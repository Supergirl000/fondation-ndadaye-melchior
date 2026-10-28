import { useRef, useState, type FormEvent } from "react";
import { Eye, ImagePlus, Save } from "lucide-react";
import type { GalleryItem, NewsArticle, Picture } from "../../data/models";
import { galleryItems } from "../../data/public";
import {
  demoAdminRepository,
  validateArticle,
  type ArticleDraft,
  type ArticleErrors,
} from "../../services/demo-admin";
import { prepareImage, IMAGE_ACCEPT } from "../../services/image-processing";
import { storageErrorMessage } from "../../services/demo-db";
import { Photo } from "../ui";
import { AdminAlert, BlobPreview, FieldError } from "./AdminUI";

export function NewsEditor({
  article,
  gallery,
  onSaved,
  onCancel,
}: {
  article?: NewsArticle;
  gallery: GalleryItem[];
  onSaved: () => Promise<void>;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<ArticleDraft>(() => ({
    id: article?.id,
    title: article?.title || "",
    description: article?.description || "",
    category: article?.category || "Vie associative",
    publishedAt: article?.publishedAt || new Date().toLocaleDateString("en-CA"),
    image: article?.image || gallery[0]?.image || galleryItems[0].image,
    body:
      article?.blocks.flatMap((block) => block.paragraphs).join("\n\n") || "",
    featured: article?.featured || false,
  }));
  const [blob, setBlob] = useState<Blob>();
  const [errors, setErrors] = useState<ArticleErrors>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [preview, setPreview] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const choices = [
    ...new Map(
      [
        ...(article ? [{ image: article.image, title: "Image actuelle" }] : []),
        ...gallery,
        ...galleryItems,
      ].map((item) => [item.image.assetId || item.image.src, item]),
    ).values(),
  ];
  const set = <K extends keyof ArticleDraft>(
    key: K,
    value: ArticleDraft[K],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key as keyof ArticleErrors];
      return next;
    });
  };
  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const nextErrors = validateArticle(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() =>
        form.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus(),
      );
      return;
    }
    setBusy(true);
    try {
      await demoAdminRepository.saveArticle(draft, blob);
      await onSaved();
    } catch (failure) {
      setError(storageErrorMessage(failure));
    } finally {
      setBusy(false);
    }
  }
  async function attach(file?: File) {
    if (!file) return;
    setProcessing(true);
    setError("");
    try {
      const prepared = await prepareImage(file);
      setBlob(prepared.blob);
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : "Image indisponible.",
      );
    } finally {
      setProcessing(false);
    }
  }
  const fieldProps = (name: keyof ArticleErrors) => ({
    "aria-required": [
      "title",
      "description",
      "publishedAt",
      "category",
    ].includes(name),
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `error-${name}` : undefined,
  });
  return (
    <div className="admin-editor">
      <div className="admin-section-top">
        <div>
          <p className="eyebrow">LE JOURNAL / ÉDITION LOCALE</p>
          <h2>
            {article ? "Affiner une histoire." : "Une nouvelle histoire."}
          </h2>
          <p>
            Le contenu restera une démonstration visible uniquement dans ce
            navigateur.
          </p>
        </div>
        <button
          className="admin-button secondary"
          onClick={onCancel}
          disabled={busy || processing}
        >
          Retour à la liste
        </button>
      </div>
      <div className={`news-editor-grid ${preview ? "show-preview" : ""}`}>
        <form
          ref={form}
          onSubmit={submit}
          noValidate
          className="admin-panel admin-form"
        >
          {error && <AdminAlert error>{error}</AdminAlert>}
          {Object.keys(errors).length > 0 && (
            <AdminAlert error>
              Certains champs sont à vérifier avant l’enregistrement.
            </AdminAlert>
          )}
          <fieldset disabled={busy || processing}>
            <legend className="sr-only">Contenu de l’article</legend>
            <label>
              Titre de l’article (requis)
              <input
                aria-label="Titre de l’article"
                value={draft.title}
                onChange={(event) => set("title", event.target.value)}
                maxLength={140}
                {...fieldProps("title")}
              />
              <FieldError id="error-title" message={errors.title} />
            </label>
            <label>
              Description (requise)
              <textarea
                aria-label="Description"
                rows={4}
                value={draft.description}
                onChange={(event) => set("description", event.target.value)}
                maxLength={600}
                {...fieldProps("description")}
              />
              <small>
                Un résumé de 15 à 600 caractères, affiché dans le journal.
              </small>
              <FieldError id="error-description" message={errors.description} />
            </label>
            <div className="admin-fields-row">
              <label>
                Date de publication fictive (requise)
                <input
                  type="date"
                  aria-label="Date de publication fictive"
                  value={draft.publishedAt}
                  onChange={(event) => set("publishedAt", event.target.value)}
                  {...fieldProps("publishedAt")}
                />
                <FieldError
                  id="error-publishedAt"
                  message={errors.publishedAt}
                />
              </label>
              <label>
                Rubrique (requise)
                <input
                  value={draft.category}
                  aria-label="Rubrique"
                  onChange={(event) => set("category", event.target.value)}
                  maxLength={60}
                  {...fieldProps("category")}
                />
                <FieldError id="error-category" message={errors.category} />
              </label>
            </div>
            <label>
              Texte de l’article
              <textarea
                rows={8}
                aria-label="Texte de l’article"
                value={draft.body}
                onChange={(event) => set("body", event.target.value)}
                maxLength={20000}
                {...fieldProps("body")}
              />
              <small>
                Facultatif : sans texte, la description servira de récit.
                Séparez les paragraphes par une ligne vide.
              </small>
              <FieldError id="error-body" message={errors.body} />
            </label>
            <label>
              Image d’illustration
              <select
                value={
                  blob ? "__upload" : draft.image.assetId || draft.image.src
                }
                onChange={(event) => {
                  const selected = choices.find(
                    (item) =>
                      (item.image.assetId || item.image.src) ===
                      event.target.value,
                  );
                  if (selected) {
                    set("image", selected.image as Picture);
                    setBlob(undefined);
                  }
                }}
              >
                {blob && (
                  <option value="__upload">
                    Image préparée depuis cet appareil
                  </option>
                )}
                {choices.map((item) => (
                  <option
                    key={item.image.assetId || item.image.src}
                    value={item.image.assetId || item.image.src}
                  >
                    {item.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-upload-inline">
              <ImagePlus size={18} aria-hidden="true" />
              Ou joindre une image depuis cet appareil
              <input
                type="file"
                accept={IMAGE_ACCEPT}
                onChange={(event) => {
                  void attach(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
              <small>JPEG, PNG, WebP · 5 Mo maximum · compression locale</small>
            </label>
            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(event) => set("featured", event.target.checked)}
              />
              Mettre cet article à la une du journal local
            </label>
          </fieldset>
          {processing && <AdminAlert>Préparation de l’image…</AdminAlert>}
          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-button secondary"
              onClick={() => setPreview(!preview)}
              aria-expanded={preview}
            >
              <Eye size={16} />
              {preview ? "Masquer l’aperçu" : "Voir l’aperçu"}
            </button>
            <button
              className="admin-button"
              type="submit"
              disabled={busy || processing}
            >
              <Save size={16} />
              {busy ? "Enregistrement…" : "Enregistrer dans ce navigateur"}
            </button>
          </div>
        </form>
        <aside
          className="admin-article-preview"
          aria-label="Aperçu de l’article"
        >
          <p className="eyebrow">APERÇU / NON ENREGISTRÉ</p>
          <div className="preview-cover">
            {blob ? (
              <BlobPreview blob={blob} alt="Aperçu de l’image choisie" />
            ) : (
              <Photo picture={draft.image} />
            )}
          </div>
          <div className="preview-copy">
            <span className="admin-tag">ARTICLE DE DÉMONSTRATION</span>
            <p className="eyebrow">{draft.category || "Votre rubrique"}</p>
            <h3>{draft.title || "Le titre de votre prochaine histoire."}</h3>
            <p>
              {draft.description ||
                "Votre description apparaîtra ici, pour imaginer le rendu avant l’enregistrement."}
            </p>
            <small>
              {draft.publishedAt || "Date à choisir"} · Date fictive
            </small>
            {draft.body && <p className="preview-body">{draft.body}</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
