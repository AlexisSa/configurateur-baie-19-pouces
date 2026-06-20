/**
 * @typedef {Object} GuideAccessory
 * @property {string} id
 * @property {number} productId
 * @property {string} sku
 * @property {string} label
 * @property {string} [description]
 * @property {string|null} [imageUrl]
 * @property {string} [productUrl]
 * @property {string[]} compatUsage
 * @property {number} [compatDepthMm]
 * @property {number} [compatMinWidthMm]
 * @property {number} [compatHeightU]
 * @property {"mobilite"|"ventilation"|"fixation"|"alimentation"|"cablage"} [category]
 * @property {string} [exclusiveGroup]
 * @property {number} [maxQuantity]
 */

/**
 * @typedef {Object} GuideOption
 * @property {string} value
 * @property {string} label
 * @property {string} [description]
 * @property {string} [imageUrl]
 */

/**
 * @typedef {Object} GuideStep
 * @property {string} id
 * @property {string} question
 * @property {string} [recapLabel]
 * @property {string} [description]
 * @property {GuideOption[]} options
 * @property {"value"|"text"|"visual"} [tileVariant]
 */

/**
 * @typedef {Object} CatalogProduct
 * @property {number} productId
 * @property {string} sku
 * @property {string} name
 * @property {string} categoryPath
 * @property {string} family
 * @property {"kit"|"montee"|null} [mounting]
 * @property {"fixe"|"sur-pieds"|null} [standType]
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
 * @property {string[]} [configurationSummary]
 * @property {"kit"|"montee"|null} [mounting]
 * @property {"fixe"|"sur-pieds"|null} [standType]
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
 * @property {(answers: Record<string, string>, product: ResolvedProduct|null, catalog: CatalogProduct[]) => GuideAccessory[]} [getAccessories]
 * @property {(accessories: GuideAccessory[]) => Array<{ id: string, label: string, hint: string|null, items: GuideAccessory[] }>} [groupAccessories]
 * @property {(stepId: string, answers: Record<string, string>, catalog: CatalogProduct[]) => GuideOption[]|null} [getStepOptions]
 * @property {(stepId: string, value: string) => string} [formatAnswer]
 * @property {(answers: Record<string, string>, catalog: CatalogProduct[]) => ResolvedProduct|null} resolveProduct
 */

export {};
