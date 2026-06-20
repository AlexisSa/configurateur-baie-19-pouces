import { useEffect, useRef } from "react";

/**
 * Déplace le focus sur un titre quand la clé change (après le premier rendu).
 * Améliore la navigation clavier / lecteur d'écran lors des transitions d'étape,
 * sans voler le focus au montage initial ni provoquer de saut de défilement.
 *
 * @param {unknown} key - valeur qui déclenche le focus lorsqu'elle change.
 * @param {{ focusOnMount?: boolean }} [options] - focaliser dès le montage
 *   (utile quand le titre correspond à une nouvelle vue qui apparaît).
 * @returns {import("react").RefObject<HTMLElement>}
 */
export function useHeadingFocus(key, { focusOnMount = false } = {}) {
  const ref = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (!focusOnMount) return;
    }
    ref.current?.focus({ preventScroll: true });
  }, [key, focusOnMount]);

  return ref;
}
