/** URL fiche produit Oxatis (fiable, indépendante du slug SEO). */
export function oxatisProductUrl(productId) {
  return `https://www.xeilom.fr/PBSCProduct.asp?PGFLngID=0&ItmID=${productId}`;
}
