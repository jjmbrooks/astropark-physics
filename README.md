# AstroPark Physics

SPA educativa **100% mobile-first** ambientada en el parque de diversiones del planeta **Xenon-9**. Aliens entrañables enseñan **mecánica clásica** y **astrofísica básica** con atracciones, simuladores y mini-juegos arcade.

> **Estado: F0–F6 implementados.** Atracciones, 4 sims Canvas, 3 juegos, Mi Pase + export. Deploy Pages vía GitHub Actions.

## URL en vivo

**https://jjmbrooks.github.io/astropark-physics/**

Si la URL aún no carga tras el primer push de Actions: activa **Settings → Pages → Source = GitHub Actions** (o corre el comando `gh` documentado abajo).


## Roles y orquestación

Jerarquía **Brooks → NexIA → Codelius → Runica**. Mapa de perfiles (aguilar, disenador, storyteller, creativo/melody, Mediateca, Inge) y delegación Kanban: [`docs/08-ROLES.md`](docs/08-ROLES.md).

## Para quién

| Aspecto | Valor |
|--------|--------|
| Público | Estudiantes de preparatoria (~15–18 años) |
| Materia | Física: MRU, F=ma, trabajo, masa vs peso, gravedad, Kepler cualitativo |
| Plataformas | iOS Safari, Android Chrome (ancho mínimo **360px**) |
| Deploy | Estático: **GitHub Pages** (`base: '/astropark-physics/'`) |

## Stack (bloqueado)

| Capa | Elección |
|------|----------|
| Build | **Vite** |
| UI | HTML + **Tailwind CSS** (plugin Vite) |
| Lógica | **JavaScript ES6+** — sin React |
| Sims / juegos | **Canvas 2D** + rAF (mount/unmount limpio) |
| Routing | Hash router (`#/atracciones`, …) |
| Estado | `localStorage` namespaced `astropark.*` |

## Cómo correr

```bash
npm install
npm run dev      # http://localhost:5173/astropark-physics/
npm run build    # sale a dist/
npm run preview  # previsualiza el build
```

## Navegación

1. **Atracciones** — board de 5 + detalle (teoría / fórmulas)  
2. **Laboratorio** — 4 simuladores Canvas  
3. **Zona Arcade** — 3 mini-juegos  
4. **Mi Pase** — progreso, export texto, reset  

## Contenido (IDs)

| Tipo | IDs |
|------|-----|
| Atracciones | `zorp`, `grog`, `kiki`, `nebu`, `tiki-tok` |
| Sims | `sim-zorp-inercia`, `sim-grog-empuje`, `sim-kiki-balanza`, `sim-nebu-caida` |
| Juegos | `game-zorp-dash`, `game-grog-push`, `game-orbit-hop` |

**g Xenon-9 = 7.5 m/s²** (también Tierra 9.8, Luna 1.6, Júpiter 24.8).

## Documentación

| # | Archivo |
|---|---------|
| 01 | [`docs/01-VISION.md`](docs/01-VISION.md) |
| 02 | [`docs/02-SPEC-PRODUCTO.md`](docs/02-SPEC-PRODUCTO.md) |
| 03 | [`docs/03-CONTENIDO.md`](docs/03-CONTENIDO.md) |
| 04 | [`docs/04-ARQUITECTURA.md`](docs/04-ARQUITECTURA.md) |
| 05 | [`docs/05-DECISIONES.md`](docs/05-DECISIONES.md) |
| 06 | [`docs/06-ROADMAP.md`](docs/06-ROADMAP.md) |
| 07 | [`docs/07-HANDOFF.md`](docs/07-HANDOFF.md) |

Agentes: [`AGENTS.md`](AGENTS.md).

## GitHub Pages (Actions)

**Pages ya está habilitado** (`build_type=workflow`) → URL esperada:
https://jjmbrooks.github.io/astropark-physics/

El workflow oficial está en plantilla (el token del bot **no** tiene scope `workflow` para pushear `.github/workflows/`):

- Plantilla: [`docs/github-pages.workflow.yml`](docs/github-pages.workflow.yml)

### Brooks — activar el deploy (una vez)

```bash
# 1) Ampliar scope del token gh
gh auth refresh -h github.com -s workflow

# 2) Instalar el workflow y pushear
mkdir -p .github/workflows
cp docs/github-pages.workflow.yml .github/workflows/pages.yml
git add .github/workflows/pages.yml
git commit -m "F6: GitHub Pages Actions workflow"
git push origin main
```

Alternativa UI: **Settings → Pages → Source: GitHub Actions**, luego crear `.github/workflows/pages.yml` pegando el contenido de `docs/github-pages.workflow.yml`.

Tras el primer run verde de **Deploy GitHub Pages**, la URL queda viva.

## Licencia

[MIT](LICENSE) — Copyright © 2026 Jhonatan Jesús Martínez Brooks / jjmbrooks.

## Repo

- https://github.com/jjmbrooks/astropark-physics  
- `git clone https://github.com/jjmbrooks/astropark-physics.git`
