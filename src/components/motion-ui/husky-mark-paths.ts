/**
 * P6 — the Husky mark's geometry, once.
 *
 * Copied verbatim from `public/brand/icon/husky-mark-orange.svg` so every scene
 * that clips, outlines or draws the mark (hero window, About outline, Contact
 * terminus, and the Creative 2/3 equivalents) shares one source of truth.
 *
 * The source file has a `<path>` (head, muzzle and left jaw) and a `<polygon>`
 * (the right jaw). The polygon is expressed here as path data so both can be fed
 * to `<path d>` and DrawSVG alike.
 */

export const MARK_VIEWBOX = "386 354 308 372";

/** Numeric form of the viewBox, for maths. */
export const MARK_BOX = { x: 386, y: 354, width: 308, height: 372 } as const;

export const MARK_HEAD_D =
  "M561.19,708.43l-42.32-.05-21.55-21.05v-84.74s-30.82-30.26-30.82-30.26l-7.09-24.69,22.05,8.73,8.34,10.67,7.04,9.05,8.14-2.22,9.19,6.94.3-18.74-23.86-23.73-.09-78.32-47.83-55.35-19.65,70.53,6.35,27.08-6.85,20.28,20.45-7.33-27.34,38.51-.04,45.86,49.46,46.88,4.17,25.2-68.6-64.69-.06-59.44,21.95-24.74-15.95-47.65,29.47-103.59,23.88,27.35,45.2,53.21.13,68.69,26.72,26.4-.02,95.8,16.15.1v-95.93s26.73-26.66,26.73-26.66l.04-68.01,69.75-80.8,28.63,104.11-15.65,46.26-7.06-19.81,6.32-26.98-19.28-69.95-48.16,55.36-.05,77.39-23.71,23.75.04,18.82,9.27-6.63c2.73.8,5.97,1.5,8.72,1.12,5.45-5.87,8.95-13.47,15.31-18.22,6.13-4.57,14.3-5.4,21.54-9.34l-7.05,24.67-30.92,30.11v84.73s-21.41,21.29-21.41,21.29ZM547.91,684.13l17.97-19.27-11.77-13.44-27.95.05-12.02,13.52,18.27,19.4,15.5-.27Z";

export const MARK_JAW_D =
  "M610.48,671.84L614.51,646.65L664.37,599.48L664.38,553.59L636.59,515.32L657.77,522.71L679.42,547.5L679.37,606.94L610.48,671.84Z";

/** Both paths, in drawing order. */
export const MARK_PATHS = [MARK_HEAD_D, MARK_JAW_D] as const;

/** The mark's lowest node — where the cable run starts. */
export const MARK_CHIN = { x: 540, y: 708 } as const;

/** Centre of the muzzle. */
export const MARK_MUZZLE = { x: 540, y: 668 } as const;
