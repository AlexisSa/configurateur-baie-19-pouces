/** @type {Record<string, string[]>} */
export const USAGE_FAMILIES = {
  serveur: ["serveur"],
  brassage: ["brassage"],
  "coffret-st": ["coffret-st"],
  etanche: ["etanche-baie", "coffret-etanche"],
};

/** @type {Record<string, string>} */
export const USAGE_LABELS = {
  serveur: "Baie serveur",
  brassage: "Baie de brassage",
  "coffret-st": "Coffret 19\"",
  etanche: "Gamme étanche IP55",
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

/**
 * @param {import("../../core/types.js").CatalogProduct[]} catalog
 * @param {string} usage
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
  return product.mounting === mounting;
}

/**
 * @param {Record<string, string>} answers
 * @param {import("../../core/types.js").CatalogProduct[]} catalog
 */
export function filterCandidates(answers, catalog) {
  const pool = filterByUsage(catalog, answers.usage);
  if (!pool.length) return [];

  let candidates = pool.filter((product) => matchesHeight(answers.height, product));
  if (!candidates.length) candidates = pool;

  if (answers.width) {
    const byWidth = candidates.filter((product) =>
      matchesWidth(answers.width, product),
    );
    if (byWidth.length) candidates = byWidth;
  }

  if (answers.depth) {
    const byDepth = candidates.filter((product) =>
      matchesDepth(answers.depth, product),
    );
    if (byDepth.length) candidates = byDepth;
  }

  if (answers.mounting) {
    const byMounting = candidates.filter((product) =>
      matchesMounting(answers.mounting, product),
    );
    if (byMounting.length) candidates = byMounting;
  }

  return candidates;
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
  if (stepId === "mounting") {
    return MOUNTING_OPTIONS.find((option) => option.value === value)?.label ?? value;
  }
  return value;
}

/**
 * @param {Record<string, string>} answers
 * @param {import("../../core/types.js").CatalogProduct[]} catalog
 * @returns {import("../../core/types.js").ResolvedProduct|null}
 */
export function resolveProduct(answers, catalog) {
  const candidates = filterCandidates(answers, catalog);
  if (!candidates.length) return null;

  const preferred =
    candidates.find((product) => product.mounting === "montee") ?? candidates[0];
  return toResolved(preferred);
}

/**
 * @param {import("../../core/types.js").CatalogProduct} product
 */
function toResolved(product) {
  return {
    productId: product.productId,
    sku: product.sku,
    name: product.name,
    description: product.categoryPath.split("\\").slice(-1)[0],
    imageUrl: product.imageUrl,
    productUrl: product.productUrl,
  };
}
