import Phaser from 'phaser'
import { GAME_WIDTH, GAME_HEIGHT } from '../main.js'
import { HAPPY_LINES, UNHAPPY_LINES } from '../config/guestLines.js'

const TEXT_STYLE = {
  fontFamily: 'monospace',
  fontSize: '10px',
  color: '#f2ecd8',
}

// HUD + results overlay. Launched once from Title and never restarted;
// it reacts to game-wide events emitted by the Playground run.
export default class UIOverlayScene extends Phaser.Scene {
  constructor() {
    super('UIOverlay')
  }

  create() {
    // the run's prospective Golden Hangers (DESIGN.md §2.5): the loss
    // counter re-expressed — hangers break as losses accrue
    this.hangerGfx = this.add.graphics()
    this.timerText = this.add.text(GAME_WIDTH / 2, 6, '', TEXT_STYLE).setOrigin(0.5, 0)
    this.scoreText = this.add.text(GAME_WIDTH - 8, 6, '', TEXT_STYLE).setOrigin(1, 0)
    this.multText = this.add.text(GAME_WIDTH - 8, 19, '', TEXT_STYLE).setOrigin(1, 0)

    this.heatToast = this.add
      .text(GAME_WIDTH / 2, 40, 'HEATING UP!', {
        ...TEXT_STYLE,
        color: '#ffb347',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setAlpha(0)

    this.buildResultsPanel()
    this.buildPausePanel()

    // guest bubbles (BRIEF-02 Chunk 3)
    this.bubbles = []
    this.lastLine = { happy: -1, angry: -1 }

    const bus = this.game.events
    bus.on('hud', this.onHud, this)
    bus.on('run-over', this.onRunOver, this)
    bus.on('run-reset', this.onRunReset, this)
    bus.on('heat-up', this.onHeatUp, this)
    bus.on('paused', this.onPaused, this)
    bus.on('guest-happy', this.onGuestHappy, this)
    bus.on('guest-angry', this.onGuestAngry, this)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      bus.off('hud', this.onHud, this)
      bus.off('run-over', this.onRunOver, this)
      bus.off('run-reset', this.onRunReset, this)
      bus.off('heat-up', this.onHeatUp, this)
      bus.off('paused', this.onPaused, this)
      bus.off('guest-happy', this.onGuestHappy, this)
      bus.off('guest-angry', this.onGuestAngry, this)
    })
  }

  // ---- guest bubbles: brand-styled (art/palette-brand.md), queued
  // bottom-right, max 3 visible, auto-dismiss; translucent per DESIGN.md §5

  onGuestHappy() {
    this.showBubble('happy')
  }

  onGuestAngry() {
    this.showBubble('angry')
  }

  pickLine(kind) {
    const pool = kind === 'happy' ? HAPPY_LINES : UNHAPPY_LINES
    let i
    do {
      i = Phaser.Math.Between(0, pool.length - 1)
    } while (pool.length > 1 && i === this.lastLine[kind])
    this.lastLine[kind] = i
    return pool[i]
  }

  showBubble(kind) {
    const text = this.add.text(0, 0, this.pickLine(kind), {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#344054', // Gray-700 text on light
      wordWrap: { width: 132 },
    })
    const w = Math.ceil(text.width) + 16
    const h = Math.ceil(text.height) + 10
    const g = this.add.graphics()
    g.fillStyle(0xf8f5f3, 0.88) // Background Tan panel, translucent
    g.fillRoundedRect(0, 0, w, h, 4)
    // Success Green / Alert Red accent bar
    g.fillStyle(kind === 'happy' ? 0x12b76a : 0xea5151, 1)
    g.fillRoundedRect(0, 0, 3, h, { tl: 4, bl: 4, tr: 0, br: 0 })
    text.setPosition(9, 5)

    const bubble = this.add.container(GAME_WIDTH - 8 - w, GAME_HEIGHT, [g, text]).setDepth(25)
    bubble.bubbleH = h
    bubble.setAlpha(0)

    this.bubbles.unshift(bubble)
    while (this.bubbles.length > 3) this.dismissBubble(this.bubbles[3], true)
    this.layoutBubbles()
    this.tweens.add({ targets: bubble, alpha: 1, duration: 120 })
    bubble.dismissTimer = this.time.delayedCall(2500, () => this.dismissBubble(bubble))
  }

  // stack upward from the bottom-right corner — clear of the HUD (top)
  // and the play-area center
  layoutBubbles() {
    let y = GAME_HEIGHT - 8
    for (const b of this.bubbles) {
      y -= b.bubbleH
      this.tweens.add({ targets: b, y, duration: 140, ease: 'Quad.easeOut' })
      y -= 4
    }
  }

  dismissBubble(bubble, instant = false) {
    const idx = this.bubbles.indexOf(bubble)
    if (idx === -1) return
    this.bubbles.splice(idx, 1)
    bubble.dismissTimer?.remove()
    if (instant) {
      bubble.destroy()
    } else {
      this.tweens.add({
        targets: bubble,
        alpha: 0,
        x: bubble.x + 10,
        duration: 200,
        onComplete: () => bubble.destroy(),
      })
    }
    this.layoutBubbles()
  }

  clearBubbles() {
    for (const b of [...this.bubbles]) this.dismissBubble(b, true)
  }

  buildPausePanel() {
    this.pausePanel = this.add.container(0, 0, [
      this.add
        .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x101018, 0.7)
        .setOrigin(0.5),
      this.add
        .text(GAME_WIDTH / 2, 118, 'PAUSED', { ...TEXT_STYLE, fontSize: '16px', fontStyle: 'bold' })
        .setOrigin(0.5),
      this.add
        .text(GAME_WIDTH / 2, 145, 'ESC OR P TO RESUME', { ...TEXT_STYLE, color: '#98a2b3' })
        .setOrigin(0.5),
    ])
    this.pausePanel.setVisible(false)
    this.pausePanel.setDepth(30) // above guest bubbles

    this.pauseKeys = this.input.keyboard.addKeys('ESC,P')
    this.pausedAt = 0
  }

  onPaused() {
    this.pausedAt = this.time.now
    this.pausePanel.setVisible(true)
  }

  update(time) {
    if (!this.pausePanel.visible) return
    // small delay so the keypress that paused can't also resume
    if (time - this.pausedAt < 250) return
    if (
      Phaser.Input.Keyboard.JustDown(this.pauseKeys.ESC) ||
      Phaser.Input.Keyboard.JustDown(this.pauseKeys.P)
    ) {
      this.pausePanel.setVisible(false)
      this.scene.resume('Playground')
    }
  }

  buildResultsPanel() {
    this.resultsTitle = this.add
      .text(GAME_WIDTH / 2, 84, '', { ...TEXT_STYLE, fontSize: '16px', fontStyle: 'bold' })
      .setOrigin(0.5)
    this.resultsBody = this.add
      .text(GAME_WIDTH / 2, 130, '', { ...TEXT_STYLE, align: 'center', lineSpacing: 6 })
      .setOrigin(0.5)
    this.resultsPrompt = this.add
      .text(GAME_WIDTH / 2, 185, 'PRESS R TO RETRY', { ...TEXT_STYLE, color: '#ffffff' })
      .setOrigin(0.5)

    this.resultsPanel = this.add.container(0, 0, [
      this.add
        .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x101018, 0.85)
        .setOrigin(0.5),
      this.resultsTitle,
      this.resultsBody,
      this.resultsPrompt,
    ])
    this.resultsPanel.setVisible(false)
    this.resultsPanel.setDepth(30) // above guest bubbles

    this.tweens.add({
      targets: this.resultsPrompt,
      alpha: 0.3,
      duration: 600,
      yoyo: true,
      repeat: -1,
    })
  }

  // gold hanger = still earnable, broken grey = a loss (placeholder art)
  drawHangers(lost) {
    const g = this.hangerGfx
    g.clear()
    for (let i = 0; i < 3; i++) {
      const x = 10 + i * 17
      const y = 7
      const intact = i < 3 - lost
      const color = intact ? 0xf3b024 : 0x59595b
      g.lineStyle(1, color, intact ? 1 : 0.7)
      g.lineBetween(x + 6, y, x + 6, y + 3) // hook
      g.strokeTriangle(x, y + 10, x + 12, y + 10, x + 6, y + 3)
      if (!intact) {
        g.lineStyle(1, 0xea5151, 0.9) // the break
        g.lineBetween(x + 2, y + 11, x + 10, y + 1)
      }
    }
  }

  onHud({ score, lost, multiplier, timeLeft }) {
    const m = Math.floor(Math.max(0, timeLeft) / 60)
    const s = String(Math.max(0, timeLeft) % 60).padStart(2, '0')
    this.timerText.setText(`${m}:${s}`)
    this.scoreText.setText(`SCORE ${score}`)
    this.drawHangers(lost)
    this.multText.setText(`x${multiplier.toFixed(2)}`)
    this.multText.setColor(
      multiplier < 1 ? '#ff9966' : multiplier > 1 ? '#7ee87e' : '#f2ecd8'
    )
  }

  onHeatUp() {
    // comeback should feel good, not punitive (DESIGN.md §2.5)
    this.heatToast.setAlpha(1)
    this.tweens.add({ targets: this.heatToast, alpha: 0, duration: 900, delay: 500 })
    this.tweens.add({
      targets: this.multText,
      scale: 1.6,
      duration: 120,
      yoyo: true,
    })
  }

  onRunOver({ cleared, score, itemsReturned, tagsCollected }) {
    this.resultsTitle.setText(cleared ? 'RUSH SURVIVED!' : 'TOO MANY LOST ITEMS')
    this.resultsTitle.setColor(cleared ? '#7ee87e' : '#ff6666')
    this.resultsBody.setText(
      [`ITEMS RETURNED  ${itemsReturned}`, `TAGS COLLECTED  ${tagsCollected}`, `SCORE  ${score}`].join(
        '\n'
      )
    )
    this.resultsPanel.setVisible(true)
  }

  onRunReset() {
    this.resultsPanel.setVisible(false)
    this.clearBubbles()
  }
}
