/**
 * En-tête persistant du guide : titre + progression globale.
 *
 * @param {{
 *   title?: string,
 *   stepNumber: number,
 *   totalSteps: number,
 *   percent: number,
 *   isComplete: boolean,
 * }} props
 */
export function GuideProgress({
  title,
  stepNumber,
  totalSteps,
  percent,
  isComplete,
}) {
  return (
    <header className="guide-progress">
      <div className="guide-progress-head">
        <div className="guide-progress-titles">
          {title && <h1 className="guide-progress-title">{title}</h1>}
        </div>

        <span className="guide-progress-step">
          {isComplete ? "Résultat" : `Étape ${stepNumber} / ${totalSteps}`}
        </span>
      </div>

      <div
        className="guide-progress-track"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progression du guide"
      >
        <div className="guide-progress-bar" style={{ width: `${percent}%` }} />
      </div>
    </header>
  );
}
