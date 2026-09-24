/**
 * Datos de las 5 atracciones — fuente: docs/03-CONTENIDO.md + storyteller F7
 * Xenon-9 g = 7.5 m/s² (dato ficticio, fijado).
 */

export const PLANET_G = {
  tierra: { label: 'Tierra', g: 9.8, fictional: false },
  luna: { label: 'Luna', g: 1.6, fictional: false },
  xenon9: { label: 'Xenon-9', g: 7.5, fictional: true },
  jupiter: { label: 'Júpiter', g: 24.8, fictional: false },
};

const BASE = () => import.meta.env.BASE_URL || '/';

export function bustUrl(slug, size = 256) {
  const base = BASE();
  if (size === 256) return `${base}assets/aliens/busto-${slug}-256.webp`;
  return `${base}assets/aliens/busto-${slug}.webp`;
}

export function poseUrl(slug, pose = 'idle') {
  return `${BASE()}assets/aliens/poses/pose-${slug}-${pose}.webp`;
}

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
 *  labExtraId: string|null,
 *  arcadeId: string|null,
 * }>} */
export const ATTRACTIONS = [
  {
    slug: 'zorp',
    name: 'Pista de inercia',
    alien: 'Zorp',
    emoji: '🟢',
    concept: 'MRU / inercia',
    color: '#4CC9F0',
    story:
      'Zorp desliza carritos por la pista sin fricción del parque. No empuja ni frena: si el carrito ya va, sigue y sigue. Eso es inercia.',
    goals: [
      'Distinguir reposo y movimiento rectilíneo uniforme (MRU).',
      'Leer velocidad constante v = Δx / Δt.',
      'Intuir la inercia: si no hay fuerza neta, no hay cambio de velocidad.',
    ],
    theory: [
      'Aquí no hay fricción ni aire. El carrito que ya se mueve sigue a la misma velocidad: no necesita motor para continuar.',
      'La velocidad es cuánto avanzas por segundo: v = Δx / Δt. En MRU ese número no cambia con el tiempo.',
      'Eso es la inercia: todo cuerpo mantiene su estado de movimiento mientras no haya una fuerza neta que lo cambie.',
      'Unidades: posición en metros (m), tiempo en segundos (s), velocidad en metros por segundo (m/s).',
    ],
    formulas: [
      { label: 'Velocidad (MRU)', expr: 'v = Δx / Δt' },
      { label: 'Inercia (idea)', expr: 'F_neta = 0  ⇒  v constante' },
    ],
    example:
      'Si el carrito de Zorp avanza 12 m en 3 s con velocidad constante: v = 12 / 3 = 4 m/s. Un segundo después sigue a 4 m/s.',
    misconception:
      '«Si no hay motor, se detiene» — en el día a día sí, por la fricción. Aquí, en el vacío del parque y sin fuerza neta, no se detiene solo.',
    labId: 'sim-zorp-inercia',
    labExtraId: null,
    arcadeId: 'game-zorp-dash',
  },
  {
    slug: 'grog',
    name: 'Empuje de vagones',
    alien: 'Grog',
    emoji: '🟠',
    concept: 'F = ma + 3ª ley',
    color: '#FF5DB1',
    story:
      'Grog empuja los vagones del roller. El mismo empujón en un vagón ligero acelera más: más fuerza o menos masa, más aceleración. Y cuando se empuja con Kiki, ambos sienten el mismo par de fuerzas.',
    goals: [
      'Usar a = F / m.',
      'Calcular trabajo W = F · d en 1D (cos ≈ 1).',
      'Ver el par acción-reacción: F₁₂ = −F₂₁ sobre cuerpos distintos.',
    ],
    theory: [
      'Segunda ley de Newton: la aceleración es proporcional a la fuerza neta e inversamente proporcional a la masa. F = m · a, o bien a = F / m.',
      'Misma fuerza y menos masa → más aceleración. Misma masa y el doble de fuerza → el doble de aceleración.',
      'Trabajo: cuando la fuerza va en el sentido del movimiento, W = F · d. Unidades: joule (J) = N·m. (Extensión; no entra al parcial 1 como eje.)',
      'Tercera ley: si Grog empuja a Kiki, Kiki empuja a Grog con la misma magnitud y sentido opuesto. Las fuerzas son iguales; las aceleraciones no, si las masas difieren.',
    ],
    formulas: [
      { label: 'Segunda ley', expr: 'F = m · a' },
      { label: 'Aceleración', expr: 'a = F / m' },
      { label: 'Tercera ley', expr: 'F₁₂ = −F₂₁' },
      { label: 'Trabajo (1D)', expr: 'W = F · d' },
    ],
    example:
      'F = 20 N, m = 5 kg → a = 20/5 = 4 m/s². Si empuja d = 3 m: W = 20 · 3 = 60 J.',
    misconception:
      'Confundir masa con peso; creer que «la fuerza mayor gana» en un par acción-reacción (las fuerzas del par son iguales).',
    labId: 'sim-grog-empuje',
    labExtraId: 'sim-par-accion-reaccion',
    arcadeId: 'game-grog-push',
  },
  {
    slug: 'kiki',
    name: 'Balanza de planetas',
    alien: 'Kiki',
    emoji: '🟣',
    concept: 'Masa vs peso',
    color: '#B5179E',
    story:
      'Kiki sube la misma balanza a la Tierra, la Luna, Júpiter y Xenon-9. Su masa nunca cambia; su peso, nunca para de cambiar. Por eso odia que le digan «peso en kilos».',
    goals: [
      'Separar masa (kg) de peso (N).',
      'Usar P = m · g.',
      'Reconocer que g depende del cuerpo celeste (y que Xenon-9 es ficticio).',
    ],
    theory: [
      'La masa mide la cantidad de materia (y la resistencia a cambiar de movimiento). Está en kilogramos (kg) y no cambia al viajar.',
      'El peso es la fuerza con la que el planeta te jala: P = m · g. Está en newtons (N).',
      'g depende del mundo: Tierra 9.8, Luna 1.6, Xenon-9 7.5 (dato ficticio del parque), Júpiter 24.8 (en m/s²).',
      'En Xenon-9, Kiki pesa menos que en la Tierra y más que en la Luna… con exactamente la misma masa. g varía porque cambia la masa y el radio del cuerpo (idea de g ≈ G M / R²).',
    ],
    formulas: [
      { label: 'Peso', expr: 'P = m · g' },
      { label: 'g Xenon-9 (ficticio)', expr: 'g = 7.5 m/s²' },
    ],
    example:
      'm = 50 kg en Xenon-9: P = 50 · 7.5 = 375 N. En la Tierra: P = 50 · 9.8 = 490 N. La masa sigue siendo 50 kg.',
    misconception:
      '«Peso = masa» y ponerle kg al peso. El peso va en newtons.',
    labId: 'sim-kiki-balanza',
    labExtraId: null,
    arcadeId: null,
  },
  {
    slug: 'nebu',
    name: 'Caída en Xenon-9',
    alien: 'Nebu',
    emoji: '🔵',
    concept: 'Gravedad',
    color: '#4CC9F0',
    story:
      'Nebu sostiene que todo cae hacia el centro del planeta — hasta los planetas. En Xenon-9 caer va más suave: g = 7.5 (dato ficticio) en vez de 9.8.',
    goals: [
      'Entender la dirección de g hacia el centro del planeta.',
      'Caída libre cualitativa: sin aire, todos aceleran igual con el mismo g.',
      'Mencionar (cartel de museo) F_g ∝ m₁ m₂ / r².',
    ],
    theory: [
      'La gravedad es atracción entre masas. Cerca de la superficie la resumimos en un número: g.',
      'En caída libre (sin aire), todos los objetos caen con la misma aceleración g, aunque pesen distinto.',
      'Reusamos P = m · g: el peso es precisamente esa fuerza gravitatoria junto a la superficie.',
      'Cartel de museo: entre dos masas, F_g = G · m₁ · m₂ / r² — aquí solo la idea, sin cálculo.',
    ],
    formulas: [
      { label: 'Peso / gravedad local', expr: 'P = m · g' },
      { label: 'Ley de Newton (cartel)', expr: 'F_g = G · m₁ · m₂ / r²' },
    ],
    example:
      'En Xenon-9 (g = 7.5 m/s², dato ficticio), un objeto en caída libre gana ~7.5 m/s de velocidad cada segundo (sin aire).',
    misconception:
      '«En el espacio no hay gravedad». En órbita sigues cayendo: solo que vas de lado tan rápido que «fallas» el piso.',
    labId: 'sim-nebu-caida',
    labExtraId: null,
    arcadeId: null,
  },
  {
    slug: 'tiki-tok',
    name: 'Órbitas del parque',
    alien: 'Tiki & Tok',
    emoji: '🟡',
    concept: 'Kepler cualitativo',
    color: '#B7F34C',
    story:
      'Tiki y Tok cronometran los satélites del parque y apuestan: el de la órbita de afuera siempre tarda más. Ninguno de los dos necesita motor para ganar.',
    goals: [
      'Relacionar periodo con radio de forma cualitativa: más lejos → más lento / periodo mayor.',
      'Ver la órbita como «caída libre que se pierde el suelo».',
      'No exigir T² ∝ a³ como cálculo obligatorio en el MVP.',
    ],
    theory: [
      'Un satélite en órbita cae hacia el planeta sin parar, pero su velocidad lateral hace que se «pierda» el suelo: eso es una órbita.',
      'Cualitativamente (Kepler): a mayor radio orbital, mayor periodo. El de afuera va más despacio y tarda más en dar la vuelta.',
      'Las órbitas no necesitan motor continuo: la gravedad curva la trayectoria.',
      'Matiz: «más lejos = menos gravedad» está incompleto; lo que importa aquí es periodo vs radio.',
    ],
    formulas: [
      { label: 'Idea Kepler (cualitativa)', expr: 'más lejos → periodo mayor' },
      { label: 'Órbita', expr: 'caída libre + velocidad lateral' },
    ],
    example:
      'Si el satélite interior da una vuelta en 4 s, el de la órbita doble de lejos tarda claramente más — lo verás en el timing de Orbit Hop.',
    misconception:
      '«Las órbitas necesitan motor» — no. Y «el de afuera va lento solo porque hay menos gravedad» es solo parte de la historia.',
    labId: null,
    labExtraId: null,
    arcadeId: 'game-orbit-hop',
  },
];

export function getAttraction(slug) {
  return ATTRACTIONS.find((a) => a.slug === slug) || null;
}
