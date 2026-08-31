import Phaser from 'phaser'
import { GAME_WIDTH, GAME_HEIGHT } from '../main.js'
import { addInputSource } from '../systems/deviceInput.js'

// On-screen controls for touch devices (DESIGN §2.2, guardrail amended
// 2026-08-30 — "Mobile/touch controls" was the last hard-NO and the
// human struck it).
//
// Layout per human ruling: discrete ◀ ▶ under the left thumb, the verbs
// under the right. Discrete pads rather than a virtual stick because
// Chexy only ever moves at full speed — an analogue axis would add a
// deadzone to tune for input the game cannot express.
//
// This scene draws the buttons and reports which are held; it never
// touches gameplay. It registers as an INPUT SOURCE (systems/deviceInput)
// so a press arrives as the same named action a gamepad would produce,
// which is why nothing downstream needed a third input term.
//
// Hit-testing is done by POSITION each frame rather than with per-button
// pointer events: a thumb that slides from ◀ to ▶ without lifting should
// change direction, and two thumbs must work at once. Polling positions
// gets both for free; pointer events would need enter/leave bookkeeping
// per button and still lose the slide.
// Sizes. The action buttons were 21px radius and the human kept missing
// them on a real phone (2026-08-30), so the verbs are now 28 — 56px
// across, which at the ~1.44 zoom a handset runs is roughly 12mm of
// glass, comfortably above the ~9mm the old size gave.
const R_ACTION = 28
const R_CURSOR = 22 // menu arrows: pressed once, not held under pressure
const R_SMALL = 17 // pause
const PAD = 8

// The floating stick (human ruling 2026-08-30, replacing the discrete
// ◀ ▶ pads). It springs up wherever the left thumb lands, so there is
// nothing to miss — which was the same complaint that grew the buttons.
const STICK_ZONE_X = 216 // left of the action cluster, which starts at 288
const STICK_DEAD = 7 // travel before a direction registers, in game px
const STICK_MAX = 22 // how far the thumb dot rides from the origin
const STICK_REST = { x: 72, y: 210 } // faint ghost when untouched, so the
// control is discoverable before anyone touches the screen

// Two layouts, built LAZILY. Menus need a cursor and confirm/back; play
// needs the verbs. Nothing is shared but the pause button, so they are
// simply separate tables.
//
// These are functions, not module constants, because main.js imports
// this scene while this scene imports main.js's GAME_WIDTH/GAME_HEIGHT —
// a cycle. Every other scene gets away with it by only reading those
// inside create(); reading them at module level hits the temporal dead
// zone and the whole game fails to boot.
//
// Movement is NOT in this table during play: the stick owns it.
function playLayout() {
  const y = GAME_HEIGHT - 36
  const right = GAME_WIDTH - 36
  const stepX = R_ACTION * 2 + PAD
  return [
    // one bottom row, thumb resting on JUMP and sliding left to reach
    // the others — three stacked buttons would climb into the play area
    { action: 'dash', label: 'DASH', x: right - stepX * 2, y, dash: true },
    { action: 'tag', label: 'TAG', x: right - stepX, y },
    { action: 'jump', label: 'JUMP', x: right, y },
    // clear of the HUD: the score sits at y6 and the multiplier at
    // y19-32, and a circle centred at y40 covered the multiplier — the
    // one readout DESIGN §2.5 requires to stay legible
    { action: 'pause', label: '❚❚', x: GAME_WIDTH - 20, y: 58, r: R_SMALL },
  ]
}

function menuLayout() {
  const y = GAME_HEIGHT - 36
  return [
    { action: 'up', label: '▲', x: 44, y: y - R_CURSOR * 2 - PAD, r: R_CURSOR },
    { action: 'down', label: '▼', x: 44, y, r: R_CURSOR },
    { action: 'left', label: '◀', x: 44 + R_CURSOR * 2 + PAD, y: y - R_CURSOR - PAD / 2, r: R_CURSOR },
    {
      action: 'right',
      label: '▶',
      x: 44 + R_CURSOR * 4 + PAD * 2,
      y: y - R_CURSOR - PAD / 2,
      r: R_CURSOR,
    },
    { action: 'confirm', label: 'OK', x: GAME_WIDTH - 36, y },
    { action: 'back', label: 'BACK', x: GAME_WIDTH - 36 - R_ACTION * 2 - PAD, y },
  ]
}

const radiusOf = (b) => b.r ?? R_ACTION

export default class TouchScene extends Phaser.Scene {
  constructor() {
    super('Touch')
  }

  create() {
    // several fingers at once: a player holding ◀ and pressing TAG is
    // two pointers, and Phaser tracks only one by default
    this.input.addPointer(3)

    this.buttons = []
    this.mode = null
    this.held = new Set()
    // the stick: which pointer owns it, where it sprang up, where the
    // thumb is now. id null = nobody is steering.
    this.stick = { id: null, ox: 0, oy: 0, x: 0, y: 0 }

    this.gfx = this.add.graphics().setDepth(60)
    this.labels = new Map()

    // The hit-test runs HERE, inside the source, because deviceInput
    // pulls sources at prestep while a scene's update() runs after it.
    // Doing the test in update() made every touch arrive a frame late —
    // measurable as a TAG press-edge landing on frame 2 instead of
    // frame 1. Pointer state is set by the DOM handlers between frames,
    // so it is already current when this is called.
    this.source = (down) => {
      const mode = this.currentMode()
      this.stickActive = mode === 'play'
      this.buttons = this.buttonsFor(mode === 'play' ? playLayout() : menuLayout())
      // stick first: it decides which pointer is steering, and
      // computeHeld must then ignore that pointer
      this.updateStick(down, this.stickActive)
      this.held = this.computeHeld()
      for (const action of this.held) down.add(action)
      // any held control also satisfies the press-any-button screens
      if (this.held.size > 0) down.add('any')
    }
    addInputSource(this.source)
  }

  // Which layout the player needs right now: the verbs (and the stick)
  // while a rush is actually running, the cursor everywhere else —
  // title, roster, briefing, pause menu, results.
  currentMode() {
    const level = this.game.scene
      .getScenes(true)
      .find((s) => s.player && !s.scene.isPaused(s.scene.key))
    if (!level) return 'menu'
    // a results screen is a menu even though its level scene is awake
    if (level.runOver) return 'menu'
    return 'play'
  }

  buttonsFor(layout) {
    const level = this.game.scene.getScenes(true).find((s) => s.player)
    return layout.filter((b) => {
      // dash is level-gated and progression-gated — showing a button
      // that does nothing teaches the wrong thing on the first shift
      if (b.dash) return typeof level?.isDashAvailable === 'function' && level.isDashAvailable()
      return true
    })
  }

  // every active pointer against every button — several fingers at once,
  // and a finger that slides between buttons keeps working
  computeHeld() {
    const held = new Set()
    const pointers = this.pointers()
    for (const p of pointers) {
      if (!p || !p.isDown) continue
      // the pointer steering the stick is not also pressing buttons
      if (p.id === this.stick.id) continue
      for (const b of this.buttons) {
        if (Phaser.Math.Distance.Between(p.x, p.y, b.x, b.y) <= radiusOf(b)) held.add(b.action)
      }
    }
    return held
  }

  pointers() {
    return [this.input.pointer1, this.input.pointer2, this.input.pointer3, this.input.pointer4]
  }

  // The floating stick. It claims the first pointer pressed in the left
  // zone that is not on a button, springs up at that exact spot, and
  // holds that pointer until it lifts — so the thumb can wander well
  // outside the zone mid-swipe without the stick letting go.
  //
  // Direction is BINARY past a deadzone, because Chexy has one speed.
  // The stick's job here is not analogue control, it is being
  // impossible to miss (the human's report: the fixed pads were).
  updateStick(down, stickActive) {
    if (!stickActive) {
      this.stick.id = null
      return
    }
    const pointers = this.pointers()

    // keep or drop the pointer we already own
    if (this.stick.id !== null) {
      const owner = pointers.find((p) => p && p.id === this.stick.id && p.isDown)
      if (owner) {
        this.stick.x = owner.x
        this.stick.y = owner.y
      } else {
        this.stick.id = null
      }
    }

    // otherwise claim one
    if (this.stick.id === null) {
      for (const p of pointers) {
        if (!p || !p.isDown || p.x > STICK_ZONE_X) continue
        const onButton = this.buttons.some(
          (b) => Phaser.Math.Distance.Between(p.x, p.y, b.x, b.y) <= radiusOf(b)
        )
        if (onButton) continue
        this.stick.id = p.id
        this.stick.ox = p.x
        this.stick.oy = p.y
        this.stick.x = p.x
        this.stick.y = p.y
        break
      }
    }

    if (this.stick.id === null) return
    const dx = this.stick.x - this.stick.ox
    if (dx <= -STICK_DEAD) down.add('left')
    else if (dx >= STICK_DEAD) down.add('right')
  }

  update() {
    this.draw()
  }

  draw() {
    this.gfx.clear()
    const live = new Set()
    for (const b of this.buttons) {
      const r = radiusOf(b)
      const on = this.held.has(b.action)
      // deliberately faint: these sit ON the play area, and an opaque
      // control panel would hide the thing the player is reaching for
      this.gfx.fillStyle(0xf2ecd8, on ? 0.34 : 0.16)
      this.gfx.fillCircle(b.x, b.y, r)
      this.gfx.lineStyle(1, 0xf2ecd8, on ? 0.75 : 0.4)
      this.gfx.strokeCircle(b.x, b.y, r)

      live.add(b.action)
      let text = this.labels.get(b.action)
      if (!text) {
        text = this.add
          .text(0, 0, b.label, {
            fontFamily: 'monospace',
            fontSize: b.label.length > 2 ? '9px' : '12px',
            color: '#f2ecd8',
          })
          .setOrigin(0.5)
          .setDepth(61)
        this.labels.set(b.action, text)
      }
      text.setText(b.label).setPosition(b.x, b.y).setVisible(true).setAlpha(on ? 1 : 0.7)
    }
    // labels for buttons not in this layout stay parked, not destroyed —
    // the layout swaps every time a rush starts or ends
    for (const [action, text] of this.labels) if (!live.has(action)) text.setVisible(false)

    if (this.stickActive) this.drawStick()
  }

  drawStick() {
    const active = this.stick.id !== null
    // Untouched, a ghost sits at the resting spot. A stick that is
    // invisible until touched is undiscoverable — a player has to
    // already know it is there to find it.
    const ox = active ? this.stick.ox : STICK_REST.x
    const oy = active ? this.stick.oy : STICK_REST.y

    this.gfx.fillStyle(0xf2ecd8, active ? 0.16 : 0.11)
    this.gfx.fillCircle(ox, oy, R_ACTION)
    this.gfx.lineStyle(1, 0xf2ecd8, active ? 0.5 : 0.32)
    this.gfx.strokeCircle(ox, oy, R_ACTION)

    // thumb dot, clamped to STICK_MAX so it never escapes its base
    let dx = active ? this.stick.x - ox : 0
    let dy = active ? this.stick.y - oy : 0
    const d = Math.hypot(dx, dy)
    if (d > STICK_MAX) {
      dx = (dx / d) * STICK_MAX
      dy = (dy / d) * STICK_MAX
    }
    // the dot brightens only once past the deadzone, so the player can
    // see the exact moment Chexy starts moving
    const moving = Math.abs(this.stick.x - ox) >= STICK_DEAD && active
    this.gfx.fillStyle(0xf2ecd8, moving ? 0.55 : active ? 0.3 : 0.2)
    this.gfx.fillCircle(ox + dx, oy + dy, 11)
  }
}
