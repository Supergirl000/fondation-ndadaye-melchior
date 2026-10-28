import { useState } from "react";
import { useLoaderData, Link } from "react-router";
import type { GalleryItem } from "../data/models";
import { pageCopy } from "../data/public";
import {
  Breadcrumbs,
  ContentFilters,
  DemoNote,
  EmptyState,
  normalizeSearch,
  PageIntro,
} from "../components/PublicUI";
import { PhotoCollection } from "../components/Lightbox";
import { usePageMetadata } from "../components/SiteLayout";
import { schoolKitsActivity } from "../data/foundation";

export function GalleryPage() {
  const items = useLoaderData() as GalleryItem[];
  const [category, setCategory] = useState("Tout");
  const [query, setQuery] = useState("");
  const filtered = items.filter(
    (item) =>
      (category === "Tout" || item.category === category) &&
      normalizeSearch(`${item.title} ${item.caption}`).includes(
        normalizeSearch(query),
      ),
  );
  usePageMetadata("Galerie", pageCopy.gallery.description);
  return (
    <main id="main" tabIndex={-1} className="public-gallery-page">
      <div className="shell">
        <Breadcrumbs items={[{ label: "La galerie" }]} />
        <PageIntro {...pageCopy.gallery} />
        <section
          className="foundation-collection"
          aria-labelledby="school-kits-collection"
        >
          <p className="eyebrow">
            ÉDUCATION ET SOLIDARITÉ · COLLECTION D’ACTIVITÉ
          </p>
          <h2 id="school-kits-collection">{schoolKitsActivity.title}</h2>
          <p>{schoolKitsActivity.description}</p>
          <p>
            Photographies non fournies. Les autorisations de publication doivent
            être confirmées avant tout ajout public.
          </p>
          <Link
            className="text-link"
            to={`/projets/${schoolKitsActivity.slug}`}
          >
            Découvrir l’activité →
          </Link>
        </section>
        <DemoNote>
          Photographies d’illustration issues d’Unsplash. Certains détails
          présentent différents cadrages d’une même image. Aucune photographie
          de l’association n’est utilisée.
        </DemoNote>
        <ContentFilters
          categories={[...new Set(items.map((item) => item.category))]}
          category={category}
          onCategory={setCategory}
          query={query}
          onQuery={setQuery}
          label="Rechercher une image"
        />
        <p className="results-count" aria-live="polite">
          {filtered.length}{" "}
          {filtered.length > 1
            ? "images d’illustration"
            : "image d’illustration"}{" "}
          · Sélectionnez une image pour l’agrandir
        </p>
        {filtered.length ? (
          <PhotoCollection key={`${category}-${query}`} items={filtered} />
        ) : (
          <EmptyState
            title="Aucune image pour ce regard."
            onReset={() => {
              setCategory("Tout");
              setQuery("");
            }}
          />
        )}
        <div className="gallery-closing">
          <span aria-hidden="true">regarder, autrement.</span>
          <p>Un carnet d’inspiration, en attendant vos histoires.</p>
        </div>
      </div>
    </main>
  );
}
