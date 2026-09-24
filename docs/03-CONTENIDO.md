# 03 — Contenido pedagógico

Fuente de verdad para atracciones, fórmulas, simuladores y juegos. Un bot implementador **no inventa** temas nuevos: solo implementa lo listado aquí.

## Las 5 atracciones

| # | Alien / marca | Concepto clave | Fórmulas / ideas | Enlace tip. Lab / Arcade |
|---|---------------|----------------|------------------|---------------------------|
| 1 | **Zorp** | MRU / inercia | \( v = \frac{\Delta x}{\Delta t} \) (constante); inercia = “seguir en línea recta si no hay fuerza neta” | Sim: Inercia de Zorp |
| 2 | **Grog** | \( F = ma \) + 3ª ley + trabajo | \( F = ma \); \( F_{12}=-F_{21} \); \( W = F \cdot d \) (1D) | Sims: Empuje de vagones + Par acción-reacción |
| 3 | **Kiki** | Masa vs peso | \( m \) (kg) ≠ peso; peso \( P = mg \); \( g \) cambia por planeta | Sim: Balanza de planetas |
| 4 | **Nebu** | Gravedad | Atracción; idea de \( g \); (opcional cualitativo) \( F_g \propto \frac{m_1 m_2}{r^2} \) | Sim: Caída en Xenon-9 |
| 5 | **Tiki & Tok** | Kepler cualitativo | Órbitas; periodo vs radio (más lejos → más lento); sin derivar leyes formales en MVP | Arcade / visual órbita |

### Detalle por atracción

#### 1. Zorp — Pista de inercia (MRU)

- **Historia corta:** Zorp desliza carritos en el vacío del parque; sin fricción, la velocidad no cambia sola.
- **Objetivos de aprendizaje:** distinguir reposo/MRU; leer \( v \) constante; intuición de inercia.
- **Teoría UI:** 3–5 párrafos cortos + fórmula \( v = \Delta x / \Delta t \) + ejemplo numérico (unidades m, s, m/s).
- **Errores comunes a contradecir:** “si no hay motor se detiene” (en el vacío del parque, no).

#### 2. Grog — Empuje de vagones (\( F=ma \), \( W \))

- **Historia:** Grog empuja vagones del roller; más fuerza o menos masa → más aceleración; trabajo = fuerza × distancia.
- **Objetivos:** \( a = F/m \); trabajo positivo cuando fuerza y desplazamiento alineados.
- **Teoría UI:** \( F=ma \), \( W=Fd \); ejemplo con números redondos.
- **Errores comunes:** confundir masa con peso; creer que \( W \) siempre es “cansancio”.

#### 3. Kiki — Masa vs peso

- **Historia:** Kiki se pesa en Xenon-9 vs Tierra vs Luna; la **masa** no cambia, el **peso** sí.
- **Objetivos:** \( P = mg \); \( g \) depende del cuerpo celeste; masa en kg, peso en N.
- **Teoría UI:** tabla \( g \) aproximada — **Tierra 9.8**, **Luna 1.6**, **Xenon-9 = 7.5 m/s²** (ficticio, fijado; etiquetar en UI como «dato ficticio»), **Júpiter 24.8**. Documentado también en el sim de balanza.
- **Errores comunes:** “peso = masa”; usar kg como unidad de peso.

#### 4. Nebu — Gravedad

- **Historia:** Nebu explica por qué las cosas caen “hacia el planeta” y por qué a mayor masa (planeta) mayor tirón.
- **Objetivos:** dirección de \( \vec{g} \); caída libre cualitativa; mención opcional de \( 1/r^2 \).
- **Teoría UI:** diagrama simple + fórmula \( P=mg \) reutilizada; opcional \( F_g = G m_1 m_2 / r^2 \) solo como “cartel de museo”.
- **Errores comunes:** “en el espacio no hay gravedad”; confundir ingravidez orbital con “cero gravedad”.

#### 5. Tiki & Tok — Órbitas (Kepler cualitativo)

- **Historia:** gemelos Tiki y Tok cronometran satélites del parque: el de órbita más lejana tarda más.
- **Objetivos:** periodo vs radio (cualitativo); órbita como caída libre “que se pierde” el suelo.
- **Teoría UI:** sin derivar \( T^2 \propto a^3 \) como cálculo obligatorio; bastará “más lejos → más lento / período mayor”.
- **Errores comunes:** órbitas “necesitan motor continuo”; planetas más lejanos “tienen menos gravedad por eso van más lento” sin matizar.

## Simuladores (Laboratorio) — 4

IDs estables (usar en rutas y `localStorage`):

| ID | Nombre UI | Atracción | Mecánica del sim | Meta / scoring |
|----|-----------|-----------|------------------|----------------|
| `sim-zorp-inercia` | Inercia de Zorp | Zorp | Objeto en pista sin fricción; tap para “empujón” impulso; ver \( v \) constante | Mantener \( v \) objetivo ±tol → 1–3★ |
| `sim-grog-empuje` | Empuje de vagones | Grog | Slider de \( F \) y \( m \); ver \( a \); desplazamiento → \( W \) | Llegar a \( a \) o \( W \) objetivo → 1–3★ |
| `sim-kiki-balanza` | Balanza de planetas | Kiki | Elegir planeta (\( g \)); misma \( m \); mostrar peso | Emparejar masa/peso correctos en N quizzes → ★ |
| `sim-nebu-caida` | Caída en Xenon-9 | Nebu | Caída libre 1D; opcional comparar dos \( g \) | Predecir tiempo/altura o igualar curvas → ★ |
| `sim-par-accion-reaccion` | Par acción-reacción | Grog (+ Kiki) | Dos cuerpos se empujan; vectores \( F_{12}=-F_{21} \); \( a=F/m \) | Predicción + feedback informativo → 1–3★ |

### Nota P1 / PF2 (F7)

Cobertura del primer parcial (CNEYT V · Del Átomo al Universo): el gap crítico era **PF2 — tercera ley de Newton + vectores** (20% del parcial). El sim `sim-par-accion-reaccion` cierra ese gap. Xenon-9 \( g = 7.5 \) es **dato ficticio** (S4): etiquetado en UI de Kiki.

**Notas de implementación (Canvas 2D):**

- Un loop `requestAnimationFrame` por vista activa; destruir al salir (evitar leaks).
- Controles DOM (sliders/botones) fuera del canvas cuando sea posible.
- Unidades en UI: SI; redondeo amable (1–2 decimales).
- Touch: `pointerdown` / `pointermove` / `pointerup` preferible a solo `touch*` o solo `mouse*`.

Orden de build (roadmap): F3 = primeros 2 (`sim-zorp-inercia`, `sim-grog-empuje`); F4 = resto.

## Juegos arcade — 3

| ID | Nombre UI | Concepto | Gameplay (MVP) | Scoring |
|----|-----------|----------|----------------|---------|
| `game-zorp-dash` | Zorp Dash | MRU / timing | Esquivar obstáculos a velocidad constante o por tramos; timing de saltos/cambios de carril | Score 0–100 o ★ según umbrales |
| `game-grog-push` | Grog Push | \( F=ma \) | Empujar cajas: elegir fuerza; masa distinta por caja; no “gastar” de más | ★ por nivel |
| `game-orbit-hop` | Orbit Hop | Kepler cualitativo | Saltar entre órbitas; órbita externa más lenta; timing de rendezvous | ★ / score |

Orden: F4 incluye juego 1; F5 juegos 2–3.

## Progreso y estrellas

- Por actividad (atracción leída, sim completado, juego ganado): **estrellas 1–3** **o** score **0–100**.
- Convención recomendada (documentada en schema):  
  - Atracciones: “leída” booleano + opcional quiz 1–3★.  
  - Sims/juegos: `stars: 0|1|2|3` y opcional `bestScore: 0–100`.
- Reporte clase: texto con lista de IDs + estrellas + timestamp; QR opcional con mismo payload corto.

## Vocabulario UI fijo

Usar estos labels (consistencia):

- Atracciones / Laboratorio / Zona Arcade / Mi Pase  
- Estrellas / Mi progreso / Exportar reporte / Reiniciar progreso  
- Jugar / Probar sim / Teoría / Fórmulas  

## Fuera de alcance de contenido (v1)

- Relatividad, fluidos, circuitos, óptica.
- Multi-idioma.
- Generación procedural de problemas con LLM.
