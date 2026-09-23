import { renderAttractionBoard } from '../modules/atracciones/board.js';
import { renderAttractionDetail } from '../modules/atracciones/detail.js';

/**
 * @param {{ section: string, param: string|null }} route
 * @returns {{ el: HTMLElement, destroy: () => void }}
 */
export function renderAtracciones(route) {
  if (route?.param) {
    return renderAttractionDetail(route.param);
  }

  const el = document.createElement('div');
  el.className = 'view view--atracciones';
  el.innerHTML = `
    <header class="view-header">
      <h1 class="view-header__title"><span class="brand-dot" aria-hidden="true"></span>Atracciones</h1>
      <p class="view-header__subtitle">Parque Xenon-9 · 5 atracciones de física</p>
    </header>
    <div class="view-body" data-board></div>
  `;
  el.querySelector('[data-board]')?.appendChild(renderAttractionBoard());
  return { el, destroy() {} };
}
