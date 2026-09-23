import { renderArcadeList, renderGameView } from '../modules/arcade/mount.js';

/**
 * @param {{ section: string, param: string|null }} route
 * @returns {{ el: HTMLElement, destroy: () => void }}
 */
export function renderArcade(route) {
  if (route?.param) return renderGameView(route.param);
  return renderArcadeList();
}
