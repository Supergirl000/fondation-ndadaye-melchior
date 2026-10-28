import { Link } from "react-router";
import { ArrowDown, ArrowUpRight, HandHeart, Scale, UsersRound } from "lucide-react";
import { organization } from "../config/organization";
import { foundationIllustrations as images, homepageEditorial as copy } from "../data/homepage";
import type { HomeContent } from "../data/home";
import { ActionLink, Eyebrow, Photo, Reveal } from "./ui";

function IllustrationNote() {
  return <span className="hp-image-note">Illustration générée par IA</span>;
}
export function Hero() {
  return (
    <section className="hp-hero shell" aria-labelledby="hero-heading">
      <div className="hp-hero-copy">
        <Eyebrow>{copy.hero.eyebrow}</Eyebrow>
        <h1 id="hero-heading">
          <span>{copy.hero.title}</span>{" "}
          <span><em>{copy.hero.emphasis}</em> {copy.hero.continuation}</span>{" "}
          <span>{copy.hero.ending}</span>
        </h1>
        <p>{copy.hero.description}</p>
        <div className="hp-actions">
          <ActionLink href="/projets">Découvrir nos actions</ActionLink>
          <ActionLink href="/a-propos" secondary>Notre esprit</ActionLink>
        </div>
        <a className="hp-discover" href="#engagements">
          <ArrowDown size={16} aria-hidden="true" />
          Une ambition commune. Un avenir partagé.
        </a>
      </div>
      <div className="hp-hero-art">
        <div className="hp-hero-mosaic">
          <figure className="hp-hero-panorama">
            <Photo picture={images.community} priority sizes="(max-width: 900px) 100vw, 48vw" />
            <figcaption><IllustrationNote /></figcaption>
          </figure>
          <div className="hp-hero-bottom">
            <figure className="hp-dialogue">
              <Photo picture={images.dialogue} priority />
              <figcaption><IllustrationNote /></figcaption>
            </figure>
            <figure className="hp-solidarity">
              <Photo picture={images.solidarity} priority />
              <figcaption><IllustrationNote /></figcaption>
            </figure>
          </div>
        </div>
        <div className="hp-visual-caption">
          <p className="hp-composition-title">Ensemble, <em>faire société.</em></p>
          <p>Illustrations IA · Une vision, pas un reportage d’activité.</p>
        </div>
      </div>
    </section>
  );
}
const pillarIcons = [Scale, UsersRound, HandHeart];
export function Pillars() {
  return <section className="hp-pillars shell" aria-label="Les trois piliers de notre mission">{copy.pillars.map((pillar, index) => { const Icon = pillarIcons[index]; return <Reveal key={pillar.title} className="hp-pillar"><Icon size={28} strokeWidth={1.3} aria-hidden="true" /><div><h2>{pillar.title}</h2><p>{pillar.description}</p></div></Reveal>; })}</section>;
}
export function Engagements() {
  return <section id="engagements" className="hp-engagements shell hp-section" aria-labelledby="engagement-heading"><Reveal className="hp-section-head"><div><Eyebrow>01 / CE QUI NOUS ANIME</Eyebrow><h2 id="engagement-heading">Nos engagements pour<br />un avenir <em>meilleur.</em></h2></div><p>Les orientations de notre mission : la dignité humaine, le dialogue et un progrès qui fait une place à chacun.</p></Reveal><div className="hp-engagement-grid">{copy.engagements.map((item, index) => <Reveal className={`hp-engagement hp-engagement-${index}`} key={item.title}><figure><Photo picture={item.image} /><figcaption><IllustrationNote /></figcaption></figure><div><span className="eyebrow">{item.category}</span><h3>{item.title}</h3></div></Reveal>)}</div><div className="hp-section-foot"><p>Ces illustrations évoquent nos engagements ; elles ne présentent pas des actions réalisées.</p><Link className="text-link" to="/a-propos">Découvrir notre engagement <ArrowUpRight size={18} aria-hidden="true" /></Link></div></section>;
}
export function Mission() {
  return <section id="mission" className="hp-mission" aria-labelledby="mission-heading"><div className="shell hp-mission-inner"><Reveal className="hp-mission-copy"><Eyebrow>UNE FONDATION. UNE MISSION COMMUNE.</Eyebrow><h2 id="mission-heading">{organization.mission}</h2><ActionLink href="/a-propos">En savoir plus sur notre fondation</ActionLink></Reveal><figure><Photo picture={images.solidarity} /><figcaption><IllustrationNote /></figcaption></figure></div></section>;
}
export function Initiatives({ data }: { data: HomeContent }) {
  const activities = data.projects.items.filter((item) => item.contentStatus === "confirmed");
  return <section id="initiatives" className="shell hp-section hp-activities" aria-labelledby="projects-heading"><Reveal className="hp-section-head"><div><Eyebrow>02 / DE L’ENGAGEMENT À L’ACTION</Eyebrow><h2 id="projects-heading">Nos actions<br /><em>sur le terrain.</em></h2></div><Link className="text-link" to="/projets">Toutes nos actions <ArrowUpRight size={18} aria-hidden="true" /></Link></Reveal>{!activities.length && <p className="public-demo-note">Les prochaines activités confirmées seront présentées ici.</p>}{activities.map((project) => <Reveal className="hp-activity" key={project.id}><Link to={`/projets/${project.id}`} className="hp-activity-image" aria-label={`Découvrir : ${project.title}`}><Photo picture={project.image} /></Link><div className="hp-activity-copy"><Eyebrow>{project.category} · ACTIVITÉ CONFIRMÉE</Eyebrow><h3><Link to={`/projets/${project.id}`}>{project.title}</Link></h3><p>{project.description}</p>{project.image.src.endsWith("school-kits-pending.svg") && <p className="hp-pending">Les photographies de cette activité seront ajoutées après réception et confirmation des autorisations de publication.</p>}<Link className="text-link" to={`/projets/${project.id}`}>Découvrir cette action <ArrowUpRight size={18} aria-hidden="true" /></Link></div></Reveal>)}<div className="hp-section-foot"><p>Une activité réelle, présentée avec des informations confirmées.</p><Link className="text-link" to="/galerie">Explorer la galerie <ArrowUpRight size={18} aria-hidden="true" /></Link></div></section>;
}
export function Journal({ data }: { data: HomeContent }) {
  return <section id="journal" className="hp-journal hp-section" aria-labelledby="news-heading"><div className="shell"><Reveal className="hp-section-head"><div><Eyebrow>03 / LE JOURNAL DE LA FONDATION</Eyebrow><h2 id="news-heading">Actualités <em>récentes.</em></h2></div><Link className="text-link" to="/actualites">Tout le journal <ArrowUpRight size={18} aria-hidden="true" /></Link></Reveal><p className="hp-demo-news">Articles de démonstration · Les contenus ajoutés dans l’administration restent enregistrés dans ce navigateur.</p><div className="hp-news-grid">{!data.news.items.length && <p className="public-demo-note">Aucune actualité pour le moment. Le journal accueillera les prochaines publications.</p>}{data.news.items.map((article) => <Reveal key={article.id}><article className="hp-news-card"><Link to={`/actualites/${article.id}`} className="hp-news-image" aria-label={`Lire : ${article.title}`}><Photo picture={article.image} />{article.image.src.startsWith("/images/fondation/") && !article.image.assetId && <IllustrationNote />}</Link><span className="eyebrow">{article.category} · EXEMPLE</span><h3><Link to={`/actualites/${article.id}`}>{article.title}</Link></h3><p>{article.description}</p><Link className="text-link" to={`/actualites/${article.id}`}>Lire l’article <ArrowUpRight size={17} aria-hidden="true" /></Link></article></Reveal>)}</div></div></section>;
}
export function Participation() {
  return <section className="hp-participation shell" aria-labelledby="contact-heading"><figure><Photo picture={images.community} /><figcaption><IllustrationNote /></figcaption></figure><Reveal className="hp-participation-copy"><Eyebrow>LA SUITE S’ÉCRIT ENSEMBLE</Eyebrow><h2 id="contact-heading">Ensemble pour une société plus juste et un avenir durable.</h2><ActionLink href="/contact">Nous contacter</ActionLink></Reveal></section>;
}


