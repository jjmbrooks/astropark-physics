# 05 — Decisiones (ADRs)

Formato: contexto → decisión → consecuencias. Cambiar solo con ADR nuevo + nota en este archivo.

---

## ADR-001 — Vite como bundler/dev server

- **Estado:** Aceptada (F0)
- **Contexto:** Necesitamos ES modules, HMR, build estático para Pages, `base` configurable.
- **Decisión:** Usar **Vite** (`astropark-physics` en `package.json`).
- **Consecuencias:** Scripts `dev` / `build` / `preview`. Node requerido solo para desarrollo/build, no en runtime del alumno.

## ADR-002 — HTML + Tailwind + vanilla JS (sin React)

- **Estado:** Aceptada (F0)
- **Contexto:** Deploy estático en aula; complejidad UI = 4 tabs + canvas; minimizar curva para bots/estudiantes que lean el código.
- **Decisión:** **Vanilla JS ES modules** + HTML + **Tailwind CSS**. Preferir plugin Vite de Tailwind para build real; CDN Tailwind solo para spike ultra-temprano (no dejar CDN en producción).
- **Consecuencias:** Sin JSX ni VDOM. Componentización = funciones `render*()` / custom elements ligeros si hace falta. Si la complejidad de estado UI explota, abrir ADR-00X React/Preact — **no** por defecto.

## ADR-003 — Canvas 2D primero (sin Phaser hasta necesidad)

- **Estado:** Aceptada (F0)
- **Contexto:** 4 sims + 3 juegos 2D simples; Phaser añade peso y API a aprender.
- **Decisión:** Implementar sims/juegos con **Canvas 2D + rAF**. Evaluar Phaser solo si hay colisiones complejas, atlas, audio pipeline, o productividad claramente superior.
- **Consecuencias:** Más código propio de loop/input; bundle más liviano; control total del ciclo mount/unmount.

## ADR-004 — Hash router / view switcher

- **Estado:** Aceptada (F0)
- **Contexto:** GitHub Project Pages no reescribe rutas a `index.html` sin config extra.
- **Decisión:** **Hash routing** (`#/atracciones`, …) o switcher equivalente basado en hash.
- **Consecuencias:** URLs feíllas pero robustas; deep-link funciona; no necesita `404.html` hack.

## ADR-005 — Estado en módulo + `localStorage` namespaced

- **Estado:** Aceptada (F0)
- **Contexto:** Sin backend; el docente necesita progreso exportable, no cuentas.
- **Decisión:** Módulo `src/state/` con API clara; claves **`astropark.*`**; schema versionado (`astropark.version`).
- **Consecuencias:** Progreso por dispositivo/navegador; limpiar datos del sitio borra progreso; export texto/QR mitiga eso para la clase.

## ADR-006 — Deploy primario: GitHub Pages con Vite `base`

- **Estado:** Aceptada (F0)
- **Contexto:** Repo `jjmbrooks/astropark-physics` → URL `https://jjmbrooks.github.io/astropark-physics/`.
- **Decisión:**
  1. `vite.config.js` → `base: '/astropark-physics/'`.
  2. Build produce `dist/`.
  3. **Enfoque elegido:** GitHub Actions en F6 publica `dist` a **GitHub Pages** (artifact / `peaceiris/actions-gh-pages` o `actions/upload-pages-artifact` + `actions/deploy-pages`).
  4. Alternativas válidas documentadas: branch `gh-pages`, o carpeta `/docs` (no preferida con Vite).
- **Consecuencias:** Assets rotos si alguien olvida el `base`. Vercel/Netlify siguen siendo opciones (allí `base` puede ser `'/'` con override — documentar al cambiar).

## ADR-007 — ES modules nativos

- **Estado:** Aceptada (F0)
- **Contexto:** Navegadores objetivo (Chrome/Safari modernos) soportan `type="module"`.
- **Decisión:** `"type": "module"` en `package.json`; imports relativos/absolutos vía Vite.
- **Consecuencias:** Sin CommonJS en src. Tests futuros con runner ESM-friendly.

## ADR-008 — Licencia MIT

- **Estado:** Aceptada (F0)
- **Contexto:** Preferencia de Brooks no especificada distinta; MIT es estándar para material educativo open.
- **Decisión:** **MIT**, copyright **Jhonatan Jesús Martínez Brooks / jjmbrooks 2026**.
- **Consecuencias:** Reutilizable con atribución; cambiar a otra licencia requiere commit explícito de Brooks.

## ADR-009 — Idioma de producto y docs: español

- **Estado:** Aceptada (F0)
- **Decisión:** UI copy y `docs/` en **español**. Identifiers de código en inglés o slug ASCII (`sim-zorp-inercia`, ok).
- **Consecuencias:** Commits pueden ser ES/EN; mensajes de agente a Brooks en español cuando el canal lo sea.

---

## Registro de cambios de ADR

| Fecha | ADR | Nota |
|-------|-----|------|
| 2026-09-22 | 001–009 | Creación F0 |
