import Phaser from 'phaser'
import { TUNING } from '../config/tuning.js'
import { audio } from '../systems/AudioBus.js'

// THE PAPER TICKET KING (BRIEF-07 Act 2, BOSS-SPEC as amended).
//
// Core concept, locked: Chexy has no attack verb. The King is never
// damaged by tagging — he is damaged by THE LINE MOVING WITHOUT HIM.
// Every successful return advances the Return Meter; his claw rips
// returns back off the rack to regress it. He threatens the JOB, never
// Chexy's health.
//
// The meter is TIER-WEIGHTED (handoff 2026-08-11-a): a return adds the
// item's weight (standard 1.0 / tier-2 1.5 / tier-3 2.0), a rip
// subtracts exactly that weight, and a restore re-adds it. Symmetric,
// so the fight can never drift on bookkeeping alone.
//
// Body states shrink per phase (128 → 104 → 80) while speed scales UP.
// Phase 3 descends to floor level — he invades your space as he fades.
//
// This is the game's first event-driven state machine, so per BRIEF-07
// §5 every transition arms a WATCHDOG: state exits belong to timers and
// logic, animations only follow. If a transition hasn't completed within
// bossWatchdogMs the machine forces itself forward and warns.
const BODY = [
  { size: 128, spools: 5, tint: 0xf2e9d0, art: 'king-intact' },
  { size: 104, spools: 3, tint: 0xe8dcbb, art: 'king-torn' },
  { size: 80, spools: 1, tint: 0xdccfa6, art: 'king-ragged' },
]
const CROWN_RED = 0xc01818

export default class PaperTicketKing {
  constructor(scene, x, floorY) {
    this.scene = scene
    this.floorY = floorY
    this.phase = 0
    this.points = 0 // meter progress WITHIN the current phase
    this.state = 'idle' // idle | transition | dead
    this.watchdogAt = 0
    this.homeX = x
    this.makeTextures()

    this.sprite = scene.physics.add.sprite(x, floorY - 150, this.bodyKey(0))
    this.applyBodyArt(0)
    this.sprite.setDepth(6)
    this.sprite.body.setAllowGravity(false)
    this.sprite.body.setImmovable(true)
    this.sprite.setData('king', true)
    this.meterGfx = scene.add.graphics().setDepth(7)

    this.nextSpewAt = scene.time.now + TUNING.bossSpewIntervalMs[0]
    this.nextClawAt = scene.time.now + TUNING.bossClawIntervalMs[0]
    this.nextCarpetAt = scene.time.now + TUNING.bossCarpetIntervalMs[0]
    this.nextTornadoAt = Infinity // phase 2 unlocks it
    this.nextGrabAt = Infinity // phase 3 unlocks it
    this.lastGaspFired = false
    this.bob = Math.random() * Math.PI * 2
  }

  makeTextures() {
    const g = this.scene.add.graphics()
    BODY.forEach((b, i) => {
      const key = `king-${i}`
      if (this.scene.textures.exists(key)) return
      g.clear()
      // interim art (BRIEF-07 §4): scaled tinted rect + drawn-on meter
      g.fillStyle(b.tint, 1)
      g.fillRect(0, Math.round(b.size * 0.18), b.size, Math.round(b.size * 0.82))
      g.fillStyle(CROWN_RED, 1)
      const spoolW = Math.round(b.size / (b.spools * 2 + 1))
      for (let s = 0; s < b.spools; s++) {
        g.fillRect(spoolW * (1 + s * 2), 0, spoolW, Math.round(b.size * 0.2))
      }
      g.generateTexture(key, b.size, b.size)
    })
    g.destroy()
  }

  // drawn state art wins per STATE (BRIEF-ART-06 drops them one at a
  // time, starting with the style-proof gate); otherwise the interim
  // tinted rect stands in
  bodyKey(phase) {
    const art = BODY[phase].art
    return this.scene.textures.exists(art) ? art : `king-${phase}`
  }

  applyBodyArt(phase) {
    if (!this.scene.textures.exists(BODY[phase].art)) return
    // sprite-local registration (2026-07-30-a): his tags never touch
    // the global namespace
    const tags = this.scene.anims.createFromAseprite(BODY[phase].art, undefined, this.sprite)
    if (tags?.some((a) => a.key === 'idle')) this.sprite.play({ key: 'idle', repeat: -1 }, true)
  }

  get threshold() {
    return TUNING.bossReturnThresholds[this.phase] ?? Infinity
  }

  get alive() {
    return this.state !== 'dead'
  }

  // a return landed: advance the meter by the item's WEIGHT
  addReturn(weight) {
    if (this.state !== 'idle') return
    this.points += weight
    // Last Gasp: one scripted all-out wave as the phase closes out —
    // fires once per phase, and the final phase's is the real one
    if (!this.lastGaspFired && this.points >= this.threshold * TUNING.bossLastGaspFrac) {
      this.lastGaspFired = true
      this.scene.lastGasp(this.phase)
    }
    if (this.points >= this.threshold) this.advancePhase()
  }

  // the claw ripped a return back off the rack: regress by exactly that
  // weight (never below zero — a phase can stall, never invert)
  regress(weight) {
    this.points = Math.max(0, this.points - weight)
  }

  advancePhase() {
    this.state = 'transition'
    this.watchdogAt = this.scene.time.now + TUNING.bossWatchdogMs
    this.points = 0
    this.scene.bossBurst(this.sprite.x, this.sprite.y)
    audio.play('heavyTag', this.scene.panFor(this.sprite.x))
    this.scene.time.delayedCall(TUNING.bossTransitionMs, () => this.finishTransition())
  }

  finishTransition() {
    if (this.state !== 'transition') return // already forced by the watchdog
    this.phase += 1
    if (this.phase >= BODY.length) return this.die()
    this.sprite.setTexture(this.bodyKey(this.phase))
    this.applyBodyArt(this.phase)
    this.sprite.body.setSize(BODY[this.phase].size, BODY[this.phase].size, true)
    this.state = 'idle'
    this.watchdogAt = 0
    this.lastGaspFired = false
    const now = this.scene.time.now
    this.nextSpewAt = now + TUNING.bossSpewIntervalMs[this.phase]
    this.nextClawAt = now + TUNING.bossClawIntervalMs[this.phase]
    this.nextCarpetAt = now + TUNING.bossCarpetIntervalMs[this.phase]
    // the kit unlocks by phase: Tornado at the Middle Manager, Grab
    // Chexy at the Desperate Clerk
    this.nextTornadoAt =
      TUNING.bossTornadoIntervalMs[this.phase] > 0
        ? now + TUNING.bossTornadoIntervalMs[this.phase]
        : Infinity
    this.nextGrabAt =
      TUNING.bossGrabIntervalMs[this.phase] > 0
        ? now + TUNING.bossGrabIntervalMs[this.phase]
        : Infinity
  }

  die() {
    this.state = 'dead'
    this.watchdogAt = 0
    this.meterGfx.clear()
    this.scene.bossBurst(this.sprite.x, this.sprite.y, 3)
    this.sprite.setVisible(false)
    this.scene.onKingDefeated()
  }

  update(time, delta) {
    if (this.state === 'dead') return

    // WATCHDOG (BRIEF-07 §5): a transition that never completed gets
    // forced, loudly — the machine may not hang on a missed callback
    if (this.watchdogAt && time > this.watchdogAt) {
      console.warn(
        `King state machine WATCHDOG: '${this.state}' exceeded ${TUNING.bossWatchdogMs}ms ` +
          `(phase ${this.phase}) — forcing it forward.`
      )
      const stuck = this.state
      this.watchdogAt = 0
      // a stuck TRANSITION completes; any other stuck state (a grab
      // whose lunge never resolved) simply returns to idle — the
      // machine may never hang, whatever wedged it
      if (stuck === 'transition') this.finishTransition()
      else {
        this.state = 'idle'
        this.scene.endGrab?.()
      }
      return
    }
    if (this.state !== 'idle') return

    // drift above the arena; phase 3 walks the floor (spatial escalation)
    const speed = TUNING.bossSpeedByPhase[this.phase]
    this.bob += delta / 1000
    const targetY =
      this.phase >= 2
        ? this.floorY - BODY[this.phase].size / 2
        : this.floorY - 150 + Math.sin(this.bob) * 12
    const player = this.scene.player
    const dx = Phaser.Math.Clamp(player.x - this.sprite.x, -1, 1)
    this.sprite.body.setVelocity(dx * speed, (targetY - this.sprite.y) * 2)

    if (time >= this.nextSpewAt) {
      this.nextSpewAt = time + TUNING.bossSpewIntervalMs[this.phase]
      this.scene.stubSpew(TUNING.bossSpewCountByPhase[this.phase])
    }
    if (time >= this.nextClawAt) {
      this.nextClawAt = time + TUNING.bossClawIntervalMs[this.phase]
      this.scene.launchClaw()
    }
    if (time >= this.nextCarpetAt) {
      this.nextCarpetAt = time + TUNING.bossCarpetIntervalMs[this.phase]
      this.scene.dropCarpet()
    }
    if (time >= this.nextTornadoAt) {
      this.nextTornadoAt = time + TUNING.bossTornadoIntervalMs[this.phase]
      this.scene.ticketTornado()
    }
    if (time >= this.nextGrabAt) {
      this.nextGrabAt = time + TUNING.bossGrabIntervalMs[this.phase]
      this.scene.startGrab()
    }
    this.drawMeter()
  }

  // the chest claim check, torn to the meter fraction (BOSS-SPEC)
  drawMeter() {
    const s = this.sprite
    const w = Math.round(BODY[this.phase].size * 0.6)
    const x = Math.round(s.x - w / 2)
    const y = Math.round(s.y)
    const frac = Phaser.Math.Clamp(this.points / this.threshold, 0, 1)
    this.meterGfx.clear()
    this.meterGfx.fillStyle(0x101018, 0.85)
    this.meterGfx.fillRect(x, y, w, 6)
    this.meterGfx.fillStyle(0x12b76a, 1) // the line moving
    this.meterGfx.fillRect(x, y, Math.round(w * frac), 6)
    this.meterGfx.lineStyle(1, CROWN_RED, 1)
    this.meterGfx.strokeRect(x, y, w, 6)
  }

  destroy() {
    this.sprite.destroy()
    this.meterGfx.destroy()
  }
}
