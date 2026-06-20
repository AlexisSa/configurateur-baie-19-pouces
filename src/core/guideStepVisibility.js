/**
 * @param {import("./types.js").GuideStep} step
 * @param {Record<string, string>} answers
 * @param {import("./types.js").CatalogProduct[]} catalog
 * @param {import("./types.js").GuideConfig["isStepVisible"]} isStepVisible
 */
export function isStepVisibleInGuide(step, answers, catalog, isStepVisible) {
  return isStepVisible?.(step.id, answers, catalog) ?? true;
}

/**
 * @param {import("./types.js").GuideStep[]} steps
 * @param {Record<string, string>} answers
 * @param {import("./types.js").CatalogProduct[]} catalog
 * @param {import("./types.js").GuideConfig["isStepVisible"]} isStepVisible
 */
export function getVisibleGuideSteps(steps, answers, catalog, isStepVisible) {
  return steps
    .map((step, index) => ({ step, index }))
    .filter(({ step }) =>
      isStepVisibleInGuide(step, answers, catalog, isStepVisible),
    );
}
