import Phaser from 'phaser'
import { GAME_WIDTH, GAME_HEIGHT } from '../main.js'
import { briefingFor } from '../config/briefings.js'
import { markBriefingShown } from '../systems/progress.js'
import { audio } from '../systems/AudioBus.js'

// One briefing screen, over a PAUSED level, for levels that introduce a
// mechanic. Its own scene rather than another UIOverlay panel: it needs
// sprite rows and a layout of its own, and launching it last puts it
// above the HUD without depth juggling.
//
// It pauses the level it explains, so the rush clock cannot run while
// the player reads — the one thing a tutorial screen must never do.
const PANEL = { w: 424, h: 216 }
// Chexy's frames are 48px, the tallest thing a row shows — rows are cut
// to fit her rather than the other way round, since integer scaling
// forbids shrinking a sprite to suit a layout.
const ROW_H = 50
const SPRITE_MAX_H = ROW_H
const TEXT = { fontFamily: 'monospace', fontSize: '9px', color: '#344054' }

export default class BriefingScene extends Phaser.Scene {
  constructor() {
    super('Briefing')
  }

  init(data) {
    // no levelKey = PREVIEW: opened from the console with no level
    // underneath, so there is nothing to pause or resume and nothing to
    // mark as seen. Dismissing just closes it.
    this.levelKey = data.levelKey ?? null
    this.levelId = data.levelId
    this.preview = !data.levelKey
  }

  create() {
    const brief = briefingFor(this.levelId)
    if (!brief) {
      this.finish()
      return
    }
    const x = Math.round((GAME_WIDTH - PANEL.w) / 2)
    const y = Math.round((GAME_HEIGHT - PANEL.h) / 2)

    // dim the level behind, so this reads as a held moment rather than
    // another HUD element competing with it
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x101828, 0.72).setOrigin(0, 0)

    const g = this.add.graphics()
    g.fillStyle(0xf8f5f3, 0.97) // Background Tan, the guest-bubble panel
    g.fillRoundedRect(x, y, PANEL.w, PANEL.h, 5)
    g.fillStyle(0xfe701e, 1) // Chexology Orange — the tutorial voice
    g.fillRoundedRect(x, y, PANEL.w, 4, { tl: 5, tr: 5, bl: 0, br: 0 })

    this.add.text(x + 14, y + 12, brief.title, {
      ...TEXT,
      fontSize: '11px',
      color: '#101828',
    })
    if (brief.subtitle) {
      this.add.text(x + 14, y + 27, brief.subtitle, {
        ...TEXT,
        color: '#667085',
        wordWrap: { width: PANEL.w - 28 },
      })
    }

    // rows: sprite gutter on the left, copy to its right. Sprites draw at
    // SCALE 1 — the pixel-art law (DESIGN §5.x) forbids the non-integer
    // squeeze that fitting them to a fixed box would need.
    let rowY = y + 50
    for (const row of brief.rows) {
      let sx = x + 20
      for (const s of row.sprites ?? []) {
        // `key` may be a list of candidates, best first: the arted enemy
        // atlas before the placeholder rect, say. A row shows the best
        // thing that exists and silently skips one that does not, so a
        // briefing never displays a blank placeholder box.
        const key = (Array.isArray(s.key) ? s.key : [s.key]).find((k) => this.textures.exists(k))
        if (!key) continue
        const img = this.add.image(sx, rowY + ROW_H / 2 - 6, key, s.frame)
        img.setOrigin(0, 0.5)
        // A sprite too tall for the row would overlap the next one, and
        // shrinking it is forbidden (integer scaling only) — so drop it.
        if (img.displayHeight > SPRITE_MAX_H) {
          img.destroy()
          continue
        }
        // Some sprites are runtime-TINTED in play (request chips carry
        // the car's colour, items carry their category) and ship white.
        // White on the tan panel is invisible, so a row may name a tint.
        if (s.tint !== undefined) img.setTint(s.tint)
        sx += img.displayWidth + 4
      }
      this.add.text(x + 96, rowY + 6, row.text, {
        ...TEXT,
        wordWrap: { width: PANEL.w - 116 },
      })
      rowY += ROW_H
    }

    this.prompt = this.add
      .text(x + PANEL.w / 2, y + PANEL.h - 16, 'ANY KEY TO START', {
        ...TEXT,
        color: '#101828',
      })
      .setOrigin(0.5, 0)
    this.tweens.add({
      targets: this.prompt,
      alpha: 0.35,
      duration: 700,
      yoyo: true,
      repeat: -1,
    })

    // A dismiss can't be honoured instantly: the keypress that opened a
    // retry (or the level-select ENTER) is often still down, and the
    // level resumes into it. Same guard the pause menu uses.
    // In PREVIEW there is no level holding the input, so the scene
    // underneath would also hear the dismissing key — the Title screen
    // advances on any key, so a preview dismissed there fell straight
    // into Shift Select. Pause whatever is running and restore it after.
    if (this.preview) {
      this.paused = this.game.scene
        .getScenes(true)
        .filter((s) => s !== this && s.scene.key !== 'Briefing')
        .map((s) => s.scene.key)
      for (const key of this.paused) this.scene.pause(key)
    }
    this.openedAt = this.time.now
    this.input.keyboard.on('keydown', this.tryFinish, this)
    this.input.on('pointerdown', this.tryFinish, this)
  }

  tryFinish() {
    if (this.time.now - this.openedAt < 350) return
    audio.play('uiSelect')
    this.finish()
  }

  finish() {
    if (this.levelId && !this.preview) markBriefingShown(this.levelId)
    this.input.keyboard.off('keydown', this.tryFinish, this)
    if (this.preview) {
      for (const key of this.paused ?? []) this.scene.resume(key)
      this.scene.stop()
      return
    }
    // resume a beat later so the dismissing key is released first — the
    // level polls JustDown and would otherwise eat it as a tag or jump
    this.time.delayedCall(120, () => {
      this.scene.resume(this.levelKey)
      this.scene.stop()
    })
  }
}
