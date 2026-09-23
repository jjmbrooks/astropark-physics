import {
  getProgress,
  getProfile,
  setDisplayName,
  resetProgress,
  ATTRACTION_SLUGS,
  SIM_IDS,
  GAME_IDS,
} from '../../state/index.js';
import { ATTRACTIONS } from '../atracciones/data.js';
import { SIMS } from '../laboratorio/catalog.js';
import { GAMES } from '../arcade/catalog.js';
import { buildClassReport } from './export.js';

/**
 * @returns {{ el: HTMLElement, destroy: () => void }}
 */
export function renderPaseView() {
  const el = document.createElement('div');
  el.className = 'view view--pase';

  function paint() {
    const profile = getProfile();
    const progress = getProgress();

    el.innerHTML = `
      <header class="view-header">
        <h1 class="view-header__title"><span class="brand-dot" aria-hidden="true"></span>Mi Pase</h1>
        <p class="view-header__subtitle">Progreso local · exportar para el docente</p>
      </header>
      <div class="view-body">
        <section class="panel">
          <h2 class="panel__title">Nombre (opcional)</h2>
          <div class="control-row">
            <label for="pase-name">Nombre en el reporte</label>
            <input id="pase-name" type="text" maxlength="40" placeholder="Tu nombre" value="${escapeAttr(profile.displayName || '')}" />
          </div>
          <div class="sim-actions" style="margin-top:0.5rem">
            <button type="button" class="btn btn-secondary" data-save-name>Guardar nombre</button>
          </div>
        </section>

        <section class="panel pase-section">
          <h2 class="panel__title">Atracciones</h2>
          ${ATTRACTION_SLUGS.map((slug) => {
            const meta = ATTRACTIONS.find((a) => a.slug === slug);
            const p = progress.attractions[slug] || { read: false, stars: 0 };
            return `<div class="pase-row"><span>${meta?.emoji || ''} ${meta?.alien || slug}</span><span>${p.read ? 'Leída' : '—'} ${p.stars ? '★'.repeat(p.stars) : ''}</span></div>`;
          }).join('')}
        </section>

        <section class="panel pase-section">
          <h2 class="panel__title">Laboratorio</h2>
          ${SIM_IDS.map((id) => {
            const meta = SIMS.find((s) => s.id === id);
            const p = progress.sims[id] || { stars: 0, bestScore: 0 };
            return `<div class="pase-row"><span>${meta?.emoji || ''} ${meta?.name || id}</span><span>${'★'.repeat(p.stars) || '☆☆☆'} · ${p.bestScore}</span></div>`;
          }).join('')}
        </section>

        <section class="panel pase-section">
          <h2 class="panel__title">Arcade</h2>
          ${GAME_IDS.map((id) => {
            const meta = GAMES.find((g) => g.id === id);
            const p = progress.games[id] || { stars: 0, bestScore: 0 };
            return `<div class="pase-row"><span>${meta?.emoji || ''} ${meta?.name || id}</span><span>${'★'.repeat(p.stars) || '☆☆☆'} · ${p.bestScore}/100</span></div>`;
          }).join('')}
        </section>

        <section class="panel">
          <h2 class="panel__title">Exportar reporte</h2>
          <textarea class="export-box" data-export readonly aria-label="Reporte de clase">${escapeHtml(buildClassReport())}</textarea>
          <div class="sim-actions" style="margin-top:0.75rem">
            <button type="button" class="btn btn-primary" data-copy>Copiar reporte</button>
          </div>
          <p class="text-muted" data-copy-status style="margin-top:0.5rem" aria-live="polite"></p>
        </section>

        <section class="panel">
          <h2 class="panel__title">Reiniciar progreso</h2>
          <p class="text-muted">Borra atracciones, sims y juegos de este dispositivo.</p>
          <button type="button" class="btn btn-danger" data-reset>Reiniciar progreso</button>
        </section>
      </div>
    `;

    el.querySelector('[data-save-name]')?.addEventListener('click', () => {
      const input = el.querySelector('#pase-name');
      setDisplayName(input?.value || '');
      paint();
    });

    el.querySelector('[data-copy]')?.addEventListener('click', async () => {
      const text = buildClassReport();
      const status = el.querySelector('[data-copy-status]');
      try {
        await navigator.clipboard.writeText(text);
        if (status) status.textContent = '✓ Copiado al portapapeles';
      } catch {
        const box = el.querySelector('[data-export]');
        box?.select();
        if (status) status.textContent = 'Selecciona el texto y copia manualmente (Ctrl/Cmd+C)';
      }
    });

    el.querySelector('[data-reset]')?.addEventListener('click', () => {
      const ok = window.confirm(
        '¿Reiniciar todo el progreso de AstroPark en este dispositivo? No se puede deshacer.',
      );
      if (!ok) return;
      resetProgress();
      paint();
    });
  }

  paint();
  return { el, destroy() {} };
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(s) {
  return escapeHtml(s).replace(/"/g, '&quot;');
}
