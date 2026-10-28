import { Link } from "react-router";
import { Search, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import type { Project, NewsArticle, ContentBlock } from "../data/models";
import { Arrow, Eyebrow, Photo } from "./ui";

export function Breadcrumbs({
  items,
}: {
  items: { label: string; to?: string }[];
}) {
  return (
    <nav className="breadcrumbs" aria-label="Fil d’Ariane">
      <ol>
        <li>
          <Link to="/">Accueil</Link>
        </li>
        {items.map((item, index) => (
          <li key={index}>
            {item.to ? (
              <Link to={item.to}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
export function PageIntro({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <header className="public-intro">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      <div className="intro-bottom">
        <p>{description}</p>
        {children || (
          <span className="demo-label">Contenu de démonstration</span>
        )}
      </div>
    </header>
  );
}
export function DemoNote({ children }: { children?: ReactNode }) {
  return (
    <aside className="public-demo-note">
      <span className="demo-dot" />
      <p>
        {children ||
          "Contenu fictif de démonstration. Les textes et photographies seront remplacés par les éléments officiels de l’association."}
      </p>
    </aside>
  );
}
export function EmptyState({
  onReset,
  title = "Aucun résultat pour le moment.",
}: {
  onReset?: () => void;
  title?: string;
}) {
  return (
    <div className="empty-state" role="status">
      <Eyebrow>UN PEU DE PLACE POUR LA SUITE</Eyebrow>
      <h2>{title}</h2>
      <p>
        Essayez une autre recherche ou revenez bientôt découvrir de nouveaux
        contenus.
      </p>
      {onReset && (
        <button className="text-link" onClick={onReset}>
          Réinitialiser les filtres <RotateCcw size={15} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
export function ContentFilters({
  categories,
  category,
  onCategory,
  query,
  onQuery,
  label,
}: {
  categories: string[];
  category: string;
  onCategory: (value: string) => void;
  query: string;
  onQuery: (value: string) => void;
  label: string;
}) {
  return (
    <div className="content-filters">
      <div
        className="filter-categories"
        role="group"
        aria-label="Filtrer par catégorie"
      >
        {["Tout", ...categories].map((value) => (
          <button
            key={value}
            aria-pressed={category === value}
            onClick={() => onCategory(value)}
          >
            {value}
          </button>
        ))}
      </div>
      <label className="search-field">
        <Search size={17} aria-hidden="true" />
        <span className="sr-only">{label}</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder={label}
        />
      </label>
    </div>
  );
}
export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <article className="public-project-card">
      <Link to={`/projets/${project.slug}`} className="editorial-button">
        <div className="public-project-photo">
          <Photo picture={project.image} />
          <span className="project-index">0{index + 1}</span>
          <span className="round-arrow">
            <Arrow />
          </span>
        </div>
        <Eyebrow>
          {project.category}{" "}
          <span>
            {project.contentStatus === "confirmed"
              ? "ACTIVITÉ CONFIRMÉE"
              : "PROJET FICTIF"}
          </span>
        </Eyebrow>
        <h2>{project.title}</h2>
        <p>{project.description}</p>
        <span className="text-link">
          {project.contentStatus === "confirmed"
            ? "Découvrir l’activité"
            : "Découvrir l’intention"}{" "}
          <Arrow />
        </span>
      </Link>
    </article>
  );
}
export function ArticleDate({ article }: { article: NewsArticle }) {
  return (
    <span className="article-date">
      <time dateTime={article.publishedAt}>
        {new Intl.DateTimeFormat("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        }).format(new Date(`${article.publishedAt}T12:00:00Z`))}
      </time>
      <span> · Date fictive</span>
    </span>
  );
}
export function ArticleCard({ article }: { article: NewsArticle }) {
  return (
    <article className="journal-card">
      <Link to={`/actualites/${article.slug}`}>
        <div className="journal-card-photo">
          <Photo picture={article.image} />
          <span className="round-arrow">
            <Arrow />
          </span>
        </div>
        <div>
          <Eyebrow>{article.category}</Eyebrow>
          <h2>{article.title}</h2>
          <p>{article.description}</p>
          <ArticleDate article={article} />
        </div>
      </Link>
    </article>
  );
}
export function EditorialBody({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="editorial-body">
      {blocks.map((block, index) => (
        <section id={`chapitre-${index + 1}`} key={block.heading}>
          <h2>{block.heading}</h2>
          {block.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
    </div>
  );
}
export function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr");
}
