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
  // travel budget — instrument three (handoff 2026-08-10-c): fairness
  // floor = catchability per event, tension band = heat per request,
  // travel budget = serial ROUTING feasibility. No schedule may demand
  // an impossible itinerary. Instrument applicability is per-level
  // grammar (2026-08-11-b): no request surface = no tension band —
  // absence is N/A, not omission.
  travelBudgetFactor: 0.8, // required serial travel may use at most this
  // fraction of wall-clock across the window — the player must never
  // need >80% of real time just in transit
  travelBudgetWindowS: 12, // sliding window the itinerary is judged over
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

  // parallax glow overlay (the Coatroom's stage wash and the Bell Desk's
  // chandelier): alpha breathes between glowMin and glowMax once per
  // glowPeriodMs. Values are shared by every level that ships a
  // glow.png — there is no per-level pulse today.
  glowMin: 0.3, // human note 2026-08-12: a deep low end reads as the
  // glow breathing OUT rather than merely dimming
  glowMax: 0.48, // human, dialled in play 2026-08-24: the ceiling is a
  // sustained warmth, not a beacon — the band now runs 0.30-0.48, a
  // sixth of the range it shipped with
  glowPeriodMs: 2200,

  // fg light pools (art/garage-inventory §(d)). Two dials:
  //
  // AMBIENT is the one that makes the pools work at all. Additive light
  // can only brighten what has headroom, and the garage floor is light
  // grey — pools drawn on it clip to white no matter how they're drawn.
  // A MULTIPLY scrim under the fg layer dims the ROOM so the light has
  // somewhere to go. 1 = no dim (pools clip); below ~0.6 the cars and
  // elites stop reading, which is a gameplay floor, not a taste one.
  fgAmbient: 0.7,
  // FLICKER: sodium lamps buzz. Two incommensurate sines on the fg
  // layer's alpha — a slow breath the eye reads as the tube warming,
  // plus a faster ripple that keeps it from looking like a tween. Sum
  // stays in [-1,1], so min/max are hard bounds and no clamp is needed.
  // Human values from play (2026-08-14): the dip goes to 0.44 and the
  // ripple to 250ms — a failing tube that stutters, not the subtle
  // breath the first pass shipped. It rides every pool on screen at
  // once, so the depth is the lever that matters most.
  fgFlickerMin: 0.44,
  fgFlickerMax: 1,
  fgFlickerHumMs: 4600, // the slow breath
  fgFlickerBuzzMs: 250, // the stutter on top
  fgFlicker: true, // flag: off = pools hold a steady alpha 1

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
  carEjectSpeed: 220, // wedge eject (human report 2026-08-14): a dash into
  // a car that is already leaving the screen has no far side to reach, so
  // Chexy is backed out to the RIGHT at this rate instead of riding
  // inside it. Above maxSpeed on purpose — holding left must not beat it.
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

  // The Paper Ticket King (BRIEF-07 Act 2 / BOSS-SPEC as amended by
  // handoff 2026-08-11-a). He is never damaged by tagging — damage is
  // THE LINE MOVING: successful returns advance the meter.
  bossReturnThresholds: [12, 15, 18], // POINTS per phase, tier-weighted
  // (standard 1.0, tier-2 1.5, tier-3 2.0, strollers 1.0) — supersedes
  // BOSS-SPEC's flat 10/12/14 return COUNTS. Rips regress by exactly the
  // ripped item's weight and restores re-add it (symmetric; the old
  // stealRefund is deleted, never built).
  bossSpeedByPhase: [26, 38, 54], // small = desperate = fast
  bossTelegraphMsByPhase: [1100, 850, 650], // counter-tap windows, measured
  // from PRESS — they budget the ~80ms tap windup (BOSS-SPEC forward note)
  bossSpewCountByPhase: [3, 5, 7],
  bossSpewIntervalMs: [9000, 7500, 6000],
  bossClawIntervalMs: [5200, 4200, 3400],
  bossStealCooldownMs: [5000, 4200, 3500], // per-phase minion steal spacing
  bossTransitionMs: 1000, // stagger between body states
  bossWatchdogMs: 4000, // state-machine watchdog (BRIEF-07 §5)
  bossDoorBreathMs: 2600, // the lobby empties before Act 2
  // his kit — every attack targets THE JOB, never Chexy's health
  slipFactor: 0.45, // Paper Carpet TRACTION multiplier on accel AND
  // decel (ratified 2026-08-13-b): the floor turns slippery, not slow —
  // slower to start, slower to stop, same top speed. Dash immunity is
  // free (a dash sets velocity with acceleration zeroed), which is the
  // dash's finale moment. NOT interrupt-class; re-asserted per frame.
  bossCarpetMs: 7000,
  bossCarpetWidth: 150,
  bossCarpetIntervalMs: [11000, 9000, 7500],
  bossTornadoCount: 3, // UNCHECKED items re-routed, never lost
  bossTornadoIntervalMs: [0, 12000, 9500], // phase 2+
  bossGrabIntervalMs: [0, 0, 8500], // phase 3 only
  grabMashMs: 1500, // lost TIME, not lost items; a graced player is immune
  grabMashRelief: 110, // each key press shaves this much off the hold
  bossLastGaspFrac: 0.9, // one scripted all-out wave near the end
  bossLastGaspMs: 6000, // how long that wave's window lasts
  lastGaspStealCooldownMs: 2000, // inside Last Gasp the SPAWN burst is
  // exempt from pacing, but steal INITIATIONS run this compressed clock
  // instead of the phase's — chases stay sequential even at the climax
  // (ratified 2026-08-13-b)

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
  // guest-bubble yield (human report 2026-08-24): a bubble dims to this
  // when an untagged item, a collectible or Chexy is behind it. 1
  // disables the behaviour; 0 hides the bubble entirely.
  bubbleYieldAlpha: 0.3,

  masterVolume: 1,
  sfxVolume: 1,
  musicVolume: 0.35, // lowered from 0.5 (human, 2026-08-21) — the real
  // tracks sit louder than the synth stub they replaced

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
  { key: 'travelBudgetFactor', label: 'Travel budget factor', min: 0.3, max: 1, step: 0.05 },
  { key: 'travelBudgetWindowS', label: 'Travel window (s)', min: 4, max: 30, step: 1 },
  { key: 'loiterRadius', label: 'Loiter radius', min: 8, max: 80, step: 2 },
  { key: 'loiterOrbitMs', label: 'Loiter orbit (ms)', min: 1000, max: 8000, step: 200 },
  { key: 'requestGraceMs', label: 'Request grace (ms)', min: 0, max: 5000, step: 100 },
  { key: 'requestFireDeadlineFrac', label: 'Request deadline (screen frac)', min: 0.3, max: 0.95, step: 0.05 },
  { key: 'luxuryLeadFactor', label: 'Luxury lead factor', min: 1, max: 3, step: 0.1 },
  { key: 'driveOffDelayMs', label: 'Drive-off delay (ms)', min: 0, max: 6000, step: 250 },
  { key: 'carEjectSpeed', label: 'Car eject speed', min: 60, max: 400, step: 10 },
  { key: 'swarmSlowFactor', label: 'Swarm slow factor', min: 0.1, max: 1, step: 0.05 },
  { key: 'swarmSlowMs', label: 'Swarm slow (ms)', min: 0, max: 2000, step: 50 },
  { key: 'eliteMaxActive', label: 'Elite cap', min: 0, max: 8, step: 1 },
  { key: 'eliteSanctuaryS', label: 'Elite sanctuary (s)', min: 0, max: 8, step: 0.5 },
  { key: 'tagReachY', label: 'Tag reach (y px)', min: 8, max: 96, step: 2 },
  { key: 'strollerSpeed', label: 'Stroller speed', min: 10, max: 45, step: 5 },
  { key: 'backpackBounce', label: 'Backpack bounce', min: 0.1, max: 0.9, step: 0.05 },
  { key: 'tagMagnetRadius', label: 'Tag magnet radius', min: 0, max: 80, step: 2 },
  { key: 'tagScoreValue', label: 'Tag score', min: 0, max: 200, step: 10 },
  { key: 'cardLingerMs', label: 'Card linger (ms)', min: 2000, max: 20000, step: 500 },
  { key: 'insightDurationMs', label: 'Insight duration (ms)', min: 3000, max: 30000, step: 500 },
  { key: 'insightFactor', label: 'Insight factor', min: 1, max: 4, step: 0.25 },
  { key: 'adaptiveBand', label: 'Adaptive band', min: 0, max: 0.6, step: 0.05 },
  { key: 'multiplierFloor', label: 'Multiplier floor', min: 0.4, max: 1, step: 0.05 },
  { key: 'glowMin', label: 'Glow pulse min alpha', min: 0, max: 1, step: 0.02 },
  { key: 'glowMax', label: 'Glow pulse max alpha', min: 0, max: 1, step: 0.02 },
  { key: 'glowPeriodMs', label: 'Glow pulse period (ms)', min: 400, max: 8000, step: 100 },
  { key: 'bubbleYieldAlpha', label: 'Bubble yield alpha', min: 0, max: 1, step: 0.05 },
  { key: 'masterVolume', label: 'Master volume', min: 0, max: 1, step: 0.05 },
  { key: 'sfxVolume', label: 'SFX volume', min: 0, max: 1, step: 0.05 },
  { key: 'musicVolume', label: 'Music volume', min: 0, max: 1, step: 0.05 },
  { key: 'fgAmbient', label: 'Ambient light', min: 0.4, max: 1, step: 0.02 },
  { key: 'fgFlickerMin', label: 'Lamp flicker min alpha', min: 0.3, max: 1, step: 0.02 },
  { key: 'fgFlickerMax', label: 'Lamp flicker max alpha', min: 0.3, max: 1, step: 0.02 },
  { key: 'fgFlickerHumMs', label: 'Lamp hum period (ms)', min: 800, max: 9000, step: 100 },
  { key: 'fgFlickerBuzzMs', label: 'Lamp buzz period (ms)', min: 100, max: 3000, step: 50 },
  { key: 'fgFlicker', label: 'Lamp flicker', type: 'flag' },
  { key: 'physicsFixedStep', label: 'Fixed physics step', type: 'flag' },
  { key: 'godMode', label: 'God mode', type: 'flag' },
  { key: 'fairnessDebug', label: 'Fairness overlay', type: 'flag' },
  { key: 'targetLockDebug', label: 'Target lock lines', type: 'flag' },
]
