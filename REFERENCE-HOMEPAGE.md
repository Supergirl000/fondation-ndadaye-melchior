# Accueil photographique — réalisation du brief de référence

Cette version remplace la composition en mosaïque par le hero demandé dans le
brief joint le 28 octobre. L’application, les routes, l’administration et les
interfaces du dépôt de contenu sont conservées.

## Sections réalisées

- Navigation ivoire, logo officiel intact, nom et sous-titre de mission ; Accueil, À propos, Nos actions, Actualités, Galerie, Contact et bouton orange Nous contacter.
- Hero pleine largeur : `hero-communaute.webp` en fond CSS `cover`, position responsive et préchargement prioritaire. Voile sombre plus marqué à gauche. Titre exact « La dignité de tous. Un avenir à construire ensemble. », avec « Un avenir » en orange, mission officielle et deux boutons fonctionnels.
- Hero desktop d’environ 70 % de la hauteur du viewport, borné entre 540 et 740 px pour rester lisible. Adaptation naturelle sur téléphone.
- Panneau flottant en trois colonnes avec numéros 01/02/03, icônes justice/participation/développement durable, séparateurs fins et ombre discrète ; empilement mobile.
- Introduction éditoriale à deux colonnes : `dialogue-citoyen.webp`, titre et texte demandés, trait orange et lien À propos.
- Bandeau mission vert profond : introduction à gauche et mission provenant de la configuration à droite, avec accent typographique chaud.
- Actions confirmées, actualités dynamiques, lien galerie, contact et footer conservés et harmonisés. L’activité scolaire garde son emplacement explicite en attente de photographies autorisées.

## Fichiers modifiés

- `src/components/HomeRedesign.tsx`
- `src/data/homepage.ts`
- `src/homepage.css`
- `src/pages/HomePage.tsx`
- `src/components/Header.tsx`
- `src/data/public.ts`
- `scripts/browser-check.cjs`
- `scripts/quality-check.cjs`
- `README.md`
- `REFERENCE-HOMEPAGE.md`

Aucun fichier de logo, de stockage, d’administration ou de déploiement modifié.
Aucune dépendance ajoutée. Le chargement du hero réutilise le WebP fourni, environ
88 Ko ; les autres photographies restent différées sous la ligne de flottaison.
Les couleurs orange des petits boutons sont légèrement assombries pour assurer
le contraste avec les libellés blancs. Les mentions IA restent dans les crédits,
sans badge superposé ; les données de provenance et textes alternatifs conservés.

## Vérifications

- Lint ESLint et build TypeScript/Vite de production.
- Accueil aux largeurs 320, 375, 768, 1024 et 1440 px : titre, trois lignes desktop, sept sections, fond pleine largeur en `cover`, panneau en chevauchement, trois piliers, image de dialogue, chargement des images et absence de débordement.
- Navigation mobile, fermeture Échap, focus, destinations de l’accueil, ancre mission, crédits IA/Unsplash et remplacement d’une image indisponible.
- Audit des 17 vues à cinq largeurs : rafraîchissement direct, headings et images. Axe A/AA à 375/1440 px et états de dialogue/formulaire, aucune violation détectée ; aucune erreur console dans cet audit. Les contrôles automatiques ne remplacent pas une revue humaine exhaustive.
- Régression publique : pages et détails, filtres, recherche, états vides, galerie, navigation clavier de la lightbox, contact et 404.
- Administration : création/modification/suppression d’articles et images, imports JPEG/PNG/WebP, validation, compression, mise à jour des pages publiques, persistance, erreurs de quota et reset.

Tests Chrome/Playwright dans des contextes isolés. Captures disponibles dans
`artifacts/redesign/` et `artifacts/quality/` ; aucun contenu du navigateur de
l’utilisateur n’est effacé.

## Limites

La capture annoncée n’était pas présente dans le dossier de pièces jointes ;
la réalisation suit le brief textuel, sans prétendre à une comparaison exacte
avec une image indisponible. L’image panoramique fournie mesure 1536 × 365 px :
son affichage en `cover` implique un recadrage, particulièrement sur téléphone,
et peut paraître moins net sur un très grand écran à forte densité.

Les photos scolaires et leurs autorisations, les coordonnées officielles et les
publications réelles restent à fournir. Aucun fait, date, résultat, montant ou
bénéficiaire inventé. Les données de l’administration restent locales au navigateur.
Aucun backend, base de données, hébergement ou paramètre Render configuré ou modifié.
Aucun déploiement effectué et aucune vérification de la version distante annoncée.
