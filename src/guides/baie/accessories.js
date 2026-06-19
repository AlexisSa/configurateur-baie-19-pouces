/** @type {import("../../core/types.js").GuideAccessory[]} */
export const BAIE_ACCESSORIES = [
  {
    id: "roulettes",
    productId: 36433353,
    sku: "XT-6-4R",
    label: "Lot de 4 roulettes",
    description: "Dont 2 avec frein — compatibles baies serveur et de brassage",
    imageUrl: "https://www.xeilom.fr/Files/126457/Img/17/KX-6-4R-1x175.jpg",
    productUrl: "https://www.xeilom.fr/lot-de-4-roulettes-pour-baie-serie-6",
    compatUsage: ["serveur", "brassage"],
  },
];

/**
 * @param {Record<string, string>} answers
 */
export function getAccessories(answers) {
  const usage = answers.usage;
  if (!usage) return [];
  return BAIE_ACCESSORIES.filter((item) => item.compatUsage.includes(usage));
}
