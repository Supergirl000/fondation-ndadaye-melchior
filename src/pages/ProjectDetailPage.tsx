import { Link, useLoaderData } from "react-router";
import type { Project } from "../data/models";
import { Arrow, Eyebrow, Photo } from "../components/ui";
import { Breadcrumbs, DemoNote, EditorialBody } from "../components/PublicUI";
import { PhotoCollection } from "../components/Lightbox";
import { usePageMetadata } from "../components/SiteLayout";

export function ProjectDetailPage() {
  const project = useLoaderData() as Project;
  usePageMetadata(
    project.title,
    `${project.description}${project.contentStatus === "confirmed" ? "" : " Projet fictif présenté à titre de démonstration."}`,
  );
  return (
    <main id="main" tabIndex={-1} className="project-detail">
      <div className="shell">
        <Breadcrumbs
          items={[
            { label: "Les projets", to: "/projets" },
            { label: project.title },
          ]}
        />
        <header className="project-detail-header">
          <Eyebrow>
            {project.category} /{" "}
            {project.contentStatus === "confirmed"
              ? "ACTIVITÉ CONFIRMÉE"
              : "INITIATIVE FICTIVE"}
          </Eyebrow>
          <h1>{project.title}</h1>
          <div className="intro-bottom">
            <p>{project.description}</p>
            <span className="demo-label">{project.status}</span>
          </div>
        </header>
        <figure className="project-detail-cover">
          <Photo picture={project.image} priority />
          <figcaption>
            {project.contentStatus === "confirmed"
              ? "Emplacement réservé · Aucune photographie de l’activité n’est publiée à ce stade"
              : "Photographie d’illustration · Aucun projet réel représenté"}
          </figcaption>
        </figure>
        <div className="project-detail-content">
          <aside className="project-facts">
            <Eyebrow>
              {project.contentStatus === "confirmed"
                ? "LA FONDATION"
                : "L’INTENTION"}
            </Eyebrow>
            <p>{project.intention}</p>
            <dl>
              <div>
                <dt>Nature</dt>
                <dd>
                  {project.contentStatus === "confirmed"
                    ? "Activité confirmée"
                    : "Projet de démonstration"}
                </dd>
              </div>
              <div>
                <dt>Calendrier</dt>
                <dd>
                  {project.contentStatus === "confirmed"
                    ? "Date non communiquée"
                    : "À définir"}
                </dd>
              </div>
              <div>
                <dt>Lieu</dt>
                <dd>Non renseigné</dd>
              </div>
            </dl>
            <Link className="text-link" to="/contact">
              Parlons-en <Arrow />
            </Link>
          </aside>
          <div>
            <DemoNote>{project.detail}</DemoNote>
            <EditorialBody blocks={project.blocks} />
          </div>
        </div>
        <section
          className="project-detail-gallery section"
          aria-labelledby="project-gallery-heading"
        >
          <div className="section-heading">
            <div>
              <Eyebrow>LE CARNET VISUEL DU PROJET</Eyebrow>
              <h2 id="project-gallery-heading">
                En images,
                <br />
                {project.contentStatus === "confirmed"
                  ? "à venir."
                  : "pour l’inspiration."}
              </h2>
            </div>
            <p>
              {project.contentStatus === "confirmed"
                ? "Collection « Éducation et solidarité » réservée à cette activité. Photographies et autorisations de publication à fournir."
                : "Des photographies d’illustration pour accompagner cette intention. Aucun reportage d’activité réelle."}
            </p>
          </div>
          <PhotoCollection items={project.gallery} compact />
        </section>
        <div className="detail-end-nav">
          <Link className="text-link" to="/projets">
            ← Toutes les initiatives
          </Link>
          <Link className="action" to="/contact">
            Une idée à partager ? <Arrow />
          </Link>
        </div>
      </div>
    </main>
  );
}
