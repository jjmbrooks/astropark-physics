/**
 * Datos de las 5 atracciones — fuente: docs/03-CONTENIDO.md
 * Xenon-9 g = 7.5 m/s² (fijado).
 */

export const PLANET_G = {
  tierra: { label: 'Tierra', g: 9.8 },
  luna: { label: 'Luna', g: 1.6 },
  xenon9: { label: 'Xenon-9', g: 7.5 },
  jupiter: { label: 'Júpiter', g: 24.8 },
};

/** @type {Array<{
 *  slug: string,
 *  name: string,
 *  alien: string,
 *  emoji: string,
 *  concept: string,
 *  color: string,
 *  story: string,
 *  goals: string[],
 *  theory: string[],
 *  formulas: { label: string, expr: string }[],
 *  example: string,
 *  misconception: string,
 *  labId: string|null,
 *  arcadeId: string|null,
 * }>} */
export const ATTRACTIONS = [
  {
    slug: 'zorp',
    name: 'Pista de inercia',
    alien: 'Zorp',
    emoji: '🟢',
    concept: 'MRU / inercia',
    color: '#2de2e6',
    story:
      'Zorp desliza carritos en el vacío del parque. Sin fricción, la velocidad no cambia sola: sigue en línea recta a ritmo constante.',
    goals: [
      'Distinguir reposo y movimiento rectilíneo uniforme (MRU).',
      'Leer velocidad constante v = Δx / Δt.',
      'Intuir la inercia: si no hay fuerza neta, no hay cambio de velocidad.',
    ],
    theory: [
      'En el vacío del parque (sin fricción ni aire), un carrito que ya se mueve sigue a la misma velocidad. No necesita “motor” para continuar.',
      'La velocidad media se calcula como el desplazamiento entre el tiempo: v = Δx / Δt. En MRU, esa v no cambia con el tiempo.',
      'La inercia es la tendencia de los cuerpos a mantener su estado de movimiento. “Si no hay motor se detiene” solo es cierto cuando hay fricción u otras fuerzas que frenan.',
      'Unidades: posición en metros (m), tiempo en segundos (s), velocidad en metros por segundo (m/s).',
    ],
    formulas: [
      { label: 'Velocidad (MRU)', expr: 'v = Δx / Δt' },
      { label: 'Inercia (idea)', expr: 'F_neta = 0  ⇒  v constante' },
    ],
    example:
      'Si el carrito de Zorp avanza 12 m en 3 s con velocidad constante: v = 12 / 3 = 4 m/s. Un segundo después sigue a 4 m/s.',
    misconception:
      'Error común: “si no hay motor se detiene”. En el vacío del parque, sin fuerza neta, no se detiene solo.',
    labId: 'sim-zorp-inercia',
    arcadeId: 'game-zorp-dash',
  },
  {
    slug: 'grog',
    name: 'Empuje de vagones',
    alien: 'Grog',
    emoji: '🟠',
    concept: 'F = ma + trabajo',
    color: '#f72585',
    story:
      'Grog empuja vagones del roller. Más fuerza o menos masa → más aceleración. El trabajo que hace es fuerza × distancia cuando van alineados.',
    goals: [
      'Usar a = F / m.',
      'Calcular trabajo W = F · d en 1D (cos ≈ 1).',
      'No confundir masa con peso ni trabajo con “cansancio”.',
    ],
    theory: [
      'La segunda ley de Newton dice que la aceleración es proporcional a la fuerza neta e inversamente proporcional a la masa: F = ma, o a = F/m.',
      'Si Grog aplica la misma fuerza a un vagón más liviano, acelera más. Si duplica la fuerza sobre la misma masa, duplica la aceleración.',
      'El trabajo mecánico en una dimensión (fuerza y desplazamiento en la misma dirección) es W = F · d. Unidades: joule (J) = N·m.',
      '“Trabajo” aquí no significa cansancio: es energía transferida por una fuerza que desplaza.',
    ],
    formulas: [
      { label: 'Segunda ley', expr: 'F = m · a' },
      { label: 'Aceleración', expr: 'a = F / m' },
      { label: 'Trabajo (1D)', expr: 'W = F · d' },
    ],
    example:
      'F = 20 N, m = 5 kg → a = 20/5 = 4 m/s². Si empuja d = 3 m: W = 20 · 3 = 60 J.',
    misconception:
      'Errores comunes: confundir masa con peso; creer que W siempre es “cansancio”.',
    labId: 'sim-grog-empuje',
    arcadeId: 'game-grog-push',
  },
  {
    slug: 'kiki',
    name: 'Balanza de planetas',
    alien: 'Kiki',
    emoji: '🟣',
    concept: 'Masa vs peso',
    color: '#b5179e',
    story:
      'Kiki se pesa en Xenon-9, en la Tierra y en la Luna. Su masa no cambia; su peso sí, porque g es distinto en cada mundo.',
    goals: [
      'Separar masa (kg) de peso (N).',
      'Usar P = m · g.',
      'Reconocer que g depende del cuerpo celeste.',
    ],
    theory: [
      'La masa mide la “cantidad de materia” y la inercia del cuerpo. Se mide en kilogramos (kg) y no cambia al viajar de un planeta a otro.',
      'El peso es la fuerza con la que un planeta tira de ti: P = m · g. Se mide en newtons (N), no en kilogramos.',
      'El valor de g cambia: Tierra ≈ 9.8 m/s², Luna ≈ 1.6 m/s², Xenon-9 = 7.5 m/s², Júpiter ≈ 24.8 m/s².',
      'En Xenon-9, Kiki “pesa” menos que en la Tierra pero más que en la Luna, con la misma masa.',
    ],
    formulas: [
      { label: 'Peso', expr: 'P = m · g' },
      { label: 'g Xenon-9', expr: 'g = 7.5 m/s²' },
    ],
    example:
      'm = 50 kg en Xenon-9: P = 50 · 7.5 = 375 N. En la Tierra: P = 50 · 9.8 = 490 N. La masa sigue siendo 50 kg.',
    misconception:
      'Errores comunes: “peso = masa”; usar kg como unidad de peso.',
    labId: 'sim-kiki-balanza',
    arcadeId: null,
  },
  {
    slug: 'nebu',
    name: 'Caída en Xenon-9',
    alien: 'Nebu',
    emoji: '🔵',
    concept: 'Gravedad',
    color: '#4cc9f0',
    story:
      'Nebu explica por qué las cosas caen “hacia el planeta” y por qué un planeta más masivo tira más fuerte.',
    goals: [
      'Entender la dirección de g hacia el centro del planeta.',
      'Caída libre cualitativa: sin aire, todos aceleran igual con el mismo g.',
      'Mencionar (cartel de museo) F_g ∝ m₁ m₂ / r².',
    ],
    theory: [
      'La gravedad es una atracción entre masas. Cerca de la superficie, la aceleración debida a la gravedad se resume en el valor g.',
      'En caída libre (sin resistencia del aire) todos los objetos caen con la misma aceleración g, independiente de su masa.',
      'Reutilizamos P = m · g: el peso es precisamente esa fuerza gravitatoria cerca de la superficie.',
      'Cartel de museo: la fuerza gravitatoria entre dos masas sigue F_g = G · m₁ · m₂ / r² (no hace falta calcularla en el MVP).',
    ],
    formulas: [
      { label: 'Peso / gravedad local', expr: 'P = m · g' },
      { label: 'Ley de Newton (cartel)', expr: 'F_g = G · m₁ · m₂ / r²' },
    ],
    example:
      'En Xenon-9 (g = 7.5 m/s²) un objeto en caída libre gana ~7.5 m/s de velocidad cada segundo (sin aire).',
    misconception:
      'Errores: “en el espacio no hay gravedad”; confundir ingravidez orbital con “cero gravedad”.',
    labId: 'sim-nebu-caida',
    arcadeId: null,
  },
  {
    slug: 'tiki-tok',
    name: 'Órbitas del parque',
    alien: 'Tiki & Tok',
    emoji: '🟡',
    concept: 'Kepler cualitativo',
    color: '#b5f34a',
    story:
      'Los gemelos Tiki y Tok cronometran satélites del parque: el de órbita más lejana tarda más en dar una vuelta.',
    goals: [
      'Relacionar periodo con radio de forma cualitativa: más lejos → más lento / periodo mayor.',
      'Ver la órbita como “caída libre que se pierde el suelo”.',
      'No exigir T² ∝ a³ como cálculo obligatorio en el MVP.',
    ],
    theory: [
      'Un satélite en órbita cae continuamente hacia el planeta, pero su velocidad lateral hace que “se pierda” el suelo: eso es una órbita.',
      'Cualitativamente (Kepler): a mayor radio orbital, mayor periodo. El satélite exterior se mueve más despacio y tarda más en completar la vuelta.',
      'Las órbitas no necesitan un motor continuo: la gravedad hace el trabajo de curvar la trayectoria.',
      'Matiz: “más lejos = menos gravedad” es incompleto; lo clave en el parque es el periodo vs radio.',
    ],
    formulas: [
      { label: 'Idea Kepler (cualitativa)', expr: 'más lejos → periodo mayor' },
      { label: 'Órbita', expr: 'caída libre + velocidad lateral' },
    ],
    example:
      'Si el satélite interior da una vuelta en 4 s, el de órbita el doble de lejos tarda claramente más (en el juego Orbit Hop lo verás en timing).',
    misconception:
      'Errores: órbitas “necesitan motor continuo”; explicar el periodo solo con “menos gravedad” sin matizar.',
    labId: null,
    arcadeId: 'game-orbit-hop',
  },
];

export function getAttraction(slug) {
  return ATTRACTIONS.find((a) => a.slug === slug) || null;
}
