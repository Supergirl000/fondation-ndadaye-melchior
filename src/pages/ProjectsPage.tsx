import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import type { Project } from "../data/models";
import { pageCopy } from "../data/public";
import {
  Breadcrumbs,
  ContentFilters,
  DemoNote,
  EmptyState,
  normalizeSearch,
  PageIntro,
  ProjectCard,
} from "../components/PublicUI";
import { Arrow, Eyebrow, Photo } from "../components/ui";
import { usePageMetadata } from "../components/SiteLayout";

export function ProjectsPage() {
  const projects = useLoaderData() as Project[];
  const [category, setCategory] = useState("Tout");
  const [query, setQuery] = useState("");
  const featured = projects.find((project) => project.featured) || projects[0];
  const filtered = projects.filter(
    (project) =>
      (category === "Tout" || project.category === category) &&
      normalizeSearch(`${project.title} ${project.description}`).includes(
        normalizeSearch(query),
      ),
  );
  const reset = () => {
    setCategory("Tout");
    setQuery("");
  };
  usePageMetadata("Les projets", pageCopy.projects.description);
  return (
    <main id="main" tabIndex={-1} className="projects-page">
      <div className="shell">
        <Breadcrumbs items={[{ label: "Les projets" }]} />
        <PageIntro {...pageCopy.projects} />
        {featured && (
          <section
            className="featured-project"
            aria-labelledby="featured-project-title"
          >
            <Link
              to={`/projets/${featured.slug}`}
              className="featured-project-image"
            >
              <Photo picture={featured.image} priority />
              <span className="image-label">
                {featured.contentStatus === "confirmed"
                  ? "PHOTOGRAPHIES EN ATTENTE"
                  : "PHOTOGRAPHIE D’ILLUSTRATION"}
              </span>
              <span className="featured-word" aria-hidden="true">
                faire ensemble.
              </span>
            </Link>
            <div className="featured-project-copy">
              <Eyebrow>
                {featured.contentStatus === "confirmed"
                  ? "ACTIVITÉ CONFIRMÉE / LA FONDATION EN ACTION"
                  : "À IMAGINER / PROJET FICTIF"}
              </Eyebrow>
              <h2 id="featured-project-title">{featured.title}</h2>
              <p>{featured.intention}</p>
              <span className="featured-status">{featured.status}</span>
              <Link className="text-link" to={`/projets/${featured.slug}`}>
                Explorer ce projet <Arrow />
              </Link>
            </div>
          </section>
        )}
        <section
          className="project-catalog section"
          aria-labelledby="catalog-heading"
        >
          <div className="catalog-heading">
            <Eyebrow>LE CARNET DES INITIATIVES</Eyebrow>
            <h2 id="catalog-heading">
              À chaque idée,
              <br />
              un nouveau départ.
            </h2>
          </div>
          <ContentFilters
            categories={[
              ...new Set(projects.map((project) => project.category)),
            ]}
            category={category}
            onCategory={setCategory}
            query={query}
            onQuery={setQuery}
            label="Rechercher un projet"
          />
          <p className="results-count" aria-live="polite" aria-atomic="true">
            {filtered.length}{" "}
            {filtered.length > 1
              ? "entrées · activités et exemples identifiés"
              : "entrée"}
          </p>
          {filtered.length ? (
            <div className="public-project-grid">
              {filtered.map((project, index) => (
                <ProjectCard project={project} index={index} key={project.id} />
              ))}
            </div>
          ) : (
            <EmptyState onReset={reset} />
          )}
          <DemoNote>
            L’activité de remise de kits scolaires est confirmée par les
            informations fournies. Les autres projets sont des exemples fictifs,
            identifiés comme tels.
          </DemoNote>
        </section>
      </div>
    </main>
  );
}
