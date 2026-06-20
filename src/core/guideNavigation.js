/**
 * @param {import("./types.js").GuideStep} step
 * @param {Record<string, string>} answers
 * @param {import("./types.js").CatalogProduct[]} catalog
 * @param {import("./types.js").GuideConfig["getStepOptions"]} getStepOptions
 */
function getStepOptionCount(step, answers, catalog, getStepOptions) {
  const options = getStepOptions?.(step.id, answers, catalog) ?? step.options;
  return options.length;
}

/**
 * Une étape est traversable si elle propose au moins une option au moment de la navigation.
 *
 * @param {number} index
 * @param {import("./types.js").GuideStep[]} steps
 * @param {Record<string, string>} answers
 * @param {import("./types.js").CatalogProduct[]} catalog
 * @param {import("./types.js").GuideConfig["getStepOptions"]} getStepOptions
 */
export function isReachableStepIndex(
  index,
  steps,
  answers,
  catalog,
  getStepOptions,
) {
  if (index < 0 || index >= steps.length) return false;
  return getStepOptionCount(steps[index], answers, catalog, getStepOptions) > 0;
}

/**
 * @param {number} currentIndex
 * @param {import("./types.js").GuideStep[]} steps
 * @param {Record<string, string>} answers
 * @param {import("./types.js").CatalogProduct[]} catalog
 * @param {import("./types.js").GuideConfig["getStepOptions"]} getStepOptions
 * @returns {number}
 */
export function findPreviousStepIndex(
  currentIndex,
  steps,
  answers,
  catalog,
  getStepOptions,
) {
  for (let index = currentIndex - 1; index >= 0; index -= 1) {
    if (isReachableStepIndex(index, steps, answers, catalog, getStepOptions)) {
      return index;
    }
  }
  return -1;
}

/**
 * @param {import("./types.js").GuideStep[]} steps
 * @param {Record<string, string>} answers
 * @param {import("./types.js").CatalogProduct[]} catalog
 * @param {import("./types.js").GuideConfig["getStepOptions"]} getStepOptions
 * @returns {number}
 */
export function findLastReachableStepIndex(
  steps,
  answers,
  catalog,
  getStepOptions,
) {
  for (let index = steps.length - 1; index >= 0; index -= 1) {
    if (isReachableStepIndex(index, steps, answers, catalog, getStepOptions)) {
      return index;
    }
  }
  return -1;
}

/**
 * @param {number} currentIndex
 * @param {import("./types.js").GuideStep[]} steps
 * @param {Record<string, string>} answers
 * @param {import("./types.js").CatalogProduct[]} catalog
 * @param {import("./types.js").GuideConfig["getStepOptions"]} getStepOptions
 * @returns {number}
 */
export function findNextStepIndex(
  currentIndex,
  steps,
  answers,
  catalog,
  getStepOptions,
) {
  for (let index = currentIndex + 1; index < steps.length; index += 1) {
    if (isReachableStepIndex(index, steps, answers, catalog, getStepOptions)) {
      return index;
    }
  }
  return steps.length;
}
