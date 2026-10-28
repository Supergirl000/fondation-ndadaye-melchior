import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { organization } from "../config/organization";
import { siteContent } from "../data/site";
import type { HomeContent } from "../data/home";
import { Arrow } from "./ui";

export function Brand() {
  return (
    <Link to="/" className="brand" aria-label={`${organization.name}, accueil`}>
      <img src={organization.logo} width="43" height="43" alt="" />
      <span>
        {organization.name}
        <small>{siteContent.brandDescriptor}</small>
      </span>
    </Link>
  );
}
export function Header({
  navigation,
  notice,
}: {
  navigation: HomeContent["navigation"];
  notice: string;
}) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <>
      <a href="#main" className="skip-link">
        Aller au contenu
      </a>
      <div className="demo-bar">
        <span className="demo-dot" />
        {notice}
        <span className="demo-credit">UNE PROPOSITION RUGOSTECH</span>
      </div>
      <header className="site-header">
        <div className="shell header-inner">
          <Brand />
          <button
            ref={toggle}
            className="menu-toggle icon-button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
          <nav
            id="main-navigation"
            aria-label="Navigation principale"
            className={open ? "navigation is-open" : "navigation"}
          >
            {navigation.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              className="nav-cta"
              to="/contact"
              onClick={() => setOpen(false)}
            >
              Contact <Arrow />
            </NavLink>
          </nav>
        </div>
      </header>
    </>
  );
}
