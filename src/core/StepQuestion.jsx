import { ArrowLeft, Check } from "lucide-react";

/**
 * @param {{
 *   step: import("./types.js").GuideStep,
 *   selectedValue?: string,
 *   onSelect: (value: string) => void,
 *   onBack?: () => void,
 *   canGoBack?: boolean,
 * }} props
 */
export function StepQuestion({ step, selectedValue, onSelect, onBack, canGoBack }) {
  const hasImages = step.options.some((option) => option.imageUrl);
  const hasDescriptions = step.options.some((option) => option.description);

  let variant = step.tileVariant ?? "value";
  if (!step.tileVariant) {
    if (hasImages) variant = "visual";
    else if (hasDescriptions) variant = "text";
  }

  return (
    <section className="panel guide-step">
      <div className="panel-header">
        <h2 className="section-title">{step.question}</h2>
        {canGoBack && (
          <button type="button" className="btn ghost guide-back-btn" onClick={onBack}>
            <ArrowLeft size={16} aria-hidden />
            Retour
          </button>
        )}
      </div>

      {step.description && (
        <p className="option-group-desc guide-step-desc">{step.description}</p>
      )}

      {!step.options.length && (
        <p className="guide-step-empty">
          Aucune option disponible pour cette combinaison. Revenez en arrière et
          modifiez vos réponses.
        </p>
      )}

      <div className={`option-grid option-grid--${variant}`} role="list">
        {step.options.map((option) => {
          const selected = selectedValue === option.value;
          return (
            <div
              key={option.value}
              className={`option-tile option-tile--${variant}${selected ? " selected" : ""}`}
              role="listitem"
            >
              <button
                type="button"
                className="option-tile-main"
                onClick={() => onSelect(option.value)}
                aria-pressed={selected}
              >
                {selected && (
                  <span className="option-tile-check" aria-hidden>
                    <Check size={14} strokeWidth={3} />
                  </span>
                )}
                {option.imageUrl && (
                  <span className="option-tile-visual">
                    <img
                      className="option-tile-image"
                      src={option.imageUrl}
                      alt={option.label}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                )}
                <span className="option-tile-body">
                  <span className="option-tile-label">{option.label}</span>
                  {option.description && (
                    <span className="option-tile-desc">{option.description}</span>
                  )}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
