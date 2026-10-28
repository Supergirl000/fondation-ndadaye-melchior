import { articles, galleryItems, projects } from "../data/public";
import type { NewsArticle, GalleryItem, Project } from "../data/models";
import { withFoundationActivity } from "../data/foundation";

export interface DemoState {
  id: "main";
  version: 1;
  articles: NewsArticle[];
  gallery: GalleryItem[];
  projects: Project[];
  settings: { showHints: boolean };
}
export interface DemoAsset {
  id: string;
  blob: Blob;
}
const DATABASE = "association-demo-content";
export const MAX_ASSET_BYTES = 30 * 1024 * 1024;
let connection: Promise<IDBDatabase> | undefined;

export const seedState = (): DemoState =>
  structuredClone({
    id: "main",
    version: 1,
    articles,
    gallery: galleryItems,
    projects: withFoundationActivity(projects),
    settings: { showHints: true },
  });

function openDatabase(): Promise<IDBDatabase> {
  if (!connection)
    connection = new Promise<IDBDatabase>((resolve, reject) => {
      if (!globalThis.indexedDB) {
        reject(
          new Error(
            "Le stockage local IndexedDB est indisponible dans ce navigateur.",
          ),
        );
        return;
      }
      const request = indexedDB.open(DATABASE, 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore("content", { keyPath: "id" });
        request.result.createObjectStore("assets", { keyPath: "id" });
      };
      request.onerror = () => reject(request.error);
      request.onblocked = () =>
        reject(
          new Error(
            "Le stockage est utilisé par une ancienne version. Fermez les autres onglets de démonstration puis réessayez.",
          ),
        );
      request.onsuccess = () => {
        const database = request.result;
        database.onversionchange = () => {
          database.close();
          connection = undefined;
        };
        resolve(database);
      };
    }).catch((error) => {
      connection = undefined;
      throw error;
    });
  return connection!;
}

export async function readDemoState(): Promise<DemoState> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction("content", "readwrite");
    const request = transaction.objectStore("content").get("main");
    let result: DemoState;
    request.onsuccess = () => {
      result = request.result || seedState();
      const merged = withFoundationActivity(result.projects);
      if (merged !== result.projects) result = { ...result, projects: merged };
      if (!request.result || merged !== request.result.projects)
        transaction.objectStore("content").put(result);
    };
    transaction.oncomplete = () => resolve(result);
    transaction.onabort = () =>
      reject(transaction.error || new Error("Lecture locale interrompue."));
    transaction.onerror = () => {
      /* onabort provides the final transaction error. */
    };
  });
}

/** Mutation, new blobs and orphan cleanup commit together, including reset. */
export async function writeDemoState(
  update: (state: DemoState) => DemoState,
  newAssets: DemoAsset[] = [],
  reset = false,
): Promise<void> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(
      ["content", "assets"],
      "readwrite",
    );
    const contents = transaction.objectStore("content");
    const assets = transaction.objectStore("assets");
    let failure: unknown;
    const request = contents.get("main");
    request.onsuccess = () => {
      try {
        const next = update(request.result || seedState());
        const used = new Set<string>();
        const collect = (image: { assetId?: string }) => {
          if (image.assetId) used.add(image.assetId);
        };
        next.articles.forEach((item) => collect(item.image));
        next.gallery.forEach((item) => collect(item.image));
        next.projects.forEach((item) => {
          collect(item.image);
          item.gallery.forEach((photo) => collect(photo.image));
        });
        const existing = assets.getAll();
        existing.onsuccess = () => {
          try {
            const retained = (existing.result as DemoAsset[]).filter((asset) =>
              used.has(asset.id),
            );
            if (
              newAssets.some(
                (asset) =>
                  !["image/jpeg", "image/png", "image/webp"].includes(
                    asset.blob.type,
                  ) || asset.blob.size > 2 * 1024 * 1024,
              )
            )
              throw new Error("Format ou taille d’image invalide.");
            const available = new Set(
              [...retained, ...newAssets].map((asset) => asset.id),
            );
            if ([...used].some((id) => !available.has(id)))
              throw new Error(
                "Une image locale n’est plus disponible. Choisissez une autre illustration.",
              );
            const total =
              retained.reduce((sum, asset) => sum + asset.blob.size, 0) +
              newAssets.reduce((sum, asset) => sum + asset.blob.size, 0);
            if (total > MAX_ASSET_BYTES)
              throw new DOMException(
                "Limite locale de 30 Mo atteinte.",
                "QuotaExceededError",
              );
            if (reset) assets.clear();
            else
              (existing.result as DemoAsset[])
                .filter((asset) => !used.has(asset.id))
                .forEach((asset) => assets.delete(asset.id));
            newAssets.forEach((asset) => assets.put(asset));
            contents.put(next);
          } catch (error) {
            failure = error;
            transaction.abort();
          }
        };
      } catch (error) {
        failure = error;
        transaction.abort();
      }
    };
    transaction.oncomplete = () => resolve();
    transaction.onabort = () =>
      reject(
        failure ||
          transaction.error ||
          new Error("Enregistrement local interrompu."),
      );
    transaction.onerror = () => {
      /* Changes remain atomic on quota/request failures. */
    };
  });
}

export async function readDemoAsset(id: string): Promise<Blob | undefined> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction("assets", "readonly");
    const request = transaction.objectStore("assets").get(id);
    transaction.oncomplete = () =>
      resolve((request.result as DemoAsset | undefined)?.blob);
    transaction.onabort = () => reject(transaction.error);
  });
}

export async function demoStorageBytes(): Promise<number> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction("assets", "readonly");
    const request = transaction.objectStore("assets").getAll();
    transaction.oncomplete = () =>
      resolve(
        (request.result as DemoAsset[]).reduce(
          (sum, asset) => sum + asset.blob.size,
          0,
        ),
      );
    transaction.onabort = () => reject(transaction.error);
  });
}

export function storageErrorMessage(error: unknown): string {
  if (error instanceof DOMException && error.name === "QuotaExceededError")
    return "L’espace de stockage est insuffisant (limite de démonstration : 30 Mo). Retirez des images ou choisissez un fichier plus léger. Aucune modification n’a été enregistrée.";
  return "Le stockage de ce navigateur est indisponible ou l’enregistrement a échoué. Aucune modification n’a été enregistrée. Vérifiez les autorisations du navigateur puis réessayez.";
}
