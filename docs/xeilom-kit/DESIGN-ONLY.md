# Design seul — import minimal

Pour réutiliser **uniquement** le look Xeilom (sans tarifs, embed, scripts Oxatis).

---

## Fichiers à copier

```
xeilom-kit/
├── styles/              # tout le dossier
├── components/          # Header, ToastContainer, ConfirmModal
├── utils/
│   ├── brandLogo.js     # URL logo
│   └── pdfColors.js     # optionnel — couleurs PDF alignées sur --brand
└── public/brand/        # placer logo.webp dans public/brand/ du projet cible
```

**Doc de référence :** [`../docs/design-system-configurateurs-xeilom.md`](../docs/design-system-configurateurs-xeilom.md)  
(ou `kit-nouveau-configurateur/docs/design-system-configurateurs-xeilom.md` si vous avez le pack complet)

---

## Installation (3 étapes)

### 1. Copier le dossier

```bash
cp -R xeilom-kit/styles /chemin/projet/xeilom-kit/styles
cp -R xeilom-kit/components /chemin/projet/xeilom-kit/components
cp xeilom-kit/utils/brandLogo.js /chemin/projet/xeilom-kit/utils/
# Logo
cp public/brand/logo.webp /chemin/projet/public/brand/
```

Ou copier tout `xeilom-kit/` — seuls les fichiers ci-dessus sont nécessaires pour l'UI.

### 2. Dépendance npm

```bash
npm install lucide-react
```

(`react` / `react-dom` déjà requis par votre app)

### 3. Brancher les styles

```jsx
// src/main.jsx
import "../xeilom-kit/styles/kit.css";
```

```jsx
// src/App.jsx
<div className="app">
  <Header eyebrow="Ma gamme" title="Mon configurateur" />
  {/* vos composants avec les classes du design system */}
</div>
```

---

## Classes CSS principales

| Classe | Usage |
|--------|-------|
| `.app` | Conteneur racine (obligatoire) |
| `.app-main` | Zone centrale max-width 1200px |
| `.layout` | Grille wizard + sidebar |
| `.panel` | Carte section |
| `.btn.primary` / `.btn.ghost` | Boutons |
| `.link-btn` | Lien action |
| `.option-tile` | Tuile sélectionnable |
| `.gamme-card` | Carte produit |
| `.recap-panel` | Panneau récap sidebar |
| `.form-grid` | Formulaire 2 colonnes |
| `.toast-container` | Notifications |

Variables dans `styles/base.css` : `--brand`, `--surface`, `--radius`, etc.

---

## Composants React fournis

```jsx
import { Header, ToastContainer, ConfirmModal } from "./xeilom-kit/components";
import { useToasts } from "./xeilom-kit/hooks/useToasts.js";

const { toasts, addToast, removeToast } = useToasts();
```

Le hook `useToasts` est léger et sans dépendance tarif/embed.

---

## Ce qu'on n'importe pas (design seul)

| Exclu | Raison |
|-------|--------|
| `utils/pricing*.js` | Tarification |
| `hooks/useEmbedContext.js` | Oxatis iframe |
| `data/pricingMatrix.json` | Prix |
| `scripts/` | Import CSV |

---

## Mode embed (optionnel)

Si l'app tourne en iframe sans header site parent :

```jsx
<div className="app app--embed">
```

Ajoute la classe `app--embed` — voir `styles/embed.css`.

---

*Synchronisé depuis le configurateur coffrets — juin 2026*
