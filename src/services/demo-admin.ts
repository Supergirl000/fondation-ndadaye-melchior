import type { NewsArticle, GalleryItem, Picture } from "../data/models";
import {
  readDemoState,
  writeDemoState,
  seedState,
  demoStorageBytes,
  type DemoState,
  type DemoAsset,
} from "./demo-db";
import { notifyDemoChange, reportStorageIssue } from "./demo-events";

export interface ArticleDraft {
  id?: string;
  title: string;
  description: string;
  publishedAt: string;
  category: string;
  image: Picture;
  body: string;
  featured: boolean;
}
export interface GalleryDraft {
  title: string;
  caption: string;
  category: string;
  blob: Blob;
}
export type ArticleErrors = Partial<
  Record<
    "title" | "description" | "publishedAt" | "category" | "body" | "image",
    string
  >
>;
export function validateArticle(draft: ArticleDraft): ArticleErrors {
  const errors: ArticleErrors = {};
  if (draft.title.trim().length < 5 || draft.title.trim().length > 140)
    errors.title = "Indiquez un titre de 5 à 140 caractères.";
  if (
    draft.description.trim().length < 15 ||
    draft.description.trim().length > 600
  )
    errors.description =
      "La description doit contenir entre 15 et 600 caractères.";
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(draft.publishedAt) ||
    Number.isNaN(Date.parse(draft.publishedAt)) ||
    new Date(draft.publishedAt).toISOString().slice(0, 10) !== draft.publishedAt
  )
    errors.publishedAt = "Choisissez une date valide.";
  if (draft.category.trim().length < 3 || draft.category.trim().length > 60)
    errors.category = "Indiquez une rubrique de 3 à 60 caractères.";
  if (draft.body.length > 20_000)
    errors.body = "Le texte doit rester inférieur à 20 000 caractères.";
  if (!draft.image.src && !draft.image.assetId)
    errors.image = "Choisissez une image d’illustration.";
  return errors;
}
export interface DemoAdminRepository {
  getSnapshot(): Promise<DemoState>;
  saveArticle(draft: ArticleDraft, blob?: Blob): Promise<void>;
  deleteArticle(id: string): Promise<void>;
  addImages(items: GalleryDraft[]): Promise<void>;
  updateImage(id: string, title: string, caption: string): Promise<void>;
  deleteImage(id: string): Promise<void>;
  saveSettings(showHints: boolean): Promise<void>;
  reset(): Promise<void>;
  storageBytes(): Promise<number>;
}
async function commit(
  update: (state: DemoState) => DemoState,
  assets: DemoAsset[] = [],
  reset = false,
) {
  await writeDemoState(update, assets, reset);
  reportStorageIssue(false);
  notifyDemoChange();
}
const localPicture = (assetId: string, alt: string): Picture => ({
  src: "/images/fallback.svg",
  assetId,
  alt,
});
function validCaption(title: string, caption: string) {
  if (
    title.trim().length < 3 ||
    title.trim().length > 140 ||
    caption.trim().length < 5 ||
    caption.trim().length > 600
  )
    throw new Error(
      "Indiquez un titre de 3 à 140 caractères et une description de 5 à 600 caractères.",
    );
}
export const demoAdminRepository: DemoAdminRepository = {
  getSnapshot: readDemoState,
  async saveArticle(draft, blob) {
    if (Object.keys(validateArticle(draft)).length)
      throw new Error("Vérifiez les champs de l’article.");
    const id = draft.id || `article-${crypto.randomUUID()}`;
    const assetId = blob ? crypto.randomUUID() : undefined;
    const image = assetId
      ? localPicture(assetId, draft.title.trim())
      : { ...draft.image, alt: draft.title.trim() };
    await commit(
      (state) => {
        const previous = state.articles.find((article) => article.id === id);
        if (draft.id && !previous)
          throw new Error(
            "Cet article a été retiré dans un autre onglet. Rechargez la liste.",
          );
        const paragraphs = (draft.body.trim() || draft.description.trim())
          .split(/\n\s*\n/)
          .filter(Boolean);
        const article: NewsArticle = {
          id,
          slug: previous?.slug || id,
          title: draft.title.trim(),
          description: draft.description.trim(),
          category: draft.category.trim(),
          image,
          publishedAt: draft.publishedAt,
          featured: draft.featured,
          author: "Rédaction de démonstration locale",
          readingMinutes: Math.max(
            1,
            Math.ceil(paragraphs.join(" ").split(/\s+/).length / 200),
          ),
          blocks:
            previous &&
            draft.body.trim() ===
              previous.blocks
                .flatMap((block) => block.paragraphs)
                .join("\n\n")
                .trim()
              ? previous.blocks
              : [{ heading: "Le récit de démonstration", paragraphs }],
        };
        const others = state.articles
          .filter((item) => item.id !== id)
          .map((item) =>
            draft.featured ? { ...item, featured: false } : item,
          );
        return {
          ...state,
          articles: [article, ...others].sort((a, b) =>
            b.publishedAt.localeCompare(a.publishedAt),
          ),
        };
      },
      blob && assetId ? [{ id: assetId, blob }] : [],
    );
  },
  async deleteArticle(id) {
    await commit((state) => ({
      ...state,
      articles: state.articles.filter((item) => item.id !== id),
    }));
  },
  async addImages(items) {
    if (!items.length || items.length > 6)
      throw new Error("Ajoutez entre une et six images à la fois.");
    items.forEach((item) => validCaption(item.title, item.caption));
    const records = items.map((item) => ({
      item,
      id: crypto.randomUUID(),
      assetId: crypto.randomUUID(),
    }));
    const gallery: GalleryItem[] = records.map(({ item, id, assetId }) => ({
      id,
      title: item.title.trim(),
      caption: item.caption.trim(),
      category: item.category.trim() || "Vos illustrations",
      image: localPicture(assetId, item.caption.trim()),
    }));
    await commit(
      (state) => ({ ...state, gallery: [...gallery, ...state.gallery] }),
      records.map(({ item, assetId }) => ({ id: assetId, blob: item.blob })),
    );
  },
  async updateImage(id, title, caption) {
    validCaption(title, caption);
    await commit((state) => {
      if (!state.gallery.some((item) => item.id === id))
        throw new Error("Cette image n’existe plus. Rechargez la galerie.");
      return {
        ...state,
        gallery: state.gallery.map((item) =>
          item.id === id
            ? {
                ...item,
                title: title.trim(),
                caption: caption.trim(),
                image: { ...item.image, alt: caption.trim() },
              }
            : item,
        ),
      };
    });
  },
  async deleteImage(id) {
    await commit((state) => ({
      ...state,
      gallery: state.gallery.filter((item) => item.id !== id),
    }));
  },
  async saveSettings(showHints) {
    await commit((state) => ({ ...state, settings: { showHints } }));
  },
  async reset() {
    await commit(() => seedState(), [], true);
  },
  storageBytes: demoStorageBytes,
};
