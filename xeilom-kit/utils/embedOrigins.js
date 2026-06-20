export const EMBED_PARENT_ORIGINS = [
  "https://www.xeilom.fr",
  "https://xeilom.fr",
];

/**
 * @returns {string[]}
 */
export function getAllowedEmbedOrigins() {
  const origins = new Set(EMBED_PARENT_ORIGINS);

  try {
    if (document.referrer) {
      origins.add(new URL(document.referrer).origin);
    }
  } catch {
    // referrer invalide
  }

  return [...origins];
}

/**
 * Origines acceptées comme cibles d'envoi (postMessage sortant).
 * Plus permissif (referrer inclus) car aucune donnée sensible n'est émise.
 * @param {string} origin
 * @returns {boolean}
 */
export function isAllowedEmbedOrigin(origin) {
  if (import.meta.env.DEV) return true;
  return getAllowedEmbedOrigins().includes(origin);
}

/**
 * Origines de confiance pour les messages entrants sensibles (tarif client).
 * Strictement limitée à Xeilom : on ne fait jamais confiance au referrer ici,
 * sinon n'importe quel site intégrant l'iframe pourrait injecter un tarif.
 * @param {string} origin
 * @returns {boolean}
 */
export function isTrustedParentOrigin(origin) {
  if (import.meta.env.DEV) return true;
  return EMBED_PARENT_ORIGINS.includes(origin);
}
