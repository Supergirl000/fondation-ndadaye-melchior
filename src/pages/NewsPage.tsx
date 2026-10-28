import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import type { NewsArticle } from "../data/models";
import { pageCopy } from "../data/public";
import {
  ArticleCard,
  ArticleDate,
  Breadcrumbs,
  ContentFilters,
  DemoNote,
  EmptyState,
  normalizeSearch,
  PageIntro,
} from "../components/PublicUI";
import { Arrow, Eyebrow, Photo } from "../components/ui";
import { usePageMetadata } from "../components/SiteLayout";

export function NewsPage() {
  const articles = useLoaderData() as NewsArticle[];
  const [category, setCategory] = useState("Tout");
  const [query, setQuery] = useState("");
  const featured = articles.find((article) => article.featured) || articles[0];
  const filtered = articles.filter(
    (article) =>
      (category === "Tout" || category === article.category) &&
      normalizeSearch(`${article.title} ${article.description}`).includes(
        normalizeSearch(query),
      ),
  );
  usePageMetadata("Actualités", pageCopy.news.description);
  return (
    <main id="main" tabIndex={-1} className="journal-page shell">
      <Breadcrumbs items={[{ label: "Le journal" }]} />
      <PageIntro {...pageCopy.news} />
      {featured && (
        <section className="journal-feature" aria-labelledby="feature-title">
          <Link to={`/actualites/${featured.slug}`}>
            <div className="journal-feature-image">
              <Photo picture={featured.image} priority />
              <span className="image-label">IMAGE D’ILLUSTRATION</span>
            </div>
            <div className="journal-feature-copy">
              <Eyebrow>À LA UNE / ARTICLE FICTIF</Eyebrow>
              <ArticleDate article={featured} />
              <h2 id="feature-title">{featured.title}</h2>
              <p>{featured.description}</p>
              <span className="text-link">
                Prendre le temps de lire <Arrow />
              </span>
            </div>
          </Link>
        </section>
      )}
      <section
        className="journal-archive section"
        aria-labelledby="archive-heading"
      >
        <div className="archive-header">
          <Eyebrow>LES PAGES DU JOURNAL</Eyebrow>
          <h2 id="archive-heading">D’autres regards.</h2>
        </div>
        <ContentFilters
          categories={[...new Set(articles.map((article) => article.category))]}
          category={category}
          onCategory={setCategory}
          query={query}
          onQuery={setQuery}
          label="Rechercher un article"
        />
        <p className="results-count" aria-live="polite">
          {filtered.length}{" "}
          {filtered.length > 1 ? "articles fictifs" : "article fictif"}
        </p>
        {filtered.length ? (
          <div className="journal-archive-grid">
            {filtered.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <EmptyState
            onReset={() => {
              setCategory("Tout");
              setQuery("");
            }}
          />
        )}
        <DemoNote>
          Les textes, dates et signatures de ce journal sont fictifs. Ils
          présentent une ligne éditoriale possible, sans annoncer d’événements
          ou de réalisations réels.
        </DemoNote>
      </section>
    </main>
  );
}
