import Phaser from 'phaser'
import { GAME_WIDTH, GAME_HEIGHT } from '../main.js'
import { LEVELS, isLevelUnlocked } from '../config/levels.js'
import { levelBest } from '../systems/progress.js'
import { createHanger } from '../ui/hanger.js'
import { audio } from '../systems/AudioBus.js'
import { currentMode, cycleMode } from '../config/difficulty.js'
import { padConnected, padJustDown } from '../systems/gamepad.js'

// Horizontal layout is anchored to ONE left edge so the block stays
// centred. It did not used to be: the roster sat at a fixed x96 while
// every right-hand element hung off GAME_WIDTH, which put the content
// at 78..464 — a 78px left margin against a 16px right one, i.e. 31px
// right of centre. The divider added 2026-08-28 drew those edges as an
// actual line and made it visible (human report 2026-08-29). Internal
// spacing is unchanged; the whole block moved left.
const BLOCK_L = 48 // marker column; content is 384 wide, so 48..432
const BLOCK_R = BLOCK_L + 384
const ROW_X = BLOCK_L + 18
const BEST_X = BLOCK_L + 254
const HANGER_X = BLOCK_L + 338 // three at +0/+17/+34, each 12 wide
const ROW_Y0 = 76
const ROW_H = 32
// TOP of the mode row (origin-y 0, so this is a real scanline), with
// its divider 8px above. The five shift rows are centred, the last
// ending at y210, so the rule sits at 216 — any tighter and it reads as
// a strikethrough under "5 ???" rather than a separator.
const MODE_Y = 224

// Level select (BRIEF-02 Chunk 6): Title → here → level → results →
// back here. Locked slots stay visible as "?" so the shape of the whole
// game reads from day one.
export default class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super('LevelSelect')
  }

  create() {
    // one continuous menu space (handoff 2026-08-07-d): the title track
    // keeps playing across Title -> Shift Select; a fresh menu visit
    // after a rush starts it from the top (stopMusic in the teardown
    // cleared the level track first)
    audio.startMusic('title')

    this.muteIcon = this.add
      .image(GAME_WIDTH - 10, GAME_HEIGHT - 9, 'mute-icon')
      .setTint(0x667085)
      .setAlpha(0.7)
      .setDepth(40)
      .setVisible(audio.muted)

    this.add
      .text(GAME_WIDTH / 2, 36, 'SELECT YOUR SHIFT', {
        fontFamily: 'monospace',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#f2ecd8',
      })
      .setOrigin(0.5)

    // unlock state resolves per-visit (progression-driven, BRIEF-03)
    this.unlockedNow = LEVELS.map((lvl) => isLevelUnlocked(lvl))

    this.rowTexts = LEVELS.map((lvl, i) => {
      const y = ROW_Y0 + i * ROW_H
      const unlocked = this.unlockedNow[i]
      const label = `${i + 1}  ${unlocked ? lvl.name : '???'}`
      const row = this.add
        .text(ROW_X, y, label, {
          fontFamily: 'monospace',
          fontSize: '11px',
          color: '#98a2b3',
        })
        .setOrigin(0, 0.5)
      if (unlocked) {
        const best = levelBest(lvl.id)
        if (best.bestScore > 0) {
          this.add
            .text(BEST_X, y, `BEST ${best.bestScore}`, {
              fontFamily: 'monospace',
              fontSize: '10px',
              color: '#667085',
            })
            .setOrigin(0, 0.5)
        }
        // best hangers earned (0-3 icons), max across runs
        for (let h = 0; h < 3; h++) {
          createHanger(this, HANGER_X + h * 17, y - 6, 1).setState(
            h < best.bestHangers ? 'golden' : 'tarnished'
          )
        }
      }
      return row
    })

    this.marker = this.add
      .text(BLOCK_L, ROW_Y0, '▶', { fontFamily: 'monospace', fontSize: '11px', color: '#fe701e' })
      .setOrigin(0, 0.5)

    // Difficulty row (DESIGN §2.5 as amended 2026-08-26). It sits OUTSIDE
    // the up/down cursor and answers to ←/→ at any time, so ENTER always
    // means "start the highlighted shift" and a booth player who never
    // touches the arrows still gets the gentler default.
    // A hairline between the roster and the control. Without it the mode
    // row inherits the list's rhythm and left edge and reads as a sixth
    // shift — orange, in the cursor's colour, directly under "5 ???".
    this.add
      .rectangle(BLOCK_L, MODE_Y - 8, BLOCK_R - BLOCK_L, 1, 0x344054)
      .setOrigin(0, 0)

    // No "MODE" caption (human, 2026-08-28) — the ◀ ▶ arrows already say
    // it is a choice, and the third element made the line read as a
    // heading, a value and a note rather than one row.
    //
    // Both halves are ONE size at origin-y 0 on an integer baseline. The
    // earlier row centred three different sizes on a shared midpoint,
    // which put its tops on half-pixels (measured 219.6) — at 480x270
    // with nearest-neighbour that is exactly the kind of misalignment
    // the eye catches without being able to name.
    this.modeText = this.add
      .text(ROW_X, MODE_Y, '', {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#fe701e',
      })
      .setOrigin(0, 0)
    this.modeBlurb = this.add
      .text(BLOCK_R, MODE_Y, '', {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#667085',
      })
      .setOrigin(1, 0)

    // the hint names the device in the player's hands — at a booth,
    // "ENTER START" in front of someone holding a controller is worse
    // than no hint at all
    this.hint = this.add
      .text(GAME_WIDTH / 2, 252, '', {
        fontFamily: 'monospace',
        fontSize: '9px',
        color: '#667085',
      })
      .setOrigin(0.5)
    this.padHint = null

    this.idx = 0
    this.keys = this.input.keyboard.addKeys('UP,DOWN,W,S,LEFT,RIGHT,A,D,ENTER,Z,SPACE,ESC')
    this.refresh()
  }

  refresh() {
    this.marker.setY(ROW_Y0 + this.idx * ROW_H)
    this.rowTexts.forEach((row, i) =>
      row.setColor(i === this.idx ? '#f2ecd8' : this.unlockedNow[i] ? '#98a2b3' : '#475467')
    )
    const mode = currentMode()
    // No score multiplier here (human, 2026-08-28): it collided with the
    // blurb at 480px wide. The HUD already carries the live multiplier
    // once a rush starts, which is where §2.5 wants the trade legible.
    this.modeText.setText(`◀ ${mode.label} ▶`)
    this.modeBlurb.setText(mode.blurb)
  }

  update() {
    this.muteIcon.setVisible(audio.muted)
    const pad = padConnected()
    if (pad !== this.padHint) {
      this.padHint = pad
      this.hint.setText(
        pad
          ? 'D-PAD SHIFT · ←→ MODE · (A) START · (B) TITLE'
          : '↑↓ SHIFT · ←→ MODE · ENTER START · ESC TITLE'
      )
    }
    const JustDown = Phaser.Input.Keyboard.JustDown
    // pad terms sit LAST in each ||, because padJustDown consumes its
    // edge: first position would swallow the edge on a frame where a
    // key already answered
    if (JustDown(this.keys.UP) || JustDown(this.keys.W) || padJustDown('up')) {
      this.idx = (this.idx + LEVELS.length - 1) % LEVELS.length
      audio.play('uiSelect')
      this.refresh()
    }
    if (JustDown(this.keys.DOWN) || JustDown(this.keys.S) || padJustDown('down')) {
      this.idx = (this.idx + 1) % LEVELS.length
      audio.play('uiSelect')
      this.refresh()
    }
    const dir = JustDown(this.keys.RIGHT) || JustDown(this.keys.D) || padJustDown('right') ? 1
      : JustDown(this.keys.LEFT) || JustDown(this.keys.A) || padJustDown('left') ? -1 : 0
    if (dir !== 0) {
      cycleMode(dir)
      audio.play('uiSelect')
      this.refresh()
    }
    if (JustDown(this.keys.ENTER) || JustDown(this.keys.Z) || JustDown(this.keys.SPACE) || padJustDown('confirm')) {
      const lvl = LEVELS[this.idx]
      if (this.unlockedNow[this.idx]) {
        audio.play('uiSelect')
        this.scene.launch('UIOverlay')
        this.scene.start(lvl.sceneKey ?? 'Level', { mapKey: lvl.mapKey })
      } else {
        audio.play('interrupt') // locked
      }
    }
    if (JustDown(this.keys.ESC) || padJustDown('back')) {
      this.scene.start('Title')
    }
  }
}
