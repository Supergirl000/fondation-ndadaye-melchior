# Fondation NDADAYE Melchior — Site de démonstration

Le compte rendu de la dernière revue est disponible dans [QUALITY-REPORT.md](QUALITY-REPORT.md).
L’intégration de l’identité officielle est documentée dans [FOUNDATION-INTEGRATION.md](FOUNDATION-INTEGRATION.md).

Prototype local de présentation pour RugosTech. L’accueil de la phase 1 est conservé
et les pages publiques sont implémentées. Le nom, le logo et la mission ont été
fournis par la Fondation ; une activité scolaire est confirmée. Les autres projets
et articles restent des contenus de démonstration, sans statistiques ni témoignages inventés.

## Démarrer

Node.js >= 22.13 et npm sont nécessaires (Node 22.23 utilisé pour la validation).

```sh
npm ci
npm run dev
npm run lint
npm run check
npm run build
npm run preview
```

Sur cette machine Windows, si le raccourci `npm` pointe vers un CLI absent,
le CLI installé avec Node peut être appelé directement depuis PowerShell :

```powershell
& 'C:\Program Files\nodejs\node.exe' 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js' run dev -- --port 5174
```

Puis ouvrir `http://127.0.0.1:5174/demo-admin` pour l’administration locale.

`dist/` contient le build statique. Les versions réellement installées sont
verrouillées dans package-lock.json. Tailwind utilise le plugin Vite officiel.

## Organisation du code

- `src/config/organization.ts` : nom, logo, slogan, mission, couleurs, coordonnées et réseaux.
- `src/data/home.ts` : modèle typé et contenus de démonstration de la page.
- `src/data/models.ts` : modèles réutilisables des projets, articles, images et de l’organisation.
- `src/data/public.ts` : contenus des pages publiques, scénarios fictifs et dates de démonstration.
- `src/services/content.ts` : contrat et adaptateur d’accès aux contenus.
- `src/services/demo-db.ts` : IndexedDB, transactions de contenu et fichiers Blob.
- `src/services/demo-admin.ts` : opérations asynchrones d’administration locale.
- `src/services/image-processing.ts` : validation, redimensionnement et compression des imports.
- `src/pages/AdminPage.tsx`, `src/components/admin/` et `src/admin.css` : interface de démonstration.
- `src/components/` : navigation, pied de page, dialogue accessible, primitives visuelles.
- `src/components/HomeSections.tsx` : sections éditoriales réutilisables.
- `src/pages/HomePage.tsx` : composition de la page.
- `src/pages/` : à propos, projets, articles, galerie, contact et vues détaillées.
- `src/components/SiteLayout.tsx` : cadre partagé, métadonnées, chargement et erreurs.
- `src/components/Lightbox.tsx` : galerie, navigation au clavier et gestion du focus.
- `src/styles.css` : système visuel, responsive, interactions et réduction des mouvements.
- `src/public-pages.css` : compositions des nouvelles pages, sans refonte de l’accueil.
- `public/images/` : visuels locaux, remplacement SVG et crédits.

Les chargeurs React Router obtiennent les contenus via ContentRepository. Pour brancher
Laravel, remplacer cet adaptateur par fetch, valider les réponses à la frontière
API et conserver les modèles typés. Le signal d’annulation est déjà transmis.
Les secrets et accès MySQL doivent rester exclusivement côté Laravel.

## Interactions et accessibilité

Navigation entre pages et par ancres, menu mobile avec fermeture par Échap, lien d’évitement,
focus visible, titres hiérarchisés, photographies légendées comme illustrations.
Les projets et articles ont leurs pages détaillées ; les aperçus de l’accueil restent
disponibles et donnent accès aux pages complètes. La galerie utilise `<dialog>` :
focus contenu, flèches gauche/droite, Échap, fermeture par bouton et restitution du focus.
Les effets d’apparition se désactivent avec prefers-reduced-motion.
Aucun formulaire ne transmet de données ; le bouton de contact explique ce statut.
Aucun cookie de suivi, CDN, service payant, backend ou base partagée. Les contenus
de l’administration de démonstration utilisent exclusivement IndexedDB local.

## Configuration du design et des contenus

`src/config/organization.ts` regroupe le nom, le chemin du logo, le slogan, la
mission, les coordonnées, les réseaux et les couleurs de marque. Les variables
CSS sont appliquées au démarrage. Le logo fourni est intégré dans
`public/images/fondation/logo.png`, avec son favicon dérivé sans recadrage.
Le PNG original transparent est conservé à l’identique dans `assets/foundation/`.
`src/foundation.css` adapte les dimensions et les fonds autour du logo, sans
retoucher son portrait, ses symboles ou ses couleurs. Aucun slogan officiel n’a
été fourni : le pied de page affiche la mission officielle.

`src/styles.css` définit le système initial ; `src/public-pages.css` et
`src/admin.css` le prolongent. `src/quality.css` contient les corrections issues de
la revue : contrastes, focus, cibles tactiles et lisibilité des légendes. Après
tout changement de palette, relancer l’audit de contraste. Georgia et Segoe UI
sont des polices système : aucun fichier de police externe n’est téléchargé.

Le nom officiel est « Fondation NDADAYE Melchior ». Sa mission exacte est :
« Promouvoir les droits humains, la démocratie et le développement durable. »
Les autres textes de démonstration sont typés dans `src/data/home.ts`, `public.ts` et
`site.ts`. L’activité confirmée de remise de kits scolaires est définie dans
`src/data/foundation.ts` et distinguée des projets fictifs. Les statistiques d’impact, témoignages et partenaires réels ne sont
pas inventés. Les dates du journal sont fictives ; les profils d’équipe sont des
emplacements explicitement identifiés. Les métadonnées sont spécifiques à la page
et le prototype reste en `noindex, nofollow`.

## Photographies et performance

Les illustrations livrées sont des WebP en 480, 960 et 1 400 px, sélectionnés par
`srcset` et `sizes`, avec dimensions intrinsèques et chargement différé lorsque
pertinent. Les originaux sont conservés dans `assets/source-images/`, en dehors
des fichiers publics. Les crédits sont dans `public/images/CREDITS.md`.
`src/config/images.ts` conserve la compatibilité avec les anciennes adresses JPG
déjà sauvegardées dans le navigateur, sans supprimer les modifications locales.

`scripts/optimize-images.cjs` régénère les variantes à partir des originaux. Il
utilise Sharp fourni par l’environnement (`SHARP_PATH`) ou installé dans l’outillage
de développement ; Sharp n’est pas nécessaire au build ni au navigateur.
Les variantes sont versionnées. Les pages secondaires et le tableau de bord sont
chargés à la demande. Aucune bibliothèque d’animation n’est ajoutée.

## Vérifications reproductibles

```sh
npm run lint
npm run check
npm run build
npm run preview -- --port 5175
```

ESLint vérifie le JavaScript, TypeScript et les règles React Hooks, avec zéro
avertissement autorisé. `axe-core` est une dépendance de développement pour les
vérifications navigateur ; aucun outil d’audit n’est livré aux visiteurs.

Les scripts ci-dessous utilisent Playwright fourni par l’environnement. Définir
`PLAYWRIGHT_PATH` si le module n’est pas résolu localement, `CHROMIUM_PATH` pour le
navigateur installé et `PREVIEW_URL` pour l’URL du serveur à contrôler :

```sh
node scripts/quality-check.cjs
node scripts/admin-check.cjs
node scripts/public-check.cjs
node scripts/browser-check.cjs
```

Les tests ouvrent des contextes isolés et ne touchent pas aux données du navigateur
de l’utilisateur. Les résultats et captures sont générés dans `artifacts/`, ignoré
par Git. L’audit qualité vérifie 320, 375, 768, 1024 et 1440 px ; axe examine les
pages et certains états interactifs. Cela ne remplace pas un audit humain complet
de conformité, des essais de lecteur d’écran ou des tests sur appareils réels.

## Exigences d’hébergement

Déployer uniquement le contenu de `dist/`, avec HTTPS et un serveur prenant en
charge le repli des routes React vers `index.html`. Ne pas déposer le dépôt, les
originaux, les scripts de test ou les dépendances dans le dossier public du serveur.
Le projet est prévu à la racine du domaine ; un sous-dossier demanderait de
configurer ensemble `base` dans Vite et `basename` dans React Router.

Exemple de réécriture Apache à adapter et à tester sur l’hébergement retenu :

```apache
RewriteEngine On
RewriteRule ^api(?:/|$) - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . index.html [L]
```

Les routes `/api` doivent être gérées par Laravel lorsqu’il sera ajouté ; cette
réécriture ne constitue pas une configuration du backend. Activer la compression
HTTP pour HTML/CSS/JS et le cache long des fichiers à nom haché dans `assets/`,
tout en permettant la revalidation de `index.html` et des images à noms stables.
Tester un accès direct et un rechargement de chaque route sur le serveur final.

La démo peut être hébergée comme prototype statique après ces vérifications, mais
son administration reste ouverte et locale. Une mise en production officielle
demande identité et mentions légales validées, contenus autorisés, API, contrôle
d’accès côté serveur et revue de sécurité. Aucun déploiement n’est effectué ici.

## Raccordement futur à Laravel et MySQL

Remplacer les implémentations de `ContentRepository` et `DemoAdminRepository` par
des appels REST asynchrones : listes, détails, création, modification, suppression
et upload. Valider les réponses à la frontière API et conserver les modèles typés
pour ne pas refaire les composants. Le serveur devra valider les fichiers, gérer
les permissions, les identifiants, les erreurs et les conflits de modification.
Les images hébergées utiliseront `Picture.src` sans `assetId` local. Les accès
MySQL, secrets et autorisations doivent rester exclusivement côté Laravel.

## Routes publiques

- `/` : accueil conservé.
- `/a-propos` : présentation, mission, vision, valeurs, récit et profils de démonstration.
- `/projets` et `/projets/:slug` : catalogue, filtres, recherche et détails.
- `/actualites` et `/actualites/:slug` : journal, dates fictives et lecture détaillée.
- `/galerie` : recherche, catégories, images et lightbox.
- `/contact` : coordonnées officielles ou indications explicites des informations manquantes.
- `/demo-admin` : administration de démonstration, accessible sans compte ni mot de passe.

Les adresses et slugs inconnus affichent une page 404. Les recherches sans résultat
proposent une réinitialisation. Les chargeurs ont un état initial et un indicateur
de transition prêts pour la future API. Les métadonnées sont adaptées à chaque page,
avec `noindex, nofollow` maintenu pour le prototype.

## Étapes futures, hors du périmètre actuel

1. Recevoir les informations officielles complémentaires, les photographies de l’activité et la confirmation de leurs droits de publication.
2. Définir le contrat de l’API Laravel à partir des modèles existants.
3. Implémenter les véritables parcours de contact et participation avec leur politique de confidentialité.
4. Ajouter les mentions légales et coordonnées officielles.
5. Préparer l’hébergement Namecheap : API Laravel/MySQL et fichiers `dist/`.
   Avec BrowserRouter, les routes frontend doivent retomber sur index.html ;
   `/api` doit rester géré par Laravel. Adapter `base` de Vite si sous-répertoire.
6. Retirer `noindex` uniquement quand le site officiel est prêt.

## Administration de démonstration

L’administration est un prototype frontend, sans authentification de production.
Elle n’offre aucune protection de sécurité. Aucune donnée personnelle ou sensible
ne doit y être enregistrée. Les articles et images sont conservés dans IndexedDB,
uniquement pour ce navigateur et cette origine (adresse et port du site).

Les pages publiques, y compris l’accueil, lisent le même dépôt. Les onglets de la
même origine sont rafraîchis via BroadcastChannel et lors du retour au premier
plan. Les données ne sont pas publiées globalement, ne sont pas partagées avec les
autres visiteurs et ne se synchronisent pas entre appareils. Le navigateur peut
effacer ce stockage, notamment à la fermeture d’une session privée.

Imports : JPEG, PNG et WebP seulement, 5 Mo par fichier, 6 fichiers par lot,
24 mégapixels maximum. Les images sont redimensionnées à 1 600 px et réencodées
localement, sans EXIF conservé ; limite après compression de 2 Mo par image et
limite totale de 30 Mo pour les fichiers de la démo. Les Blobs restent dans
IndexedDB ; les URL d’aperçu sont temporaires et révoquées. Aucune image n’est
enregistrée dans localStorage.

Les contenus et les fichiers sont modifiés dans une transaction commune. En cas
d’échec de stockage, la modification est annulée. Les fichiers devenus inutilisés
sont retirés ; une image encore utilisée dans un article est conservée même après
son retrait de la galerie. La remise à zéro restaure les contenus d’origine et
retire les imports locaux, après confirmation.

Le backend, Laravel/MySQL et l’administration de production restent à créer.
Les photographies de l’activité scolaire n’ont pas été fournies et leur autorisation
de publication n’est pas confirmée. Aucune photographie d’élève n’est incluse dans
le build public. La collection de galerie est réservée avec un message explicite.
Les originaux de futures photographies doivent rester hors de `public/` jusqu’à
confirmation des autorisations. Aucun nom d’élève, lieu, date, école, montant ou
nombre de bénéficiaires non confirmé ne doit être ajouté.

La nouvelle activité est ajoutée aux anciens contenus IndexedDB par son identifiant
stable, sans remplacer les articles ou images créés localement. La remise à zéro
restaure les exemples initiaux et l’activité confirmée, sans photographies en attente.
La gestion des projets dans le tableau de bord, facultative dans ce périmètre,
n’est pas ajoutée ; les pages publiques des projets sont conservées.

Le compte rendu initial figure dans `PHASE-1.md`, celui des pages publiques dans
`PHASE-2.md`, et celui de l’administration dans `PHASE-3.md`.
Le script facultatif `scripts/admin-check.cjs` teste les modifications dans un
contexte de navigateur isolé, sans toucher au contenu local de l’utilisateur.
Le script `scripts/public-check.cjs` vérifie le site public
(le script initial `browser-check.cjs` reste disponible pour l’accueil). Ils utilisent Playwright fourni par
votre environnement : définir `PLAYWRIGHT_PATH` si nécessaire, `CHROMIUM_PATH`
pour un navigateur installé et `PREVIEW_URL` pour l’adresse du serveur local.
Il ne nécessite aucun ajout de dépendance à l’application livrée.

## Accueil éditorial de la Fondation

La composition actuelle est définie dans `src/components/HomeRedesign.tsx`,
`src/data/homepage.ts` et `src/homepage.css`. Le catalogue typé distingue les
illustrations IA fournies des photographies documentaires. Cinq WebP locaux sont
utilisés ; aucune image IA ne constitue une preuve d’activité réelle.
La maquette Option 3 mentionnée n’était pas jointe aux ressources accessibles ;
la mise en page suit sa description textuelle. Voir `HOMEPAGE-REDESIGN.md`.

L’accueil lit toujours le dépôt asynchrone : seules les activités confirmées
apparaissent dans « Nos actions sur le terrain », et les trois premières actualités
locales apparaissent dans le journal. Les trois articles d’exemple d’origine,
lorsqu’ils utilisent encore leurs anciennes photographies stock, reçoivent une
illustration éditoriale à l’accueil. Cette adaptation de présentation ne modifie
aucune donnée enregistrée et conserve les images importées depuis l’administration.
Aucune date de démonstration n’est présentée comme une publication officielle.

`scripts/browser-check.cjs` teste la nouvelle composition, ses destinations,
le menu mobile et le fallback des images à cinq largeurs. Les captures récentes
figurent dans `artifacts/redesign/` (non versionnées).
