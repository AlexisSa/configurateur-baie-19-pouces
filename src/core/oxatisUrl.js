/** URL fiche produit Oxatis (fiable, indépendante du slug SEO). */
export function oxatisProductUrl(productId) {
  return `https://www.xeilom.fr/PBSCProduct.asp?PGFLngID=0&ItmID=${productId}`;
}

/** Création de compte client sur xeilom.fr. */
export const OXATIS_SIGNUP_URL =
  "https://www.xeilom.fr/PBUserLogin.asp?CCode=33";
