import { TUNING } from '../config/tuning.js'

// Per-level bests. localStorage is the game's ONE storage dependency
// (BRIEF-02 Chunk 6) — this is a plain browser game on static hosting,
// so it's available; guarded anyway so blocked storage (private mode,
// disabled cookies) degrades to no persistence instead of crashing.
const KEY = 'chexys-big-day-progress-v1'

function load() {
  try {
    return JSON.parse(window.localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

function save(data) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // storage blocked: play on without persistence
  }
}

export function levelBest(levelId) {
  const d = load()[levelId] || {}
  return { bestScore: d.bestScore ?? 0, bestHangers: d.bestHangers ?? 0 }
}

// a cleared run always earns >= 1 hanger (3 losses is a fail), so
// bestHangers > 0 <=> the level has been cleared at least once
export function levelCleared(levelId) {
  return levelBest(levelId).bestHangers > 0
}

// master mute (handoff 2026-08-07-d): a preference, not a run stat —
// the godMode no-record rule does not apply
export function isMuted() {
  return load().muted === true
}

export function setMuted(muted) {
  const all = load()
  all.muted = muted
  save(all)
}

// dash unlock (BRIEF-03 / DESIGN.md §3.2): granted by the Bell Desk
// scripted beat, persists for all subsequent levels. A control unlock,
// not a best — the godMode guard doesn't apply.
export function isDashUnlocked() {
  return load().dashUnlocked === true
}

export function unlockDash() {
  const all = load()
  if (all.dashUnlocked) return
  all.dashUnlocked = true
  save(all)
}

// garage dash-through tip (handoff 2026-08-09-g): a one-time tutorial
// bubble on the first garage rush, gated like the Bell Desk beat — a
// control tip, not a best, so the godMode guard doesn't apply
export function isGarageDashTipShown() {
  return load().garageDashTipShown === true
}

export function markGarageDashTipShown() {
  const all = load()
  if (all.garageDashTipShown) return
  all.garageDashTipShown = true
  save(all)
}

export function recordRun(levelId, { finalScore, hangers }) {
  // god-mode runs never write persisted bests (standing rule,
  // handoffs 2026-07-29-g / 2026-07-30-h)
  if (TUNING.godMode) return levelBest(levelId)
  const all = load()
  const cur = all[levelId] || {}
  all[levelId] = {
    bestScore: Math.max(cur.bestScore ?? 0, finalScore),
    // hangers persist as the MAX across runs — never downgraded
    bestHangers: Math.max(cur.bestHangers ?? 0, hangers),
  }
  save(all)
  return { ...all[levelId] }
}
