import { useLoaderData, Link } from "react-router";
import { UserRound, Sprout } from "lucide-react";
import type { AboutContent } from "../data/models";
import { homeContent } from "../data/home";
import { pageCopy } from "../data/public";
import { organization } from "../config/organization";
import { Breadcrumbs, DemoNote, PageIntro } from "../components/PublicUI";
import { Eyebrow, Photo, Reveal, Arrow } from "../components/ui";
import { usePageMetadata } from "../components/SiteLayout";

export function AboutPage() {
  const data = useLoaderData() as AboutContent;
  usePageMetadata("À propos", pageCopy.about.description);
  return (
    <main id="main" tabIndex={-1} className="about-page">
      <div className="shell">
        <Breadcrumbs items={[{ label: "À propos" }]} />
        <div className="about-opening">
          <PageIntro {...pageCopy.about} />
          <figure className="about-portrait">
            <Photo picture={homeContent.gallery.images[0]} priority />
            <figcaption>
              Un regard sur le vivant · Photographie d’illustration
            </figcaption>
            <span className="about-photo-mark" aria-hidden="true">
              <Sprout strokeWidth={1} />
            </span>
          </figure>
        </div>
        <section className="about-introduction">
          <Eyebrow>LA FONDATION</Eyebrow>
          <div>
            <h2>{organization.name}</h2>
            <p>{data.intro}</p>
            <DemoNote>
              Le nom, le logo et la mission ont été fournis par la Fondation.
              L’histoire, l’équipe et les autres informations officielles
              restent à communiquer.
            </DemoNote>
          </div>
        </section>
      </div>
      <section className="about-purpose section">
        <div className="shell">
          <div className="purpose-pair">
            <Reveal>
              <Eyebrow>01 / MISSION OFFICIELLE</Eyebrow>
              <h2>
                Notre mission
                <br />
                <em>officielle.</em>
              </h2>
              <p>{organization.mission}</p>
            </Reveal>
            <Reveal>
              <Eyebrow>02 / VISION À DÉFINIR</Eyebrow>
              <h2>
                Une vision
                <br />
                <em>à préciser.</em>
              </h2>
              <p>{data.vision}</p>
            </Reveal>
          </div>
          <div className="about-values">
            <Eyebrow>DES VALEURS À DÉFINIR ENSEMBLE</Eyebrow>
            {homeContent.mission.values.map((value, index) => (
              <div key={value.title}>
                <span>0{index + 1}</span>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="about-story section">
        <div className="shell">
          <div>
            <Eyebrow>LE FIL D’UNE HISTOIRE / RÉCIT FICTIF</Eyebrow>
            <h2>
              Tout commence
              <br />
              par une <em>envie.</em>
            </h2>
            <p className="about-story-intro">
              Trois intentions narratives pour imaginer la présentation de votre
              parcours. Les étapes réelles restent à raconter.
            </p>
          </div>
          <div className="story-chapters">
            {data.story.map((chapter, index) => (
              <Reveal key={chapter.title}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{chapter.title}</h3>
                  <p>{chapter.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section shell team-section">
        <div className="section-heading">
          <div>
            <Eyebrow>DES VISAGES À DÉCOUVRIR</Eyebrow>
            <h2>
              Le collectif, bientôt
              <br />à visage ouvert.
            </h2>
          </div>
          <p>
            Des emplacements de démonstration, sans noms ni portraits de
            personnes réelles.
          </p>
        </div>
        <div className="team-grid">
          {data.team.map((member) => (
            <article key={member.id}>
              <div className="team-placeholder" aria-hidden="true">
                <UserRound strokeWidth={0.6} />
                <span>PORTRAIT À FOURNIR</span>
              </div>
              <Eyebrow>PROFIL DE DÉMONSTRATION</Eyebrow>
              <h3>{member.role}</h3>
              <p>{member.description}</p>
            </article>
          ))}
        </div>
        <Link className="text-link" to="/contact">
          Faire connaissance <Arrow />
        </Link>
      </section>
    </main>
  );
}
