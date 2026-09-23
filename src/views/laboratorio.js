import { renderLabList, renderSimView } from '../modules/laboratorio/mount.js';

/**
 * @param {{ section: string, param: string|null }} route
 * @returns {{ el: HTMLElement, destroy: () => void }}
 */
export function renderLaboratorio(route) {
  if (route?.param) return renderSimView(route.param);
  return renderLabList();
}
