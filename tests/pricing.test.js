import { afterEach, describe, expect, it } from "vitest";
import {
  applyPricingToLine,
  formatPriceHT,
  getTotalTTC,
  getVatRate,
} from "../xeilom-kit/utils/pricing.js";
import { getSkuTierPriceHT } from "../xeilom-kit/utils/pricingMatrix.js";
import { configurePricing } from "../xeilom-kit/utils/pricingConfig.js";
import { buildGuidePricing } from "../src/core/guidePricing.js";

// SKU réel présent dans la matrice tarifaire (tarif public S = 530,40 € HT).
const KNOWN_SKU = "XT-B6-206060KN";
const KNOWN_PRICE_S = 530.4;

afterEach(() => {
  // Réinitialise la configuration globale entre les tests.
  configurePricing({ lot24: { unitSku: null, lotSku: null, size: 24 } });
});

describe("getTotalTTC", () => {
  it("applique la TVA de 20 % par défaut", () => {
    expect(getVatRate()).toBe(0.2);
    expect(getTotalTTC(100)).toBe(120);
  });

  it("arrondit le total TTC au centime", () => {
    expect(getTotalTTC(KNOWN_PRICE_S)).toBe(636.48);
  });
});

describe("applyPricingToLine", () => {
  it("calcule le total de ligne selon la quantité", () => {
    const line = applyPricingToLine({ sku: KNOWN_SKU, quantity: 2 }, "S");
    expect(line.unitPriceHT).toBe(KNOWN_PRICE_S);
    expect(line.lineTotalHT).toBe(1060.8);
  });

  it("ne facture pas les lignes marquées INCLUS", () => {
    const line = applyPricingToLine({ sku: "INCLUS", quantity: 3 }, "S");
    expect(line.unitPriceHT).toBeNull();
    expect(line.lineTotalHT).toBeNull();
  });

  it("renvoie un prix nul pour un SKU inconnu", () => {
    const line = applyPricingToLine(
      { sku: "SKU-INEXISTANT", quantity: 1 },
      "S",
    );
    expect(line.unitPriceHT).toBeNull();
  });
});

describe("getSkuTierPriceHT — lot de 24", () => {
  it("dérive le prix d'un lot depuis le prix unitaire", () => {
    configurePricing({
      lot24: { unitSku: KNOWN_SKU, lotSku: "TEST-LOT-24", size: 24 },
    });
    expect(getSkuTierPriceHT("TEST-LOT-24", "S")).toBe(
      Math.round(KNOWN_PRICE_S * 24 * 100) / 100,
    );
  });
});

describe("buildGuidePricing", () => {
  it("renvoie un panier vide sans produit", () => {
    const pricing = buildGuidePricing({
      product: null,
      accessories: [],
      selectedAccessoryIds: [],
      accessoryQuantities: {},
      pricingTierCode: "S",
    });
    expect(pricing.hasPrices).toBe(false);
    expect(pricing.totalHT).toBe(0);
  });

  it("totalise la baie et ses accessoires sélectionnés", () => {
    const accessories = [
      { id: "acc-1", sku: KNOWN_SKU, label: "Accessoire test" },
    ];
    const pricing = buildGuidePricing({
      product: { sku: KNOWN_SKU },
      accessories,
      selectedAccessoryIds: ["acc-1"],
      accessoryQuantities: { "acc-1": 2 },
      pricingTierCode: "S",
    });

    // 1 baie + 2 accessoires = 3 × 530,40.
    expect(pricing.hasPrices).toBe(true);
    expect(pricing.totalHT).toBe(1591.2);
    expect(pricing.totalTTC).toBe(getTotalTTC(1591.2));
  });
});

describe("formatPriceHT", () => {
  it("affiche un tiret pour une valeur absente", () => {
    expect(formatPriceHT(null)).toBe("—");
  });

  it("formate en euros français", () => {
    expect(formatPriceHT(530.4)).toMatch(/530,40/);
  });
});
