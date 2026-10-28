import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Link,
  Outlet,
  ScrollRestoration,
  useLocation,
  useNavigation,
  useRouteError,
  isRouteErrorResponse,
  useRevalidator,
} from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { DetailDialog, type Detail } from "./DetailDialog";
import { homeContent } from "../data/home";
import { publicNavigation } from "../data/public";
import { siteContent } from "../data/site";
import { organization } from "../config/organization";
import { Eyebrow } from "./ui";
import {
  DEMO_CHANGED,
  DEMO_STORAGE_STATUS,
  hasStorageIssue,
} from "../services/demo-events";

export function usePageMetadata(title: string, description: string) {
  useEffect(() => {
    document.title = `${title} — ${organization.name} · Démonstration`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('meta[name="robots"]')
      ?.setAttribute("content", "noindex, nofollow");
  }, [title, description]);
}

export function SiteLayout({ children }: { children?: ReactNode }) {
  const [detail, setDetail] = useState<Detail | null>(null);
  const navigation = useNavigation();
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);
  const revalidator = useRevalidator();
  const [storageIssue, setStorageIssue] = useState(hasStorageIssue);
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") void revalidator.revalidate();
    };
    const status = () => setStorageIssue(hasStorageIssue());
    window.addEventListener(DEMO_CHANGED, refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener(DEMO_STORAGE_STATUS, status);
    let channel: BroadcastChannel | undefined;
    try {
      if ("BroadcastChannel" in window) {
        channel = new BroadcastChannel(DEMO_CHANGED);
        channel.onmessage = refresh;
      }
    } catch {
      /* Refresh on focus remains available. */
    }
    return () => {
      window.removeEventListener(DEMO_CHANGED, refresh);
      window.removeEventListener("focus", refresh);
      window.removeEventListener(DEMO_STORAGE_STATUS, status);
      channel?.close();
    };
  }, [revalidator]);
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    const frame = requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>("main h1");
      heading?.setAttribute("tabindex", "-1");
      heading?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
  return (
    <>
      <Header navigation={publicNavigation} notice={homeContent.demoNotice} />
      {storageIssue && (
        <p className="public-storage-notice" role="status">
          Stockage de ce navigateur indisponible : les contenus de démonstration
          d’origine sont affichés.
        </p>
      )}
      {navigation.state !== "idle" && (
        <div className="route-progress" role="status">
          <span />
          Chargement de la page…
        </div>
      )}
      {children || <Outlet />}
      <Footer
        navigation={publicNavigation}
        onNotice={(kind) => setDetail(siteContent.notices[kind])}
      />
      <DetailDialog detail={detail} onClose={() => setDetail(null)} />
      <ScrollRestoration />
    </>
  );
}

export function LoadingPage() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="shell page-loading"
      aria-busy="true"
    >
      <Eyebrow>UN INSTANT…</Eyebrow>
      <h1>Les idées prennent place.</h1>
      <p role="status">Chargement du contenu…</p>
      <div className="loading-skeleton" aria-hidden="true" />
    </main>
  );
}

export function RouteError({ notFound = false }: { notFound?: boolean }) {
  const error = useRouteError();
  const missing =
    notFound || (isRouteErrorResponse(error) && error.status === 404);
  usePageMetadata(
    missing ? "Page introuvable" : "Contenu indisponible",
    "Site de démonstration : le contenu demandé est introuvable ou momentanément indisponible.",
  );
  return (
    <main id="main" tabIndex={-1} className="shell public-error">
      <Eyebrow>
        {missing ? "404 / UN CHEMIN À RETROUVER" : "CONTENU INDISPONIBLE"}
      </Eyebrow>
      <h1>{missing ? "Reprenons\nle bon chemin." : "Un petit contretemps."}</h1>
      <p>
        {missing
          ? "Cette page n’existe pas, ou son adresse a changé. Revenons aux idées qui nous rassemblent."
          : "Le contenu n’a pas pu être chargé. Vous pouvez réessayer ou revenir à l’accueil."}
      </p>
      <div className="error-actions">
        <Link className="action" to="/">
          Revenir à l’accueil
        </Link>
        {!missing && (
          <button
            className="text-link"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        )}
        <Link className="text-link" to="/projets">
          Explorer les initiatives
        </Link>
      </div>
    </main>
  );
}
