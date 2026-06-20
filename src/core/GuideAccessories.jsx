import { ExternalLink, Check, Minus, Plus } from "lucide-react";
import { oxatisProductUrl } from "./oxatisUrl.js";
import { formatPriceHT, getLinePrice } from "./guidePricing.js";

/**
 * @param {{
 *   accessories: import("./types.js").GuideAccessory[],
 *   selectedAccessoryIds: string[],
 *   accessoryQuantities?: Record<string, number>,
 *   onToggleAccessory?: (id: string) => void,
 *   onAccessoryQuantityChange?: (id: string, quantity: number) => void,
 *   groupAccessories: (accessories: import("./types.js").GuideAccessory[]) => Array<{
 *     id: string,
 *     label: string,
 *     hint: string | null,
 *     items: import("./types.js").GuideAccessory[],
 *   }>,
 *   pricingTierCode?: string,
 * }} props
 */
export function GuideAccessories({
  accessories,
  selectedAccessoryIds,
  accessoryQuantities = {},
  onToggleAccessory,
  onAccessoryQuantityChange,
  groupAccessories,
  pricingTierCode = "S",
}) {
  if (!accessories.length) return null;

  const groups = groupAccessories(accessories);
  const selectedCount = selectedAccessoryIds.length;

  return (
    <div className="guide-accessories">
      <header className="guide-accessories-head">
        <div>
          <h3 className="guide-accessories-title">Options complémentaires</h3>
          <p className="guide-accessories-desc">
            Facultatif — personnalisez votre commande avant l&apos;ajout au panier.
          </p>
        </div>
        {selectedCount > 0 && (
          <span className="guide-accessories-count">
            {selectedCount} sélectionnée{selectedCount > 1 ? "s" : ""}
          </span>
        )}
      </header>

      {groups.map((group) => (
        <section key={group.id} className="guide-accessories-group" aria-label={group.label}>
          <h4 className="guide-accessories-group-title">{group.label}</h4>
          {group.hint && <p className="guide-accessories-group-hint">{group.hint}</p>}
          <ul className="guide-accessories-list" role="list">
            {group.items.map((accessory) => {
              const selected = selectedAccessoryIds.includes(accessory.id);
              const quantity = accessoryQuantities[accessory.id] ?? 1;
              const maxQuantity = accessory.maxQuantity ?? 1;
              const canChangeQuantity = maxQuantity > 1;
              const price = getLinePrice(accessory.sku, quantity, pricingTierCode);

              return (
                <li
                  key={accessory.id}
                  className={`guide-accessory-item${selected ? " guide-accessory-item--selected" : ""}`}
                  role="listitem"
                >
                  <div
                    className={`guide-accessory-card${canChangeQuantity ? "" : " guide-accessory-card--no-qty"}`}
                  >
                    <button
                      type="button"
                      className="guide-accessory-toggle"
                      onClick={() => onToggleAccessory?.(accessory.id)}
                      aria-pressed={selected}
                      aria-label={`${selected ? "Retirer" : "Ajouter"} ${accessory.label}`}
                    >
                      <span
                        className={`guide-accessory-marker${selected ? " guide-accessory-marker--on" : ""}`}
                        aria-hidden
                      >
                        {selected && <Check size={13} strokeWidth={3} />}
                      </span>

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
                        <span className="guide-accessory-meta">
                          <span className="guide-accessory-ref">Réf. {accessory.sku}</span>
                          {accessory.description && (
                            <span className="guide-accessory-desc">{accessory.description}</span>
                          )}
                        </span>
                        {price.unitPriceHT != null && (
                          <span className="guide-accessory-price">
                            {formatPriceHT(price.unitPriceHT)} HT
                            {quantity > 1 && price.lineTotalHT != null && (
                              <> · {formatPriceHT(price.lineTotalHT)} total</>
                            )}
                          </span>
                        )}
                      </span>
                    </button>

                    {accessory.productId && (
                      <a
                        href={oxatisProductUrl(accessory.productId)}
                        className="guide-accessory-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Fiche
                        <ExternalLink size={11} aria-hidden />
                      </a>
                    )}

                    {canChangeQuantity && (
                      <div
                        className={`guide-accessory-qty-bar${selected ? " guide-accessory-qty-bar--visible" : ""}`}
                        aria-hidden={!selected}
                      >
                        <span className="guide-accessory-qty-label">Quantité</span>
                        <div
                          className="guide-accessory-qty"
                          onClick={(event) => event.stopPropagation()}
                          onKeyDown={(event) => event.stopPropagation()}
                        >
                          <button
                            type="button"
                            className="guide-accessory-qty-btn"
                            onClick={() =>
                              onAccessoryQuantityChange?.(accessory.id, quantity - 1)
                            }
                            disabled={!selected || quantity <= 1}
                            tabIndex={selected ? 0 : -1}
                            aria-label="Diminuer la quantité"
                          >
                            <Minus size={12} aria-hidden />
                          </button>
                          <span className="guide-accessory-qty-value" aria-live="polite">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            className="guide-accessory-qty-btn"
                            onClick={() =>
                              onAccessoryQuantityChange?.(accessory.id, quantity + 1)
                            }
                            disabled={!selected || quantity >= maxQuantity}
                            tabIndex={selected ? 0 : -1}
                            aria-label="Augmenter la quantité"
                          >
                            <Plus size={12} aria-hidden />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
