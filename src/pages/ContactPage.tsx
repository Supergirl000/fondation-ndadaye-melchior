import { Link } from "react-router";
import { ArrowUpRight, Mail, MapPin, Phone, Sprout } from "lucide-react";
import { organization } from "../config/organization";
import { pageCopy } from "../data/public";
import { Breadcrumbs, DemoNote, PageIntro } from "../components/PublicUI";
import { Eyebrow } from "../components/ui";
import { usePageMetadata } from "../components/SiteLayout";

export function ContactPage() {
  usePageMetadata("Contact", pageCopy.contact.description);
  const { contact, socialLinks } = organization;
  return (
    <main id="main" tabIndex={-1} className="public-contact-page">
      <div className="shell">
        <Breadcrumbs items={[{ label: "Contact" }]} />
        <div className="contact-page-grid">
          <div>
            <PageIntro {...pageCopy.contact} />
            <div className="contact-emblem" aria-hidden="true">
              <Sprout strokeWidth={0.7} />
              <span>LES BELLES CHOSES COMMENCENT ENSEMBLE.</span>
            </div>
          </div>
          <section
            className="contact-directory"
            aria-labelledby="contact-directory-heading"
          >
            <Eyebrow>LES POINTS DE RENCONTRE</Eyebrow>
            <h2 id="contact-directory-heading">Restons en lien.</h2>
            <dl>
              <div>
                <dt>
                  <Mail size={18} aria-hidden="true" />
                  Nous écrire
                </dt>
                <dd>
                  {contact.email ? (
                    <a href={`mailto:${contact.email}`}>
                      {contact.email}
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </a>
                  ) : (
                    <>
                      <span>Adresse e-mail à renseigner</span>
                      <small>Coordonnée officielle non fournie</small>
                    </>
                  )}
                </dd>
              </div>
              <div>
                <dt>
                  <Phone size={18} aria-hidden="true" />
                  Nous appeler
                </dt>
                <dd>
                  {contact.phone ? (
                    <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}>
                      {contact.phone}
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </a>
                  ) : (
                    <>
                      <span>Numéro à renseigner</span>
                      <small>Coordonnée officielle non fournie</small>
                    </>
                  )}
                </dd>
              </div>
              <div>
                <dt>
                  <MapPin size={18} aria-hidden="true" />
                  Nous retrouver
                </dt>
                <dd>
                  {contact.address ? (
                    <span>{contact.address}</span>
                  ) : (
                    <>
                      <span>Adresse à renseigner</span>
                      <small>Lieu et modalités d’accueil à confirmer</small>
                    </>
                  )}
                </dd>
              </div>
            </dl>
            <div className="contact-socials">
              <Eyebrow>AILLEURS, AUSSI</Eyebrow>
              {socialLinks.length ? (
                socialLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                    <ArrowUpRight size={17} aria-hidden="true" />
                    <span className="sr-only"> (nouvel onglet)</span>
                  </a>
                ))
              ) : (
                <p>
                  Les réseaux sociaux officiels seront indiqués ici lorsqu’ils
                  auront été communiqués.
                </p>
              )}
            </div>
            <DemoNote>
              Les coordonnées présentées comme manquantes ne sont pas actives.
              Aucun formulaire ni système d’envoi de message n’est proposé dans
              ce prototype.
            </DemoNote>
          </section>
        </div>
      </div>
      <section className="contact-next">
        <div className="shell">
          <Eyebrow>EN ATTENDANT LA RENCONTRE</Eyebrow>
          <h2>
            Découvrons ce qui
            <br />
            pourrait nous réunir.
          </h2>
          <div>
            <Link className="text-link" to="/projets">
              Explorer les initiatives{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <Link className="text-link" to="/a-propos">
              Découvrir notre esprit{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
