import { readFileSync, writeFileSync } from "node:fs";
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
  if (/mont[eé]e/i.test(name)) return "montee";
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
 * @param {string} url
 * @returns {string|null}
 */
function normalizeImageUrl(url) {
  if (!url || !url.trim()) return null;
  const trimmed = url.trim();
  if (trimmed.startsWith("http")) return trimmed;
  return `https://www.xeilom.fr/Files/126457/Img/${trimmed.startsWith("/") ? trimmed.slice(1) : trimmed}`;
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

  const imageRaw =
    row[index.UrlBigImgFileName] ||
    row[index.BigImgFileName] ||
    row[index.UrlSmallImgFileName] ||
    "";

  catalog.push({
    productId,
    sku: row[index.ItemSKU] ?? "",
    name,
    categoryPath,
    family,
    mounting: parseMounting(name),
    productUrl: row[index.ProductUrl] ?? "",
    imageUrl: normalizeImageUrl(imageRaw),
    attrs: parseAttrsFromName(name),
  });
}

catalog.sort((a, b) => a.name.localeCompare(b.name, "fr"));

writeFileSync(OUT_PATH, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
console.log(`Catalogue baie : ${catalog.length} produits → ${OUT_PATH}`);
