/** Ordre et libellés des groupes d'accessoires. */
export const ACCESSORY_CATEGORIES = [
  {
    id: "mobilite",
    label: "Mobilité",
    hint: null,
  },
  {
    id: "ventilation",
    label: "Ventilation",
    hint: "Le caisson se fixe en toiture ; le ventilateur rackable s'installe en 1U dans la baie.",
  },
  {
    id: "fixation",
    label: "Fixation",
    hint: null,
  },
  {
    id: "alimentation",
    label: "Alimentation",
    hint: "Choisissez une version — avec ou sans interrupteur.",
  },
];

/** @type {import("../../core/types.js").GuideAccessory[]} */
export const BAIE_ACCESSORIES = [
  {
    id: "roulettes",
    category: "mobilite",
    productId: 36433353,
    sku: "XT-6-4R",
    label: "Lot de 4 roulettes",
    description: "Dont 2 avec frein",
    imageUrl: "https://www.xeilom.fr/Files/126457/Img/17/KX-6-4R-1x175.jpg",
    productUrl: "https://www.xeilom.fr/lot-de-4-roulettes-pour-baie-serie-6",
    compatUsage: ["serveur", "brassage", "coffret-st"],
  },
  {
    id: "caisson-v2",
    category: "ventilation",
    productId: 38219876,
    sku: "XT-6-V2",
    label: "Caisson 2 ventilateurs",
    description: "Toiture — profondeur baie 600 mm",
    imageUrl: "https://www.xeilom.fr/Files/126457/Img/07/KX-6-V2-1-small.png",
    productUrl:
      "https://www.xeilom.fr/caisson-2-ventilateurs-noir-compatible-armoires-profondeur-600-mm",
    compatUsage: ["serveur", "brassage"],
    compatDepthMm: 600,
  },
  {
    id: "caisson-v4",
    category: "ventilation",
    productId: 36433641,
    sku: "XT-6-V4",
    label: "Caisson 4 ventilateurs",
    description: "Toiture — profondeur baie 800 mm",
    imageUrl: "https://www.xeilom.fr/Files/126457/Img/08/KX-6-V4-1-small.jpg",
    productUrl:
      "https://www.xeilom.fr/caisson-4-ventilateurs-noir-compatible-armoires-profondeur-800-mm",
    compatUsage: ["serveur", "brassage"],
    compatDepthMm: 800,
  },
  {
    id: "caisson-v6",
    category: "ventilation",
    productId: 39321524,
    sku: "XT-6-V6",
    label: "Caisson 6 ventilateurs",
    description: "Toiture — profondeur baie 1000 mm",
    imageUrl: "https://www.xeilom.fr/Files/126457/Img/17/KX-6-V6_1x1200.jpg",
    productUrl:
      "https://www.xeilom.fr/caisson-6-ventilateurs-noir-compatible-armoires-profondeur-1000-mm",
    compatUsage: ["serveur", "brassage"],
    compatDepthMm: 1000,
  },
  {
    id: "ventilateur-rack",
    category: "ventilation",
    productId: 25739652,
    sku: "PA19VEN4",
    label: "Ventilateur rackable 1U",
    description: "4 ventilateurs — sans thermostat",
    imageUrl: "https://www.xeilom.fr/Files/126457/Img/14/PA19VEN4-1-small.jpg",
    productUrl:
      "https://www.xeilom.fr/ventilateur-sans-thermostat-19-1u-4-ventilateurs-profondeur-350-mm-noir",
    compatUsage: ["serveur", "brassage"],
  },
  {
    id: "ventilateur",
    category: "ventilation",
    productId: 25737965,
    sku: "CBVE00NR0001",
    label: "Ventilateur pour coffret",
    description: "Flux d'air 50–110 m³/h — 230 V",
    imageUrl: "https://www.xeilom.fr/Files/126457/Img/01/CBVE00NR0001_1x175.jpg",
    productUrl: "https://www.xeilom.fr/ventilateur-pour-coffrets-19",
    compatUsage: ["coffret-st"],
  },
  {
    id: "verins",
    category: "fixation",
    productId: 41130631,
    sku: "XT-6-4V",
    label: "Lot de 4 vérins",
    description: "Nivellement de la baie ou du coffret",
    imageUrl: "https://www.xeilom.fr/Files/126457/Img/21/KX-6-4V_1x175.png",
    productUrl: "https://www.xeilom.fr/lot-de-4-verins-pour-baies-et-coffrets-19-pouces",
    compatUsage: ["coffret-st"],
  },
  {
    id: "bandeau-sans-inter",
    category: "alimentation",
    productId: 27399790,
    sku: "BAN8PCIN",
    label: "Bandeau électrique 8 prises",
    description: "1U 19\" — 8 prises 2P+T — sans interrupteur",
    imageUrl: "https://www.xeilom.fr/Files/126457/Img/04/BAN8PCIN_1x175.jpg",
    productUrl: "https://www.xeilom.fr/bandeau-electrique-8-prises-2pt-1u-19-sans-interrupteur",
    compatUsage: ["serveur", "brassage", "coffret-st"],
    exclusiveGroup: "bandeau-electrique",
  },
  {
    id: "bandeau-avec-inter",
    category: "alimentation",
    productId: 27399791,
    sku: "BAN8PCIN-2",
    label: "Bandeau électrique 8 prises",
    description: "1U 19\" — 8 prises 2P+T — avec interrupteur",
    imageUrl: "https://www.xeilom.fr/Files/126457/Img/11/BAN8PCIN-2_1x175.jpg",
    productUrl: "https://www.xeilom.fr/bandeau-electrique-8-prises-2pt-1u-19-avec-interrupteur",
    compatUsage: ["serveur", "brassage", "coffret-st"],
    exclusiveGroup: "bandeau-electrique",
  },
];

/**
 * @param {import("../../core/types.js").GuideAccessory[]} accessories
 */
export function groupAccessories(accessories) {
  const byCategory = new Map(
    ACCESSORY_CATEGORIES.map((category) => [category.id, []]),
  );

  for (const accessory of accessories) {
    const categoryId = accessory.category ?? "fixation";
    if (!byCategory.has(categoryId)) {
      byCategory.set(categoryId, []);
    }
    byCategory.get(categoryId).push(accessory);
  }

  return ACCESSORY_CATEGORIES.flatMap((category) => {
    const items = byCategory.get(category.id) ?? [];
    if (!items.length) return [];

    const showHint =
      category.hint &&
      ((category.id === "ventilation" &&
        items.some((item) => item.id.startsWith("caisson-")) &&
        items.some((item) => item.id === "ventilateur-rack")) ||
        (category.id === "alimentation" && items.length > 1));

    return [{ ...category, hint: showHint ? category.hint : null, items }];
  });
}

/**
 * @param {Record<string, string>} answers
 */
export function getAccessories(answers) {
  const usage = answers.usage;
  if (!usage) return [];

  const depthMm = answers.depth ? Number.parseInt(answers.depth, 10) : null;

  return BAIE_ACCESSORIES.filter((item) => {
    if (!item.compatUsage.includes(usage)) return false;
    if (item.compatDepthMm != null) {
      return depthMm === item.compatDepthMm;
    }
    return true;
  });
}
