/** Catálogo Laboratorio — IDs de docs/03 */
export const SIMS = [
  {
    id: 'sim-zorp-inercia',
    name: 'Inercia de Zorp',
    alien: 'Zorp',
    slug: 'zorp',
    emoji: '🟢',
    blurb: 'Sin fricción: un empujón y la velocidad no se mueve.',
    phase: 3,
  },
  {
    id: 'sim-grog-empuje',
    name: 'Empuje de vagones',
    alien: 'Grog',
    slug: 'grog',
    emoji: '🟠',
    blurb: 'Mueve fuerza y masa, mira cuánto acelera… y cuánto trabajo deja.',
    phase: 3,
  },
  {
    id: 'sim-par-accion-reaccion',
    name: 'Par acción-reacción',
    alien: 'Grog & Kiki',
    slug: 'grog',
    emoji: '↔️',
    blurb: '¿Por qué no salgo volando? Fuerzas iguales, aceleraciones distintas.',
    phase: 7,
  },
  {
    id: 'sim-kiki-balanza',
    name: 'Balanza de planetas',
    alien: 'Kiki',
    slug: 'kiki',
    emoji: '🟣',
    blurb: 'Elige planeta, cambia g: mira qué cambia y qué se queda igual.',
    phase: 4,
  },
  {
    id: 'sim-nebu-caida',
    name: 'Caída en Xenon-9',
    alien: 'Nebu',
    slug: 'nebu',
    emoji: '🔵',
    blurb: 'Suelta, cronometra y compara: qué tan fuerte jala Xenon-9.',
    phase: 4,
  },
];

export function getSim(id) {
  return SIMS.find((s) => s.id === id) || null;
}
