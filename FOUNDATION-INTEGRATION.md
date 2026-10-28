# Fondation NDADAYE Melchior — Intégration de l’identité

## Identité et mission

Nom intégré : **Fondation NDADAYE Melchior**.

Mission officielle : **« Promouvoir les droits humains, la démocratie et le développement durable. »**

La configuration centrale, l’accueil, la mission de l’accueil, la page À propos,
le pied de page, les métadonnées et la marque du tableau de bord utilisent cette
identité. Aucun slogan officiel n’est inventé ; la configuration laisse le slogan
vide et le pied de page reprend la mission. L’histoire, la vision, les valeurs et
l’équipe non communiquées sont signalées comme manquantes ou démonstratives.

## Logo conservé et intégré

- `assets/foundation/logo-original.png` : copie exacte du fichier transmis,
  empreinte SHA-256 comparée avec la source et identique.
- `public/images/fondation/logo.png` : PNG transparent réduit proportionnellement
  à 256 × 215 px, environ 50,6 Ko, utilisé par la navigation, le footer et l’administration.
- `public/images/fondation/favicon.png` : favicon 64 × 64 px contenant l’emblème
  entier, proportionnellement réduit, sur un fond ivoire.

Le portrait, les branches, les symboles et les couleurs ne sont pas redessinés,
retouchés ou recadrés. Les composants utilisent `object-fit: contain`. Un fond
ivoire autour du logo maintient sa lisibilité sur le footer et la barre latérale.
L’ancien logo provisoire est archivé hors des fichiers publics.

## Activité confirmée

Fiche publique : `/projets/distribution-kits-scolaires`.

Titre : **Distribution de kits scolaires aux élèves**.

Description fournie : **La Fondation NDADAYE Melchior a procédé à une remise de kits scolaires à des élèves.**

L’activité apparaît dans les initiatives de l’accueil, dans les projets, dans
une collection réservée de la galerie et dans l’aperçu de l’administration.
Elle est distincte des scénarios fictifs. Aucune date, école, localisation,
identité d’élève, quantité, somme ou résultat supplémentaire n’a été inventé.

## Photographies et autorisations : en attente

**Aucune photographie de l’activité n’a été fournie dans les ressources disponibles
du projet pour cette demande. Aucune confirmation des droits de publication des
photographies d’élèves n’a été reçue.**

Aucune photographie d’activité ou d’élève n’a donc été ajoutée au build public.
Le SVG « Photographies à fournir » est un emplacement identifié, pas une photo.
Les photographies de banque d’images existantes restent étiquetées comme illustrations.

À fournir pour poursuivre cette partie :

- les photographies réelles sélectionnées de la remise de kits ;
- la confirmation par la Fondation des autorisations nécessaires à leur publication ;
- les légendes validées, sans identification des élèves.

Les futurs originaux doivent rester dans `assets/foundation/`, hors de `public/`,
tant que les autorisations ne sont pas confirmées. Les variantes optimisées pourront
ensuite rejoindre la collection de cette activité.

## Conservation des contenus locaux

Le mécanisme de seed IndexedDB ajoute l’activité par identifiant stable s’il la
trouve absente. Il ne remplace pas les articles ou images créés localement. La
réinitialisation restaure les exemples d’origine et l’activité confirmée, dont la
galerie reste vide tant qu’aucune photographie n’est fournie et autorisée.

## Principaux fichiers créés ou adaptés

- Identité : `src/config/organization.ts`, `src/data/site.ts`, `index.html`.
- Activité et contenus : `src/data/foundation.ts`, `src/data/models.ts`,
  `src/data/home.ts`, `src/data/public.ts`, `src/services/demo-db.ts`.
- Présentation : `src/foundation.css`, `src/main.tsx`, `src/components/Footer.tsx`,
  `HomeSections.tsx`, `PublicUI.tsx`, et les pages `HomePage`, `AboutPage`,
  `ProjectsPage`, `ProjectDetailPage`, `GalleryPage`, `AdminPage`.
- Assets : PNG original, logo optimisé, favicon et SVG d’attente dans les chemins
  précisés ci-dessus ; ancien logo dans `assets/source-images/placeholder-logo.svg`.
- Documentation : `README.md`, `assets/foundation/README.md`,
  `public/images/CREDITS.md`, présent compte rendu.
- Vérifications : `scripts/foundation-check.cjs` et adaptation des tests des projets.

## Tests et état avant hébergement Render

Lint, TypeScript et build Vite réussis. Le test d’identité vérifie le logo et la
mission aux largeurs 320, 375, 768, 1024 et 1440 px, sans débordement. La migration
des données locales conserve un article ajouté par l’utilisateur ; la remise à
zéro conserve l’activité confirmée. L’empreinte du logo original est inchangée.

L’audit navigateur couvre 17 vues aux cinq largeurs, ainsi que les formulaires,
la galerie et les dialogues, sans violation axe détectée dans ce périmètre. Les
vérifications de non-régression des pages publiques (15 destinations de liens),
de l’administration CRUD et de l’accueil se sont terminées avec le code 0, sans
erreur JavaScript dans les parcours vérifiés.

Avant une publication : fournir/autoriser les photos, compléter les coordonnées
et mentions légales, vérifier les réécritures SPA et HTTPS chez l’hébergeur. Les
essais Safari/lecteurs d’écran restent à prévoir. L’administration est toujours
ouverte, locale et démonstrative ; aucun backend ni authentification de production
n’a été créé. Aucun paramétrage Render, Laravel, MySQL ou Namecheap, et aucun
déploiement n’ont été effectués. Aucune phase suivante n’a été commencée.
