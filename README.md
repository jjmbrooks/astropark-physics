# AstroPark Physics

SPA educativa **100% mobile-first** ambientada en el parque de diversiones del planeta **Xenon-9**. Aliens entrañables enseñan **mecánica clásica** y **astrofísica básica** con atracciones, simuladores y mini-juegos arcade.

> **Estado actual: F0 — definición + esqueleto.** No hay feature SPA aún. La documentación en `docs/` es la fuente de verdad.

## Para quién

| Aspecto | Valor |
|--------|--------|
| Público | Estudiantes de preparatoria (~15–18 años) |
| Materia | Física: MRU, F=ma, trabajo, masa vs peso, gravedad, Kepler cualitativo |
| Plataformas | iOS Safari, Android Chrome (ancho mínimo **360px**) |
| Deploy | Estático: **GitHub Pages** (primario), también Vercel/Netlify |

## Stack decidido (bloqueado)

| Capa | Elección |
|------|----------|
| Build | **Vite** (`package.json` name: `astropark-physics`) |
| UI | HTML + **Tailwind CSS** (plugin Vite en build real; CDN solo para spike temprano) |
| Lógica | **JavaScript ES6+** módulos nativos — **sin React** salvo que la complejidad lo fuerce |
| Sims / juegos | **Canvas 2D** primero; evaluar Phaser solo si hace falta después |
| Routing | Hash router o view switcher simple |
| Estado | Módulo pequeño + `localStorage` namespaced `astropark.*` |
| Deploy | GitHub Pages desde `main` → carpeta `dist/` (Actions) o `gh-pages`; `base: '/astropark-physics/'` |

Detalle y ADRs: [`docs/05-DECISIONES.md`](docs/05-DECISIONES.md).

## Cómo correr (placeholder F0)

Cuando exista `node_modules` (F1+):

```bash
npm install
npm run dev      # http://localhost:5173/astropark-physics/
npm run build    # sale a dist/
npm run preview  # previsualiza el build
```

Hoy `src/main.js` solo imprime un mensaje en consola. **No implementes UI de producto en F0.**

## Navegación de la app (producto)

Barra inferior fija (bottom nav), 4 pestañas:

1. **Atracciones** — teoría / board de 5 atracciones  
2. **Laboratorio** — 4 simuladores Canvas  
3. **Zona Arcade** — 3 mini-juegos  
4. **Mi Pase** — progreso, estrellas, export de reporte  

UX táctil: thumb-zone, botones ≥ **48×48 px**. Spec: [`docs/02-SPEC-PRODUCTO.md`](docs/02-SPEC-PRODUCTO.md).

## Documentación (léela en orden)

| # | Archivo | Contenido |
|---|---------|-----------|
| 01 | [`docs/01-VISION.md`](docs/01-VISION.md) | Visión, público, plataformas, tono Xenon-9 |
| 02 | [`docs/02-SPEC-PRODUCTO.md`](docs/02-SPEC-PRODUCTO.md) | UX mobile-first, bottom nav, requisitos táctiles |
| 03 | [`docs/03-CONTENIDO.md`](docs/03-CONTENIDO.md) | 5 atracciones, fórmulas, sims, 3 juegos |
| 04 | [`docs/04-ARQUITECTURA.md`](docs/04-ARQUITECTURA.md) | Carpetas, módulos, canvas vs DOM, estado, schema LS |
| 05 | [`docs/05-DECISIONES.md`](docs/05-DECISIONES.md) | ADRs (Vite, vanilla, Canvas, Pages, ES modules) |
| 06 | [`docs/06-ROADMAP.md`](docs/06-ROADMAP.md) | Fases F0→F6 con Definition of Done |
| 07 | [`docs/07-HANDOFF.md`](docs/07-HANDOFF.md) | Cómo retomar / trabajar en paralelo |

Instrucciones para agentes/bots: [`AGENTS.md`](AGENTS.md).

## Personajes / atracciones (resumen)

| Alias | Tema | Concepto |
|-------|------|----------|
| **Zorp** | MRU / inercia | Movimiento rectilíneo uniforme |
| **Grog** | F=ma + trabajo | Fuerza, aceleración, W |
| **Kiki** | Masa vs peso | m ≠ peso; g local |
| **Nebu** | Gravedad | Atracción gravitatoria |
| **Tiki & Tok** | Kepler cualitativo | Órbitas / periodos |

Tabla completa: [`docs/03-CONTENIDO.md`](docs/03-CONTENIDO.md).

## Licencia

[MIT](LICENSE) — Copyright © 2026 Jhonatan Jesús Martínez Brooks / jjmbrooks.

## Repo

- HTTPS: https://github.com/jjmbrooks/astropark-physics  
- Clone: `git clone https://github.com/jjmbrooks/astropark-physics.git`
