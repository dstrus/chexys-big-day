import { TUNING } from './tuning.js'

// Selectable difficulty (amends DESIGN.md §2.5, human ruling 2026-08-26).
//
// §2.5 resolved difficulty as ADAPTIVE ONLY: one baseline per level with
// intensity floating in a band around it, paid for by a score multiplier.
// That still holds — this adds a second, PLAYER-CHOSEN layer underneath
// it, because the game is likely to be shown at a convention booth where
// a first-timer gets one short run and no coaching.
//
// The mode does not replace adaptation, it MOVES ITS CENTRE. FULL RUSH
// is the balance the game was tuned and signed off at (base 1.0, and
// every factor 1 — it must be bit-identical to pre-mode behaviour).
// FIRST DAY recentres the same band lower and pays the same way §2.5
// already established: easier play scores less, visibly, on one shared
// table.
//
// Levers are deliberately narrow (human ruling): thin the PRESSURE and
// widen the RECOVERY, but never touch the tag verb (targetRadius, hold
// durations) or the rush clock. A booth player should meet the same
// game running cooler — not a different game with a bigger hitbox, and
// not a longer session than the 15-20 minute full-clear target.
export const MODES = [
  {
    id: 'firstDay',
    label: 'FIRST DAY',
    blurb: 'Fewer tickets. More room to recover.',
    // wave counts scale by this and intervals divide by it (WaveRunner),
    // so 0.75 is both thinner waves and longer gaps between them
    intensityBase: 0.75,
    multiplierBase: 0.7,
    factors: {
      enemySpeed: 0.85, // a ticket you can outrun
      stealCooldownMs: 1.4, // steal INITIATIONS spaced out; menace is free
      iframesMs: 1.5, // an interrupted hold can actually be re-attempted
      enemyStealGraceMs: 1.5, // and a stunned ticket stays off you longer
    },
  },
  {
    id: 'fullRush',
    label: 'FULL RUSH',
    blurb: 'The balance the game was tuned at.',
    intensityBase: 1,
    multiplierBase: 1,
    factors: {},
  },
]

// SESSION-SCOPED on purpose: not in progress.js, not in localStorage.
// A booth machine must come up on FIRST DAY for the next stranger even
// if the last player switched — persistence would leave full heat armed
// for someone who never chose it.
let index = 0

export function currentMode() {
  return MODES[index]
}

export function modeIndex() {
  return index
}

export function setModeIndex(i) {
  index = Math.max(0, Math.min(MODES.length - 1, i | 0))
  return MODES[index]
}

export function cycleMode(dir) {
  index = (index + dir + MODES.length) % MODES.length
  return MODES[index]
}

// The mode's multiplier on a single TUNING value. Every read site of a
// modded key must go through here — including the FAIRNESS instruments,
// which predict enemy travel from enemySpeed (§2.4). If the sim used the
// effective speed and the prediction used the raw one, the spawn/steal
// guarantees would be computed against an enemy that does not exist.
export function diff(key) {
  return TUNING[key] * (currentMode().factors[key] ?? 1)
}

// Same factor applied to an already-resolved value — for keys a level
// may override via a map property (stealCooldownMs trends down across
// the roster), where the override, not the TUNING default, is the base.
export function scaled(key, value) {
  return value * (currentMode().factors[key] ?? 1)
}
