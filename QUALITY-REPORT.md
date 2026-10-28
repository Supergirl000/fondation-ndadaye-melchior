# Revue qualité — Démonstration client

L’application et sa direction visuelle sont conservées. Aucun backend,
authentification de production ou déploiement n’a été ajouté.

## Problèmes trouvés

- Contrastes insuffisants reproduits par axe : texte du sceau, bouton terracotta,
  numéros du journal, repères des valeurs et certains libellés administratifs.
- Contrôles secondaires et boutons de fermeture trop petits pour un usage tactile
  confortable ; indicateurs de focus incomplets sur les champs publics.
- Trois photographies JPG, environ 1,29 Mo au total, servies sans variantes
  responsive ni dimensions intrinsèques dans le modèle.
- Pages publiques secondaires intégrées au téléchargement JavaScript initial.
- Aucune commande de lint ; documentation incomplète sur le design et le déploiement.
- Les anciennes adresses d’images déjà conservées dans IndexedDB devaient rester
  compatibles après remplacement des JPG par les WebP.

## Corrections

- Teintes ajustées dans la palette existante, légendes sur fond lisible et
  traitement photographique cohérent. Pas de nouvelle identité ni refonte.
- Focus visible renforcé, destinations du lien d’évitement focusables, noms
  accessibles explicites et champs requis identifiés pour les technologies d’aide.
- Cibles de 44 px pour les filtres, liens d’action, fermetures et commandes de
  lightbox sur mobile ; pied de page plus lisible, hauteurs d’action cohérentes.
- Navigation Tab/Maj+Tab des dialogues étendue aux champs et contrôles visibles.
- Photographies WebP en 480, 960 et 1 400 px, `srcset`, `sizes`, dimensions et
  chargement différé. Les originaux restent hors de `public/`.
- Compatibilité des anciens contenus locaux gérée à l’affichage, sans effacer
  les modifications de l’utilisateur.
- Routes publiques secondaires et administration chargées à la demande.
- ESLint 10, TypeScript et React Hooks configurés ; axe-core réservé aux outils
  de développement. Aucun outil d’audit n’est envoyé aux visiteurs.
- README complété : installation, développement, architecture, identité, contenus,
  limites locales, réécriture des routes et intégration Laravel/MySQL.

## Contrôles réellement exécutés

- `npm run lint` : réussi, zéro avertissement autorisé.
- `npm run check` : réussi, TypeScript strict.
- `npm run build` : réussi, Vite 8.3.5.
- `scripts/quality-check.cjs` sur le build de production : 16 vues à 320, 375,
  768, 1024 et 1440 px, soit 80 vérifications de mise en page et accès direct.
  Un titre principal par vue, aucune image cassée, aucun débordement horizontal.
- Axe sur les pages à 375 et 1440 px, puis sur la lightbox, les erreurs du
  formulaire et la confirmation de suppression : aucune violation automatique
  A/AA détectée dans le périmètre exécuté.
- Lien d’évitement et focus, préférence de mouvement réduit, apparition au
  défilement et dimensions des commandes tactiles vérifiés dans Chrome.
- Compatibilité avec une ancienne image JPG référencée par IndexedDB vérifiée.
- `scripts/admin-check.cjs` : création, aperçu, édition, suppression confirmée,
  annulation, imports JPEG/PNG/WebP, refus de fichiers invalides et volumineux,
  persistance, mises à jour publiques, quota simulé et remise à zéro réussis.
- `scripts/public-check.cjs` : routes, 14 destinations internes, ancres,
  catégories, recherches, états vides, dates, sommaires, lightbox et 404 réussis.
- `scripts/browser-check.cjs` : non-régression de l’accueil, navigation mobile,
  dialogues, clavier et image de remplacement réussis.
- Aucun défaut console ni erreur JavaScript sur les pages de l’audit qualité.
  Les tests d’échec d’image provoquent intentionnellement un refus de ressource.

Les scripts utilisent Chrome avec Playwright dans des contextes isolés ; ils ne
modifient pas les contenus du navigateur de l’utilisateur. Captures et résultats
machine : `artifacts/quality/`, `artifacts/admin/` et `artifacts/public/`.

## Mesures de livraison

Les trois plus grandes variantes WebP totalisent environ 665 Ko, contre 1 286 Ko
pour les anciens JPG, soit environ 48 % de moins. À 375 px et DPR 1, le navigateur
de test choisit `garden-480.webp` pour le hero : 29 458 octets, contre 299 719
octets pour l’ancien fichier, soit environ 90 % de moins pour cette ressource.
Les autres variantes servent aux écrans et densités plus élevés.

Le JavaScript initial passe de 383,47 à 362,04 Ko (114,96 Ko gzip). Les modules
secondaires sont téléchargés à la demande. Ces chiffres décrivent les fichiers ;
aucun score Lighthouse, temps 3G réel ni Core Web Vitals en production n’est avancé.

## Limites restantes

L’audit automatisé n’est pas une certification de conformité. Axe signale encore
des vérifications manuelles, notamment sur les contrastes dépendant des images.
Les légendes ont reçu un fond contrasté ; les compositions ont été revues en
captures. Aucun audit exhaustif NVDA/VoiceOver, Safari/iOS, Firefox ou appareil
physique n’a été réalisé. Ces essais restent à prévoir avant un lancement officiel.

L’identité et les contenus officiels restent à fournir. L’administration est une
démo ouverte et locale, sans partage entre appareils, sauvegarde distante ni
protection d’accès. Les conditions d’hébergement et les en-têtes HTTP n’ont pas
été validés sur Namecheap ; la réécriture proposée dans le README est à y tester.

## État de préparation

Le build est prêt pour une présentation client et pour un hébergement statique
de démonstration avec HTTPS et repli des routes correctement configuré. Il ne
constitue pas un système administratif de production. La mise en ligne officielle
reste conditionnée aux contenus autorisés, aux mentions légales, à l’API et aux
autorisations côté serveur, ainsi qu’aux validations d’hébergement et d’accessibilité
complémentaires. Aucun déploiement n’a été effectué.
