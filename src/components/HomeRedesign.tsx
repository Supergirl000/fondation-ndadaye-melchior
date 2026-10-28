import { Link } from "react-router";
import { ArrowUpRight, Sprout, Scale, UsersRound } from "lucide-react";
import { organization } from "../config/organization";
import { foundationIllustrations as images, homepageEditorial as copy } from "../data/homepage";
import type { HomeContent } from "../data/home";
import { ActionLink, Eyebrow, Photo, Reveal } from "./ui";


export function Hero() {
  return (
    <section className="hp-hero" aria-labelledby="hero-heading">
      <link rel="preload" as="image" href={images.community.src} fetchPriority="high" />
      <div className="hp-hero-background" role="img" aria-label={images.community.alt} style={{ backgroundImage: `url(${images.community.src})` }} />
      <div className="shell hp-hero-inner">
        <div className="hp-hero-copy">
          <Eyebrow>{copy.hero.eyebrow}</Eyebrow>
          <h1 id="hero-heading">
            <span>{copy.hero.title}</span>{" "}
            <span><em>{copy.hero.emphasis}</em></span>{" "}
            <span>{copy.hero.ending}</span>
          </h1>
          <p>{organization.mission}</p>
          <div className="hp-actions">
            <ActionLink href="/projets">Découvrir nos actions</ActionLink>
            <ActionLink href="#mission" secondary>Notre mission</ActionLink>
          </div>
        </div>
      </div>
    </section>
  );
}

const pillarIcons = [Scale, UsersRound, Sprout];
export function Pillars() {
  return (
    <section className="hp-pillars shell" aria-label="Les trois piliers de notre mission">
      {copy.pillars.map((pillar, index) => {
        const Icon = pillarIcons[index];
        return <Reveal key={pillar.title} className="hp-pillar">
          <Icon size={30} strokeWidth={1.3} aria-hidden="true" />
          <div><span className="hp-pillar-number" aria-hidden="true">0{index + 1}</span><h2>{pillar.title}</h2><p>{pillar.description}</p></div>
        </Reveal>;
      })}
    </section>
  );
}

export function Engagements() {
  return (
    <section id="engagements" className="hp-engagements shell hp-section" aria-labelledby="engagement-heading">
      <figure className="hp-engagement-photo"><Photo picture={images.dialogue} sizes="(max-width: 700px) 100vw, 50vw" /></figure>
      <Reveal className="hp-engagement-copy">
        <Eyebrow>NOTRE ENGAGEMENT</Eyebrow>
        <h2 id="engagement-heading">Une fondation tournée vers les personnes et la société.</h2>
        <div className="hp-editorial-rule" aria-hidden="true" />
        <p className="hp-engagement-lead">Parce que les droits humains, la démocratie et le progrès durable concernent chaque génération.</p>
        <p>La {organization.name} a pour mission de promouvoir les droits humains, la démocratie et le développement durable.</p>
        <ActionLink href="/a-propos">En savoir plus sur la fondation</ActionLink>
      </Reveal>
    </section>
  );
}

export function Mission() {
  const emphasis = "droits humains,";
  const [before, after] = organization.mission.split(emphasis);
  return (
    <section id="mission" className="hp-mission" aria-labelledby="mission-heading">
      <div className="shell hp-mission-inner">
        <Reveal className="hp-mission-intro"><Eyebrow>NOTRE MISSION</Eyebrow><p>Trois engagements complémentaires, une vision commune.</p></Reveal>
        <Reveal><h2 id="mission-heading">{after !== undefined ? <>{before}<em>{emphasis}</em>{after}</> : organization.mission}</h2></Reveal>
      </div>
    </section>
  );
}

export function Initiatives({ data }: { data: HomeContent }) {
  const activities = data.projects.items.filter((item) => item.contentStatus === "confirmed");
  return <section id="initiatives" className="shell hp-section hp-activities" aria-labelledby="projects-heading"><Reveal className="hp-section-head"><div><Eyebrow>02 / DE L’ENGAGEMENT À L’ACTION</Eyebrow><h2 id="projects-heading">Nos actions<br /><em>sur le terrain.</em></h2></div><Link className="text-link" to="/projets">Toutes nos actions <ArrowUpRight size={18} aria-hidden="true" /></Link></Reveal>{!activities.length && <p className="public-demo-note">Les prochaines activités confirmées seront présentées ici.</p>}{activities.map((project) => <Reveal className="hp-activity" key={project.id}><Link to={`/projets/${project.id}`} className="hp-activity-image" aria-label={`Découvrir : ${project.title}`}><Photo picture={project.image} /></Link><div className="hp-activity-copy"><Eyebrow>{project.category} · ACTIVITÉ CONFIRMÉE</Eyebrow><h3><Link to={`/projets/${project.id}`}>{project.title}</Link></h3><p>{project.description}</p>{project.image.src.endsWith("school-kits-pending.svg") && <p className="hp-pending">Les photographies de cette activité seront ajoutées après réception et confirmation des autorisations de publication.</p>}<Link className="text-link" to={`/projets/${project.id}`}>Découvrir cette action <ArrowUpRight size={18} aria-hidden="true" /></Link></div></Reveal>)}<div className="hp-section-foot"><p>Une activité réelle, présentée avec des informations confirmées.</p><Link className="text-link" to="/galerie">Explorer la galerie <ArrowUpRight size={18} aria-hidden="true" /></Link></div></section>;
}
export function Journal({ data }: { data: HomeContent }) {
  return <section id="journal" className="hp-journal hp-section" aria-labelledby="news-heading"><div className="shell"><Reveal className="hp-section-head"><div><Eyebrow>03 / LE JOURNAL DE LA FONDATION</Eyebrow><h2 id="news-heading">Actualités <em>récentes.</em></h2></div><Link className="text-link" to="/actualites">Tout le journal <ArrowUpRight size={18} aria-hidden="true" /></Link></Reveal><p className="hp-demo-news">Articles de démonstration · Les contenus ajoutés dans l’administration restent enregistrés dans ce navigateur.</p><div className="hp-news-grid">{!data.news.items.length && <p className="public-demo-note">Aucune actualité pour le moment. Le journal accueillera les prochaines publications.</p>}{data.news.items.map((article) => <Reveal key={article.id}><article className="hp-news-card"><Link to={`/actualites/${article.id}`} className="hp-news-image" aria-label={`Lire : ${article.title}`}><Photo picture={article.image} /></Link><span className="eyebrow">{article.category} · EXEMPLE</span><h3><Link to={`/actualites/${article.id}`}>{article.title}</Link></h3><p>{article.description}</p><Link className="text-link" to={`/actualites/${article.id}`}>Lire l’article <ArrowUpRight size={17} aria-hidden="true" /></Link></article></Reveal>)}</div></div></section>;
}
export function Participation() {
  return <section className="hp-participation shell" aria-labelledby="contact-heading"><figure><Photo picture={images.community} /></figure><Reveal className="hp-participation-copy"><Eyebrow>LA SUITE S’ÉCRIT ENSEMBLE</Eyebrow><h2 id="contact-heading">Une idée, une question ?<br /><span className="hp-nowrap">Parlons-en.</span></h2><ActionLink href="/contact">Nous contacter</ActionLink></Reveal></section>;
}


