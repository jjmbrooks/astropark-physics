/**
 * Audio engine Xenon-9 — mute por defecto, unlock en primer gesto (iOS).
 * Persistencia: astropark.settings.soundEnabled
 */
import { getSettings, updateSettings } from '../state/index.js';

const BASE = import.meta.env.BASE_URL || '/';

const SFX = {
  tap: 'audio/sfx_tap_ui.wav',
  star: 'audio/sfx_star_collect.wav',
  success: 'audio/sfx_sim_success.wav',
  fail: 'audio/sfx_fail_soft.wav',
  portal: 'audio/sfx_portal_ride.wav',
};

/** @type {HTMLAudioElement | null} */
let bgm = null;
/** @type {Map<string, HTMLAudioElement[]>} */
const pools = new Map();
let unlocked = false;
let enabled = false;
let sfxVolume = 1;
let bgmVolume = 0.55;
let fadeTimer = 0;

function url(rel) {
  return `${BASE}${rel.replace(/^\//, '')}`;
}

function makeAudio(src, { loop = false, volume = 1 } = {}) {
  const a = new Audio();
  a.preload = 'auto';
  a.loop = loop;
  a.volume = volume;
  try {
    a.src = src;
  } catch {
    /* ignore */
  }
  a.addEventListener('error', () => {
    /* no romper si falla carga */
  });
  return a;
}

function ensureBgm() {
  if (bgm) return bgm;
  bgm = makeAudio(url('audio/bgm_astropark_main_loop.mp3'), { loop: true, volume: 0 });
  // ogg fallback via source swap if mp3 errors
  bgm.addEventListener(
    'error',
    () => {
      if (bgm && !bgm.dataset.oggTried) {
        bgm.dataset.oggTried = '1';
        bgm.src = url('audio/bgm_astropark_main_loop.ogg');
      }
    },
    { once: true },
  );
  return bgm;
}

function getPool(key) {
  if (!pools.has(key)) {
    const path = SFX[key];
    if (!path) return [];
    const a = makeAudio(url(path), { volume: sfxVolume });
    pools.set(key, [a]);
  }
  return pools.get(key);
}

function playFromPool(key) {
  if (!enabled || !unlocked) return;
  try {
    const pool = getPool(key);
    if (!pool.length) return;
    let a = pool.find((el) => el.paused || el.ended);
    if (!a) {
      const path = SFX[key];
      a = makeAudio(url(path), { volume: sfxVolume });
      pool.push(a);
    }
    a.volume = sfxVolume;
    a.currentTime = 0;
    const p = a.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  } catch {
    /* silent */
  }
}

function fadeBgm(to, ms = 300) {
  const el = ensureBgm();
  if (fadeTimer) {
    clearInterval(fadeTimer);
    fadeTimer = 0;
  }
  const from = el.volume;
  const steps = Math.max(1, Math.round(ms / 30));
  let i = 0;
  fadeTimer = setInterval(() => {
    i += 1;
    const t = i / steps;
    el.volume = Math.max(0, Math.min(1, from + (to - from) * t));
    if (i >= steps) {
      clearInterval(fadeTimer);
      fadeTimer = 0;
      el.volume = to;
      if (to === 0) {
        try {
          el.pause();
        } catch {
          /* */
        }
      }
    }
  }, 30);
}

async function startBgm() {
  if (!enabled || !unlocked) return;
  const el = ensureBgm();
  try {
    el.volume = 0;
    const p = el.play();
    if (p && typeof p.then === 'function') await p;
    fadeBgm(bgmVolume, 300);
  } catch {
    /* autoplay blocked — will retry on next gesture */
  }
}

function stopBgm() {
  if (!bgm) return;
  fadeBgm(0, 400);
}

function unlock() {
  if (unlocked) return;
  unlocked = true;
  // warm SFX
  try {
    getPool('tap');
  } catch {
    /* */
  }
  if (enabled) startBgm();
}

function onFirstGesture() {
  unlock();
  document.removeEventListener('pointerdown', onFirstGesture, true);
  document.removeEventListener('touchstart', onFirstGesture, true);
  document.removeEventListener('keydown', onFirstGesture, true);
}

function onVisibility() {
  if (document.hidden) {
    if (bgm && !bgm.paused) {
      try {
        bgm.pause();
      } catch {
        /* */
      }
    }
  } else if (enabled && unlocked && bgm) {
    startBgm();
  }
}

/**
 * Init once from main.js
 */
export function initAudio() {
  const s = getSettings();
  enabled = Boolean(s.soundEnabled);
  sfxVolume = typeof s.sfxVolume === 'number' ? s.sfxVolume : 1;
  bgmVolume = typeof s.bgmVolume === 'number' ? s.bgmVolume : 0.55;

  document.addEventListener('pointerdown', onFirstGesture, true);
  document.addEventListener('touchstart', onFirstGesture, true);
  document.addEventListener('keydown', onFirstGesture, true);
  document.addEventListener('visibilitychange', onVisibility);
}

export function isSoundEnabled() {
  return enabled;
}

export function setSoundEnabled(on) {
  enabled = Boolean(on);
  updateSettings({ soundEnabled: enabled });
  if (enabled) {
    unlock();
    startBgm();
  } else {
    stopBgm();
  }
  return enabled;
}

export function toggleSound() {
  return setSoundEnabled(!enabled);
}

export function playTap() {
  playFromPool('tap');
}
export function playStar() {
  playFromPool('star');
}
export function playSuccess() {
  playFromPool('success');
}
export function playFail() {
  playFromPool('fail');
}
export function playPortal() {
  playFromPool('portal');
}
