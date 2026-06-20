import { useCallback, useMemo, useState } from "react";
import { findNextStepIndex, findPreviousStepIndex } from "./guideNavigation.js";

/**
 * @param {import("./types.js").GuideConfig} config
 * @param {import("./types.js").CatalogProduct[]} catalog
 */
export function useGuideState(config, catalog) {
  const stepIds = useMemo(
    () => config.steps.map((step) => step.id),
    [config.steps],
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentStep = config.steps[stepIndex] ?? null;
  const isComplete = stepIndex >= config.steps.length;

  const previousStepIndex = useMemo(
    () =>
      findPreviousStepIndex(
        stepIndex,
        config.steps,
        answers,
        catalog,
        config.getStepOptions,
      ),
    [answers, catalog, config.getStepOptions, config.steps, stepIndex],
  );

  const canGoBack = previousStepIndex >= 0 && !isComplete;

  const progress = useMemo(() => {
    if (!config.steps.length) return 0;
    if (isComplete) return 100;
    return Math.round((stepIndex / config.steps.length) * 100);
  }, [config.steps.length, isComplete, stepIndex]);

  const selectOption = useCallback(
    (value) => {
      if (!currentStep) return;
      const currentIdx = stepIds.indexOf(currentStep.id);
      const nextAnswers = { ...answers, [currentStep.id]: value };

      for (let i = currentIdx + 1; i < stepIds.length; i += 1) {
        delete nextAnswers[stepIds[i]];
      }

      setAnswers(nextAnswers);
      setStepIndex(
        findNextStepIndex(
          currentIdx,
          config.steps,
          nextAnswers,
          catalog,
          config.getStepOptions,
        ),
      );
    },
    [
      answers,
      catalog,
      config.getStepOptions,
      config.steps,
      currentStep,
      stepIds,
    ],
  );

  const goToStep = useCallback(
    (index) => {
      if (index < 0 || index >= config.steps.length) return;
      setAnswers((prev) => {
        const next = { ...prev };
        for (let i = index + 1; i < stepIds.length; i += 1) {
          delete next[stepIds[i]];
        }
        return next;
      });
      setStepIndex(index);
    },
    [config.steps.length, stepIds],
  );

  const goBack = useCallback(() => {
    if (!canGoBack) return;
    goToStep(previousStepIndex);
  }, [canGoBack, goToStep, previousStepIndex]);

  const skipStep = useCallback(() => {
    setStepIndex((index) =>
      findNextStepIndex(
        index,
        config.steps,
        answers,
        catalog,
        config.getStepOptions,
      ),
    );
  }, [answers, catalog, config.getStepOptions, config.steps]);

  const restart = useCallback(() => {
    setStepIndex(0);
    setAnswers({});
  }, []);

  return {
    stepIndex,
    currentStep,
    answers,
    isComplete,
    canGoBack,
    progress,
    selectOption,
    goBack,
    goToStep,
    skipStep,
    restart,
  };
}
