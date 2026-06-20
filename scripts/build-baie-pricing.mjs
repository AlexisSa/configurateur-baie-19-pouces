import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseOxatisCsv, parseOxatisPriceHT } from "../xeilom-kit/scripts/lib/parseOxatisCsv.mjs";
import {
  OXATIS_TIER_COLUMNS,
  TIER_CODES,
} from "../xeilom-kit/scripts/lib/oxatisPricingColumns.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CSV_PATH = resolve(ROOT, "data/import/Oxatis-All-xeilom-26993.csv");
const CATALOG_PATH = resolve(ROOT, "src/guides/baie/catalog.json");
const ACCESSORIES_PATH = resolve(ROOT, "src/guides/baie/accessories.js");
const OUT_PATH = resolve(ROOT, "xeilom-kit/data/pricingMatrix.json");

const emptyTierPrices = () =>
  Object.fromEntries(TIER_CODES.map((code) => [code, null]));

/**
 * @param {string[]} header
 * @param {string[][]} rows
 */
function indexOxatisPrices(header, rows) {
  const columnIndex = Object.fromEntries(header.map((name, index) => [name, index]));
  const skuIndex = columnIndex.ItemSKU;
  /** @type {Map<string, Record<string, number|null>>} */
  const bySku = new Map();

  for (const row of rows) {
    const itemSku = row[skuIndex]?.trim();
    if (!itemSku) continue;

    const tiers = emptyTierPrices();
    for (const code of TIER_CODES) {
      const column = OXATIS_TIER_COLUMNS[code];
      const value = row[columnIndex[column]];
      tiers[code] = parseOxatisPriceHT(value);
    }

    bySku.set(itemSku.toUpperCase(), tiers);
  }

  return bySku;
}

/**
 * @returns {string[]}
 */
function collectAccessorySkus() {
  const source = readFileSync(ACCESSORIES_PATH, "utf8");
  const matches = source.matchAll(/sku:\s*"([^"]+)"/g);
  return [...new Set([...matches].map((match) => match[1]))];
}

if (!existsSync(CSV_PATH)) {
  console.error(`CSV introuvable : ${CSV_PATH}`);
  process.exit(1);
}

const rawBuffer = readFileSync(CSV_PATH);
let raw = rawBuffer.toString("utf8");
if (raw.includes("\uFFFD")) {
  raw = rawBuffer.toString("latin1");
}

const { header, rows } = parseOxatisCsv(raw);
const oxatisBySku = indexOxatisPrices(header, rows);
const catalog = JSON.parse(readFileSync(CATALOG_PATH, "utf8"));
const skusToImport = [
  ...new Set([
    ...catalog.map((product) => product.sku).filter(Boolean),
    ...collectAccessorySkus(),
  ]),
];

/** @type {Record<string, Record<string, number|null>>} */
const skus = {};
const missing = [];

for (const sku of skusToImport) {
  const tiers = oxatisBySku.get(sku.toUpperCase());
  if (!tiers) {
    missing.push(sku);
    skus[sku] = emptyTierPrices();
    continue;
  }
  skus[sku] = { ...tiers };
}

const output = {
  meta: {
    tiers: TIER_CODES,
    note: "Prix HT par SKU et tarif client (S/M/B/A/Z). Généré depuis l'export Oxatis.",
    importedFrom: CSV_PATH.split(/[/\\]/).pop(),
    importedAt: new Date().toISOString().slice(0, 10),
    skuCount: skusToImport.length,
  },
  skus,
};

writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);
const filled = Object.values(skus).filter((tier) =>
  TIER_CODES.some((code) => tier[code] != null),
).length;

console.log(`${OUT_PATH} mis à jour (${skusToImport.length} SKU, ${filled} avec au moins un tarif).`);
if (missing.length) {
  console.warn(`${missing.length} SKU sans prix dans l'export :`);
  for (const sku of missing.slice(0, 10)) console.warn(`  - ${sku}`);
}
