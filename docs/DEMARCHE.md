# Démarche : guide de choix en iframe → ajout au panier Xeilom

Ce document explique **pourquoi** et **comment** connecter une application externe (configurateur, guide de choix, etc.) intégrée en iframe sur [xeilom.fr](https://www.xeilom.fr/) au panier Oxatis.

---

## 1. Contexte et objectif

Xeilom tourne sur **Oxatis**, une plateforme e-commerce SaaS. Oxatis offre un back-office pour gérer le catalogue, mais reste limité pour créer des **expériences sur mesure** : configurateurs multi-étapes, logique métier complexe, interfaces fluides, etc.

**Objectif :** développer ces expériences en dehors d'Oxatis (HTML/JS/React, hébergement libre), les afficher sur le site via une **iframe**, et à la fin du parcours **ajouter le bon produit au panier** sans friction.

---

## 2. Le blocage technique

Une iframe et la page qui l'entoure sont souvent sur **deux domaines différents** :

| Élément            | Domaine typique                                            |
| ------------------ | ---------------------------------------------------------- |
| Site marchand      | `https://www.xeilom.fr`                                    |
| App guide de choix | `https://guides.xeilom.fr` ou `https://mon-app.vercel.app` |

Le navigateur applique la **politique same-origin** : le JavaScript de l'iframe **ne peut pas** appeler directement les fonctions de la page parente, par exemple `AddToCart()` d'Oxatis.

```
❌ Impossible depuis l'iframe :
   window.parent.AddToCart(42291127)
```

Il faut donc un **canal de communication** entre les deux mondes.

---

## 3. Ce qu'Oxatis expose côté panier

En analysant une fiche produit sur xeilom.fr, on observe le comportement natif :

### Bouton « Ajouter au panier »

```html
<a href="javascript:AddToCart(42291127);" id="btnaddtocart"
  >Ajouter au panier</a
>
```

### Fonction interne

```javascript
function AddToCart(nPdtOptID) {
  PostFormData(true, nPdtOptID, "PBShoppingCart.asp");
}
```

Oxatis tente d'abord un ajout **AJAX** (panier dynamique, popup), sinon soumet un formulaire vers le panier.

### Endpoint AJAX

```
GET PBShoppingCart.asp?ajaxmode=1&cartRelatedProducts=1&ItmID=42291127
```

### URL de secours (sans JavaScript custom)

```
https://www.xeilom.fr/PBShoppingCart.asp?ItmID=42291127
```

Cette URL ajoute le produit et affiche le panier. Elle fonctionne en navigation directe.

### Retrouver l'ID produit Oxatis

Dans l'URL d'une fiche produit, l'ID est le nombre après `c2x` :

```
https://www.xeilom.fr/cable-reseau-...-c2x42291127
                                              └─────┘
                                           productId = 42291127
```

---

## 4. La solution : pont `postMessage`

L'API [`window.postMessage`](https://developer.mozilla.org/fr/docs/Web/API/Window/postMessage) permet à deux fenêtres de **différentes origines** d'échanger des messages de façon sécurisée.

### Schéma global

```
┌──────────────────────────────────────────────────────────┐
│  PAGE XEILOM.FR (parent — domaine Oxatis)                │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  IFRAME — votre guide de choix (autre domaine)     │  │
│  │                                                    │  │
│  │  1. L'utilisateur répond aux questions             │  │
│  │  2. L'app détermine le produit (productId)         │  │
│  │  3. postMessage → parent                           │  │
│  └────────────────────────────────────────────────────┘  │
│                          │                               │
│                          ▼                               │
│  oxatis-bridge.js (écouteur sur la page parent)          │
│  4. Vérifie l'origine du message                         │
│  5. Appelle AddToCart(productId)                         │
│  6. Répond à l'iframe (succès / échec)                   │
└──────────────────────────────────────────────────────────┘
```

### Message envoyé par l'iframe

```json
{
  "type": "XEILOM_ADD_TO_CART",
  "productId": 42291127,
  "quantity": 1
}
```

### Réponse du parent (optionnelle)

```json
{
  "type": "XEILOM_ADD_TO_CART_RESULT",
  "success": true,
  "productId": 42291127,
  "method": "AddToCart"
}
```

### Côté iframe (extrait)

```javascript
window.parent.postMessage(
  {
    type: "XEILOM_ADD_TO_CART",
    productId: 42291127,
    quantity: 1,
  },
  "https://www.xeilom.fr", // origine cible — jamais "*" en production
);
```

### Côté parent — script pont (`oxatis-bridge.js`)

Le script écoute les messages, **filtre par origine**, puis délègue à Oxatis :

```javascript
window.addEventListener("message", function (event) {
  if (!ALLOWED_ORIGINS.includes(event.origin)) return;
  if (event.data?.type !== "XEILOM_ADD_TO_CART") return;

  var id = event.data.productId;
  if (typeof AddToCart === "function") {
    AddToCart(id); // fiches produit PBSCProduct
  } else if (typeof OxAddToCart === "function") {
    OxAddToCart(id, "ItmID=" + id); // pages contenu PBCPPlayer
  }
});
```

Sur les **pages contenu** (`PBCPPlayer.asp`), `AddToCart` n'existe pas : le pont doit appeler `OxAddToCart(id, "ItmID=" + id)` pour ouvrir le modal AJAX au lieu de rediriger vers le panier.

Le fichier complet se trouve à la racine du projet : `oxatis-bridge.js`.

---

## 5. Étapes de mise en œuvre

### Étape 1 — Développer l'app guide de choix

- Créer l'interface (questions, étapes, résultat).
- À la fin du parcours, déterminer le **productId** Oxatis correspondant.
- Envoyer le `postMessage` au clic sur « Ajouter au panier ».

Dans ce projet, l'app se trouve dans le dossier `app/`.

### Étape 2 — Héberger l'app

Déployer sur un domaine stable :

- Vercel, Netlify, serveur interne, sous-domaine Xeilom (`guides.xeilom.fr`), etc.
- L'URL doit être en **HTTPS** en production.

### Étape 3 — Créer la page sur Oxatis

Dans le back-office Oxatis :

1. Créer une page de contenu (ex. « Guide câble Cat 6A »).
2. Ajouter un bloc HTML avec l'iframe :

```html
<iframe
  src="https://VOTRE-DOMAINE/app/"
  title="Guide de choix"
  style="width:100%;min-height:720px;border:0;"
  loading="lazy"
></iframe>
```

### Étape 4 — Installer le script pont

Coller le contenu de `oxatis-bridge.js` dans :

**Design → Code personnalisé → Fin de page (JavaScript)**

Ou dans un bloc HTML `<script>` sur la page du guide uniquement (recommandé si vous avez plusieurs guides).

**À adapter impérativement :**

```javascript
var ALLOWED_ORIGINS = ["https://votre-domaine-reel.vercel.app"];
```

Seules les origines listées peuvent déclencher un ajout au panier.

### Étape 5 — Mapper questions → produits

Maintenir une table de correspondance entre les réponses du guide et les IDs Oxatis :

```javascript
var PRODUCTS = {
  "cat6a-ftp-500m": { productId: 42291127, name: "...", price: "400,00 €" },
  "cat6a-ftp-305m": { productId: 41986597, name: "...", price: "239,64 €" },
};
```

Chaque nouvelle référence catalogue = une entrée dans cette table.

### Étape 6 — Tester

| Test       | Comment                                                                        |
| ---------- | ------------------------------------------------------------------------------ |
| En local   | `npm run dev` puis ouvrir `http://localhost:3000/host/`                        |
| Sur Oxatis | Parcourir le guide, cliquer « Ajouter au panier », vérifier le compteur panier |
| Fallback   | Désactiver temporairement le script pont → la redirection doit fonctionner     |

---

## 6. Plan B — sans script sur Oxatis

Si l'injection JavaScript n'est pas possible (droits limités, validation longue), l'iframe peut **rediriger toute la fenêtre** vers l'URL panier Oxatis :

```javascript
window.top.location.href =
  "https://www.xeilom.fr/PBShoppingCart.asp?ItmID=" + productId;
```

| Avantage                        | Inconvénient                  |
| ------------------------------- | ----------------------------- |
| Aucun code à ajouter sur Oxatis | L'utilisateur quitte le guide |
| Fonctionne immédiatement        | Pas de popup panier dynamique |
| Compatible tous navigateurs     | Expérience moins fluide       |

Ce fallback est déjà intégré dans `app/app.js` si le pont ne répond pas.

---

## 7. Sécurité

| Règle                                   | Pourquoi                                                        |
| --------------------------------------- | --------------------------------------------------------------- |
| Vérifier `event.origin` côté parent     | Empêcher un site tiers d'ajouter des produits au panier         |
| Ne pas utiliser `targetOrigin: "*"`     | N'importe quelle page pourrait recevoir ou envoyer des messages |
| Valider `productId` (entier positif)    | Éviter les injections ou valeurs invalides                      |
| Limiter les origines autorisées         | Whitelist stricte des domaines de vos apps                      |
| Ne pas exposer de secrets dans l'iframe | L'ID produit est public (visible dans l'URL produit)            |

---

## 8. Cas particuliers à anticiper

### Produits avec options (taille, couleur, déclinaisons)

Oxatis gère des paramètres `XMLOpt1`, `XMLOpt2` en plus de `ItmID`. Si votre guide cible des produits à options, il faudra étendre le protocole :

```json
{
  "type": "XEILOM_ADD_TO_CART",
  "productId": 42291127,
  "quantity": 1,
  "options": { "XMLOpt1": 0, "XMLOpt2": 1 }
}
```

Et adapter le script pont pour transmettre ces options à `PostFormData` / `OxAddToCart`.

### Plusieurs produits à la fois

Deux approches :

1. Envoyer plusieurs messages `postMessage` successifs.
2. Étendre le protocole avec un tableau `products: [{ productId, quantity }, ...]`.

### Plusieurs guides sur le même site

Chaque guide peut pointer vers une iframe différente. Un seul `oxatis-bridge.js` en fin de page suffit, à condition d'autoriser toutes les origines de vos apps dans `ALLOWED_ORIGINS`.

---

## 9. Fichiers du projet

| Fichier / dossier  | Rôle                                              |
| ------------------ | ------------------------------------------------- |
| `app/`             | Application guide de choix (contenu de l'iframe)  |
| `host/`            | Page de démo simulant xeilom.fr pour tests locaux |
| `oxatis-bridge.js` | Script pont à coller sur Oxatis                   |
| `README.md`        | Démarrage rapide et référence technique           |
| `DEMARCHE.md`      | Ce document — explication de la démarche          |

---

## 10. Résumé

1. **Oxatis ne permet pas** de faire des configurateurs avancés nativement → on les développe à part.
2. **L'iframe ne peut pas** toucher au panier directement → on utilise `postMessage`.
3. **La page xeilom.fr** reçoit le message et appelle `AddToCart(id)` — la fonction native Oxatis.
4. **En secours**, une redirection vers `PBShoppingCart.asp?ItmID=...` fonctionne sans script custom.
5. **L'ID produit** se lit dans l'URL catalogue (`c2x` + nombre).

Cette architecture est le standard pour intégrer des outils tiers sur un site Oxatis tout en conservant le panier et le tunnel de commande natifs.
