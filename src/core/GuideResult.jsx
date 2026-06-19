import {
  ArrowLeft,
  BadgeCheck,
  ExternalLink,
  RotateCcw,
  SearchX,
  ShoppingCart,
} from "lucide-react";

/**
 * @param {{
 *   product: import("./types.js").ResolvedProduct | null,
 *   accessories?: import("./types.js").GuideAccessory[],
 *   selectedAccessoryIds?: string[],
 *   onToggleAccessory?: (id: string) => void,
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

      {accessories.length > 0 && (
        <div className="guide-accessories">
          <h3 className="guide-accessories-title">Options complémentaires</h3>
          <p className="guide-accessories-desc">
            Ajoutez des accessoires compatibles avec votre baie.
          </p>
          <ul className="guide-accessories-list" role="list">
            {accessories.map((accessory) => {
              const selected = selectedAccessoryIds.includes(accessory.id);
              return (
                <li key={accessory.id} className="guide-accessory-item" role="listitem">
                  <label
                    className={`guide-accessory-card${selected ? " guide-accessory-card--selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      className="guide-accessory-check"
                      checked={selected}
                      onChange={() => onToggleAccessory?.(accessory.id)}
                    />
                    {accessory.imageUrl && (
                      <span className="guide-accessory-visual">
                        <img
                          src={accessory.imageUrl}
                          alt=""
                          className="guide-accessory-image"
                          loading="lazy"
                        />
                      </span>
                    )}
                    <span className="guide-accessory-body">
                      <span className="guide-accessory-label">{accessory.label}</span>
                      <span className="guide-accessory-ref">Réf. {accessory.sku}</span>
                      {accessory.description && (
                        <span className="guide-accessory-desc">{accessory.description}</span>
                      )}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="guide-result-actions">
        <button
          type="button"
          className="btn primary guide-result-cart"
          onClick={onAddToCart}
          disabled={isLoading}
        >
          <ShoppingCart size={16} aria-hidden />
          {isLoading ? "Ajout en cours…" : "Ajouter au panier"}
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
