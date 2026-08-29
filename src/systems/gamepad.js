// Controller support (DESIGN §2.2, guardrail amended 2026-08-28 — this
// was on CLAUDE.md's hard-NO list and the human struck it, ranking it
// above finishing levels 4 and 5).
//
// Phaser's gamepad plugin is enabled in main.js; everything else lives
// here so the scenes never touch pad internals. Actions are named the
// same as the keyboard bindings they parallel, and READ the same way:
// padDown() is level-triggered, padJustDown() is a consumed edge. That
// mirrors Phaser's JustDown, and the consumption matters — two scenes
// can be awake at once (a level under its pause overlay), and without
// it one button press would be handled twice.
//
// Mapping (human ruling): A jump, X tag, LB/RB dash, START pause, B back,
// Y retry (results screen only).
// Dash sits on the shoulder so the stick hand never leaves the stick
// and a dash can be thrown mid-tag.
const DEADZONE = 0.35

// Standard-mapping indices. We read the RAW navigator.getGamepads()
// snapshot by index rather than Phaser's named getters (pad.A, pad.left)
// — those bind to button OBJECTS at Gamepad construction
// (this._LCLeft = buttons[14] ? buttons[14] : _noButton), so a pad that
// enumerated with a different button count when Phaser first saw it has
// its d-pad wired to a dummy forever. Reading raw each frame cannot go
// stale that way. (Human report 2026-08-29: stick worked, d-pad did not.)
const BTN = { A: 0, B: 1, X: 2, Y: 3, LB: 4, RB: 5, SELECT: 8, START: 9, UP: 12, DOWN: 13, LEFT: 14, RIGHT: 15 }

const state = { down: new Set(), prev: new Set(), edges: new Set(), upEdges: new Set(), pads: 0 }

// Non-standard pads often expose the d-pad as a HAT: one axis holding a
// direction in eighths, -1 = up and going clockwise, with a rest value
// outside [-1,1] (7/7 = 1.2857 on many, or exactly 9 on others). Decoded
// only when the axis is present AND in range, so a pad without a hat
// never sees a phantom direction.
function hatDirections(axes, down) {
  const v = axes.length > 9 ? axes[9] : null
  if (v === null || v < -1.01 || v > 1.01) return
  // eighths around the circle from up
  const oct = Math.round(((v + 1) * 7) / 2)
  if ([7, 0, 1].includes(oct)) down.add('up')
  if ([1, 2, 3].includes(oct)) down.add('right')
  if ([3, 4, 5].includes(oct)) down.add('down')
  if ([5, 6, 7].includes(oct)) down.add('left')
}

const pressed = (pad, i) => !!pad.buttons?.[i]?.pressed

function readPad(pad, down) {
  const axes = pad.axes ?? []
  // stick and d-pad both drive the same directions — a booth player
  // will reach for whichever their hands know
  const sx = axes[0] ?? 0
  const sy = axes[1] ?? 0
  if (pressed(pad, BTN.LEFT) || sx < -DEADZONE) down.add('left')
  if (pressed(pad, BTN.RIGHT) || sx > DEADZONE) down.add('right')
  if (pressed(pad, BTN.UP) || sy < -DEADZONE) down.add('up')
  if (pressed(pad, BTN.DOWN) || sy > DEADZONE) down.add('down')
  hatDirections(axes, down)
  if (pressed(pad, BTN.A)) down.add('jump')
  if (pressed(pad, BTN.X)) down.add('tag')
  // dash on EITHER shoulder (human, 2026-08-29) — which hand throws it
  // is the player's business, and it costs nothing to accept both
  if (pressed(pad, BTN.RB) || pressed(pad, BTN.LB)) down.add('dash')
  if (pressed(pad, BTN.B)) down.add('back')
  // RETRY is its own action, used only by the results screen — A is
  // NEXT SHIFT there, so replaying a level needed a button of its own
  if (pressed(pad, BTN.Y)) down.add('retry')
  if (pressed(pad, BTN.START)) down.add('pause')
  if (pressed(pad, BTN.SELECT)) down.add('back')
  // CONFIRM is A in menus — the same physical button as jump, which is
  // safe because menus and play never read the pad in the same frame.
  if (pressed(pad, BTN.A)) down.add('confirm')
  // 'any' backs the press-any-button screens (Title, briefing dismiss)
  if (pad.buttons?.some((b) => b.pressed)) down.add('any')
}

function poll() {
  state.prev = state.down
  const down = new Set()
  const pads = navigator.getGamepads ? navigator.getGamepads() : []
  let count = 0
  // OR across every connected pad: a booth may well have two plugged in
  for (const pad of pads) {
    if (!pad || !pad.connected) continue
    count++
    readPad(pad, down)
  }
  state.pads = count
  state.down = down
  // fresh edges for this frame, consumed by the first reader
  state.edges = new Set([...down].filter((a) => !state.prev.has(a)))
  // RELEASE edges matter as much as presses: variable jump height is
  // driven by the release, so without these a pad jump would always be
  // full height while a keyboard jump could be cut short
  state.upEdges = new Set([...state.prev].filter((a) => !down.has(a)))
}

export function initPad(game) {
  // prestep, so every scene's update() in this frame sees the same
  // snapshot — polling per scene would let the first scene's read race
  // the second's.
  //
  // Phaser's own GamepadPlugin is left enabled in main.js (it owns the
  // connect/disconnect events), but nothing here reads through it: it
  // registers as a SCENE plugin, so there is no game-level instance to
  // hang this on, and its named getters have the construction-time
  // binding problem described above.
  game.events.on('prestep', poll)
}

// Raw snapshot of every connected pad — dev diagnostic, so a controller
// that misbehaves can be identified by what it actually reports rather
// than by guesswork about its mapping.
export function padReport() {
  const pads = navigator.getGamepads ? navigator.getGamepads() : []
  return [...pads].filter(Boolean).map((p) => ({
    id: p.id,
    mapping: p.mapping,
    buttons: p.buttons.length,
    pressed: p.buttons.map((b, i) => (b.pressed ? i : null)).filter((i) => i !== null),
    axes: [...p.axes].map((a) => Math.round(a * 100) / 100),
  }))
}

export function padDown(action) {
  return state.down.has(action)
}

export function padJustDown(action) {
  if (!state.edges.has(action)) return false
  state.edges.delete(action)
  return true
}

export function padJustUp(action) {
  if (!state.upEdges.has(action)) return false
  state.upEdges.delete(action)
  return true
}

// True while ANY pad is connected — used to label the on-screen key
// hints, so a booth player is told the buttons they are actually holding
export function padConnected() {
  return state.pads > 0
}
