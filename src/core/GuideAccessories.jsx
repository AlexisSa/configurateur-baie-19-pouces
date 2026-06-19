import { ExternalLink, Check } from "lucide-react";

/**
 * @param {{
 *   accessories: import("./types.js").GuideAccessory[],
 *   selectedAccessoryIds: string[],
 *   onToggleAccessory?: (id: string) => void,
 *   groupAccessories: (accessories: import("./types.js").GuideAccessory[]) => Array<{
 *     id: string,
 *     label: string,
 *     hint: string | null,
 *     items: import("./types.js").GuideAccessory[],
 *   }>,
 * }} props
 */
export function GuideAccessories({
  accessories,
  selectedAccessoryIds,
  onToggleAccessory,
  groupAccessories,
}) {
  if (!accessories.length) return null;

  const groups = groupAccessories(accessories);
  const selectedCount = selectedAccessoryIds.length;

  return (
    <div className="guide-accessories">
      <div className="guide-accessories-head">
        <div>
          <h3 className="guide-accessories-title">Options complémentaires</h3>
          <p className="guide-accessories-desc">
            Cliquez sur une option pour l&apos;ajouter à votre commande.
          </p>
        </div>
        {selectedCount > 0 && (
          <span className="guide-accessories-count">
            {selectedCount} sélectionnée{selectedCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {groups.map((group) => (
        <section key={group.id} className="guide-accessories-group" aria-label={group.label}>
          <h4 className="guide-accessories-group-title">{group.label}</h4>
          {group.hint && <p className="guide-accessories-group-hint">{group.hint}</p>}
          <ul className="guide-accessories-list" role="list">
            {group.items.map((accessory) => {
              const selected = selectedAccessoryIds.includes(accessory.id);
              return (
                <li key={accessory.id} className="guide-accessory-item" role="listitem">
                  <div
                    className={`guide-accessory-card${selected ? " guide-accessory-card--selected" : ""}`}
                  >
                    <button
                      type="button"
                      className="guide-accessory-main"
                      onClick={() => onToggleAccessory?.(accessory.id)}
                      aria-pressed={selected}
                      aria-label={`${selected ? "Retirer" : "Ajouter"} ${accessory.label}`}
                    >
                      <span
                        className={`guide-accessory-marker${selected ? " guide-accessory-marker--on" : ""}`}
                        aria-hidden
                      >
                        {selected && <Check size={14} strokeWidth={3} />}
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
                        <span className="guide-accessory-ref">Réf. {accessory.sku}</span>
                        {accessory.description && (
                          <span className="guide-accessory-desc">{accessory.description}</span>
                        )}
                      </span>
                    </button>
                    {accessory.productUrl && (
                      <a
                        href={accessory.productUrl}
                        className="guide-accessory-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Fiche produit
                        <ExternalLink size={12} aria-hidden />
                      </a>
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
