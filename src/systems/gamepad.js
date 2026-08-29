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
// Mapping (human ruling): A jump, X tag, RB dash, START pause, B back.
// Dash sits on the shoulder so the stick hand never leaves the stick
// and a dash can be thrown mid-tag.
const DEADZONE = 0.35

// Standard-mapping button indices, used where Phaser exposes no named
// property. 9 = Start, 8 = Select/Back.
const BTN_START = 9
const BTN_SELECT = 8

const state = { down: new Set(), prev: new Set(), edges: new Set(), upEdges: new Set(), pads: 0 }

function readPad(pad, down) {
  // stick and d-pad both drive the same directions — a booth player
  // will reach for whichever their hands know
  const sx = pad.leftStick ? pad.leftStick.x : 0
  const sy = pad.leftStick ? pad.leftStick.y : 0
  if (pad.left || sx < -DEADZONE) down.add('left')
  if (pad.right || sx > DEADZONE) down.add('right')
  if (pad.up || sy < -DEADZONE) down.add('up')
  if (pad.down || sy > DEADZONE) down.add('down')
  if (pad.A) down.add('jump')
  if (pad.X) down.add('tag')
  if (pad.R1) down.add('dash')
  if (pad.B) down.add('back')
  if (pad.buttons?.[BTN_START]?.pressed) down.add('pause')
  if (pad.buttons?.[BTN_SELECT]?.pressed) down.add('back')
  // CONFIRM is A in menus — the same physical button as jump, which is
  // safe because menus and play never read the pad in the same frame.
  if (pad.A) down.add('confirm')
  // 'any' backs the press-any-button screens (Title, briefing dismiss)
  if (pad.buttons?.some((b) => b.pressed)) down.add('any')
}

function poll(plugin) {
  state.prev = state.down
  const down = new Set()
  // Refresh before reading. The plugin's own refreshPads() runs during
  // its scene's update, which is AFTER prestep — without this we would
  // read last frame's pad and compute edges against stale data.
  plugin.refreshPads()
  const pads = plugin.getAll()
  state.pads = pads.length
  // OR across every connected pad: a booth may well have two plugged in
  for (const pad of pads) if (pad) readPad(pad, down)
  state.down = down
  // fresh edges for this frame, consumed by the first reader
  state.edges = new Set([...down].filter((a) => !state.prev.has(a)))
  // RELEASE edges matter as much as presses: variable jump height is
  // driven by the release, so without these a pad jump would always be
  // full height while a keyboard jump could be cut short
  state.upEdges = new Set([...state.prev].filter((a) => !down.has(a)))
}

// Phaser registers GamepadPlugin as a SCENE input plugin (scene.input
// .gamepad) — there is no game-level instance, so game.input.gamepad is
// undefined and an early return on it would silently disable everything
// here. Every scene's plugin reads the same navigator.getGamepads(), so
// any live one will do.
function findPlugin(game) {
  for (const scene of game.scene.getScenes(true)) {
    if (scene.input?.gamepad) return scene.input.gamepad
  }
  return null
}

export function initPad(game) {
  // prestep, so every scene's update() in this frame sees the same
  // snapshot — polling per scene would let the first scene's read race
  // the second's
  game.events.on('prestep', () => {
    const plugin = findPlugin(game)
    if (!plugin) {
      // no scene awake yet, or a browser without the Gamepad API
      state.prev = state.down
      state.down = new Set()
      state.edges = new Set()
      state.upEdges = new Set()
      state.pads = 0
      return
    }
    poll(plugin)
  })
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
