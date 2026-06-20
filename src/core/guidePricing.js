import {
  applyPricingToLines,
  formatPriceHT,
  getPricedTotalHT,
  getPricingDisclaimer,
  getTotalTTC,
  hasPricedLines,
} from "../../xeilom-kit/utils/pricing.js";
import { getPricingTierLabel } from "../../xeilom-kit/utils/pricingTier.js";

export {
  applyPricingToLines,
  formatPriceHT,
  getPricedTotalHT,
  getPricingDisclaimer,
  getTotalTTC,
  hasPricedLines,
};

/**
 * @param {{
 *   product: { sku: string }|null,
 *   accessories: import("./types.js").GuideAccessory[],
 *   selectedAccessoryIds: string[],
 *   accessoryQuantities: Record<string, number>,
 *   pricingTierCode: string,
 * }}
 */
export function buildGuidePricing({
  product,
  accessories,
  selectedAccessoryIds,
  accessoryQuantities,
  pricingTierCode,
}) {
  if (!product) {
    return { lines: [], totalHT: 0, totalTTC: 0, hasPrices: false };
  }

  /** @type {{ sku: string, quantity: number, label?: string }[]} */
  const rawLines = [{ sku: product.sku, quantity: 1, label: "Baie" }];

  for (const id of selectedAccessoryIds) {
    const accessory = accessories.find((item) => item.id === id);
    if (!accessory) continue;
    rawLines.push({
      sku: accessory.sku,
      quantity: accessoryQuantities[id] ?? 1,
      label: accessory.label,
    });
  }

  const lines = applyPricingToLines(rawLines, pricingTierCode);
  const totalHT = getPricedTotalHT(lines);

  return {
    lines,
    totalHT,
    totalTTC: getTotalTTC(totalHT),
    hasPrices: hasPricedLines(lines),
    tierLabel: getPricingTierLabel(pricingTierCode),
    disclaimer: getPricingDisclaimer(pricingTierCode),
  };
}

/**
 * @param {string} sku
 * @param {number} quantity
 * @param {string} pricingTierCode
 */
export function getLinePrice(sku, quantity, pricingTierCode) {
  const [line] = applyPricingToLines([{ sku, quantity }], pricingTierCode);
  return line;
}
