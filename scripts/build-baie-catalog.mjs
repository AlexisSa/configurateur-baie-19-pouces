import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseOxatisCsv } from "../xeilom-kit/scripts/lib/parseOxatisCsv.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CSV_PATH = resolve(ROOT, "data/import/Oxatis-All-xeilom-26993.csv");
const OUT_PATH = resolve(ROOT, "src/guides/baie/catalog.json");

/** @type {{ suffix: string, family: string }[]} */
const CATEGORY_RULES = [
  { suffix: "Baies serveurs 19 pouces", family: "serveur" },
  { suffix: "Baie de brassage 19 pouces", family: "brassage" },
  { suffix: "Baies étanches / outdoors IP55 19 pouces", family: "etanche-baie" },
  {
    suffix: "Coffrets étanches / outdoors IP55 19 pouces",
    family: "coffret-etanche",
  },
  { suffix: 'Coffrets 19" profondeur 450 mm', family: "coffret-st" },
  { suffix: 'Coffrets 19" profondeur 600 mm', family: "coffret-st" },
  { suffix: 'Coffrets 19" profondeur 800 mm', family: "coffret-st" },
  {
    suffix: "Coffrets informatiques 19 pouces sur pieds",
    family: "coffret-st",
  },
];

/**
 * @param {string} categoryPath
 * @returns {string|null}
 */
function resolveFamily(categoryPath) {
  for (const rule of CATEGORY_RULES) {
    if (categoryPath.includes(rule.suffix)) return rule.family;
  }
  return null;
}

/**
 * @param {string} name
 * @returns {"kit"|"montee"|null}
 */
function parseMounting(name) {
  if (/en kit/i.test(name)) return "kit";
  if (/mont[eé]/i.test(name)) return "montee";
  return null;
}

/**
 * @param {string} name
 * @returns {{ heightU: number|null, widthMm: number|null, depthMm: number|null }}
 */
function parseAttrsFromName(name) {
  const heightMatch = name.match(/(\d+)\s*U\b/i);
  const dimMatch = name.match(/(\d{3,4})\s*[x×]\s*(\d{3,4})/i);

  return {
    heightU: heightMatch ? Number(heightMatch[1]) : null,
    widthMm: dimMatch ? Number(dimMatch[1]) : null,
    depthMm: dimMatch ? Number(dimMatch[2]) : null,
  };
}

/**
 * @param {string} sku
 * @param {string} categoryPath
 * @returns {"fixe"|"sur-pieds"}
 */
function parseStandType(sku, categoryPath) {
  if (/MNP$/i.test(sku) || /sur pieds/i.test(categoryPath)) return "sur-pieds";
  return "fixe";
}

/**
 * @param {import("../../core/types.js").CatalogProduct} product
 */
function isConfigurableRack(product) {
  if (product.family === "coffret-st") {
    return product.attrs.heightU != null;
  }
  return product.attrs.heightU != null && product.attrs.widthMm != null;
}

/**
 * @param {string} url
 * @returns {string|null}
 */
function normalizeImageUrl(url) {
  if (!url || !url.trim()) return null;
  const trimmed = url.trim();
  if (trimmed.startsWith("http")) return trimmed;
  return `https://www.xeilom.fr/Files/126457/Img/${trimmed.startsWith("/") ? trimmed.slice(1) : trimmed}`;
}

if (!existsSync(CSV_PATH)) {
  if (existsSync(OUT_PATH)) {
    console.log(
      `CSV absent (${CSV_PATH}) — conservation de ${OUT_PATH} existant.`,
    );
    process.exit(0);
  }
  console.error(
    `CSV introuvable : ${CSV_PATH}\nPlacez l'export Oxatis ou lancez depuis un clone avec data/import/.`,
  );
  process.exit(1);
}

const raw = readFileSync(CSV_PATH, "latin1");
const { header, rows } = parseOxatisCsv(raw);

const index = Object.fromEntries(header.map((key, i) => [key, i]));

/** @type {unknown[]} */
const catalog = [];

for (const row of rows) {
  const categoryPath = row[index.Category1Name] ?? "";
  if (!categoryPath.startsWith("Baies et coffrets")) continue;

  const family = resolveFamily(categoryPath);
  if (!family) continue;

  const name = row[index.Name] ?? "";
  const productId = Number.parseInt(row[index.OxatisId] ?? "", 10);
  if (!Number.isFinite(productId)) continue;

  const sku = row[index.ItemSKU] ?? "";
  const attrs = parseAttrsFromName(name);

  if (!isConfigurableRack({ family, attrs })) continue;

  const imageRaw =
    row[index.UrlBigImgFileName] ||
    row[index.BigImgFileName] ||
    row[index.UrlSmallImgFileName] ||
    "";

  catalog.push({
    productId,
    sku,
    name,
    categoryPath,
    family,
    mounting: parseMounting(name),
    standType: family === "coffret-st" ? parseStandType(sku, categoryPath) : null,
    productUrl: row[index.ProductUrl] ?? "",
    imageUrl: normalizeImageUrl(imageRaw),
    attrs,
  });
}

catalog.sort((a, b) => a.name.localeCompare(b.name, "fr"));

writeFileSync(OUT_PATH, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
console.log(`Catalogue baie : ${catalog.length} produits → ${OUT_PATH}`);
