/** Catálogo Laboratorio — IDs de docs/03 */
export const SIMS = [
  {
    id: 'sim-zorp-inercia',
    name: 'Inercia de Zorp',
    alien: 'Zorp',
    emoji: '🟢',
    blurb: 'Impulso + fricción · v constante si μ≈0',
    phase: 3,
  },
  {
    id: 'sim-grog-empuje',
    name: 'Empuje de vagones',
    alien: 'Grog',
    emoji: '🟠',
    blurb: 'Sliders F, m, d · ver a y W',
    phase: 3,
  },
  {
    id: 'sim-kiki-balanza',
    name: 'Balanza de planetas',
    alien: 'Kiki',
    emoji: '🟣',
    blurb: 'Masa vs peso · g por planeta',
    phase: 4,
  },
  {
    id: 'sim-nebu-caida',
    name: 'Caída en Xenon-9',
    alien: 'Nebu',
    emoji: '🔵',
    blurb: 'Caída libre · compara g',
    phase: 4,
  },
];

export function getSim(id) {
  return SIMS.find((s) => s.id === id) || null;
}
