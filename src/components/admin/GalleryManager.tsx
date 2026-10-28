import { useRef, useState, type FormEvent } from "react";
import { ImagePlus, Pencil, Trash2, X } from "lucide-react";
import type { GalleryItem } from "../../data/models";
import {
  demoAdminRepository,
  type GalleryDraft,
} from "../../services/demo-admin";
import { prepareImage, IMAGE_ACCEPT } from "../../services/image-processing";
import { storageErrorMessage } from "../../services/demo-db";
import { Photo } from "../ui";
import { AdminAlert, BlobPreview, bytesLabel } from "./AdminUI";

export function GalleryManager({
  items,
  onSaved,
  onDelete,
}: {
  items: GalleryItem[];
  onSaved: () => Promise<void>;
  onDelete: (item: GalleryItem) => void;
}) {
  const [queue, setQueue] = useState<(GalleryDraft & { key: string })[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [editing, setEditing] = useState<string>();
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const upload = useRef<HTMLInputElement>(null);
  async function select(files: File[]) {
    if (!files.length) return;
    setError("");
    if (files.length + queue.length > 6) {
      setError("Préparez au maximum six images à la fois.");
      return;
    }
    setProcessing(true);
    const prepared: typeof queue = [];
    const failures: string[] = [];
    for (const file of files) {
      try {
        const result = await prepareImage(file);
        prepared.push({
          key: crypto.randomUUID(),
          blob: result.blob,
          title: "Nouvelle image de démonstration",
          caption: "",
          category: "Vos illustrations",
        });
      } catch (failure) {
        failures.push(
          `${file.name} : ${failure instanceof Error ? failure.message : "Fichier indisponible."}`,
        );
      }
    }
    setQueue((current) => [...current, ...prepared]);
    setError(failures.join(" "));
    setProcessing(false);
  }
  async function saveQueue(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (
      queue.some(
        (item) =>
          item.title.trim().length < 3 ||
          item.title.length > 140 ||
          item.caption.trim().length < 5 ||
          item.caption.length > 600,
      )
    ) {
      setError(
        "Chaque image doit avoir un titre (3 à 140 caractères) et une description (5 à 600 caractères).",
      );
      return;
    }
    setBusy(true);
    try {
      await demoAdminRepository.addImages(queue);
      setQueue([]);
      await onSaved();
    } catch (failure) {
      setError(storageErrorMessage(failure));
    } finally {
      setBusy(false);
    }
  }
  async function saveDescription(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (title.trim().length < 3 || caption.trim().length < 5) {
      setError(
        "Le titre doit contenir au moins 3 caractères et la description au moins 5.",
      );
      return;
    }
    setBusy(true);
    try {
      await demoAdminRepository.updateImage(editing!, title, caption);
      setEditing(undefined);
      await onSaved();
    } catch (failure) {
      setError(storageErrorMessage(failure));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="admin-section-top">
        <div>
          <p className="eyebrow">LA PHOTOTHÈQUE / IMAGES LOCALES</p>
          <h2>Des images pour raconter.</h2>
          <p>
            Ajoutez des illustrations et décrivez-les pour les rendre
            accessibles.
          </p>
        </div>
        <button
          className="admin-button"
          disabled={processing || busy}
          onClick={() => upload.current?.click()}
        >
          <ImagePlus size={17} />
          Ajouter des images
        </button>
      </div>
      <div className="admin-upload-zone">
        <ImagePlus size={30} strokeWidth={1} />
        <div>
          <strong>Choisir depuis cet appareil</strong>
          <p>JPEG, PNG ou WebP · 5 Mo par fichier · 6 images à la fois</p>
          <small>
            Redimensionnement à 1 600 px, compression locale et limite totale de
            30 Mo.
          </small>
        </div>
        <input
          ref={upload}
          type="file"
          aria-label="Choisir des images"
          multiple
          accept={IMAGE_ACCEPT}
          disabled={processing || busy}
          onChange={(event) => {
            void select(Array.from(event.target.files || []));
            event.target.value = "";
          }}
        />
      </div>
      {error && <AdminAlert error>{error}</AdminAlert>}
      {processing && (
        <AdminAlert>
          Préparation des images… Les fichiers restent sur cet appareil.
        </AdminAlert>
      )}
      {queue.length > 0 && (
        <form
          className="admin-panel admin-form upload-queue"
          onSubmit={saveQueue}
          noValidate
        >
          <h3>Avant de les ajouter…</h3>
          <p>
            Une description claire aide les visiteurs à comprendre chaque image.
          </p>
          {queue.map((item, index) => (
            <fieldset
              className="queue-item"
              disabled={busy || processing}
              key={item.key}
            >
              <legend className="sr-only">Image {index + 1}</legend>
              <div className="queue-preview">
                <BlobPreview
                  blob={item.blob}
                  alt={item.caption || "Aperçu de l’image à ajouter"}
                />
                <small>{bytesLabel(item.blob.size)} après compression</small>
              </div>
              <div>
                <label>
                  Titre de l’image {index + 1}
                  <input
                    value={item.title}
                    maxLength={140}
                    onChange={(event) =>
                      setQueue((current) =>
                        current.map((entry) =>
                          entry.key === item.key
                            ? { ...entry, title: event.target.value }
                            : entry,
                        ),
                      )
                    }
                  />
                </label>
                <label>
                  Description de l’image {index + 1}
                  <textarea
                    rows={3}
                    value={item.caption}
                    maxLength={600}
                    onChange={(event) =>
                      setQueue((current) =>
                        current.map((entry) =>
                          entry.key === item.key
                            ? { ...entry, caption: event.target.value }
                            : entry,
                        ),
                      )
                    }
                  />
                </label>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label={`Retirer l’image préparée ${index + 1}`}
                onClick={() =>
                  setQueue((current) =>
                    current.filter((entry) => entry.key !== item.key),
                  )
                }
              >
                <X size={18} />
              </button>
            </fieldset>
          ))}
          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-button secondary"
              disabled={busy || processing}
              onClick={() => setQueue([])}
            >
              Annuler la sélection
            </button>
            <button className="admin-button" disabled={busy || processing}>
              {busy
                ? "Enregistrement…"
                : "Enregistrer les images dans ce navigateur"}
            </button>
          </div>
        </form>
      )}
      <div className="admin-list-heading">
        <h3>Votre photothèque</h3>
        <span>{items.length} images locales</span>
      </div>
      {!items.length && (
        <div className="admin-empty">
          <h3>La première image commence ici.</h3>
          <p>
            Choisissez un fichier pour composer votre photothèque de
            démonstration.
          </p>
        </div>
      )}
      <div className="admin-gallery-grid">
        {items.map((item) => (
          <article className="admin-photo-card" key={item.id}>
            <div className="admin-photo-image">
              <Photo picture={item.image} />
              <span className="admin-image-origin">
                {item.image.assetId ? "IMPORT LOCAL" : "ILLUSTRATION D’ORIGINE"}
              </span>
            </div>
            {editing === item.id ? (
              <form
                className="admin-form admin-photo-edit"
                onSubmit={saveDescription}
              >
                <label>
                  Titre de l’image
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    maxLength={140}
                    disabled={busy}
                  />
                </label>
                <label>
                  Description de l’image
                  <textarea
                    aria-label="Description de l’image"
                    rows={3}
                    value={caption}
                    onChange={(event) => setCaption(event.target.value)}
                    maxLength={600}
                    disabled={busy}
                  />
                </label>
                <div className="admin-form-actions">
                  <button
                    type="button"
                    className="admin-button secondary"
                    onClick={() => setEditing(undefined)}
                    disabled={busy}
                  >
                    Annuler
                  </button>
                  <button className="admin-button" disabled={busy}>
                    Enregistrer
                  </button>
                </div>
              </form>
            ) : (
              <div className="admin-photo-copy">
                <h3>{item.title}</h3>
                <p>{item.caption}</p>
                <div className="admin-card-actions">
                  <button
                    onClick={() => {
                      setEditing(item.id);
                      setTitle(item.title);
                      setCaption(item.caption);
                      setError("");
                    }}
                    disabled={busy || processing}
                  >
                    <Pencil size={14} />
                    Modifier<span className="sr-only"> {item.title}</span>
                  </button>
                  <button
                    className="text-danger"
                    onClick={() => onDelete(item)}
                    disabled={busy || processing}
                  >
                    <Trash2 size={14} />
                    Retirer<span className="sr-only"> {item.title}</span>
                  </button>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
