import { renderAttractionBoard } from '../modules/atracciones/board.js';
import { renderAttractionDetail } from '../modules/atracciones/detail.js';
import { getSettings, updateSettings } from '../state/index.js';
import { playTap } from '../audio/engine.js';

/**
 * @param {{ section: string, param: string|null }} route
 * @returns {{ el: HTMLElement, destroy: () => void }}
 */
export function renderAtracciones(route) {
  if (route?.param) {
    return renderAttractionDetail(route.param);
  }

  const base = import.meta.env.BASE_URL || '/';
  const settings = getSettings();
  const el = document.createElement('div');
  el.className = 'view view--atracciones';

  const hero640 = `${base}assets/hero/hero-parque-640.webp`;
  const heroFull = `${base}assets/hero/hero-parque.webp`;

  el.innerHTML = `
    <div class="hero">
      <img
        class="hero__img"
        src="${hero640}"
        srcset="${hero640} 640w, ${heroFull} 1600w"
        sizes="(max-width: 480px) 360px, 640px"
        width="640"
        height="357"
        alt="Bienvenido al parque AstroPark en Xenon-9"
        decoding="async"
      />
      <div class="hero__scrim"></div>
      <div class="hero__copy">
        <h1 class="hero__title">Bienvenido a Xenon-9</h1>
        <p class="hero__sub">Parque de física · 5 atracciones</p>
      </div>
    </div>
    ${
      settings.welcomeDismissed
        ? ''
        : `<aside class="onboard" data-onboard>
      <p><strong>Bienvenido a Xenon-9.</strong> Este parque enseña física de tu primer parcial: lees poco, tocas el sim, ganas estrellas y sales con un reporte para tu profe.</p>
      <button type="button" class="btn btn-primary" data-dismiss-onboard>Entrar al parque</button>
    </aside>`
    }
    <header class="view-header view-header--compact">
      <h2 class="view-header__title"><span class="brand-dot" aria-hidden="true"></span>Atracciones</h2>
      <p class="view-header__subtitle">Elige un alien y su concepto</p>
    </header>
    <div class="view-body" data-board></div>
  `;
  el.querySelector('[data-board]')?.appendChild(renderAttractionBoard());
  el.querySelector('[data-dismiss-onboard]')?.addEventListener('click', () => {
    playTap();
    updateSettings({ welcomeDismissed: true });
    el.querySelector('[data-onboard]')?.remove();
  });
  return { el, destroy() {} };
}
