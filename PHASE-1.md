# Livraison — Phase 1

La page d’accueil française et le système visuel partagé sont implémentés.
Le projet reste un prototype local, sans publication ni passage à la phase suivante.

## Fichiers créés

### Configuration

- `.gitignore`
- `package.json` et `package-lock.json`
- `tsconfig.json`
- `vite.config.ts`
- `index.html`

### Application et contenus

- `src/main.tsx` — démarrage React, route d’accueil et récupération des erreurs.
- `src/styles.css` — tokens visuels, compositions, responsive et mouvement réduit.
- `src/config/organization.ts` — identité provisoire centralisée.
- `src/data/home.ts` — interfaces TypeScript et contenus de démonstration.
- `src/data/site.ts` — textes partagés et notices du prototype.
- `src/services/content.ts` — contrat et adaptateur de contenu remplaçable par Laravel.
- `src/pages/HomePage.tsx` — composition et gestion du dialogue.
- `src/components/Header.tsx` — marque et navigation responsive.
- `src/components/HomeSections.tsx` — sections de la page.
- `src/components/Footer.tsx` — pied de page et accès aux notices.
- `src/components/DetailDialog.tsx` — fenêtre modale native, Échap et restitution du focus.
- `src/components/ui.tsx` — liens d’action, photographies, surtitres et apparition au défilement.

### Ressources et documentation

- `public/logo.svg` — logo végétal provisoire original.
- `public/images/garden.jpg`, `forest.jpg`, `growing.jpg` — illustrations locales.
- `public/images/fallback.svg` — illustration originale de remplacement.
- `public/images/CREDITS.md` — sources et licence des photographies.
- `scripts/browser-check.cjs` — vérification navigateur facultative.
- `README.md` — démarrage, structure, accessibilité et raccordement futur.
- `PHASE-1.md` — présent compte rendu.

Le dossier initial était vide, hormis Git. Aucun fichier existant de l’application
n’a été écrasé. `dist/` et `artifacts/` sont des sorties générées ignorées par Git.

## Composants réalisés

Navigation fixe avec menu mobile, hero asymétrique et deux appels à l’action,
bandeau de convictions, introduction de mission, trois initiatives d’exemple,
récit éditorial, trois aperçus d’articles, galerie, invitation à participer et
pied de page. Les détails s’affichent dans une fenêtre accessible, sans créer
de pages internes supplémentaires.

Les visuels sont identifiés comme illustrations. Les contenus provisoires sont
signalés dans le bandeau général et au niveau des projets/articles. Aucun chiffre
d’impact, témoignage, événement réel ou contact fictif n’est présenté.

## Commandes et résultats

Le raccourci npm présent sur cette machine pointe vers un fichier manquant.
Les commandes npm ont donc été exécutées avec Node et le CLI npm installés :

```powershell
& 'C:\Program Files\nodejs\node.exe' 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js' install --prefer-offline --maxsockets=2 --fetch-retries=2 --fetch-timeout=60000 --no-audit --no-fund
```

Résultat : installation réussie et lockfile généré après plusieurs interruptions
réseau. Les premières tentatives avaient échoué avec EACCES puis ECONNRESET.

`npm run check` a également été exécuté séparément : **réussi**.

```sh
npm run build
```

Exécuté via le même CLI npm : **réussi**, vérification TypeScript stricte puis
build Vite 8.3.5. Sorties : HTML 0,81 Ko, CSS 27,36 Ko et JavaScript 333,88 Ko
(105,65 Ko compressés pour JavaScript).

```sh
node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5174 --strictPort
node scripts/browser-check.cjs
```

Contrôle navigateur exécuté avec Playwright fourni par l’environnement et Chrome
installé via `PLAYWRIGHT_PATH`, `CHROMIUM_PATH` et `PREVIEW_URL`. Le Chromium
fourni ne démarrait pas ; Chrome a permis de terminer les contrôles.

Résultats : **tous réussis**.

- Largeurs 1440, 1024, 768, 390 et 320 pixels, sans débordement horizontal.
- Chargement des photographies locales et structure des titres/sections.
- Menu mobile, navigation par ancres et fermeture par Échap.
- Dialogue, navigation au clavier et retour du focus au déclencheur.
- Ouverture et fermeture des aperçus du journal et de la galerie.
- Explication du contact de démonstration sans transmission de données.
- Remplacement d’une image en échec par le SVG local.
- Route inconnue et retour vers l’accueil.
- Aucune erreur JavaScript détectée.

Captures générées dans `artifacts/home-{largeur}.png` et revues sur ordinateur
et mobile. Les contrôles utilisent la préférence de réduction des mouvements.
Prettier a formaté les sources sans ajout de dépendance au projet ; ses messages
sur les deux SVG indiquaient seulement l’absence de parseur automatiquement choisi.

## Limites et Phase 2

L’identité, les contenus et les visuels définitifs sont attendus. Le contact est
informatif. Les mentions légales sont une notice de prototype. Aucun audit
exhaustif d’accessibilité, test de lecteur d’écran ou test Safari/iOS n’a été fait.

La structure de contenu typée, l’adaptateur, les composants et la configuration
centrale sont prêts pour la prochaine phase. Laravel, MySQL, les pages internes,
le traitement du contact, l’administration et le déploiement Namecheap restent
à réaliser après validation. Les règles de réécriture BrowserRouter et le retrait
du noindex avant lancement officiel sont documentés dans le README.
