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
const R = 21 // touch target radius. 42px across at 480x270 is ~9mm on a
// phone once the canvas fills the screen — the low end of a usable
// target, and as large as this resolution can afford without the
// controls eating the play area.
const PAD = 10

// Two layouts, built LAZILY. Menus need a cursor and confirm/back; play
// needs the verbs. Nothing is shared but the pause button, so they are
// simply separate tables.
//
// These are functions, not module constants, because main.js imports
// this scene while this scene imports main.js's GAME_WIDTH/GAME_HEIGHT —
// a cycle. Every other scene gets away with it by only reading those
// inside create(); reading them at module level hits the temporal dead
// zone and the whole game fails to boot.
function playLayout() {
  return [
    { action: 'left', label: '◀', x: 34, y: GAME_HEIGHT - 32 },
    { action: 'right', label: '▶', x: 34 + R * 2 + PAD, y: GAME_HEIGHT - 32 },
    { action: 'tag', label: 'TAG', x: GAME_WIDTH - 34 - R * 2 - PAD, y: GAME_HEIGHT - 32 },
    { action: 'jump', label: 'JUMP', x: GAME_WIDTH - 34, y: GAME_HEIGHT - 32 },
    {
      action: 'dash',
      label: 'DASH',
      x: GAME_WIDTH - 34,
      y: GAME_HEIGHT - 32 - R * 2 - PAD,
      dash: true,
    },
    // clear of the HUD: the score sits at y6 and the multiplier at
    // y19-32, and a 15px-radius circle centred at y40 covered the
    // multiplier — the one readout DESIGN §2.5 requires to stay legible
    { action: 'pause', label: '❚❚', x: GAME_WIDTH - 20, y: 58, small: true },
  ]
}

function menuLayout() {
  return [
    { action: 'up', label: '▲', x: 40, y: GAME_HEIGHT - 32 - R * 2 - PAD },
    { action: 'down', label: '▼', x: 40, y: GAME_HEIGHT - 32 },
    { action: 'left', label: '◀', x: 40 + R * 2 + PAD, y: GAME_HEIGHT - 32 - R - PAD / 2 },
    { action: 'right', label: '▶', x: 40 + R * 4 + PAD * 2, y: GAME_HEIGHT - 32 - R - PAD / 2 },
    { action: 'confirm', label: 'OK', x: GAME_WIDTH - 34, y: GAME_HEIGHT - 32 },
    { action: 'back', label: 'BACK', x: GAME_WIDTH - 34 - R * 2 - PAD, y: GAME_HEIGHT - 32 },
  ]
}

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

    this.gfx = this.add.graphics().setDepth(60)
    this.labels = new Map()

    // The hit-test runs HERE, inside the source, because deviceInput
    // pulls sources at prestep while a scene's update() runs after it.
    // Doing the test in update() made every touch arrive a frame late —
    // measurable as a TAG press-edge landing on frame 2 instead of
    // frame 1. Pointer state is set by the DOM handlers between frames,
    // so it is already current when this is called.
    this.source = (down) => {
      this.buttons = this.buttonsFor(this.currentLayout())
      this.held = this.computeHeld()
      for (const action of this.held) down.add(action)
      // any held control also satisfies the press-any-button screens
      if (this.held.size > 0) down.add('any')
    }
    addInputSource(this.source)
  }

  // Which layout the player needs right now: the verbs while a rush is
  // actually running, the cursor everywhere else (title, roster,
  // briefing, pause menu, results).
  currentLayout() {
    const level = this.game.scene
      .getScenes(true)
      .find((s) => s.player && !s.scene.isPaused(s.scene.key))
    if (!level) return menuLayout()
    // a results screen is a menu even though its level scene is awake
    if (level.runOver) return menuLayout()
    return playLayout()
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
    const pointers = [
      this.input.pointer1,
      this.input.pointer2,
      this.input.pointer3,
      this.input.pointer4,
    ]
    for (const p of pointers) {
      if (!p || !p.isDown) continue
      for (const b of this.buttons) {
        const r = b.small ? R * 0.7 : R
        if (Phaser.Math.Distance.Between(p.x, p.y, b.x, b.y) <= r) held.add(b.action)
      }
    }
    return held
  }

  update() {
    this.draw()
  }

  draw() {
    this.gfx.clear()
    const live = new Set()
    for (const b of this.buttons) {
      const r = b.small ? R * 0.7 : R
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
            fontSize: b.label.length > 2 ? '8px' : '11px',
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
  }
}
