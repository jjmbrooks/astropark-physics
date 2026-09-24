export const GAMES = [
  {
    id: 'game-zorp-dash',
    name: 'Zorp Dash',
    emoji: '🟢',
    blurb: 'A velocidad constante todo depende del timing: esquiva sin frenar.',
    phase: 4,
  },
  {
    id: 'game-grog-push',
    name: 'Grog Push',
    emoji: '🟠',
    blurb: 'Elige la fuerza justa: ni de más ni de menos.',
    phase: 5,
  },
  {
    id: 'game-orbit-hop',
    name: 'Orbit Hop',
    emoji: '🟡',
    blurb: 'Salta entre órbitas: la de afuera va más lenta. Sincroniza o espera.',
    phase: 5,
  },
];

export function getGame(id) {
  return GAMES.find((g) => g.id === id) || null;
}
