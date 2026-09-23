/**
 * Estado + localStorage namespaced `astropark.*` (docs/04).
 */

const VERSION = 1;
const KEYS = {
  version: 'astropark.version',
  profile: 'astropark.profile',
  progress: 'astropark.progress',
  settings: 'astropark.settings',
};

const ATTRACTION_SLUGS = ['zorp', 'grog', 'kiki', 'nebu', 'tiki-tok'];
const SIM_IDS = [
  'sim-zorp-inercia',
  'sim-grog-empuje',
  'sim-kiki-balanza',
  'sim-nebu-caida',
];
const GAME_IDS = ['game-zorp-dash', 'game-grog-push', 'game-orbit-hop'];

function emptyAttraction() {
  return { read: false, stars: 0 };
}

function emptyActivity() {
  return { stars: 0, bestScore: 0, completed: false };
}

export function defaultProgress() {
  const attractions = {};
  for (const slug of ATTRACTION_SLUGS) attractions[slug] = emptyAttraction();
  const sims = {};
  for (const id of SIM_IDS) sims[id] = emptyActivity();
  const games = {};
  for (const id of GAME_IDS) games[id] = emptyActivity();
  return {
    attractions,
    sims,
    games,
    updatedAt: new Date().toISOString(),
  };
}

function defaultProfile() {
  return { displayName: '' };
}

function defaultSettings() {
  return { reducedMotion: false };
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function migrate(raw) {
  if (!raw || typeof raw !== 'object') return defaultProgress();
  const base = defaultProgress();
  for (const slug of ATTRACTION_SLUGS) {
    const a = raw.attractions?.[slug];
    if (a && typeof a === 'object') {
      base.attractions[slug] = {
        read: Boolean(a.read),
        stars: clampInt(a.stars, 0, 3),
      };
    }
  }
  for (const id of SIM_IDS) {
    const s = raw.sims?.[id];
    if (s && typeof s === 'object') {
      base.sims[id] = {
        stars: clampInt(s.stars, 0, 3),
        bestScore: clampInt(s.bestScore, 0, 100),
        completed: Boolean(s.completed),
      };
    }
  }
  for (const id of GAME_IDS) {
    const g = raw.games?.[id];
    if (g && typeof g === 'object') {
      base.games[id] = {
        stars: clampInt(g.stars, 0, 3),
        bestScore: clampInt(g.bestScore, 0, 100),
        completed: Boolean(g.completed),
      };
    }
  }
  if (typeof raw.updatedAt === 'string') base.updatedAt = raw.updatedAt;
  return base;
}

function clampInt(n, min, max) {
  const v = Number(n);
  if (!Number.isFinite(v)) return min;
  return Math.max(min, Math.min(max, Math.round(v)));
}

function touch(progress) {
  progress.updatedAt = new Date().toISOString();
  return progress;
}

function ensureVersion() {
  const v = Number(localStorage.getItem(KEYS.version));
  if (!Number.isFinite(v) || v < VERSION) {
    localStorage.setItem(KEYS.version, String(VERSION));
  }
}

/** @returns {ReturnType<typeof defaultProgress>} */
export function getProgress() {
  ensureVersion();
  return migrate(readJSON(KEYS.progress, null));
}

function saveProgress(progress) {
  ensureVersion();
  writeJSON(KEYS.progress, touch(progress));
  return progress;
}

export function getProfile() {
  ensureVersion();
  const p = readJSON(KEYS.profile, null);
  if (!p || typeof p !== 'object') return defaultProfile();
  return {
    displayName: typeof p.displayName === 'string' ? p.displayName : '',
  };
}

export function setDisplayName(name) {
  const profile = getProfile();
  profile.displayName = String(name || '').trim().slice(0, 40);
  writeJSON(KEYS.profile, profile);
  return profile;
}

export function getSettings() {
  ensureVersion();
  const s = readJSON(KEYS.settings, null);
  if (!s || typeof s !== 'object') return defaultSettings();
  return { reducedMotion: Boolean(s.reducedMotion) };
}

export function markAttractionRead(slug) {
  const progress = getProgress();
  if (!progress.attractions[slug]) return progress;
  progress.attractions[slug].read = true;
  return saveProgress(progress);
}

export function setAttractionStars(slug, stars) {
  const progress = getProgress();
  if (!progress.attractions[slug]) return progress;
  progress.attractions[slug].stars = clampInt(stars, 0, 3);
  progress.attractions[slug].read = true;
  return saveProgress(progress);
}

/**
 * Update sim progress; keeps best stars/score.
 * @param {string} id
 * @param {{ stars?: number, bestScore?: number, completed?: boolean }} patch
 */
export function updateSim(id, patch) {
  const progress = getProgress();
  if (!progress.sims[id]) return progress;
  const cur = progress.sims[id];
  if (patch.stars != null) cur.stars = Math.max(cur.stars, clampInt(patch.stars, 0, 3));
  if (patch.bestScore != null) {
    cur.bestScore = Math.max(cur.bestScore, clampInt(patch.bestScore, 0, 100));
  }
  if (patch.completed) cur.completed = true;
  if (cur.stars > 0) cur.completed = true;
  return saveProgress(progress);
}

/**
 * Update game progress; keeps best stars/score.
 * @param {string} id
 * @param {{ stars?: number, bestScore?: number, completed?: boolean }} patch
 */
export function updateGame(id, patch) {
  const progress = getProgress();
  if (!progress.games[id]) return progress;
  const cur = progress.games[id];
  if (patch.stars != null) cur.stars = Math.max(cur.stars, clampInt(patch.stars, 0, 3));
  if (patch.bestScore != null) {
    cur.bestScore = Math.max(cur.bestScore, clampInt(patch.bestScore, 0, 100));
  }
  if (patch.completed) cur.completed = true;
  if (cur.stars > 0 || cur.bestScore > 0) cur.completed = true;
  return saveProgress(progress);
}

export function resetProgress() {
  const fresh = defaultProgress();
  writeJSON(KEYS.progress, fresh);
  localStorage.setItem(KEYS.version, String(VERSION));
  return fresh;
}

export { ATTRACTION_SLUGS, SIM_IDS, GAME_IDS, VERSION, KEYS };
