# 02 — Spec de producto (UX)

## Principio rector

**Mobile-first absoluto.** Diseñar para el pulgar. Desktop es el mismo layout ensanchado o centrado, no una UI paralela.

## Viewport y layout

| Regla | Valor |
|-------|--------|
| Ancho mínimo soportado | **360 px** |
| Meta viewport | `width=device-width, initial-scale=1, viewport-fit=cover` |
| Safe areas | Respetar `env(safe-area-inset-*)` en notch / home indicator |
| Altura útil | Contenido scrolleable; **bottom nav fija** encima del safe area |
| Densidad táctil | Targets ≥ **48×48 px**; gap ≥ 8 px entre controles críticos |

## Estructura de pantallas

```
┌─────────────────────────┐
│  Header compacto        │  ← logo / título de vista / acción secundaria
├─────────────────────────┤
│                         │
│  Contenido (scroll)     │
│                         │
├─────────────────────────┤
│  Bottom nav (4 tabs)    │  ← siempre visible en rutas principales
└─────────────────────────┘
```

## Bottom navigation (4 tabs)

| Tab | ID sugerido | Ruta hash sugerida | Contenido |
|-----|-------------|--------------------|-----------|
| **Atracciones** | `atracciones` | `#/atracciones` | Board de 5 cards + detalle |
| **Laboratorio** | `laboratorio` | `#/laboratorio` | Lista de 4 sims + canvas |
| **Zona Arcade** | `arcade` | `#/arcade` | Lista de 3 juegos + canvas |
| **Mi Pase** | `pase` | `#/pase` | Progreso, estrellas, export |

### Comportamiento nav

- Un solo tab activo a la vez (estado visual claro: color + icono filled).
- Tap en tab activo: scroll-to-top o re-entrar a lista raíz de esa sección.
- No ocultar la nav durante sims/juegos **salvo** fullscreen explícito con botón “Salir” visible ≥48px (F4+); documentar decisión en implementación.
- Labels cortas en español debajo del icono (o solo icono + `aria-label` si el espacio aprieta; preferir label visible).

## Thumb-zone

- Acciones primarias (jugar, siguiente, exportar) en la **mitad inferior** de la pantalla cuando sea posible.
- Controles de sim (sliders, botones Start/Reset) agrupados bajo o a los lados del canvas, no en la esquina superior remota.
- Evitar gestos solo-pinch o solo-hover; todo debe funcionar con tap / drag simple.

## Flujos principales

### Atracciones

1. Lista (board) de 5 cards: nombre alien, concepto, estado (bloqueado / disponible / estrellas).
2. Tap → detalle: teoría corta + fórmulas + CTA “Ir al laboratorio” / “Jugar arcade” según enlace pedagógico.
3. Sin wall de texto: secciones colapsables o cards cortas.

### Laboratorio

1. Lista de sims con preview / título / dificultad.
2. Tap → vista sim: canvas + panel de controles + feedback numérico.
3. Al completar objetivo del sim → registrar estrellas / score en `localStorage`.

### Zona Arcade

1. Lista de 3 juegos.
2. Tap → juego Canvas; HUD mínimo (score, vidas/tiempo).
3. Game over / win → stars + volver a lista.

### Mi Pase

1. Resumen de progreso por atracción / sim / juego.
2. Estrellas **1–3** por actividad **o** score **0–100** (ver schema en `04-ARQUITECTURA.md`).
3. Export: **texto plano** (copiar) y/o **QR** con resumen para el docente.

## Gamificación (producto)

- Persistencia **solo local** (`astropark.*`).
- Sin leaderboard global en v1.
- Reset de progreso: acción destructiva con confirmación en Mi Pase.
- Reporte de clase: debe ser legible en texto (nombre opcional del alumno = input local, no cuenta).

## Accesibilidad mínima (F6, planear desde F1)

- Contraste suficiente sobre fondo oscuro.
- `aria-label` en tabs e iconos.
- Focus visible en navegación por teclado (desktop).
- No depender solo del color para estrellas (usar iconos + número).

## Estados vacíos / errores

- Primera visita: onboarding de 1 pantalla o banner “Bienvenido a Xenon-9” dismissible.
- Sin JS / canvas fallido: mensaje claro “Tu navegador no soporta Canvas; prueba Chrome/Safari actualizado”.
- Offline tras carga: las vistas DOM deben seguir; sims usan assets locales.

## Fuera de alcance UI (no implementar en F1–F3)

- Menú hamburguesa complejo, drawer multi-nivel.
- Dark/light toggle (el tema Xenon-9 es dark por defecto).
- Autenticación, perfiles cloud, notificaciones push.

## Criterios de aceptación UX (shell F1)

- [ ] 4 tabs navegan a 4 vistas vacías con título correcto.
- [ ] En 360×640 (DevTools) no hay overflow horizontal.
- [ ] Bottom nav no tapa contenido crítico (padding-bottom ≥ altura nav + safe area).
- [ ] Targets táctiles ≥48px en la nav.
