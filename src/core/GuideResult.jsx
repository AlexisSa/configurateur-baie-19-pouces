import {
  ArrowLeft,
  BadgeCheck,
  ExternalLink,
  RotateCcw,
  SearchX,
  ShoppingCart,
} from "lucide-react";
import { GuideAccessories } from "./GuideAccessories.jsx";
import { formatPriceHT, getLinePrice } from "./guidePricing.js";
import { hideBrokenImage } from "./imageFallback.js";
import { useHeadingFocus } from "./useHeadingFocus.js";

/**
 * @param {{
 *   product: import("./types.js").ResolvedProduct | null,
 *   accessories?: import("./types.js").GuideAccessory[],
 *   selectedAccessoryIds?: string[],
 *   accessoryQuantities?: Record<string, number>,
 *   onToggleAccessory?: (id: string) => void,
 *   onAccessoryQuantityChange?: (id: string, quantity: number) => void,
 *   groupAccessories?: (accessories: import("./types.js").GuideAccessory[]) => Array<{
 *     id: string,
 *     label: string,
 *     hint: string | null,
 *     items: import("./types.js").GuideAccessory[],
 *   }>,
 *   cartStatus: string,
 *   cartItemCount?: number,
 *   pricing?: {
 *     lines: Array<{ sku: string, quantity: number, unitPriceHT?: number|null, lineTotalHT?: number|null }>,
 *     totalHT: number,
 *     totalTTC: number,
 *     hasPrices: boolean,
 *     tierLabel?: string,
 *     disclaimer?: string,
 *   },
 *   pricingTierCode?: string,
 *   onAddToCart: () => void,
 *   onRestart: () => void,
 *   onBack?: () => void,
 * }} props
 */
export function GuideResult({
  product,
  accessories = [],
  selectedAccessoryIds = [],
  accessoryQuantities = {},
  onToggleAccessory,
  onAccessoryQuantityChange,
  groupAccessories,
  cartStatus,
  cartItemCount = 1,
  pricing,
  pricingTierCode = "S",
  onAddToCart,
  onRestart,
  onBack,
}) {
  const headingRef = useHeadingFocus(product?.sku ?? "empty", {
    focusOnMount: true,
  });

  if (!product) {
    return (
      <section className="panel guide-result guide-result--empty">
        <div className="guide-result-head guide-result-head--empty">
          <SearchX size={20} strokeWidth={2.2} aria-hidden />
          <div>
            <h2 className="section-title" ref={headingRef} tabIndex={-1}>
              Aucune correspondance
            </h2>
            <p className="guide-result-desc">
              Aucun produit ne correspond à vos critères. Modifiez vos réponses
              ou contactez Xeilom pour un conseil personnalisé.
            </p>
          </div>
        </div>
        <div className="guide-result-actions">
          {onBack && (
            <button type="button" className="btn ghost" onClick={onBack}>
              <ArrowLeft size={16} aria-hidden />
              Modifier mes réponses
            </button>
          )}
          <button type="button" className="btn primary" onClick={onRestart}>
            <RotateCcw size={16} aria-hidden />
            Recommencer
          </button>
        </div>
      </section>
    );
  }

  const isLoading = cartStatus === "loading";
  const hasAccessories = accessories.length > 0 && groupAccessories;
  const selectedCount = selectedAccessoryIds.length;
  const productPrice = getLinePrice(product.sku, 1, pricingTierCode);
  const cartLabel =
    selectedCount > 0
      ? `Ajouter au panier · ${cartItemCount} article${cartItemCount > 1 ? "s" : ""}`
      : "Ajouter au panier";

  const renderCartButton = (className = "") => (
    <button
      type="button"
      className={`btn primary guide-result-cart${className ? ` ${className}` : ""}`}
      onClick={onAddToCart}
      disabled={isLoading}
    >
      <ShoppingCart size={16} aria-hidden />
      {isLoading ? "Ajout en cours…" : cartLabel}
    </button>
  );

  const renderPricing = () => {
    if (!pricing?.hasPrices) return null;

    return (
      <div className="guide-result-pricing panel-inset">
        <div className="guide-result-pricing-row guide-result-pricing-row--head">
          <span>Total configuration</span>
          <span className="guide-result-pricing-total">
            {formatPriceHT(pricing.totalHT)} HT
            <span className="guide-result-pricing-ttc">
              {formatPriceHT(pricing.totalTTC)} TTC
            </span>
          </span>
        </div>
        {pricing.tierLabel && (
          <p className="guide-result-pricing-tier">
            Tarif : {pricing.tierLabel}
          </p>
        )}
        {pricing.disclaimer && (
          <p className="guide-result-pricing-note">{pricing.disclaimer}</p>
        )}
      </div>
    );
  };

  return (
    <section className="panel guide-result">
      <header className="guide-result-head">
        <BadgeCheck
          size={20}
          strokeWidth={2.2}
          className="guide-result-head-icon"
          aria-hidden
        />
        <h2 className="section-title" ref={headingRef} tabIndex={-1}>
          Votre baie recommandée
        </h2>
      </header>

      {product.configurationSummary?.length > 0 && (
        <ul className="guide-result-config" aria-label="Configuration retenue">
          {product.configurationSummary.map((item) => (
            <li key={item} className="guide-result-config-item">
              {item}
            </li>
          ))}
        </ul>
      )}

      <div className="guide-result-product">
        {product.imageUrl && (
          <div className="guide-result-visual">
            <img
              src={product.imageUrl}
              alt=""
              className="product-visual"
              loading="lazy"
              onError={hideBrokenImage}
            />
          </div>
        )}
        <div className="guide-result-content">
          <span className="guide-result-ref">Réf. {product.sku}</span>
          <h3 className="guide-result-name">{product.name}</h3>
          {productPrice.unitPriceHT != null && (
            <p className="guide-result-price">
              <span className="guide-result-price-value">
                {formatPriceHT(productPrice.unitPriceHT)} HT
              </span>
            </p>
          )}
          {product.productUrl && (
            <a
              href={product.productUrl}
              className="link-btn guide-result-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Voir la fiche produit
              <ExternalLink size={14} aria-hidden />
            </a>
          )}
        </div>
      </div>

      {!hasAccessories && renderPricing()}

      <div className="guide-result-actions">
        {renderCartButton()}
        {onBack && (
          <button type="button" className="btn ghost" onClick={onBack}>
            <ArrowLeft size={16} aria-hidden />
            Modifier
          </button>
        )}
        <button type="button" className="btn ghost" onClick={onRestart}>
          <RotateCcw size={16} aria-hidden />
          Recommencer
        </button>
      </div>

      {hasAccessories && (
        <div className="guide-result-options">
          <GuideAccessories
            accessories={accessories}
            selectedAccessoryIds={selectedAccessoryIds}
            accessoryQuantities={accessoryQuantities}
            onToggleAccessory={onToggleAccessory}
            onAccessoryQuantityChange={onAccessoryQuantityChange}
            groupAccessories={groupAccessories}
            pricingTierCode={pricingTierCode}
          />
          {renderPricing()}
          {selectedCount > 0 && (
            <div className="guide-result-actions guide-result-actions--bottom">
              {renderCartButton()}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
