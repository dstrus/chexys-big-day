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
