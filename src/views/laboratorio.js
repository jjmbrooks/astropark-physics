/**
 * Placeholder F2 — lista real llega en F3.
 * @returns {{ el: HTMLElement, destroy: () => void }}
 */
export function renderLaboratorio() {
  const el = document.createElement('div');
  el.className = 'view view--laboratorio';
  el.innerHTML = `
    <header class="view-header">
      <h1 class="view-header__title"><span class="brand-dot" aria-hidden="true"></span>Laboratorio</h1>
      <p class="view-header__subtitle">Sims Canvas · llegan en F3+</p>
    </header>
    <div class="view-body">
      <div class="placeholder-card">
        <p><strong>Próximamente.</strong> Lista de simuladores. Los CTAs de atracciones ya apuntan a las rutas del lab.</p>
      </div>
    </div>
  `;
  return { el, destroy() {} };
}
