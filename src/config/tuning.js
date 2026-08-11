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
  dashSpeed: 400,
  dashDurationMs: 200,
  dashCooldownMs: 900,
  dashDoubleTapMs: 250, // second ←/→ press within this window dashes
  dashCancelsHold: false, // locked out during a hold by default (DESIGN.md §3.2);
  // true lets a dash break the hold (playtest trial, BRIEF-03)

  // teeter (handoff 2026-08-05-b): idle on a platform edge swaps to the
  // teeter anim when the supported fraction of the body drops below this
  teeterSupportFraction: 0.5,

  // tagging
  holdTagMs: 300,
  holdTier2Factor: 0.6, // tier-2 hold duration = holdTagMs * this (BRIEF-03)
  holdDeferredStart: true, // hold start buffering (handoff 2026-08-03-d):
  // held tag intent waits for movement release; false = legacy press-start
  iframesMs: 1100, // post-interrupt grace (handoff 2026-08-07-e): budgeted
  // for re-press + a full tier-3 hold + margin. This is THE lever on the
  // hit-tanking trade (eat one struggle to buy a guaranteed hold) — play
  // showed no dominance at 1100, but enemy density in later levels can
  // change that math (2026-08-09-a).
  targetRadius: 66,
  hitstopMs: 45,

  // rush / spawning — schedules live in assets/waves/*.json now;
  // rushSeconds is a fallback when a map omits the property
  rushSeconds: 150,
  maxItemsOnField: 12,
  itemDragX: 150, // ground skid decay — rescue-dropped items stop in ~0.25s
  // instead of sliding forever (physics fix, 2026-08-03; hold-tags exposed it)
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

  // collectibles (BRIEF-04)
  tagMagnetRadius: 20, // NFC tags drift to Chexy inside this (body center)
  tagScoreValue: 50, // per tag, × adaptive multiplier
  cardLingerMs: 8000, // Contact Card despawn; blink warning final 2000
  insightDurationMs: 10000,
  insightFactor: 2.0, // Insights Report: score gains ×, MULTIPLICATIVE with adaptive

  // valet garage (BRIEF-05): request-queue auto-scroll
  requestGraceMs: 1500, // lead-time slack the request readout must hold
  requestFireDeadlineFrac: 0.75, // a request must arrive before its car
  // crosses this fraction of the screen toward the trailing edge
  // (in-session ruling 2026-08-10) — late requests read as ambushes
  // even when the lead-time math says they're catchable
  luxuryLeadFactor: 1.5, // luxury requests need this × the standard lead
  driveOffDelayMs: 5000, // tagged car sits (elite-vulnerable) before pulling
  // out — retuned 2500→5000 after the first punch list: the tagged
  // backlog must persist long enough for elite pressure to exist
  edgePushMargin: 10, // trailing-edge nudge zone (px past the view edge)
  swarmSlowFactor: 0.4, // swarm contact-slow (2026-08-09-c): speed cap factor
  swarmSlowMs: 600, // refresh-not-stack; dash immune and dash cancels it
  eliteMaxActive: 2, // concurrent elite cap (in-session ruling 2026-08-10):
  // the auto-scroll bounds the usable space — more elites just stack the
  // trailing edge and feed the camp-and-spam loop
  eliteSanctuaryS: 4, // near-safe sanctuary (the -f lever, pulled
  // 2026-08-10): tagged cars within this many seconds of banking at the
  // trailing edge are not valid elite targets — a rip that leaves no
  // time to rescue is an ambush, not a clutch beat
  tagReachY: 28, // feet-level reach gate (in-session ruling 2026-08-10):
  // a car is taggable only when Chexy's feet are within this of the
  // car's wheels — deck cars can't be tagged through the deck floor,
  // so the roof routes and dash gaps are load-bearing, not optional

  // stroller valet (BRIEF-06): rolling items
  strollerSpeed: 45, // mover roll speed. HARD RULE (BRIEF-06 §1): must
  // stay ≤ 0.3× maxSpeed — the mover fairness rail. Spawn-time fairness
  // validation stays honest over a mover's drift only at this ratio
  // (the carrierSpeedFactor logic applied to movers).
  backpackBounce: 0.5, // energetic entrance, settles in ~1s under drag
  cupBounce: 0.75, // high-restitution comedy bouncer, settles ~1.5s
  cupScoreFactor: 0.4, // sippy cups: standard tap, small score (§1)

  // adaptive intensity / multiplier (DESIGN.md §2.5 skeleton)
  adaptiveBand: 0.3,
  adaptiveStep: 0.1,
  cleanStreakForRamp: 5,
  multiplierFloor: 0.7,

  // scoring — heavy items score by commitment (handoff 2026-08-04-a):
  // tier 1 = standard, tier 2 = ×1.5, tier 3 = ×2.0; the adaptive
  // multiplier and BIG DAY bonus apply on top as ever
  standardItemScore: 100,
  tier2ScoreFactor: 1.5,
  tier3ScoreFactor: 2.0,
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
  { key: 'teeterSupportFraction', label: 'Teeter support frac', min: 0.1, max: 0.9, step: 0.05 },
  { key: 'holdTagMs', label: 'Hold-tag (ms)', min: 100, max: 800, step: 10 },
  { key: 'holdTier2Factor', label: 'Tier-2 hold factor', min: 0.3, max: 1, step: 0.05 },
  { key: 'holdDeferredStart', label: 'Hold start buffering', type: 'flag' },
  { key: 'iframesMs', label: 'Interrupt grace (ms)', min: 0, max: 3000, step: 50 },
  { key: 'targetRadius', label: 'Target radius', min: 20, max: 160, step: 2 },
  { key: 'enemyStunMs', label: 'Enemy stun (ms)', min: 300, max: 4000, step: 100 },
  { key: 'spawnFairnessGraceMs', label: 'Spawn fairness grace (ms)', min: 0, max: 2000, step: 50 },
  { key: 'freshItemGraceMs', label: 'Fresh item grace (ms)', min: 0, max: 3000, step: 50 },
  { key: 'itemDragX', label: 'Item skid drag', min: 0, max: 600, step: 10 },
  { key: 'carrierSpeedFactor', label: 'Carrier speed factor', min: 0.2, max: 1, step: 0.05 },
  { key: 'gloatMs', label: 'Gloat beat (ms)', min: 0, max: 2500, step: 50 },
  { key: 'stealCooldownMs', label: 'Steal cooldown (ms)', min: 0, max: 10000, step: 250 },
  { key: 'stealFairnessMarginMs', label: 'Steal margin (ms)', min: 0, max: 2000, step: 50 },
  { key: 'loiterRadius', label: 'Loiter radius', min: 8, max: 80, step: 2 },
  { key: 'loiterOrbitMs', label: 'Loiter orbit (ms)', min: 1000, max: 8000, step: 200 },
  { key: 'requestGraceMs', label: 'Request grace (ms)', min: 0, max: 5000, step: 100 },
  { key: 'requestFireDeadlineFrac', label: 'Request deadline (screen frac)', min: 0.3, max: 0.95, step: 0.05 },
  { key: 'luxuryLeadFactor', label: 'Luxury lead factor', min: 1, max: 3, step: 0.1 },
  { key: 'driveOffDelayMs', label: 'Drive-off delay (ms)', min: 0, max: 6000, step: 250 },
  { key: 'swarmSlowFactor', label: 'Swarm slow factor', min: 0.1, max: 1, step: 0.05 },
  { key: 'swarmSlowMs', label: 'Swarm slow (ms)', min: 0, max: 2000, step: 50 },
  { key: 'eliteMaxActive', label: 'Elite cap', min: 0, max: 8, step: 1 },
  { key: 'eliteSanctuaryS', label: 'Elite sanctuary (s)', min: 0, max: 8, step: 0.5 },
  { key: 'tagReachY', label: 'Tag reach (y px)', min: 8, max: 96, step: 2 },
  { key: 'strollerSpeed', label: 'Stroller speed', min: 10, max: 45, step: 5 },
  { key: 'backpackBounce', label: 'Backpack bounce', min: 0.1, max: 0.9, step: 0.05 },
  { key: 'cupBounce', label: 'Cup bounce', min: 0.3, max: 0.95, step: 0.05 },
  { key: 'tagMagnetRadius', label: 'Tag magnet radius', min: 0, max: 80, step: 2 },
  { key: 'tagScoreValue', label: 'Tag score', min: 0, max: 200, step: 10 },
  { key: 'cardLingerMs', label: 'Card linger (ms)', min: 2000, max: 20000, step: 500 },
  { key: 'insightDurationMs', label: 'Insight duration (ms)', min: 3000, max: 30000, step: 500 },
  { key: 'insightFactor', label: 'Insight factor', min: 1, max: 4, step: 0.25 },
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
