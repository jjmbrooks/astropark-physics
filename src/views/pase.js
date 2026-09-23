/**
 * Placeholder F2 — Mi Pase completo en F5.
 * @returns {{ el: HTMLElement, destroy: () => void }}
 */
export function renderPase() {
  const el = document.createElement('div');
  el.className = 'view view--pase';
  el.innerHTML = `
    <header class="view-header">
      <h1 class="view-header__title"><span class="brand-dot" aria-hidden="true"></span>Mi Pase</h1>
      <p class="view-header__subtitle">Progreso y reporte · F5</p>
    </header>
    <div class="view-body">
      <div class="placeholder-card">
        <p><strong>Próximamente.</strong> Estrellas, export y reset. El progreso de atracciones ya se guarda en localStorage.</p>
      </div>
    </div>
  `;
  return { el, destroy() {} };
}
