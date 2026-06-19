import { useCallback, useMemo, useState } from "react";

/**
 * @param {import("./types.js").GuideConfig} config
 */
export function useGuideState(config) {
  const stepIds = useMemo(
    () => config.steps.map((step) => step.id),
    [config.steps],
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentStep = config.steps[stepIndex] ?? null;
  const isComplete = stepIndex >= config.steps.length;
  const canGoBack = stepIndex > 0 && !isComplete;

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
      setStepIndex((index) => index + 1);
    },
    [answers, currentStep, stepIds],
  );

  const goBack = useCallback(() => {
    if (!canGoBack) return;
    const newIndex = stepIndex - 1;
    setAnswers((prev) => {
      const next = { ...prev };
      for (let i = newIndex + 1; i < stepIds.length; i += 1) {
        delete next[stepIds[i]];
      }
      return next;
    });
    setStepIndex(newIndex);
  }, [canGoBack, stepIndex, stepIds]);

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

  const skipStep = useCallback(() => {
    setStepIndex((index) => index + 1);
  }, []);

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
