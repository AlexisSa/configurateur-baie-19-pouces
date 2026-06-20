/** @type {Record<string, string[]>} */
export const USAGE_FAMILIES = {
  serveur: ["serveur"],
  brassage: ["brassage"],
  "coffret-st": ["coffret-st"],
  "etanche-baie": ["etanche-baie"],
  "coffret-etanche": ["coffret-etanche"],
};

/** @type {Record<string, string>} */
export const USAGE_LABELS = {
  serveur: "Baie serveur 19 pouces",
  brassage: "Baie de brassage 19 pouces",
  "coffret-st": "Coffret 19 pouces",
  "etanche-baie": "Baie étanche IP55 19 pouces",
  "coffret-etanche": "Coffret étanche IP55 19 pouces",
};

/** @type {{ value: "kit"|"montee", label: string, description: string }[]} */
export const MOUNTING_OPTIONS = [
  {
    value: "montee",
    label: "Montée",
    description: "Baie assemblée, prête à l'emploi",
  },
  { value: "kit", label: "En kit", description: "À assembler sur site" },
];

/** @type {{ value: "fixe"|"sur-pieds", label: string, description: string }[]} */
export const STAND_OPTIONS = [
  {
    value: "fixe",
    label: "Fixe",
    description: "Coffret mural ou sur socle",
  },
  {
    value: "sur-pieds",
    label: "Sur pieds",
    description: "Coffret monté sur pieds avec roulettes",
  },
];

/**
 * @param {string} usage
 * @param {import("../../core/types.js").CatalogProduct[]} catalog
 */
export function filterByUsage(catalog, usage) {
  const families = USAGE_FAMILIES[usage] ?? [];
  return catalog.filter((product) => families.includes(product.family));
}

/**
 * @param {string} heightU
 * @param {import("../../core/types.js").CatalogProduct} product
 */
export function matchesHeight(heightU, product) {
  const target = Number.parseInt(heightU, 10);
  if (!Number.isFinite(target)) return true;
  if (product.attrs.heightU == null) return false;
  return product.attrs.heightU === target;
}

/**
 * @param {string} widthMm
 * @param {import("../../core/types.js").CatalogProduct} product
 */
export function matchesWidth(widthMm, product) {
  const target = Number.parseInt(widthMm, 10);
  if (!Number.isFinite(target)) return true;
  if (product.attrs.widthMm == null) return false;
  return product.attrs.widthMm === target;
}

/**
 * @param {string} depthMm
 * @param {import("../../core/types.js").CatalogProduct} product
 */
export function matchesDepth(depthMm, product) {
  const target = Number.parseInt(depthMm, 10);
  if (!Number.isFinite(target)) return true;
  if (product.attrs.depthMm == null) return false;
  return product.attrs.depthMm === target;
}

/**
 * @param {string} mounting
 * @param {import("../../core/types.js").CatalogProduct} product
 */
export function matchesMounting(mounting, product) {
  if (!mounting) return true;
  if (product.mounting == null) return false;
  return product.mounting === mounting;
}

/**
 * @param {string} stand
 * @param {import("../../core/types.js").CatalogProduct} product
 */
export function matchesStand(stand, product) {
  if (!stand) return true;
  if (product.standType == null) return true;
  return product.standType === stand;
}

/**
 * @param {Record<string, string>} answers
 * @param {import("../../core/types.js").CatalogProduct[]} catalog
 */
export function filterCandidates(answers, catalog) {
  const pool = filterByUsage(catalog, answers.usage);
  if (!pool.length) return [];

  return pool.filter((product) => {
    if (answers.height && !matchesHeight(answers.height, product)) return false;
    if (answers.width && !matchesWidth(answers.width, product)) return false;
    if (answers.depth && !matchesDepth(answers.depth, product)) return false;
    if (answers.stand && !matchesStand(answers.stand, product)) return false;
    if (answers.mounting && !matchesMounting(answers.mounting, product)) return false;
    return true;
  });
}

/**
 * @param {string} usage
 * @param {import("../../core/types.js").CatalogProduct[]} catalog
 */
export function getAvailableHeights(usage, catalog) {
  const products = filterByUsage(catalog, usage);
  const heights = [
    ...new Set(
      products.map((product) => product.attrs.heightU).filter((u) => u != null),
    ),
  ].sort((a, b) => a - b);

  return heights.map((u) => ({
    value: String(u),
    label: `${u} U`,
  }));
}

/**
 * @param {string} usage
 * @param {string} heightU
 * @param {import("../../core/types.js").CatalogProduct[]} catalog
 */
export function getAvailableWidths(usage, heightU, catalog) {
  const products = filterByUsage(catalog, usage).filter((product) =>
    matchesHeight(heightU, product),
  );

  const widths = [
    ...new Set(
      products.map((product) => product.attrs.widthMm).filter((w) => w != null),
    ),
  ].sort((a, b) => a - b);

  return widths.map((w) => ({
    value: String(w),
    label: `${w} mm`,
  }));
}

/**
 * @param {string} usage
 * @param {string} heightU
 * @param {string} widthMm
 * @param {import("../../core/types.js").CatalogProduct[]} catalog
 */
export function getAvailableDepths(usage, heightU, widthMm, catalog) {
  const products = filterByUsage(catalog, usage)
    .filter((product) => matchesHeight(heightU, product))
    .filter((product) => matchesWidth(widthMm, product));

  const depths = [
    ...new Set(
      products.map((product) => product.attrs.depthMm).filter((d) => d != null),
    ),
  ].sort((a, b) => a - b);

  return depths.map((d) => ({
    value: String(d),
    label: `${d} mm`,
  }));
}

/**
 * @param {Record<string, string>} answers
 * @param {import("../../core/types.js").CatalogProduct[]} catalog
 */
export function getAvailableStands(answers, catalog) {
  if (answers.usage !== "coffret-st") return [];

  const candidates = filterCandidates({ ...answers, stand: "", mounting: "" }, catalog);
  const stands = new Set(
    candidates.map((product) => product.standType).filter(Boolean),
  );

  return STAND_OPTIONS.filter((option) => stands.has(option.value));
}

/**
 * @param {Record<string, string>} answers
 * @param {import("../../core/types.js").CatalogProduct[]} catalog
 */
export function getAvailableMountings(answers, catalog) {
  const candidates = filterCandidates({ ...answers, mounting: "" }, catalog);
  const mountings = new Set(
    candidates.map((product) => product.mounting).filter(Boolean),
  );
  return MOUNTING_OPTIONS.filter((option) => mountings.has(option.value));
}

/**
 * @param {string} stepId
 * @param {Record<string, string>} answers
 * @param {import("../../core/types.js").CatalogProduct[]} catalog
 */
export function getStepOptions(stepId, answers, catalog) {
  if (stepId === "height" && answers.usage) {
    return getAvailableHeights(answers.usage, catalog);
  }
  if (stepId === "width" && answers.usage && answers.height) {
    return getAvailableWidths(answers.usage, answers.height, catalog);
  }
  if (stepId === "depth" && answers.usage && answers.height && answers.width) {
    return getAvailableDepths(
      answers.usage,
      answers.height,
      answers.width,
      catalog,
    );
  }
  if (
    stepId === "stand" &&
    answers.usage === "coffret-st" &&
    answers.height &&
    answers.width &&
    answers.depth
  ) {
    return getAvailableStands(answers, catalog);
  }
  if (
    stepId === "mounting" &&
    answers.usage &&
    answers.height &&
    answers.width &&
    answers.depth
  ) {
    return getAvailableMountings(answers, catalog);
  }
  return null;
}

/**
 * @param {string} stepId
 * @param {string} value
 */
export function formatAnswer(stepId, value) {
  if (stepId === "usage") return USAGE_LABELS[value] ?? value;
  if (stepId === "height") return `${value} U`;
  if (stepId === "width" || stepId === "depth") return `${value} mm`;
  if (stepId === "stand") {
    return STAND_OPTIONS.find((option) => option.value === value)?.label ?? value;
  }
  if (stepId === "mounting") {
    return MOUNTING_OPTIONS.find((option) => option.value === value)?.label ?? value;
  }
  return value;
}

/**
 * @param {Record<string, string>} answers
 * @returns {string[]}
 */
export function buildConfigurationSummary(answers) {
  const parts = [];

  if (answers.usage) {
    parts.push(USAGE_LABELS[answers.usage] ?? answers.usage);
  }
  if (answers.height) parts.push(`${answers.height} U`);
  if (answers.width) parts.push(`${answers.width} mm`);
  if (answers.depth) parts.push(`${answers.depth} mm`);
  if (answers.stand) {
    parts.push(
      STAND_OPTIONS.find((option) => option.value === answers.stand)?.label ??
        answers.stand,
    );
  }
  if (answers.mounting) {
    parts.push(
      MOUNTING_OPTIONS.find((option) => option.value === answers.mounting)?.label ??
        answers.mounting,
    );
  }

  return parts;
}

/**
 * @param {Record<string, string>} answers
 * @param {import("../../core/types.js").CatalogProduct[]} catalog
 * @returns {import("../../core/types.js").ResolvedProduct|null}
 */
export function resolveProduct(answers, catalog) {
  const candidates = filterCandidates(answers, catalog);
  if (!candidates.length) return null;

  if (answers.mounting) {
    return toResolved(candidates[0], answers);
  }

  const withMounting = candidates.filter((product) => product.mounting != null);
  const pool = withMounting.length ? withMounting : candidates;
  const preferred =
    pool.find((product) => product.mounting === "montee") ?? pool[0];

  return toResolved(preferred, answers);
}

/**
 * @param {import("../../core/types.js").CatalogProduct} product
 * @param {Record<string, string>} answers
 */
function toResolved(product, answers) {
  return {
    productId: product.productId,
    sku: product.sku,
    name: product.name,
    description: product.categoryPath.split("\\").slice(-1)[0],
    imageUrl: product.imageUrl,
    productUrl: product.productUrl,
    configurationSummary: buildConfigurationSummary(answers),
    mounting: product.mounting,
    standType: product.standType,
  };
}
