import { describe, expect, it } from "vitest";
import catalog from "../src/guides/baie/catalog.json";
import { getAccessories } from "../src/guides/baie/accessories.js";
import {
  buildConfigurationSummary,
  filterCandidates,
  getAvailableStands,
  resolveProduct,
} from "../src/guides/baie/rules.js";

describe("filterCandidates", () => {
  it("retourne une correspondance stricte pour une baie serveur", () => {
    const answers = {
      usage: "serveur",
      height: "42",
      width: "800",
      depth: "1000",
      mounting: "kit",
    };

    const candidates = filterCandidates(answers, catalog);
    expect(candidates).toHaveLength(1);
    expect(candidates[0].sku).toBe("XT-S6-4280100KN");
  });

  it("ne retourne rien si la profondeur ne correspond pas", () => {
    const answers = {
      usage: "brassage",
      height: "42",
      width: "800",
      depth: "1200",
      mounting: "kit",
    };

    expect(filterCandidates(answers, catalog)).toHaveLength(0);
  });
});

describe("resolveProduct", () => {
  it("distingue un coffret fixe d'un coffret sur pieds", () => {
    const base = {
      usage: "coffret-st",
      height: "12",
      width: "600",
      depth: "450",
      mounting: "montee",
    };

    const fixe = resolveProduct({ ...base, stand: "fixe" }, catalog);
    const surPieds = resolveProduct({ ...base, stand: "sur-pieds" }, catalog);

    expect(fixe?.sku).toBe("XT-ST126045MN");
    expect(surPieds?.sku).toBe("XT-ST126045MNP");
  });

  it("expose un récapitulatif de configuration", () => {
    const product = resolveProduct(
      {
        usage: "serveur",
        height: "42",
        width: "800",
        depth: "1000",
        mounting: "kit",
      },
      catalog,
    );

    expect(product?.configurationSummary).toEqual([
      "Baie serveur 19 pouces",
      "42 U",
      "800 mm",
      "1000 mm",
      "En kit",
    ]);
  });
});

describe("getAvailableStands", () => {
  it("propose fixe et sur pieds pour les coffrets concernés", () => {
    const stands = getAvailableStands(
      {
        usage: "coffret-st",
        height: "12",
        width: "600",
        depth: "450",
      },
      catalog,
    );

    expect(stands.map((option) => option.value)).toEqual(["fixe", "sur-pieds"]);
  });
});

describe("buildConfigurationSummary", () => {
  it("inclut la fixation coffret", () => {
    expect(
      buildConfigurationSummary({
        usage: "coffret-st",
        height: "12",
        width: "600",
        depth: "450",
        stand: "sur-pieds",
        mounting: "montee",
      }),
    ).toContain("Sur pieds");
  });
});

describe("getAccessories", () => {
  it("filtre les goulottes par hauteur et largeur", () => {
    const items = getAccessories({
      usage: "serveur",
      height: "42",
      width: "800",
      depth: "1000",
    });

    expect(items.some((item) => item.id === "goulotte-42")).toBe(true);
    expect(items.some((item) => item.id === "goulotte-26")).toBe(false);
  });

  it("n'affiche pas les goulottes pour une largeur 600 mm", () => {
    const items = getAccessories({
      usage: "brassage",
      height: "42",
      width: "600",
      depth: "800",
    });

    expect(items.some((item) => item.id.startsWith("goulotte-"))).toBe(false);
  });
});
