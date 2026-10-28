import { Link, useLoaderData } from "react-router";
import type { NewsArticle } from "../data/models";
import {
  ArticleDate,
  Breadcrumbs,
  DemoNote,
  EditorialBody,
} from "../components/PublicUI";
import { Eyebrow, Photo, Arrow } from "../components/ui";
import { usePageMetadata } from "../components/SiteLayout";

export function NewsDetailPage() {
  const article = useLoaderData() as NewsArticle;
  usePageMetadata(
    article.title,
    `${article.description} Article et date de publication fictifs.`,
  );
  return (
    <main id="main" tabIndex={-1} className="article-page">
      <div className="shell">
        <Breadcrumbs
          items={[
            { label: "Le journal", to: "/actualites" },
            { label: article.title },
          ]}
        />
        <header className="article-masthead">
          <Eyebrow>{article.category} / ARTICLE DE DÉMONSTRATION</Eyebrow>
          <h1>{article.title}</h1>
          <p className="article-deck">{article.description}</p>
          <div className="article-byline">
            <span>{article.author}</span>
            <ArticleDate article={article} />
            <span>{article.readingMinutes} min de lecture</span>
          </div>
        </header>
        <figure className="article-cover">
          <Photo picture={article.image} priority />
          <figcaption>
            Photographie d’illustration · Sans lien avec l’association
          </figcaption>
        </figure>
        <div className="article-reading">
          <aside className="article-contents">
            <Eyebrow>AU FIL DE LA LECTURE</Eyebrow>
            <nav aria-label="Sommaire de l’article">
              {article.blocks.map((block, index) => (
                <a key={block.heading} href={`#chapitre-${index + 1}`}>
                  <span>0{index + 1}</span>
                  {block.heading}
                </a>
              ))}
            </nav>
            <Link className="text-link" to="/actualites">
              ← Retour au journal
            </Link>
          </aside>
          <div>
            <DemoNote>
              Ce récit, sa date et sa signature sont fictifs. Le contenu
              officiel sera fourni et validé par l’association.
            </DemoNote>
            <EditorialBody blocks={article.blocks} />
            <p className="article-signoff">
              Fin de ce récit de démonstration.
              <br />
              <em>La suite s’écrira avec vos mots.</em>
            </p>
            <Link className="text-link" to="/actualites">
              Continuer la découverte <Arrow />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
