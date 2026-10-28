import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  LayoutDashboard,
  Newspaper,
  Images,
  Settings2,
  ArrowUpRight,
  Plus,
  Pencil,
  Trash2,
  ArrowRight,
  HardDrive,
  Sprout,
  Menu,
  X,
} from "lucide-react";
import { organization } from "../config/organization";
import type { NewsArticle } from "../data/models";
import type { DemoState } from "../services/demo-db";
import { MAX_ASSET_BYTES, storageErrorMessage } from "../services/demo-db";
import { demoAdminRepository } from "../services/demo-admin";
import { DEMO_CHANGED } from "../services/demo-events";
import { NewsEditor } from "../components/admin/NewsEditor";
import { GalleryManager } from "../components/admin/GalleryManager";
import {
  AdminAlert,
  bytesLabel,
  ConfirmDialog,
} from "../components/admin/AdminUI";
import { Photo } from "../components/ui";
import { ArticleDate } from "../components/PublicUI";
import { usePageMetadata } from "../components/SiteLayout";
import "../admin.css";
import { schoolKitsActivity } from "../data/foundation";

const navigation = [
  { key: "apercu", label: "Vue d’ensemble", icon: LayoutDashboard },
  { key: "actualites", label: "Actualités", icon: Newspaper },
  { key: "galerie", label: "Photothèque", icon: Images },
  { key: "reglages", label: "Réglages démo", icon: Settings2 },
];
type Confirmation = {
  title: string;
  text: string;
  action: string;
  execute: () => Promise<void>;
};
export function AdminPage() {
  const [params] = useSearchParams();
  const view = navigation.some((item) => item.key === params.get("vue"))
    ? params.get("vue")!
    : "apercu";
  const [state, setState] = useState<DemoState>();
  const [bytes, setBytes] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<NewsArticle | "new">();
  const [confirm, setConfirm] = useState<Confirmation>();
  const [confirmError, setConfirmError] = useState("");
  const [busy, setBusy] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menu) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu]);
  usePageMetadata(
    "Administration de démonstration",
    "Démonstration frontend sans authentification. Les contenus sont conservés uniquement dans ce navigateur.",
  );
  const load = useCallback(async () => {
    try {
      const [snapshot, usage] = await Promise.all([
        demoAdminRepository.getSnapshot(),
        demoAdminRepository.storageBytes(),
      ]);
      setState(snapshot);
      setBytes(usage);
      setError("");
    } catch (failure) {
      setError(storageErrorMessage(failure));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  useEffect(() => {
    setEditing(undefined);
    setMenu(false);
    setNotice("");
  }, [view]);
  useEffect(() => {
    const refresh = () => {
      void load();
    };
    window.addEventListener("focus", refresh);
    let channel: BroadcastChannel | undefined;
    try {
      if ("BroadcastChannel" in window) {
        channel = new BroadcastChannel(DEMO_CHANGED);
        channel.onmessage = refresh;
      }
    } catch {
      /* Reload remains available. */
    }
    return () => {
      window.removeEventListener("focus", refresh);
      channel?.close();
    };
  }, [load]);
  const saved = async () => {
    await load();
    setEditing(undefined);
    setNotice("Modifications enregistrées uniquement dans ce navigateur.");
  };
  const ask = (confirmation: Confirmation) => {
    setConfirmError("");
    setConfirm(confirmation);
  };
  async function executeConfirmation() {
    if (!confirm) return;
    setBusy(true);
    setConfirmError("");
    try {
      await confirm.execute();
      await load();
      setConfirm(undefined);
      setNotice(
        "Modification locale effectuée. Le site public de ce navigateur est à jour.",
      );
    } catch (failure) {
      setConfirmError(storageErrorMessage(failure));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="admin-app">
      <a className="skip-link" href="#admin-main">
        Aller au contenu
      </a>
      <aside className={`admin-sidebar ${menu ? "is-open" : ""}`}>
        <Link className="admin-brand" to="/demo-admin">
          <img src={organization.logo} alt="" width={40} height={40} />
          <span>
            {organization.name}
            <small>ESPACE DE DÉMONSTRATION</small>
          </span>
        </Link>
        <span className="admin-sidebar-label">VOTRE ESPACE LOCAL</span>
        <nav aria-label="Navigation de l’administration">
          {navigation.map((item) => (
            <Link
              key={item.key}
              to={`/demo-admin?vue=${item.key}`}
              aria-current={view === item.key ? "page" : undefined}
            >
              <item.icon size={18} strokeWidth={1.6} />
              {item.label}
              {view === item.key && <span className="admin-active-dot" />}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <div>
            <Sprout strokeWidth={1} />
            <p>
              Un espace pour essayer.
              <br />
              <em>Sans publication globale.</em>
            </p>
          </div>
          <Link to="/">
            Voir le site public <ArrowUpRight size={17} />
          </Link>
          <small>
            Aucun compte ni mot de passe.
            <br />
            Cet accès n’est pas une protection de sécurité.
          </small>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <button
            className="icon-button admin-menu"
            ref={menuButton}
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-label={
              menu
                ? "Fermer le menu administratif"
                : "Ouvrir le menu administratif"
            }
          >
            {menu ? <X /> : <Menu />}
          </button>
          <span>
            Espace associatif <b>/</b>{" "}
            {navigation.find((item) => item.key === view)?.label}
          </span>
          <Link to="/">
            Site public <ArrowUpRight size={15} />
          </Link>
        </header>
        <div className="admin-local-banner">
          <HardDrive size={18} aria-hidden="true" />
          <div>
            <strong>
              Administration de démonstration — les modifications sont
              enregistrées uniquement dans ce navigateur.
            </strong>
            <span>
              Elles ne sont pas publiées globalement et ne se synchronisent pas
              entre les appareils ou les visiteurs.
            </span>
          </div>
          <span className="admin-local-pill">LOCAL</span>
        </div>
        <main id="admin-main" tabIndex={-1} className="admin-main">
          <div className="admin-heading">
            <div>
              <p className="eyebrow">
                UN ESPACE POUR LES IDÉES QUI PRENNENT VIE
              </p>
              <h1>
                {view === "apercu"
                  ? "Faisons vivre le collectif."
                  : view === "actualites"
                    ? "Le fil de vos histoires."
                    : view === "galerie"
                      ? "Le regard du collectif."
                      : "Un terrain d’essai, simplement."}
              </h1>
            </div>
            <span className="admin-demo-tag">PROTOTYPE INTERACTIF</span>
          </div>
          {notice && <AdminAlert>{notice}</AdminAlert>}
          {error && (
            <AdminAlert error>
              {error}
              <button
                className="admin-button secondary"
                onClick={() => void load()}
              >
                Réessayer
              </button>
            </AdminAlert>
          )}
          {loading && (
            <div className="admin-panel admin-loading" role="status">
              Ouverture du stockage de ce navigateur…
              <div className="admin-loading-bars" />
            </div>
          )}
          {state && !loading && (
            <>
              {view === "apercu" && (
                <aside className="admin-foundation-note">
                  <p className="eyebrow">
                    IDENTITÉ OFFICIELLE ET ACTIVITÉ CONFIRMÉE
                  </p>
                  <h2>{schoolKitsActivity.title}</h2>
                  <p>{schoolKitsActivity.description}</p>
                  <p>
                    Photographies non fournies ; autorisations de publication à
                    confirmer. Aucun fichier de cette activité n’est inclus dans
                    le build public.
                  </p>
                  <Link
                    className="text-link"
                    to={`/projets/${schoolKitsActivity.slug}`}
                  >
                    Consulter la fiche de l’activité <ArrowUpRight size={16} />
                  </Link>
                </aside>
              )}
              {view === "apercu" && (
                <>
                  <div className="admin-overview-stats">
                    <div>
                      <Newspaper />
                      <span>Articles de démonstration</span>
                      <strong>{state.articles.length}</strong>
                      <small>dans ce navigateur</small>
                    </div>
                    <div>
                      <Images />
                      <span>Images dans la photothèque</span>
                      <strong>{state.gallery.length}</strong>
                      <small>illustrations et imports locaux</small>
                    </div>
                    <div>
                      <HardDrive />
                      <span>Espace utilisé par les imports</span>
                      <strong>{bytesLabel(bytes)}</strong>
                      <small>
                        sur {bytesLabel(MAX_ASSET_BYTES)} pour cette démo
                      </small>
                    </div>
                  </div>
                  <div className="admin-overview-columns">
                    <section className="admin-welcome-panel">
                      <p className="eyebrow">DE L’IDÉE AU RÉCIT</p>
                      <h2>
                        Une histoire à partager ?<br />
                        <em>Commencez ici.</em>
                      </h2>
                      <p>
                        Ajoutez un article, choisissez une illustration et
                        découvrez le résultat sur le site public de ce
                        navigateur.
                      </p>
                      <Link
                        className="admin-button"
                        to="/demo-admin?vue=actualites"
                      >
                        Ouvrir les actualités <ArrowRight size={16} />
                      </Link>
                      <Sprout
                        className="admin-welcome-sprout"
                        strokeWidth={0.7}
                        aria-hidden="true"
                      />
                    </section>
                    <section className="admin-panel admin-recent">
                      <div className="admin-panel-heading">
                        <h2>Derniers contenus</h2>
                        <span>LOCAL</span>
                      </div>
                      {state.articles.slice(0, 3).map((article) => (
                        <div key={article.id}>
                          <Photo picture={article.image} />
                          <div>
                            <h3>{article.title}</h3>
                            <ArticleDate article={article} />
                          </div>
                        </div>
                      ))}
                      {!state.articles.length && (
                        <p>
                          Aucun article pour l’instant. Une première histoire
                          peut commencer.
                        </p>
                      )}
                    </section>
                  </div>
                  {state.settings.showHints && (
                    <div className="admin-help-grid">
                      <div>
                        <span>01</span>
                        <h3>Essayez librement</h3>
                        <p>
                          Les données de départ sont des exemples. Vous pouvez
                          les modifier ou les retirer.
                        </p>
                      </div>
                      <div>
                        <span>02</span>
                        <h3>Regardez le résultat</h3>
                        <p>
                          Les changements apparaissent sur le site public dans
                          ce même navigateur.
                        </p>
                      </div>
                      <div>
                        <span>03</span>
                        <h3>Repartez de zéro</h3>
                        <p>
                          Les réglages permettent de restaurer les contenus de
                          démonstration d’origine.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
              {view === "actualites" &&
                (editing ? (
                  <NewsEditor
                    key={typeof editing === "string" ? "new" : editing.id}
                    article={editing === "new" ? undefined : editing}
                    gallery={state.gallery}
                    onSaved={saved}
                    onCancel={() => setEditing(undefined)}
                  />
                ) : (
                  <>
                    <div className="admin-section-top">
                      <div>
                        <h2>Votre journal local</h2>
                        <p>
                          {state.articles.length} articles · Toutes les dates et
                          publications restent démonstratives.
                        </p>
                      </div>
                      <button
                        className="admin-button"
                        onClick={() => {
                          setEditing("new");
                          setNotice("");
                        }}
                      >
                        <Plus size={17} />
                        Créer un article
                      </button>
                    </div>
                    <div className="admin-panel admin-news-list">
                      {state.articles.map((article) => (
                        <article key={article.id}>
                          <Photo picture={article.image} />
                          <div className="admin-news-copy">
                            <span className="admin-tag">
                              {article.featured
                                ? "À LA UNE · LOCAL"
                                : "DÉMONSTRATION"}
                            </span>
                            <h3>{article.title}</h3>
                            <p>{article.description}</p>
                            <ArticleDate article={article} />
                          </div>
                          <div className="admin-news-actions">
                            <button
                              className="admin-button secondary"
                              onClick={() => {
                                setEditing(article);
                                setNotice("");
                              }}
                            >
                              <Pencil size={14} />
                              Modifier
                              <span className="sr-only"> {article.title}</span>
                            </button>
                            <Link to={`/actualites/${article.slug}`}>
                              Voir sur le site <ArrowUpRight size={14} />
                            </Link>
                            <button
                              className="text-danger"
                              onClick={() =>
                                ask({
                                  title: "Retirer cet article ?",
                                  text: `« ${article.title} » sera supprimé du contenu local de ce navigateur. Les autres visiteurs ne seront pas affectés.`,
                                  action: "Supprimer de ce navigateur",
                                  execute: () =>
                                    demoAdminRepository.deleteArticle(
                                      article.id,
                                    ),
                                })
                              }
                            >
                              <Trash2 size={14} />
                              Supprimer
                              <span className="sr-only"> {article.title}</span>
                            </button>
                          </div>
                        </article>
                      ))}
                      {!state.articles.length && (
                        <div className="admin-empty">
                          <h3>Le journal est ouvert.</h3>
                          <p>Créez un premier article de démonstration.</p>
                        </div>
                      )}
                    </div>
                  </>
                ))}
              {view === "galerie" && (
                <GalleryManager
                  items={state.gallery}
                  onSaved={saved}
                  onDelete={(item) =>
                    ask({
                      title: "Retirer cette image ?",
                      text: `« ${item.title} » disparaîtra de la galerie locale. Si un article l’utilise, son illustration sera conservée pour cet article.`,
                      action: "Retirer de la galerie locale",
                      execute: () => demoAdminRepository.deleteImage(item.id),
                    })
                  }
                />
              )}
              {view === "reglages" && (
                <div className="admin-settings">
                  <section className="admin-panel">
                    <p className="eyebrow">LE MODE DÉMONSTRATION</p>
                    <h2>Ce navigateur, et seulement lui.</h2>
                    <p>
                      Les données sont enregistrées dans IndexedDB, sur cet
                      appareil. Il n’y a ni serveur, ni base partagée, ni
                      authentification de production. Aucun mot de passe n’est
                      demandé et cette interface est accessible librement.
                    </p>
                    <p>
                      Le stockage peut être effacé par le navigateur ou
                      disparaître à la fermeture d’une session privée. N’y
                      placez aucune information personnelle ou sensible.
                    </p>
                    <div className="admin-storage-meter">
                      <span>
                        Images importées : {bytesLabel(bytes)} /{" "}
                        {bytesLabel(MAX_ASSET_BYTES)}
                      </span>
                      <meter
                        min={0}
                        max={MAX_ASSET_BYTES}
                        value={bytes}
                        aria-label="Espace utilisé par les images locales"
                      />
                    </div>
                    <label className="admin-checkbox">
                      <input
                        type="checkbox"
                        checked={state.settings.showHints}
                        disabled={busy}
                        onChange={async (event) => {
                          setBusy(true);
                          try {
                            await demoAdminRepository.saveSettings(
                              event.target.checked,
                            );
                            await saved();
                          } catch (failure) {
                            setError(storageErrorMessage(failure));
                          } finally {
                            setBusy(false);
                          }
                        }}
                      />
                      Afficher les conseils sur la vue d’ensemble
                    </label>
                  </section>
                  <section className="admin-panel admin-reset-panel">
                    <p className="eyebrow">REVENIR AU POINT DE DÉPART</p>
                    <h2>Un nouveau commencement.</h2>
                    <p>
                      Restaurez les articles et photographies d’origine. Vos
                      modifications locales et vos fichiers importés seront
                      supprimés de cette démonstration.
                    </p>
                    <button
                      className="admin-button danger"
                      onClick={() =>
                        ask({
                          title: "Réinitialiser la démonstration ?",
                          text: "Tous les articles modifiés et toutes les images importées dans ce navigateur seront retirés. Les contenus d’origine seront restaurés. Cette action est irréversible pour les modifications locales.",
                          action: "Réinitialiser les contenus locaux",
                          execute: () => demoAdminRepository.reset(),
                        })
                      }
                    >
                      Réinitialiser les contenus de démonstration
                    </button>
                  </section>
                </div>
              )}
            </>
          )}
          <footer className="admin-footer">
            <span>RugosTech · Prototype d’administration</span>
            <span>Aucune donnée publiée globalement.</span>
          </footer>
        </main>
      </div>
      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          action={confirm.action}
          busy={busy}
          error={confirmError}
          onConfirm={() => void executeConfirmation()}
          onClose={() => setConfirm(undefined)}
        >
          <p>{confirm.text}</p>
        </ConfirmDialog>
      )}
    </div>
  );
}
export const Component = AdminPage;
