# 01 — Visión

## Qué es AstroPark Physics

**AstroPark Physics** es una aplicación web educativa (SPA) ambientada en un parque de diversiones en el planeta ficticio **Xenon-9**. Aliens entrañables guían al estudiante por atracciones, laboratorios y juegos arcade para aprender **mecánica clásica** y **astrofísica básica**.

No es un LMS ni un libro digital: es un **parque interactivo** pensado para usarse con el pulgar en el celular, en clase o en casa.

## Problema que resuelve

- La física de prepa se siente abstracta y “de pizarrón”.
- Los recursos móviles buenos suelen ser apps nativas o contenido en inglés.
- El docente necesita algo **estático, enlazable y sin backend** para compartir en el salón.

AstroPark ofrece: teoría corta + simulación táctil + juego corto + progreso local exportable.

## Público objetivo

| Atributo | Detalle |
|----------|---------|
| Edad | ~15–18 años (preparatoria / bachillerato) |
| Nivel | Física introductoria |
| Idioma UI / copy | **Español** (México / LatAm, tono cercano) |
| Contexto de uso | Celular en clase, tarea, refuerzo; proyector opcional vía mismo URL |
| Conectividad | Debe funcionar bien offline *después* de la primera carga (cache del browser); sin API obligatoria |

## Plataformas soportadas (objetivo)

| Plataforma | Prioridad |
|------------|-----------|
| **Android Chrome** | Alta |
| **iOS Safari** | Alta |
| Desktop Chromium / Firefox | Secundaria (layout mobile centrado, no desktop-first) |
| Ancho mínimo | **360 px** |
| Orientación | Portrait primario; landscape usable pero no diseñado primero |

## Tono y mundo: Xenon-9

- **Parque espacial** colorido, no “sci-fi militar”.
- Aliens **entrañables**, humor ligero, sin memes ofensivos ni slang que caduque en un semestre.
- Nombres propios: **Zorp, Grog, Kiki, Nebu, Tiki & Tok** — cada uno “dueño” de una atracción.
- Copy: segunda persona (“tú”), frases cortas, metáforas del parque (“tu pase”, “atracción”, “laboratorio”).
- Evitar: jerga de redes excesiva, spoilers de pop culture que rompan el immersion del planeta, tono condescendiente (“¡aprende jugando, niño!”).

### Paleta / vibe (orientación para F1)

- Fondo oscuro espacial (`#0b1020` o similar) + acentos neón (cyan, magenta, lima).
- Tipografía legible en móvil (system UI o una sans cargada vía Vite/Tailwind).
- Iconografía simple; personajes pueden ser SVG/PNG estáticos al inicio.

## Propuesta de valor (una frase)

> En Xenon-9, cada atracción enseña una idea de física: lees poco, tocas el sim, ganas estrellas y sales con un reporte para tu profe.

## Qué NO es (límites de producto)

- No es un curso completo de física (solo el set de atracciones definido en `03-CONTENIDO.md`).
- No hay cuentas de usuario en servidor (progreso = `localStorage`).
- No hay multiplayer ni chat.
- No hay backend propio en MVP–v1.
- No se implementa Phaser ni React en F0–F3 salvo ADR nuevo aprobado por Brooks.

## Éxito medible (producto)

Para un alumno de prepa en un teléfono de 360px:

1. Entiende en &lt;30 s qué es el parque y dónde tocar.
2. Completa al menos 1 atracción + 1 sim + 1 juego en una sesión corta.
3. Puede exportar un reporte de clase (texto / QR) desde **Mi Pase**.

## Enlaces internos

- Spec UX → [`02-SPEC-PRODUCTO.md`](02-SPEC-PRODUCTO.md)
- Contenido pedagógico → [`03-CONTENIDO.md`](03-CONTENIDO.md)
- Roadmap → [`06-ROADMAP.md`](06-ROADMAP.md)
