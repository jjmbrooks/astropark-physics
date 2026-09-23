export const GAMES = [
  {
    id: 'game-zorp-dash',
    name: 'Zorp Dash',
    emoji: '🟢',
    blurb: 'MRU / timing · esquiva en carriles',
    phase: 4,
  },
  {
    id: 'game-grog-push',
    name: 'Grog Push',
    emoji: '🟠',
    blurb: 'Elige fuerza vs masa de la caja',
    phase: 5,
  },
  {
    id: 'game-orbit-hop',
    name: 'Orbit Hop',
    emoji: '🟡',
    blurb: 'Órbita exterior más lenta',
    phase: 5,
  },
];

export function getGame(id) {
  return GAMES.find((g) => g.id === id) || null;
}
