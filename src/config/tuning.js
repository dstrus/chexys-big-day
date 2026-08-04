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

  // dash (BRIEF-03: unlocks via the Bell Desk scripted beat and persists
  // in progress; dashEnabled remains the debug/panel override)
  dashEnabled: false,
  dashSpeed: 340,
  dashDurationMs: 140,
  dashCooldownMs: 900,
  dashDoubleTapMs: 250, // second ←/→ press within this window dashes
  dashCancelsHold: false, // locked out during a hold by default (DESIGN.md §3.2);
  // true lets a dash break the hold (playtest trial, BRIEF-03)

  // tagging
  holdTagMs: 300,
  holdTier2Factor: 0.6, // tier-2 hold duration = holdTagMs * this (BRIEF-03)
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
  // steal fairness (DESIGN.md §2.4 — unconditional)
  carrierSpeedFactor: 0.5, // carrying encumbers a ticket (locked, handoff 2026-07-30-g)
  gloatMs: 700, // taunt beat before the carrier moves
  stealCooldownMs: 6000, // gates steal INITIATIONS only (menace is free,
  // commitments are spaced); per-level override via map property, trending
  // down as player mobility grows (Coatroom 6000 ... finale ~4000)
  stealFairnessMarginMs: 500, // slack the (c) escape-time assertion must hold by
  enemyStunMs: 1500,
  enemyStealGraceMs: 1000, // no re-steal window after a stun wears off
  // menace loiter (grab-state wedge investigation 2026-08-03): an enemy
  // not yet cleared to steal circles its locked target instead of
  // camping dead-center on it — camping read as a stuck grab/gloat
  loiterRadius: 28,
  loiterOrbitMs: 3800, // full circle period while loitering

  // adaptive intensity / multiplier (DESIGN.md §2.5 skeleton)
  adaptiveBand: 0.3,
  adaptiveStep: 0.1,
  cleanStreakForRamp: 5,
  multiplierFloor: 0.7,

  // scoring
  standardItemScore: 100,
  heavyItemScore: 300,
  bigDayBonusFactor: 0.25, // 3-hanger clear bonus (DESIGN.md §2.5)

  // audio (master/sfx/music mix — AudioBus + synth read these live)
  masterVolume: 1,
  sfxVolume: 1,
  musicVolume: 0.5,

  // debug helpers
  // fixed 60Hz physics steps. A/B testing on real hardware showed the
  // variable-step mode (fixedStep=false) produces a per-frame position
  // alternation ("two copies of the sprite"); fixed step does not. The
  // toggle remains on the panel for future investigation.
  physicsFixedStep: true,
  godMode: false, // steals still happen but never count toward the 3-lost fail
  fairnessDebug: false, // draw spawn-fairness estimates while the panel is open
  targetLockDebug: false, // draw enemy -> locked-target lines while the panel is open
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
  { key: 'dashCooldownMs', label: 'Dash cooldown (ms)', min: 0, max: 3000, step: 50 },
  { key: 'dashCancelsHold', label: 'Dash cancels hold', type: 'flag' },
  { key: 'holdTagMs', label: 'Hold-tag (ms)', min: 100, max: 800, step: 10 },
  { key: 'holdTier2Factor', label: 'Tier-2 hold factor', min: 0.3, max: 1, step: 0.05 },
  { key: 'targetRadius', label: 'Target radius', min: 20, max: 160, step: 2 },
  { key: 'enemyStunMs', label: 'Enemy stun (ms)', min: 300, max: 4000, step: 100 },
  { key: 'spawnFairnessGraceMs', label: 'Spawn fairness grace (ms)', min: 0, max: 2000, step: 50 },
  { key: 'freshItemGraceMs', label: 'Fresh item grace (ms)', min: 0, max: 3000, step: 50 },
  { key: 'carrierSpeedFactor', label: 'Carrier speed factor', min: 0.2, max: 1, step: 0.05 },
  { key: 'gloatMs', label: 'Gloat beat (ms)', min: 0, max: 2500, step: 50 },
  { key: 'stealCooldownMs', label: 'Steal cooldown (ms)', min: 0, max: 10000, step: 250 },
  { key: 'stealFairnessMarginMs', label: 'Steal margin (ms)', min: 0, max: 2000, step: 50 },
  { key: 'loiterRadius', label: 'Loiter radius', min: 8, max: 80, step: 2 },
  { key: 'loiterOrbitMs', label: 'Loiter orbit (ms)', min: 1000, max: 8000, step: 200 },
  { key: 'adaptiveBand', label: 'Adaptive band', min: 0, max: 0.6, step: 0.05 },
  { key: 'multiplierFloor', label: 'Multiplier floor', min: 0.4, max: 1, step: 0.05 },
  { key: 'masterVolume', label: 'Master volume', min: 0, max: 1, step: 0.05 },
  { key: 'sfxVolume', label: 'SFX volume', min: 0, max: 1, step: 0.05 },
  { key: 'musicVolume', label: 'Music volume', min: 0, max: 1, step: 0.05 },
  { key: 'physicsFixedStep', label: 'Fixed physics step', type: 'flag' },
  { key: 'godMode', label: 'God mode', type: 'flag' },
  { key: 'fairnessDebug', label: 'Fairness overlay', type: 'flag' },
  { key: 'targetLockDebug', label: 'Target lock lines', type: 'flag' },
]
