/**
 * Masque une image dont la source est cassée, sans casser la mise en page
 * (l'espace réservé reste, l'image devient invisible).
 *
 * @param {import("react").SyntheticEvent<HTMLImageElement>} event
 */
export function hideBrokenImage(event) {
  event.currentTarget.style.visibility = "hidden";
}
