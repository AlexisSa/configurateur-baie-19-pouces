import {
  ArrowLeft,
  BadgeCheck,
  ExternalLink,
  RotateCcw,
  SearchX,
  ShoppingCart,
} from "lucide-react";
import { GuideAccessories } from "./GuideAccessories.jsx";

/**
 * @param {{
 *   product: import("./types.js").ResolvedProduct | null,
 *   accessories?: import("./types.js").GuideAccessory[],
 *   selectedAccessoryIds?: string[],
 *   onToggleAccessory?: (id: string) => void,
 *   groupAccessories?: (accessories: import("./types.js").GuideAccessory[]) => Array<{
 *     id: string,
 *     label: string,
 *     hint: string | null,
 *     items: import("./types.js").GuideAccessory[],
 *   }>,
 *   cartStatus: string,
 *   onAddToCart: () => void,
 *   onRestart: () => void,
 *   onBack?: () => void,
 * }} props
 */
export function GuideResult({
  product,
  accessories = [],
  selectedAccessoryIds = [],
  onToggleAccessory,
  groupAccessories,
  cartStatus,
  onAddToCart,
  onRestart,
  onBack,
}) {
  if (!product) {
    return (
      <section className="panel guide-result guide-result--empty">
        <div className="guide-result-status guide-result-status--empty">
          <span className="guide-result-status-icon" aria-hidden>
            <SearchX size={20} strokeWidth={2.2} />
          </span>
          <div>
            <h2 className="section-title">Aucune correspondance</h2>
            <p className="guide-result-desc">
              Aucun produit ne correspond à vos critères. Modifiez vos réponses ou
              contactez Xeilom pour un conseil personnalisé.
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
  const cartItemCount = 1 + selectedAccessoryIds.length;
  const cartLabel =
    selectedAccessoryIds.length > 0
      ? `Ajouter au panier · ${cartItemCount} article${cartItemCount > 1 ? "s" : ""}`
      : "Ajouter au panier";

  return (
    <section className="panel guide-result">
      <div className="guide-result-status">
        <span className="guide-result-status-icon" aria-hidden>
          <BadgeCheck size={20} strokeWidth={2.2} />
        </span>
        <div className="guide-result-status-text">
          <h2 className="section-title">Votre baie recommandée</h2>
          <p className="guide-result-status-sub">
            Sélectionnée d'après vos critères dans le catalogue Xeilom.
          </p>
        </div>
        <span className="section-badge">Réf. {product.sku}</span>
      </div>

      <div className="guide-result-card">
        {product.imageUrl && (
          <div className="guide-result-visual">
            <img
              src={product.imageUrl}
              alt=""
              className="product-visual"
              loading="lazy"
            />
          </div>
        )}
        <div className="guide-result-content">
          <h3>{product.name}</h3>
          {product.description && <p>{product.description}</p>}
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

      {groupAccessories && (
        <GuideAccessories
          accessories={accessories}
          selectedAccessoryIds={selectedAccessoryIds}
          onToggleAccessory={onToggleAccessory}
          groupAccessories={groupAccessories}
        />
      )}

      <div className="guide-result-actions">
        <button
          type="button"
          className="btn primary guide-result-cart"
          onClick={onAddToCart}
          disabled={isLoading}
        >
          <ShoppingCart size={16} aria-hidden />
          {isLoading ? "Ajout en cours…" : cartLabel}
        </button>
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
    </section>
  );
}
