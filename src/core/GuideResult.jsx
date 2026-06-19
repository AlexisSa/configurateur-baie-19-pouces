import { ArrowLeft, ExternalLink, RotateCcw, ShoppingCart } from "lucide-react";

/**
 * @param {{
 *   product: import("./types.js").ResolvedProduct | null,
 *   cartStatus: string,
 *   onAddToCart: () => void,
 *   onRestart: () => void,
 *   onBack?: () => void,
 * }} props
 */
export function GuideResult({ product, cartStatus, onAddToCart, onRestart, onBack }) {
  if (!product) {
    return (
      <section className="panel guide-result">
        <div className="panel-header">
          <h2 className="section-title">Aucune correspondance</h2>
          {onBack && (
            <button type="button" className="btn ghost guide-back-btn" onClick={onBack}>
              <ArrowLeft size={16} aria-hidden />
              Retour
            </button>
          )}
        </div>
        <p className="guide-result-desc">
          Aucun produit ne correspond à vos critères. Modifiez vos réponses ou
          contactez Xeilom pour un conseil personnalisé.
        </p>
        <div className="guide-result-actions">
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
      <div className="panel-header">
        <h2 className="section-title">Produit recommandé</h2>
        <div className="guide-result-header-actions">
          <span className="section-badge">Réf. {product.sku}</span>
          {onBack && (
            <button type="button" className="btn ghost guide-back-btn" onClick={onBack}>
              <ArrowLeft size={16} aria-hidden />
              Retour
            </button>
          )}
        </div>
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

      <div className="guide-result-actions">
        <button
          type="button"
          className="btn primary"
          onClick={onAddToCart}
          disabled={isLoading}
        >
          <ShoppingCart size={16} aria-hidden />
          {isLoading ? "Ajout en cours…" : "Ajouter au panier"}
        </button>
        <button type="button" className="btn ghost" onClick={onRestart}>
          <RotateCcw size={16} aria-hidden />
          Recommencer
        </button>
      </div>
    </section>
  );
}
