// All tunable gameplay values live here — never hardcode these in scene
// logic (CLAUDE.md). The debug tuning panel (backtick) reads and writes
// this object live; its "Copy values" button dumps it as JSON so final
// numbers can be pasted back into this file.

export const TUNING = {
  // physics / movement
  gravity: 950,
  moveAccel: 1600,
  moveDecel: 2400,
  maxSpeed: 150,
  playerSize: 32,
  jumpVelocity: -340, // max jump height = v^2/2g ≈ 61px at gravity 950
  jumpCutMultiplier: 0.45,
  coyoteMs: 100,
  bufferMs: 120,
  fallMaxSpeed: 520,

  // dash (stub — implemented but disabled for the grey-box)
  dashEnabled: false,
  dashSpeed: 340,
  dashDurationMs: 140,

  // tagging
  holdTagMs: 300,
  targetRadius: 66,
  hitstopMs: 45,

  // rush / spawning — schedules live in assets/waves/*.json now;
  // rushSeconds is a fallback when a map omits the property
  rushSeconds: 150,
  maxItemsOnField: 12,
  enemySpeed: 55,
  // spawn fairness (DESIGN.md §2.4 — unconditional, outside the adaptive band)
  spawnFairnessGraceMs: 600,
  freshItemGraceMs: 800,
  enemyStunMs: 1500,
  enemyStealGraceMs: 1000, // no re-steal window after a stun wears off

  // adaptive intensity / multiplier (DESIGN.md §2.5 skeleton)
  adaptiveBand: 0.3,
  adaptiveStep: 0.1,
  cleanStreakForRamp: 5,
  multiplierFloor: 0.7,

  // scoring
  standardItemScore: 100,
  heavyItemScore: 300,

  // debug helpers
  godMode: false, // steals still happen but never count toward the 3-lost fail
  fairnessDebug: false, // draw spawn-fairness estimates while the panel is open
}

// Slider metadata for the debug tuning panel.
export const TUNING_SCHEMA = [
  { key: 'gravity', label: 'Gravity', min: 300, max: 2000, step: 10 },
  { key: 'playerSize', label: 'Player size', min: 24, max: 72, step: 2 },
  { key: 'moveAccel', label: 'Move accel', min: 400, max: 4000, step: 50 },
  { key: 'moveDecel', label: 'Move decel', min: 400, max: 5000, step: 50 },
  { key: 'maxSpeed', label: 'Max speed', min: 60, max: 320, step: 5 },
  // negate: value is stored negative (up = -y) but the slider shows its
  // magnitude so dragging right = jumping higher
  { key: 'jumpVelocity', label: 'Jump velocity', min: 120, max: 520, step: 5, negate: true },
  { key: 'jumpCutMultiplier', label: 'Jump cut mult', min: 0.1, max: 1, step: 0.05 },
  { key: 'coyoteMs', label: 'Coyote (ms)', min: 0, max: 300, step: 10 },
  { key: 'bufferMs', label: 'Jump buffer (ms)', min: 0, max: 300, step: 10 },
  { key: 'dashEnabled', label: 'Dash enabled', type: 'flag' },
  { key: 'dashSpeed', label: 'Dash speed', min: 180, max: 600, step: 10 },
  { key: 'dashDurationMs', label: 'Dash duration (ms)', min: 60, max: 400, step: 10 },
  { key: 'holdTagMs', label: 'Hold-tag (ms)', min: 100, max: 800, step: 10 },
  { key: 'targetRadius', label: 'Target radius', min: 20, max: 160, step: 2 },
  { key: 'enemyStunMs', label: 'Enemy stun (ms)', min: 300, max: 4000, step: 100 },
  { key: 'spawnFairnessGraceMs', label: 'Spawn fairness grace (ms)', min: 0, max: 2000, step: 50 },
  { key: 'freshItemGraceMs', label: 'Fresh item grace (ms)', min: 0, max: 3000, step: 50 },
  { key: 'adaptiveBand', label: 'Adaptive band', min: 0, max: 0.6, step: 0.05 },
  { key: 'multiplierFloor', label: 'Multiplier floor', min: 0.4, max: 1, step: 0.05 },
  { key: 'godMode', label: 'God mode', type: 'flag' },
  { key: 'fairnessDebug', label: 'Fairness overlay', type: 'flag' },
]
