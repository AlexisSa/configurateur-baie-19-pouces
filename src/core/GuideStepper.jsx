import { Check } from "lucide-react";

/**
 * @param {{
 *   steps: import("./types.js").GuideStep[],
 *   answers: Record<string, string>,
 *   stepIndex: number,
 *   isComplete: boolean,
 *   formatAnswer?: (stepId: string, value: string) => string,
 *   onGoToStep: (index: number) => void,
 * }} props
 */
export function GuideStepper({
  steps,
  answers,
  stepIndex,
  isComplete,
  formatAnswer,
  onGoToStep,
}) {
  const format = formatAnswer ?? ((_, value) => value);

  return (
    <nav className="guide-stepper panel" aria-label="Étapes du guide">
      <ol className="guide-stepper-list">
        {steps.map((step, index) => {
          const hasAnswer = Boolean(answers[step.id]);
          const isCompleted = isComplete ? hasAnswer : index < stepIndex;
          const isCurrent = !isComplete && index === stepIndex;
          const isUpcoming = !isComplete && index > stepIndex;
          const canEdit = hasAnswer && (isCompleted || isComplete);

          let statusClass = "guide-stepper-item--upcoming";
          if (isCompleted) statusClass = "guide-stepper-item--done";
          if (isCurrent) statusClass = "guide-stepper-item--current";

          return (
            <li
              key={step.id}
              className={`guide-stepper-item ${statusClass}`}
              aria-current={isCurrent ? "step" : undefined}
            >
              <span className="guide-stepper-marker" aria-hidden>
                {isCompleted ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  index + 1
                )}
              </span>

              <div className="guide-stepper-content">
                <span className="guide-stepper-label">
                  {step.recapLabel ?? step.question}
                </span>

                {hasAnswer && (
                  canEdit ? (
                    <button
                      type="button"
                      className="guide-stepper-value"
                      onClick={() => onGoToStep(index)}
                    >
                      {format(step.id, answers[step.id])}
                    </button>
                  ) : (
                    <span className="guide-stepper-value guide-stepper-value--static">
                      {format(step.id, answers[step.id])}
                    </span>
                  )
                )}

                {isCurrent && !hasAnswer && (
                  <span className="guide-stepper-hint">En cours…</span>
                )}

                {isUpcoming && (
                  <span className="guide-stepper-hint guide-stepper-hint--muted">
                    À venir
                  </span>
                )}
              </div>
            </li>
          );
        })}

        <li
          className={`guide-stepper-item guide-stepper-item--result${
            isComplete
              ? " guide-stepper-item--current"
              : " guide-stepper-item--upcoming"
          }`}
          aria-current={isComplete ? "step" : undefined}
        >
          <span className="guide-stepper-marker" aria-hidden>
            {steps.length + 1}
          </span>
          <div className="guide-stepper-content">
            <span className="guide-stepper-label">Résultat</span>
            {isComplete ? (
              <span className="guide-stepper-hint">Produit recommandé</span>
            ) : (
              <span className="guide-stepper-hint guide-stepper-hint--muted">
                À venir
              </span>
            )}
          </div>
        </li>
      </ol>
    </nav>
  );
}
