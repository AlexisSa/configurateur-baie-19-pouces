/**
 * @typedef {Object} GuideOption
 * @property {string} value
 * @property {string} label
 * @property {string} [description]
 */

/**
 * @typedef {Object} GuideStep
 * @property {string} id
 * @property {string} question
 * @property {string} [recapLabel]
 * @property {string} [description]
 * @property {GuideOption[]} options
 */

/**
 * @typedef {Object} CatalogProduct
 * @property {number} productId
 * @property {string} sku
 * @property {string} name
 * @property {string} categoryPath
 * @property {string} family
 * @property {"kit"|"montee"|null} [mounting]
 * @property {string} productUrl
 * @property {string|null} imageUrl
 * @property {{ heightU: number|null, widthMm: number|null, depthMm: number|null }} attrs
 */

/**
 * @typedef {Object} ResolvedProduct
 * @property {number} productId
 * @property {string} sku
 * @property {string} name
 * @property {string} [description]
 * @property {string|null} [imageUrl]
 * @property {string} [productUrl]
 */

/**
 * @typedef {Object} GuideMeta
 * @property {string} id
 * @property {string} title
 * @property {string} [eyebrow]
 */

/**
 * @typedef {Object} GuideConfig
 * @property {GuideMeta} meta
 * @property {GuideStep[]} steps
 * @property {(stepId: string, answers: Record<string, string>, catalog: CatalogProduct[]) => GuideOption[]|null} [getStepOptions]
 * @property {(stepId: string, value: string) => string} [formatAnswer]
 * @property {(answers: Record<string, string>, catalog: CatalogProduct[]) => ResolvedProduct|null} resolveProduct
 */

export {};
