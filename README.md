# Guide de choix baie — Xeilom

Application React intégrable en iframe sur [xeilom.fr](https://www.xeilom.fr/), avec ajout au panier Oxatis en un clic.

## Démarrage

```bash
npm install
npm run build:catalog   # génère src/guides/baie/catalog.json depuis le CSV Oxatis
npm run dev
```

- Guide : [http://localhost:5173/baie](http://localhost:5173/baie)
- Test iframe : [http://localhost:5173/host/](http://localhost:5173/host/)

## Déploiement Vercel

Connecter le repo GitHub — la commande `npm run build` suffit (`catalog.json` est versionné).

Pour regénérer le catalogue après un export Oxatis (en local) :

```bash
# placer le CSV dans data/import/ puis :
npm run build:catalog
git add src/guides/baie/catalog.json && git commit -m "Mise à jour catalogue baie"
```

## Intégration Oxatis

1. Héberger l'app (Vercel, Netlify, sous-domaine Xeilom…)
2. Créer une page Oxatis avec une iframe :

```html
<iframe
  src="https://VOTRE-DOMAINE/baie?embed=1"
  title="Guide de choix baie"
  style="width:100%;min-height:720px;border:0;"
  loading="lazy"
></iframe>
```

3. Coller le contenu de [`oxatis-bridge.js`](oxatis-bridge.js) dans **Design → Code personnalisé → Fin de page**
4. Adapter `ALLOWED_ORIGINS` dans le bridge avec votre domaine de déploiement

Voir [`docs/DEMARCHE.md`](docs/DEMARCHE.md) pour le détail du protocole `postMessage`.

## Catalogue produits

Placer l'export Oxatis CSV dans `data/import/Oxatis-All-xeilom-26993.csv`, puis :

```bash
npm run build:catalog
```

Le script filtre les **baies serveurs**, **baies de brassage** et **gamme étanche IP55** (baies + coffrets outdoor).

## Ajouter un nouveau guide

1. Copier `src/guides/baie/` vers `src/guides/<nom>/`
2. Adapter `config.js` (questions + `resolveProduct`)
3. Créer un script catalogue dédié ou étendre le filtre CSV
4. Ajouter une route dans `src/App.jsx`

## Logo

Placer `logo.webp` dans `public/brand/` (voir `xeilom-kit/utils/brandLogo.js`).

## Structure

```
src/core/           Moteur de guide réutilisable
src/guides/baie/    Guide baie (config + catalog.json)
xeilom-kit/         Design system + hooks embed/panier
oxatis-bridge.js    Script pont à coller sur xeilom.fr
host/               Page de test iframe locale
```
