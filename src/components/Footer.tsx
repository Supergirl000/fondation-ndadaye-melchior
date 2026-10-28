import { organization } from "../config/organization";
import { Brand } from "./Header";
import { Arrow } from "./ui";
import type { HomeContent } from "../data/home";
import { Link } from "react-router";

export function Footer({
  navigation,
  onNotice,
}: {
  navigation: HomeContent["navigation"];
  onNotice: (kind: "legal" | "credits") => void;
}) {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-top">
          <div>
            <Brand />
            <p>{organization.tagline || organization.mission}</p>
            <span className="footer-demo">
              Identité fournie par la Fondation · Site de démonstration
            </span>
          </div>
          <nav aria-label="Navigation de pied de page">
            <p className="eyebrow">EXPLORER</p>
            {navigation.map((item) => (
              <Link to={item.href} key={item.href}>
                {item.label}
                <Arrow />
              </Link>
            ))}
            <Link to="/contact">
              Faire connaissance
              <Arrow />
            </Link>
          </nav>
          <div className="footer-contact">
            <p className="eyebrow">RESTONS EN LIEN</p>
            {organization.contact.email ? (
              <a href={`mailto:${organization.contact.email}`}>
                {organization.contact.email}
              </a>
            ) : (
              <p>
                Nos coordonnées officielles
                <br />
                seront bientôt ici.
              </p>
            )}
            {organization.contact.phone && (
              <a href={`tel:${organization.contact.phone}`}>
                {organization.contact.phone}
              </a>
            )}
            {organization.contact.address && (
              <p>{organization.contact.address}</p>
            )}
            {organization.socialLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
                <Arrow />
              </a>
            ))}
            <Link to="/contact">
              Écrivons la suite <Arrow />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {organization.name} · Prototype
          </span>
          <div>
            <button onClick={() => onNotice("legal")}>
              Informations légales
            </button>
            <button onClick={() => onNotice("credits")}>Crédits visuels</button>
          </div>
          <span>
            Conception <b>RugosTech</b> <Arrow />
          </span>
        </div>
      </div>
    </footer>
  );
}
