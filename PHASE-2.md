# Phase 2 — Pages publiques

Le projet React/Vite existant a été prolongé. L’identité, les tokens visuels,
la composition de l’accueil et les ressources de la phase 1 sont conservés.
Aucune nouvelle dépendance n’a été ajoutée.

## Pages livrées

- `/a-propos` : introduction, mission, vision, valeurs, récit fictif et profils
  d’équipe explicitement présentés comme des emplacements de démonstration.
- `/projets` : projet à la une, catalogue, catégories, recherche et état vide
  avec réinitialisation des filtres.
- `/projets/jardins`, `/projets/savoirs`, `/projets/vivant` : intentions détaillées,
  chapitres de présentation, informations manquantes et galeries d’illustration.
- `/actualites` : une éditoriale, recherche, catégories et dates fictives.
- `/actualites/premiers-pas`, `/actualites/idees`, `/actualites/nature` : articles,
  sommaires, dates, signatures de démonstration et mises en page de lecture.
- `/galerie` : grille responsive, recherche, catégories et lightbox.
- `/contact` : coordonnées depuis la configuration, emplacements explicites pour
  les informations manquantes et réseaux sociaux affichés uniquement si fournis.

L’accueil conserve ses aperçus en fenêtre modale. Ils proposent désormais un lien
vers les pages complètes. La navigation et le pied de page sont partagés sur
toutes les routes, avec indication de la page active et gestion mobile.

## Architecture et fichiers

Nouveaux modèles dans `src/data/models.ts` : `Project`, `NewsArticle`,
`GalleryItem`, `Organization`, `ContentBlock`, `AboutContent` et profils d’équipe.
Les anciens types de l’accueil restent réexportés pour assurer la compatibilité.
Les contenus des pages sont dans `src/data/public.ts` ; l’adaptateur
`src/services/content.ts` expose les listes et les détails avec signal d’annulation.

Nouveaux composants :

- `src/components/SiteLayout.tsx` : cadre partagé, chargement, erreurs, métadonnées,
  restauration du défilement et transfert du focus après changement de page.
- `src/components/PublicUI.tsx` : fil d’Ariane, introduction, filtres, recherche,
  cartes, dates, chapitres, notice de démonstration et état vide.
- `src/components/Lightbox.tsx` : collection d’images et visionneuse accessible.
- `src/pages/AboutPage.tsx`, `ProjectsPage.tsx`, `ProjectDetailPage.tsx`,
  `NewsPage.tsx`, `NewsDetailPage.tsx`, `GalleryPage.tsx`, `ContactPage.tsx`.
- `src/public-pages.css` : compositions spécifiques et responsive.
- `scripts/public-check.cjs` : vérifications des parcours et des formats d’écran.

Fichiers existants adaptés : `src/main.tsx`, `src/config/organization.ts`,
`src/data/home.ts`, `src/services/content.ts`, `src/pages/HomePage.tsx`,
`src/components/Header.tsx`, `Footer.tsx`, `HomeSections.tsx`, `DetailDialog.tsx`,
`ui.tsx`, `scripts/browser-check.cjs` et `README.md`.

## Accessibilité et comportements

La lightbox accepte les flèches gauche/droite, les commandes précédente/suivante,
Tab, Maj+Tab et Échap. La navigation boucle sur les images et sur les contrôles.
La fermeture restitue le focus au déclencheur et rétablit le défilement du document.
Les légendes précisent le caractère illustratif des photographies.

Les résultats de recherche sont annoncés ; les états vides proposent une action
de réinitialisation. Les adresses inconnues, y compris les slugs inexistants,
affichent une page 404 avec retour à l’accueil. Les erreurs de chargement ont une
action de nouvelle tentative. Le chargement initial et les transitions disposent
d’états dédiés, prêts pour les futurs appels API.

Chaque page a un titre et une description propres. `noindex, nofollow` est maintenu
pour le prototype. Les dates d’articles portent la mention « Date fictive ».
Aucun formulaire de contact, envoi de message ou collecte de données n’est simulé.

## Vérifications exécutées

- `node node_modules/typescript/bin/tsc --noEmit` : réussi.
- `npm run build` via le CLI npm installé : réussi, TypeScript strict puis Vite.
- `scripts/public-check.cjs` exécuté contre le build servi par `vite preview` :
  12 routes vérifiées à 1440, 768, 390 et 320 px, sans débordement horizontal.
- 14 destinations de liens internes et les ancres de page vérifiées.
- Navigation mobile, fermeture du menu, focus après navigation, filtres,
  recherches, états vides et réinitialisation validés.
- Détails de projets, galeries, dates et sommaires des articles validés.
- Lightbox : navigation par flèches/boutons, passage dernière/première image,
  boucle de focus, fermeture et restitution du focus validés.
- Contact sans formulaire fictif ; coordonnées absentes clairement affichées.
- Routes inconnues et récupération vers l’accueil validées.
- Aucune erreur JavaScript détectée pendant les parcours publics.
- `scripts/browser-check.cjs` : non-régression de l’accueil réussie sur cinq
  largeurs, incluant ses aperçus, leur accès aux pages détaillées, les dialogues,
  la restauration du défilement et l’image de remplacement en cas d’échec.

Build : CSS 54,73 Ko (11,51 Ko gzip), JavaScript 375,18 Ko (116,21 Ko gzip),
HTML 0,81 Ko. Les visuels locaux existants sont réutilisés et chargés paresseusement
hors des images principales. Les détails de la galerie réutilisent trois sources
photographiques avec différents cadrages, ce qui est signalé aux visiteurs.

Les captures sont dans `artifacts/public/` (sorties ignorées par Git). Les pages
principales ont été revues sur ordinateur et mobile. Les vérifications utilisent
Chrome avec Playwright fourni par l’environnement, sans ajout au projet.

## Limites et éléments restants

Les contenus, coordonnées, équipe et visuels officiels restent à fournir. Les
pages ne prétendent à aucun résultat réel, bénéficiaire, partenaire ou financement.
Les métadonnées sont mises à jour côté navigateur : pas de rendu serveur ni de
pré-rendu prévu dans cette phase. Aucun audit exhaustif de lecteur d’écran ou
test Safari/iOS n’a été réalisé.

Pour l’hébergement futur, les routes frontend doivent retomber sur `index.html`,
en réservant `/api` à Laravel. Les réponses réseau devront être validées dans
l’adaptateur et les identifiants MySQL rester exclusivement côté serveur.

Aucun backend, base de données, tableau de bord ou déploiement n’a été créé.
