import { getProgress, getProfile, ATTRACTION_SLUGS, SIM_IDS, GAME_IDS } from '../../state/index.js';
import { ATTRACTIONS } from '../atracciones/data.js';
import { SIMS } from '../laboratorio/catalog.js';
import { GAMES } from '../arcade/catalog.js';

/**
 * Plain-text class report for teachers.
 * @returns {string}
 */
export function buildClassReport() {
  const profile = getProfile();
  const progress = getProgress();
  const name = profile.displayName?.trim() || '(sin nombre)';
  const when = progress.updatedAt
    ? new Date(progress.updatedAt).toLocaleString('es-MX', { hour12: false })
    : new Date().toLocaleString('es-MX', { hour12: false });

  const lines = [
    'AstroPark Physics — Reporte de clase',
    `Alumno: ${name}`,
    `Actualizado: ${when}`,
    '',
    '=== Atracciones ===',
  ];

  for (const slug of ATTRACTION_SLUGS) {
    const meta = ATTRACTIONS.find((a) => a.slug === slug);
    const p = progress.attractions[slug] || { read: false, stars: 0 };
    lines.push(
      `- ${meta?.alien || slug} (${slug}): ${p.read ? 'leída' : 'no leída'}${p.stars ? ` · ${p.stars}★` : ''}`,
    );
  }

  lines.push('', '=== Laboratorio ===');
  for (const id of SIM_IDS) {
    const meta = SIMS.find((s) => s.id === id);
    const p = progress.sims[id] || { stars: 0, bestScore: 0, completed: false };
    lines.push(
      `- ${meta?.name || id}: ${p.stars}★ · score ${p.bestScore}${p.completed ? ' · ok' : ''}`,
    );
  }

  lines.push('', '=== Arcade ===');
  for (const id of GAME_IDS) {
    const meta = GAMES.find((g) => g.id === id);
    const p = progress.games[id] || { stars: 0, bestScore: 0, completed: false };
    lines.push(
      `- ${meta?.name || id}: ${p.stars}★ · mejor ${p.bestScore}/100${p.completed ? ' · ok' : ''}`,
    );
  }

  const readN = ATTRACTION_SLUGS.filter((s) => progress.attractions[s]?.read).length;
  const simStars = SIM_IDS.reduce((n, id) => n + (progress.sims[id]?.stars || 0), 0);
  const gameStars = GAME_IDS.reduce((n, id) => n + (progress.games[id]?.stars || 0), 0);
  lines.push(
    '',
    '=== Resumen ===',
    `Atracciones leídas: ${readN}/${ATTRACTION_SLUGS.length}`,
    `Estrellas sims: ${simStars}`,
    `Estrellas juegos: ${gameStars}`,
    '',
    'Xenon-9 · AstroPark Physics',
  );

  return lines.join('\n');
}
