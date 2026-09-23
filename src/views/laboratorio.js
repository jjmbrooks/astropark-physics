/** Placeholder view — Laboratorio (F1 shell only). */
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
        <p><strong>Placeholder F1.</strong> Lista de simuladores. Sin sims ni canvas todavía.</p>
      </div>
    </div>
  `;
  return el;
}
