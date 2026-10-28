# Refonte de l’accueil — Fondation NDADAYE Melchior

## Périmètre

Refonte de l’accueil dans l’application existante. Routes publiques, détails,
galerie, lightbox et administration IndexedDB conservés. Aucun backend,
authentification, déploiement ou service payant ajouté.

## Fichiers

- `src/components/HomeRedesign.tsx` : sept sections de l’accueil ; remplace l’ancien `HomeSections.tsx`, supprimé car inutilisé.
- `src/data/homepage.ts` : textes éditoriaux typés, piliers et catalogue des illustrations utilisées.
- `src/homepage.css` : compositions, couleurs, transitions et adaptations responsive, limitées à l’accueil ; ajustement de l’espacement de la navigation partagée.
- `src/pages/HomePage.tsx`, `src/main.tsx` : assemblage et styles.
- `src/components/Header.tsx`, `src/data/public.ts` : six destinations publiques : Accueil, Notre esprit, Nos actions, Actualités, Galerie, Contact.
- `src/services/content.ts` : activités confirmées dynamiques, actualités toujours issues du dépôt local. Les trois anciens articles de démonstration reçoivent des illustrations éditoriales sur l’accueil lorsqu’ils utilisent encore leurs images stock d’origine ; les images importées et les autres articles sont préservés. Aucune mutation des données IndexedDB.
- `src/data/site.ts`, `public/images/CREDITS.md`, `README.md` : provenance et limites des visuels.
- `scripts/browser-check.cjs`, `quality-check.cjs`, `public-check.cjs`, `admin-check.cjs`, `foundation-check.cjs` : parcours et sélecteurs adaptés à la nouvelle composition.

## Images

Les onze WebP annoncés sont présents. Cinq utilisés :

- `hero-communaute.webp` : hero, dernier appel au contact, illustration de l’un des articles d’exemple.
- `dialogue-citoyen.webp` : collage, participation citoyenne et article d’exemple.
- `droits-humains-justice.webp` : droits humains.
- `developpement-durable.webp` : développement durable et article d’exemple.
- `solidarite-ensemble.webp` : solidarité et mission.

Illustrations IA fournies, signalées comme telles ; aucun événement réel ne leur
est attribué. Le hero pèse environ 88 Ko et les quatre autres illustrations entre
18 et 38 Ko. Aucun Base64 ou service d’image externe.
Chargement différé sous le hero, dimensions intrinsèques et conteneurs responsive.
Logo officiel conservé sans modification.

## Composition

Hero asymétrique en ivoire avec collage communautaire ; trois piliers de mission ;
engagements en composition éditoriale ; mission officielle sur fond vert profond ;
activité scolaire confirmée avec emplacement photographique explicite ; journal
dynamique ; appel au contact avec visuel communautaire. Footer existant conservé.
L’orange demandé apparaît notamment sur l’appel de mission ; une nuance plus
foncée assure la lisibilité des textes orange sur fond ivoire.

## Vérifications

- `npm run lint` : réussi, aucun avertissement.
- `npm run check` : validation TypeScript explicite.
- `npm run build` : build de production Vite réussi.
- `scripts/browser-check.cjs` : cinq largeurs 320, 375, 768, 1024 et 1440 px, images, sections, trois piliers, quatre engagements, activité confirmée, destinations de l’accueil, menu mobile, Échap et fallback d’image.
- `scripts/quality-check.cjs` : 17 vues × cinq largeurs ; rafraîchissements directs, aucune image cassée ni débordement. Axe A/AA à 375 et 1440 px, également dans la lightbox et les états de formulaire/confirmation ; zéro violation détectée. Navigation clavier, focus, mouvement réduit et compatibilité des anciennes images locales vérifiés.
- `scripts/public-check.cjs` : routes, liens, filtres, états vides, détails, galerie, clavier, contact et 404 réussis.
- `scripts/admin-check.cjs` : création/modification/suppression, prévisualisation, uploads JPEG/PNG/WebP, erreurs, compression, rollback de quota, nettoyage des URL temporaires, rafraîchissement public dont l’accueil, reset et mode stockage indisponible réussis.
- `scripts/foundation-check.cjs` : identité, mission exacte, logo, préservation des contenus locaux, activité confirmée après reset et absence de photos non autorisées réussis.

Tests Chrome/Playwright dans des contextes isolés ; aucun effacement des données
de l’utilisateur. Captures : `artifacts/redesign/home-{largeur}.png`. Aucune erreur
console détectée dans l’audit des 85 vues. Axe ne remplace pas un audit humain
exhaustif ; certaines vérifications de contraste sur images nécessitent une revue
manuelle. Aucun score Lighthouse ou test réseau mobile réel annoncé.

## Points ouverts

- Aucune maquette « Option 3 » n’était accessible dans les pièces jointes : la composition suit le brief textuel, sans prétendre reproduire exactement cette référence.
- Les vraies photos de remise des kits et leurs autorisations ne sont pas disponibles : aucune photo d’élève publiée. Le bloc reste explicitement en attente.
- Aucun article officiel daté fourni ; les actualités restent des exemples, sans date présentée comme vérifiée sur l’accueil.
- Coordonnées et liens sociaux officiels non fournis ; aucun contact inventé.
- Les six autres illustrations restent disponibles sans forcer leur chargement sur l’accueil.
- Administration ouverte et données locales à cette origine/navigateur, sans synchronisation globale ni sécurité de production.


## Affinement visuel du hero approuvé

- Titre conservé mot pour mot, réparti sur trois lignes sur desktop ; taille réduite, interligne et largeur ajustés.
- Hero plus compact : marges verticales réduites et colonnes rééquilibrées, mission et boutons immédiatement lisibles.
- Visuel communautaire conservé et recadré moins fortement ; images de dialogue et de solidarité réunies dans une mosaïque continue, avec un seul contour arrondi et des séparations fines.
- Mentions IA maintenues sur chaque image ; signature éditoriale et provenance alignées sous la composition.
- Bouton secondaire mieux délimité, survol léger désactivé en mouvement réduit ; alignement des icônes des trois piliers ajusté.
- Modifications limitées à `src/components/HomeRedesign.tsx`, `src/data/homepage.ts`, `src/homepage.css` et au test de régression de l’accueil. Logo, dépôt de contenu, routes et administration inchangés.
- Vérifications : captures et navigation aux largeurs 320/375/768/1024/1440, aucun débordement, aucune image cassée ; parcours publics et lightbox réussis ; lint et build TypeScript/Vite réussis. Le test vérifie aussi le texte exact, les trois lignes desktop et la visibilité du bouton principal dans 768 px de hauteur.

## Mise à jour — photographies sans badges et parcours clarifié

Cette mise à jour remplace les mentions précédentes de badges sur les images.
Le composant `IllustrationNote` et tous ses rendus ont été retirés du hero, des
engagements, de la mission, des actualités et de l’appel au contact. Ses styles
`.hp-image-note` et le positionnement des légendes superposées ont été supprimés.
La recherche de l’intitulé et du composant dans `src/` ne trouve plus de résultat.
Les autres pages et le composant Photo partagé ne rendaient pas ce badge IA.
Les crédits visuels accessibles dans le footer conservent l’explication des
illustrations IA, les références Unsplash et les mentions de licence.
Les textes alternatifs continuent d’indiquer la nature illustrative des visuels.

Le hero affiche explicitement le nom de la Fondation et conserve son titre exact
sur trois lignes desktop. L’espace supérieur est réduit, les séparations de la
mosaïque affinées et la composition communautaire conservée. La mission officielle
précède désormais les engagements. Les trois piliers gardent leur présentation
horizontale sur desktop et empilée sur mobile. La transition vers l’activité réelle
est resserrée ; cette activité dispose d’une présentation mise en avant avec son
emplacement photographique explicite. L’appel final propose une conversation,
sans répéter une nouvelle formule générique de mission.

Le modèle Picture possède un champ optionnel `provenance` pour distinguer
illustration IA, stock, photographie d’activité, emplacement et import local.
Les cinq visuels fournis sont marqués `ai-illustration` ; l’image de l’activité
scolaire est marquée `placeholder`. Ce champ optionnel ne modifie ni IndexedDB,
ni ses contenus existants, ni l’interface du dépôt asynchrone.

Fichiers modifiés :
- `src/components/HomeRedesign.tsx`
- `src/pages/HomePage.tsx`
- `src/homepage.css`
- `src/data/models.ts`, `src/data/homepage.ts`, `src/data/foundation.ts`
- `scripts/browser-check.cjs`, `scripts/quality-check.cjs`
- `HOMEPAGE-REDESIGN.md`, `README.md`

Vérifications : lint, TypeScript dans le build Vite, régression de l’accueil aux
cinq largeurs, présence des crédits IA/Unsplash, absence des badges dans 17 vues
aux cinq largeurs, axe A/AA sans violation détectée, galerie et lightbox, CRUD
administration et actualisation publique, imports, erreurs, quota et reset.
Les tests utilisent des contextes isolés et n’effacent pas les données du client.
Les captures sont dans `artifacts/redesign/` et `artifacts/quality/`.

Limites : photographies scolaires et autorisations toujours absentes ; coordonnées
officielles et actualités réelles à fournir. L’administration reste locale au
navigateur. Aucune configuration de déploiement, aucun backend et aucun logo
modifiés. Aucun déploiement effectué ; la version Render n’a pas été vérifiée.
