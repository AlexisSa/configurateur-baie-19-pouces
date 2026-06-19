/** Parent → iframe : applique la catégorie tarifaire Oxatis. */
export const EMBED_CONTEXT_MESSAGE_TYPE = "xeilom-context";

/** iframe → parent : demande la catégorie (évite la course au chargement). */
export const EMBED_REQUEST_CONTEXT_MESSAGE_TYPE = "xeilom-request-context";

/** iframe → parent : hauteur pour redimensionner l'iframe. */
export const EMBED_RESIZE_MESSAGE_TYPE = "xeilom-resize";

/** iframe → parent : ajout au panier Oxatis. */
export const ADD_TO_CART_MESSAGE_TYPE = "XEILOM_ADD_TO_CART";

/** parent → iframe : résultat ajout panier. */
export const ADD_TO_CART_RESULT_MESSAGE_TYPE = "XEILOM_ADD_TO_CART_RESULT";

export const OXATIS_CART_BASE_URL = "https://www.xeilom.fr/PBShoppingCart.asp";
