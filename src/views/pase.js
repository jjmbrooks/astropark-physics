import { renderPaseView } from '../modules/pase/view.js';

/**
 * @returns {{ el: HTMLElement, destroy: () => void }}
 */
export function renderPase() {
  return renderPaseView();
}
