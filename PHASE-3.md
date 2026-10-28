# Phase 3 — Administration de démonstration

Route : `/demo-admin`.
Le site public et son système visuel sont conservés. Aucune dépendance ajoutée,
aucun backend, Laravel, MySQL, compte utilisateur ou déploiement configuré.

## Fonctionnalités livrées

- Tableau de bord responsive avec navigation latérale, vue d’ensemble, liens
  vers le site public et compteurs correspondant aux contenus locaux.
- Articles : liste, création, édition, suppression confirmée, titre, description,
  rubrique, date fictive, texte, illustration et choix de mise à la une.
- Validation des champs avec messages associés, état de préparation d’image,
  aperçu avant enregistrement et confirmations de modification locale.
- Photothèque : import multiple, aperçu, titre, description accessible,
  modification des descriptions et suppression confirmée.
- Réglages : activation des conseils, taille des imports et réinitialisation
  confirmée des contenus et fichiers locaux.
- Le journal public, les articles détaillés, la galerie et les aperçus de
  l’accueil lisent les modifications du même navigateur.

Le bandeau demandé est affiché dans toutes les vues :

« Administration de démonstration — les modifications sont enregistrées uniquement dans ce navigateur. »

Les limites sont explicites : aucune publication globale, aucune synchronisation
entre appareils ou visiteurs, aucun mot de passe ni protection de sécurité.
Les brouillons non enregistrés sont temporaires. Aucune donnée sensible ne doit
être placée dans ce prototype.

## Architecture

- `src/services/demo-db.ts` : ouverture d’IndexedDB, magasins `content` et
  `assets`, initialisation des exemples, transactions atomiques, quota et nettoyage.
- `src/services/demo-admin.ts` : interface asynchrone d’administration et opérations
  de contenu. Les mutations et les nouveaux fichiers sont enregistrés ensemble.
- `src/services/content.ts` : dépôt public branché sur le contenu local, avec
  retour explicite aux exemples si IndexedDB est indisponible.
- `src/services/image-processing.ts` : validation du type et de la signature,
  décodage, limites, redimensionnement et réencodage dans le navigateur.
- `src/services/demo-events.ts` : notification locale des changements et indication
  d’indisponibilité du stockage.
- `src/pages/AdminPage.tsx` : composition du tableau de bord, chargée séparément
  du site public via une route différée.
- `src/components/admin/NewsEditor.tsx`, `GalleryManager.tsx`, `AdminUI.tsx` :
  éditeurs, aperçus, confirmations et retours de validation.
- `src/admin.css` : style administratif dérivé de l’identité existante.

Les modèles existants sont conservés ; `Picture.assetId` permet de référencer
une image locale sans persister son URL temporaire. Le composant `Photo` résout
le Blob et révoque l’URL lors de son remplacement ou de son démontage.

Les onglets de la même origine (même adresse et même port) sont actualisés par
BroadcastChannel et au retour au premier plan. Les chargeurs publics relisent
IndexedDB ; aucune notification n’est envoyée à un serveur.

Le dépôt peut être remplacé par une API REST Laravel : les pages ne manipulent
pas les magasins IndexedDB directement. Les futurs fichiers distants pourront
utiliser `Picture.src` sans `assetId`. L’authentification et les autorisations
devront être réalisées et vérifiées côté serveur dans une phase ultérieure.

## Gestion des images

- JPEG, PNG et WebP uniquement ; SVG, GIF, fichiers illisibles ou dont la
  signature ne correspond pas au type annoncé sont refusés.
- 5 Mo maximum par fichier, 24 mégapixels maximum, 6 fichiers par sélection.
- Redimensionnement à 1 600 px sur le plus grand côté, sans agrandissement.
- Réencodage WebP quand disponible ; limite de 2 Mo après préparation.
- Limite de démonstration de 30 Mo pour les fichiers conservés.
- Blobs stockés dans IndexedDB ; aucune image dans localStorage.
- Les URL d’aperçu sont révoquées. Les fichiers inutilisés sont supprimés,
  tandis qu’une illustration encore référencée par un article reste conservée.
- En cas de quota dépassé ou d’erreur de transaction, les anciennes données sont
  conservées et les champs ou la sélection restent disponibles pour réessayer.

## Vérifications

Les tests utilisent des contextes Chrome isolés, sans modifier les données du
navigateur de l’utilisateur. Playwright est fourni par l’environnement de travail,
sans dépendance supplémentaire dans l’application.

- TypeScript strict : réussi.
- `npm run build` : réussi (TypeScript puis Vite 8.3.5).
- Administration : vue d’ensemble contrôlée à 320, 390, 768 et 1440 px ; sections
  actualités, photothèque et réglages contrôlées à 320, 768 et 1440 px.
- Création, aperçu, modification, annulation de suppression et suppression
  confirmée d’un article ; persistance après rechargement ; reflet dans l’onglet
  public et sur l’accueil.
- Imports JPEG, PNG et WebP ; refus SVG, fichier trop volumineux et fichier
  corrompu ; contrôle du redimensionnement à 1 600 px.
- Modification de description, persistance et retrait d’une image, avec mise
  à jour de la galerie publique.
- Erreur de quota simulée : écriture annulée et contenu précédent conservé.
- Nettoyage des URL temporaires et absence de fichiers dans localStorage.
- Réinitialisation : retour aux six illustrations d’origine et suppression des
  Blobs importés ; les anciens articles locaux ne sont plus accessibles.
- IndexedDB indisponible : erreur lisible dans l’administration et affichage des
  exemples d’origine avec avertissement sur le site public.
- `scripts/public-check.cjs` : 12 routes sur quatre largeurs, liens internes,
  filtres, articles, lightbox, contact et 404 validés sur le build de production.
- `scripts/browser-check.cjs` : non-régression de l’accueil sur cinq largeurs,
  dialogues, images de remplacement et accès aux détails validés.
- Les trois scripts se sont terminés avec le code 0 ; aucune erreur JavaScript
  n’a été détectée dans les parcours vérifiés.

Build : bundle public 383,47 Ko (119,44 Ko gzip), module administratif chargé à
la demande 33,53 Ko (10,37 Ko gzip), CSS administratif 21,44 Ko (4,70 Ko gzip).
Les captures sont disponibles dans `artifacts/admin/` et sont ignorées par Git.

## Limites

Le stockage peut être effacé par le navigateur ; la navigation privée peut ne
pas le conserver. Changer d’origine, d’appareil ou de profil de navigateur donne
accès à un stockage différent. Il n’y a ni sauvegarde distante ni publication
partagée. Deux éditions simultanées d’un même article appliquent la dernière
modification enregistrée ; il n’y a pas de résolution collaborative des conflits.

La gestion administrative des projets, optionnelle, n’a pas été ajoutée. Les
projets publics restent disponibles. Safari/iOS et les lecteurs d’écran n’ont
pas fait l’objet d’un audit exhaustif. Aucun déploiement n’est effectué.
