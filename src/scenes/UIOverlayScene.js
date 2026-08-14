import Phaser from 'phaser'
import { GAME_WIDTH, GAME_HEIGHT } from '../main.js'
import { TUNING } from '../config/tuning.js'
import {
  HAPPY_LINES,
  UNHAPPY_LINES,
  CARD_LINES,
  EXODUS_HAPPY_LINES,
  EXODUS_UNHAPPY_LINES,
} from '../config/guestLines.js'
import { audio } from '../systems/AudioBus.js'
import { createHanger } from '../ui/hanger.js'

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
    this.hudHangers = [0, 1, 2].map((i) => createHanger(this, 10 + i * 17, 5, 1))
    this.timerText = this.add.text(GAME_WIDTH / 2, 6, '', TEXT_STYLE).setOrigin(0.5, 0)
    this.scoreText = this.add.text(GAME_WIDTH - 8, 6, '', TEXT_STYLE).setOrigin(1, 0)
    this.multText = this.add.text(GAME_WIDTH - 8, 19, '', TEXT_STYLE).setOrigin(1, 0)
    // NFC tag counter (BRIEF-04 §1): small icon + count under the
    // hangers. Real art wins over the generated placeholder, same
    // drop-in contract as the in-world collectibles.
    this.tagIcon = this.add
      .image(14, 24, this.textures.exists('nfc-tag') ? 'nfc-tag' : 'collectible-nfcTag')
      .setOrigin(0.5)
      .setScale(0.75)
    this.tagCountText = this.add
      .text(22, 19, '0', { ...TEXT_STYLE, fontSize: '9px' })
      .setOrigin(0, 0)
    // Insights Report chip (BRIEF-04 §3): sits LEFT of the adaptive
    // multiplier so the §2.5 readout is never masked; ring counts down
    // the final 3s
    this.insightChip = this.add
      .text(GAME_WIDTH - 56, 19, '', { ...TEXT_STYLE, color: '#ffe123', fontStyle: 'bold' })
      .setOrigin(1, 0)
      .setVisible(false)
    this.insightRing = this.add.graphics()
    this.insightUntilLocal = 0
    // persistent muted-speaker indicator (handoff 2026-08-07-d):
    // bottom-right, quiet gray, above panels
    this.muteIcon = this.add
      .image(GAME_WIDTH - 10, GAME_HEIGHT - 9, 'mute-icon')
      .setTint(0x667085)
      .setAlpha(0.7)
      .setDepth(40)
      .setVisible(audio.muted)

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
    this.lastLine = { happy: -1, angry: -1, card: -1 }

    const bus = this.game.events
    bus.on('hud', this.onHud, this)
    bus.on('run-over', this.onRunOver, this)
    bus.on('run-reset', this.onRunReset, this)
    bus.on('heat-up', this.onHeatUp, this)
    bus.on('paused', this.onPaused, this)
    bus.on('guest-happy', this.onGuestHappy, this)
    bus.on('guest-angry', this.onGuestAngry, this)
    bus.on('guest-card', this.onGuestCard, this)
    bus.on('system-bubble', this.onSystemBubble, this)
    bus.on('request-added', this.onRequestAdded, this)
    bus.on('request-done', this.onRequestDone, this)
    bus.on('request-tagged', this.onRequestTagged, this)
    bus.on('request-untagged', this.onRequestUntagged, this)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      bus.off('hud', this.onHud, this)
      bus.off('run-over', this.onRunOver, this)
      bus.off('run-reset', this.onRunReset, this)
      bus.off('heat-up', this.onHeatUp, this)
      bus.off('paused', this.onPaused, this)
      bus.off('guest-happy', this.onGuestHappy, this)
      bus.off('guest-angry', this.onGuestAngry, this)
      bus.off('guest-card', this.onGuestCard, this)
      bus.off('system-bubble', this.onSystemBubble, this)
      bus.off('request-added', this.onRequestAdded, this)
      bus.off('request-done', this.onRequestDone, this)
      bus.off('request-tagged', this.onRequestTagged, this)
      bus.off('request-untagged', this.onRequestUntagged, this)
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

  // Contact Card save — "got the text" variant pool (BRIEF-04 §2)
  onGuestCard() {
    this.showBubble('card')
  }

  // scripted (non-guest) bubbles — e.g. the Bell Desk dash beat
  // (BRIEF-03): custom text, accent color, and hold time
  onSystemBubble(opts) {
    this.showBubble('happy', opts)
  }

  // ---- garage request queue (BRIEF-05 §1): car-silhouette chips in the
  // car's body color, stacked left-to-right under the timer; a resolved
  // chip flashes its outcome (green tag / red miss) and leaves the row

  // Chip SILHOUETTES (human report 2026-08-13): body colour alone can't
  // separate two live requests of the same hue, so the chip carries the
  // car's shape too. Drawn icons win when the strip exists
  // (assets/sprites/request-chips.png, one 16x10 frame per silhouette,
  // tinted by hue); until then each tier gets its own PROPORTIONS —
  // sedan low and wide, SUV short and tall, luxury longest and lowest.
  // Scaling the car sprites was rejected: at 14-18px tall they would
  // need a ~0.35x non-integer downscale, which is mush (DESIGN §5).
  onRequestAdded({ key, color, luxury, kind }) {
    if (!this.requestChips) this.requestChips = new Map()
    const CHIP_SHAPE = { 'car-sedan': [16, 7], 'car-suv': [13, 10], 'car-lux': [18, 6] }
    const frame = { 'car-sedan': 0, 'car-suv': 1, 'car-lux': 2 }[kind] ?? 0
    const [w, h] = CHIP_SHAPE[kind] ?? [16, 9]
    const art = this.textures.exists('request-chips')
    const chip = this.add.container(0, 0, [
      art
        ? this.add.image(0, 0, 'request-chips', frame).setTint(color)
        : this.add.rectangle(0, 0, w, h, color).setStrokeStyle(1, 0xf2ecd8, 0.9),
      ...(luxury && !art
        ? [this.add.rectangle(5, -2, 3, 3, 0xffe066)] // gold dot = hold-tier
        : []),
    ])
    chip.setDepth(21)
    this.requestChips.set(key, chip)
    this.layoutRequestChips()
  }

  // fulfilled-but-stealable (human ruling 2026-08-10): a tagged car's
  // chip wears a Success Green check until it banks or drives off —
  // the queue reads "handled" vs "still needs me" at a glance. An
  // elite rip removes the check (the request is live work again).
  onRequestTagged({ key }) {
    const chip = this.requestChips?.get(key)
    if (!chip || chip.getData('check')) return
    const check = this.add.graphics()
    check.lineStyle(2, 0x12b76a, 1) // Success Green
    check.beginPath()
    check.moveTo(-3, 0)
    check.lineTo(-1, 2)
    check.lineTo(3, -3)
    check.strokePath()
    check.setPosition(7, -4) // top-right corner of the silhouette
    chip.add(check)
    chip.setData('check', check)
  }

  onRequestUntagged({ key }) {
    const chip = this.requestChips?.get(key)
    const check = chip?.getData('check')
    if (!check) return
    check.destroy()
    chip.setData('check', null)
  }

  onRequestDone({ key, ok }) {
    const chip = this.requestChips?.get(key)
    if (!chip) return
    this.requestChips.delete(key)
    const flash = this.add
      .rectangle(chip.x, chip.y, 16, 9, ok ? 0x12b76a : 0xea5151)
      .setDepth(22)
    chip.destroy()
    this.tweens.add({
      targets: flash,
      alpha: 0,
      y: flash.y - 6,
      duration: 450,
      onComplete: () => flash.destroy(),
    })
    this.layoutRequestChips()
  }

  layoutRequestChips() {
    let x = 64
    for (const chip of this.requestChips.values()) {
      chip.setPosition(x, 9)
      x += 20
    }
  }

  clearRequestChips() {
    if (!this.requestChips) return
    for (const chip of this.requestChips.values()) chip.destroy()
    this.requestChips.clear()
  }

  pickLine(kind) {
    // fiction flip (BRIEF-07): the exodus hands items BACK — its map
    // property swaps the guest pools (card lines stay: still a save)
    const handback = this.game.registry.get('handbackCopy') === true
    const pool =
      kind === 'happy'
        ? handback
          ? EXODUS_HAPPY_LINES
          : HAPPY_LINES
        : kind === 'card'
          ? CARD_LINES
          : handback
            ? EXODUS_UNHAPPY_LINES
            : UNHAPPY_LINES
    let i
    do {
      i = Phaser.Math.Between(0, pool.length - 1)
    } while (pool.length > 1 && i === this.lastLine[kind])
    this.lastLine[kind] = i
    return pool[i]
  }

  showBubble(kind, opts = {}) {
    const text = this.add.text(0, 0, opts.text ?? this.pickLine(kind), {
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
    // Success Green / Alert Red accent bar (system bubbles override;
    // card saves read as happy — Success Green)
    g.fillStyle(opts.accent ?? (kind === 'angry' ? 0xea5151 : 0x12b76a), 1)
    g.fillRoundedRect(0, 0, 3, h, { tl: 4, bl: 4, tr: 0, br: 0 })
    text.setPosition(9, 5)

    const bubble = this.add.container(GAME_WIDTH - 8 - w, GAME_HEIGHT, [g, text]).setDepth(25)
    bubble.bubbleH = h
    bubble.setAlpha(0)

    this.bubbles.unshift(bubble)
    while (this.bubbles.length > 3) this.dismissBubble(this.bubbles[3], true)
    this.layoutBubbles()
    this.tweens.add({ targets: bubble, alpha: 1, duration: 120 })
    bubble.dismissTimer = this.time.delayedCall(opts.holdMs ?? 2500, () =>
      this.dismissBubble(bubble)
    )
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

  // pause menu (handoff 2026-08-04-e): Resume / Exit to Shift Select,
  // with a one-step confirm on Exit — it discards a live run and sits
  // one slot from Resume, so the confirm cursor defaults to CANCEL
  buildPausePanel() {
    const optStyle = { ...TEXT_STYLE, fontSize: '11px' }
    this.pauseTitle = this.add
      .text(GAME_WIDTH / 2, 100, 'PAUSED', { ...TEXT_STYLE, fontSize: '16px', fontStyle: 'bold' })
      .setOrigin(0.5)
    this.pauseOptions = [
      this.add.text(GAME_WIDTH / 2, 132, 'RESUME', optStyle).setOrigin(0.5),
      this.add.text(GAME_WIDTH / 2, 150, 'RESTART LEVEL', optStyle).setOrigin(0.5),
      this.add.text(GAME_WIDTH / 2, 168, 'EXIT TO SHIFT SELECT', optStyle).setOrigin(0.5),
    ]
    // both destructive options share the -e confirm; this maps menu
    // index -> teardown destination once confirmed
    this.pauseDestinations = [null, 'retry', 'exit']
    this.pendingDestination = null
    this.pauseHint = this.add
      .text(GAME_WIDTH / 2, 200, 'ESC OR P TO RESUME', { ...TEXT_STYLE, color: '#98a2b3' })
      .setOrigin(0.5)
    this.confirmPrompt = this.add
      .text(GAME_WIDTH / 2, 118, "Abandon your shift? Progress won't be saved.", {
        ...TEXT_STYLE,
        align: 'center',
        wordWrap: { width: 300 },
      })
      .setOrigin(0.5)
    this.confirmOptions = [
      this.add.text(GAME_WIDTH / 2, 150, 'CONFIRM', optStyle).setOrigin(0.5),
      this.add.text(GAME_WIDTH / 2, 168, 'CANCEL', optStyle).setOrigin(0.5),
    ]
    this.pauseMarker = this.add
      .text(0, 0, '▶', { fontFamily: 'monospace', fontSize: '11px', color: '#fe701e' })
      .setOrigin(1, 0.5)

    this.pausePanel = this.add.container(0, 0, [
      this.add
        .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x101018, 0.7)
        .setOrigin(0.5),
      this.pauseTitle,
      ...this.pauseOptions,
      this.pauseHint,
      this.confirmPrompt,
      ...this.confirmOptions,
      this.pauseMarker,
    ])
    this.pausePanel.setVisible(false)
    this.pausePanel.setDepth(30) // above guest bubbles

    this.pauseKeys = this.input.keyboard.addKeys('ESC,P,UP,DOWN,W,S,ENTER,Z,SPACE')
    this.pausedAt = 0
    this.setPauseMode('menu')
  }

  setPauseMode(mode) {
    this.pauseMode = mode
    const menu = mode === 'menu'
    this.pauseTitle.setVisible(menu)
    this.pauseOptions.forEach((o) => o.setVisible(menu))
    this.pauseHint.setVisible(menu)
    this.confirmPrompt.setVisible(!menu)
    this.confirmOptions.forEach((o) => o.setVisible(!menu))
    // menu opens on RESUME; confirm opens on CANCEL (accident safety)
    this.pauseIdx = menu ? 0 : 1
    this.movePauseMarker()
  }

  movePauseMarker() {
    const opts = this.pauseMode === 'menu' ? this.pauseOptions : this.confirmOptions
    const sel = opts[this.pauseIdx]
    this.pauseMarker.setPosition(sel.x - sel.width / 2 - 6, sel.y)
    opts.forEach((o, i) => o.setColor(i === this.pauseIdx ? '#f2ecd8' : '#98a2b3'))
  }

  onPaused() {
    this.pausedAt = this.time.now
    this.setPauseMode('menu')
    this.pausePanel.setVisible(true)
  }

  // the active gameplay scene key ('Level', 'Garage', ...) — set by
  // LevelScene.init and inherited by subclasses
  levelKey() {
    return this.game.registry.get('activeLevelKey') ?? 'Level'
  }

  resumeLevel() {
    this.pausePanel.setVisible(false)
    audio.resumeMusic() // track continues from where the pause held it
    this.scene.resume(this.levelKey())
  }

  update(time) {
    audio.refreshVolumes() // volume sliders apply live
    this.updateInsightChip()
    this.muteIcon.setVisible(audio.muted)
    if (!this.pausePanel.visible) return
    // small delay so the keypress that paused can't also resume
    if (time - this.pausedAt < 250) return
    const JD = Phaser.Input.Keyboard.JustDown
    const k = this.pauseKeys
    const nav = (count) => {
      const dir = JD(k.UP) || JD(k.W) ? -1 : JD(k.DOWN) || JD(k.S) ? 1 : 0
      if (dir !== 0) {
        this.pauseIdx = (this.pauseIdx + dir + count) % count
        audio.play('uiSelect')
        this.movePauseMarker()
      }
    }
    if (this.pauseMode === 'menu') {
      if (JD(k.ESC) || JD(k.P)) {
        this.resumeLevel()
        return
      }
      nav(this.pauseOptions.length)
      if (JD(k.ENTER) || JD(k.Z) || JD(k.SPACE)) {
        if (this.pauseIdx === 0) this.resumeLevel()
        else {
          // restart and exit both abandon the live run -> same confirm
          this.pendingDestination = this.pauseDestinations[this.pauseIdx]
          audio.play('uiSelect')
          this.setPauseMode('confirm')
        }
      }
    } else {
      // confirm view: ESC/P backs out, same as CANCEL
      if (JD(k.ESC) || JD(k.P)) {
        this.setPauseMode('menu')
        return
      }
      nav(this.confirmOptions.length)
      if (JD(k.ENTER) || JD(k.Z) || JD(k.SPACE)) {
        if (this.pauseIdx === 1) {
          this.setPauseMode('menu') // CANCEL
        } else {
          // CONFIRM: abandon the rush — the shared teardown records
          // nothing; destination is whichever option opened the confirm
          this.pausePanel.setVisible(false)
          this.scene.get(this.levelKey()).teardownRun(this.pendingDestination)
        }
      }
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
      .text(GAME_WIDTH / 2, 185, 'R RETRY · C CONTINUE', { ...TEXT_STYLE, color: '#ffffff' })
      .setOrigin(0.5)
    // Golden Hanger row: the screen's visual second beat (handoff -i)
    this.resultHangers = [0, 1, 2].map(() => createHanger(this, 0, 0, 2))
    this.hangerTimers = []
    // BIG DAY! rubber stamp — Chexology Orange, slams over the title region
    this.stampText = this.add
      .text(GAME_WIDTH / 2 + 108, 60, 'BIG DAY!', {
        fontFamily: 'monospace',
        fontSize: '22px',
        fontStyle: 'bold',
        color: '#fe701e',
      })
      .setOrigin(0.5)
      .setRotation(-0.21)
      .setVisible(false)

    this.resultsPanel = this.add.container(0, 0, [
      this.add
        .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x101018, 0.85)
        .setOrigin(0.5),
      this.resultsTitle,
      this.resultsBody,
      ...this.resultHangers.map((h) => h.obj),
      this.resultsPrompt,
      this.stampText,
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

  // golden = still earnable, broken = a loss
  drawHangers(lost) {
    this.hudHangers.forEach((h, i) => h.setState(i < 3 - lost ? 'golden' : 'broken'))
  }

  onHud({ score, lost, multiplier, timeLeft, tags = 0, insightMs = 0 }) {
    const m = Math.floor(Math.max(0, timeLeft) / 60)
    const s = String(Math.max(0, timeLeft) % 60).padStart(2, '0')
    this.timerText.setText(`${m}:${s}`)
    this.scoreText.setText(`SCORE ${score}`)
    this.drawHangers(lost)
    this.multText.setText(`x${multiplier.toFixed(2)}`)
    this.multText.setColor(
      multiplier < 1 ? '#ff9966' : multiplier > 1 ? '#7ee87e' : '#f2ecd8'
    )
    this.tagCountText.setText(String(tags))
    // local countdown estimate so the chip ring animates between hud events
    this.insightUntilLocal = insightMs > 0 ? this.time.now + insightMs : 0
  }

  // insight chip render (BRIEF-04 §3): its own chip beside the adaptive
  // multiplier — the adaptive state is never masked. Ring = final 3s.
  updateInsightChip() {
    const remaining = this.insightUntilLocal - this.time.now
    this.insightRing.clear()
    if (remaining <= 0) {
      this.insightChip.setVisible(false)
      return
    }
    this.insightChip.setText(`x${TUNING.insightFactor}`).setVisible(true)
    if (remaining <= 3000) {
      const frac = remaining / 3000
      const cx = this.insightChip.x - this.insightChip.width - 8
      this.insightRing.lineStyle(2, 0xffe123, 1)
      this.insightRing.beginPath()
      this.insightRing.arc(cx, 24, 5, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2)
      this.insightRing.strokePath()
    }
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

  // results hanger row at 2x scale: three slots always shown — slots
  // still tarnished either land golden on their chime or stay as what
  // was left on the table
  drawResultHangers(filled) {
    this.resultHangers.forEach((h, i) =>
      h
        .setPosition(GAME_WIDTH / 2 - 44 + i * 32, this.hangerRowY)
        .setState(i < filled ? 'golden' : 'tarnished')
        .setVisible(true)
    )
  }

  onRunOver({
    cleared,
    score,
    bonus,
    itemsReturned,
    guestsServed,
    tagsCollected,
    cardsUsed = 0,
    insightsCaught = 0,
    lost,
    bestMultiplier,
    returnRate,
    finale = false,
  }) {
    this.hangerTimers.forEach((t) => t.remove())
    this.hangerTimers = []
    this.resultHangers.forEach((h) => h.setVisible(false)) // fail layout shows none
    this.stampText.setVisible(false)

    // the finale earns its own headline (BOSS-SPEC ending)
    this.resultsTitle.setText(
      cleared ? (finale ? 'DEATH TO THE PAPER TICKET' : 'RUSH SURVIVED!') : 'TOO MANY LOST ITEMS'
    )
    this.resultsTitle.setColor(cleared ? '#7ee87e' : '#ff6666')

    if (!cleared) {
      // fail layout unchanged: no hanger ceremony on a game over
      this.resultsTitle.setY(84)
      this.resultsBody.setOrigin(0.5, 0.5)
      this.resultsBody.setY(130)
      this.resultsPrompt.setY(185)
      // "tags" = collectible pickups (2026-08-05-a); minor line only
      // when nonzero, per the BRIEF-04 results convention
      const failLines = [`ITEMS RETURNED  ${itemsReturned}`]
      if (tagsCollected > 0) failLines.push(`TAGS COLLECTED  ${tagsCollected}`)
      failLines.push(`SCORE  ${score}`)
      this.resultsBody.setText(failLines.join('\n'))
      this.resultsPanel.setVisible(true)
      return
    }

    // clear layout (handoff 2026-07-30-i): success text → hanger row →
    // grading (DESIGN.md §2) → actions; 8-point gaps (16 / 8 / 24),
    // stack centered as a group regardless of line count
    const hangers = Math.max(0, 3 - lost)

    // on the finale the RETURN RATE leads — the whole game argues that
    // number (BOSS-SPEC / DESIGN §3.6)
    const lines = finale
      ? [
          `ITEM RETURN RATE  ${returnRate}%`,
          `ITEMS RETURNED  ${itemsReturned}`,
          `GUESTS SERVED  ${guestsServed}`,
          `BEST MULTIPLIER  x${bestMultiplier.toFixed(2)}`,
          `SCORE  ${score}`,
        ]
      : [
          `ITEMS RETURNED  ${itemsReturned}`,
          `GUESTS SERVED  ${guestsServed}`,
          `ITEM RETURN RATE  ${returnRate}%`,
          `BEST MULTIPLIER  x${bestMultiplier.toFixed(2)}`,
          `SCORE  ${score}`,
        ]
    // collectible minor lines only when nonzero (BRIEF-04 §4)
    if (insightsCaught > 0) lines.splice(2, 0, `INSIGHTS CAUGHT  ${insightsCaught}`)
    if (cardsUsed > 0) lines.splice(2, 0, `CARDS USED  ${cardsUsed}`)
    if (tagsCollected > 0) lines.splice(2, 0, `TAGS COLLECTED  ${tagsCollected}`)
    if (bonus > 0) lines.push(`BIG DAY! BONUS  +${bonus}`)
    this.resultsBody.setOrigin(0.5, 0)
    this.resultsBody.setText(lines.join('\n'))

    const HANGER_H = 20 // 2x glyph height
    const total = 16 + 16 + HANGER_H + 8 + this.resultsBody.height + 24 + 12
    const top = Math.round((GAME_HEIGHT - total) / 2)
    this.resultsTitle.setY(top + 8) // 16px title, origin-centered
    this.hangerRowY = top + 32
    this.resultsBody.setY(top + 32 + HANGER_H + 8)
    this.resultsPrompt.setY(top + 32 + HANGER_H + 8 + this.resultsBody.height + 24 + 6)
    this.stampText.setY(this.resultsTitle.y - 4) // overlaps the title region

    // sequential fill is the screen's second beat: chime per hanger
    this.drawResultHangers(0)
    for (let i = 1; i <= hangers; i++) {
      this.hangerTimers.push(
        this.time.delayedCall(400 * i, () => {
          this.drawResultHangers(i)
          audio.play('chime')
          if (i === 3) this.slamStamp()
        })
      )
    }

    this.resultsPanel.setVisible(true)
  }

  // BIG DAY! rubber-stamp slam — overlaps the title region, clear of the
  // hanger row (handoff -i item 3)
  slamStamp() {
    this.stampText.setVisible(true)
    this.stampText.setScale(3)
    this.stampText.setAlpha(0)
    audio.play('stamp')
    this.tweens.add({
      targets: this.stampText,
      scale: 1,
      alpha: 1,
      duration: 180,
      ease: 'Back.easeIn',
    })
  }

  onRunReset() {
    this.resultsPanel.setVisible(false)
    this.pausePanel.setVisible(false) // exit-from-pause path (-e)
    this.hangerTimers.forEach((t) => t.remove())
    this.hangerTimers = []
    this.resultHangers.forEach((h) => h.setVisible(false))
    this.stampText.setVisible(false)
    this.clearBubbles()
    this.clearRequestChips()
  }
}
