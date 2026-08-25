import Phaser from 'phaser'
import MuseumScene from './MuseumScene.js'
import PaperTicketKing from '../entities/PaperTicketKing.js'
import { TUNING } from '../config/tuning.js'
import { audio } from '../systems/AudioBus.js'
import WaveRunner from '../systems/WaveRunner.js'
import { getWaveSchedule } from '../config/waveRegistry.js'
import { categoryColor } from '../config/itemCategories.js'

// Level 5: The Mass Exodus (BRIEF-07). TWO ACTS IN ONE RUN.
//
// Act 1 (S1) is the medley finale — every shipped item class in one
// static arena; extending MuseumScene buys the mover stack whole.
// Act 2 (S2) is The Paper Ticket King, entered through the BOSS DOOR:
// act-1 losses AND score bank at the door, a boss retry restores
// exactly that state, and Act 1 is never replayed within a run.
// Hangers judge the FULL SHIFT (losses across both acts).
//
// The fiction is flipped level-wide (handbackCopy map property): every
// tag RETURNS an item to a departing guest. In Act 2 returns stay
// RACKED on screen instead of whisking away — they have to persist,
// because the King's claw rips returns back off the rack to regress
// his meter. Rip and restore are exactly symmetric in weight.
const CHECKPOINT_KEY = 'exodusCheckpoint'
const CLAW_RED = 0xc01818

export default class ExodusScene extends MuseumScene {
  constructor() {
    super('Exodus')
  }

  init(data) {
    super.init(data)
    // a boss retry re-enters straight into Act 2 with the banked state
    this.resumeBoss = data.resumeBoss === true
  }

  create() {
    super.create()
    this.act = 1
    this.king = null
    this.claws = this.physics.add.group({ allowGravity: false })
    this.bossParticles = this.tagParticles
    this.carpets = []
    this.grab = null
    // DEV-ONLY boss skip (playtest tool): B during Act 1 banks the run
    // as it stands and opens the Boss Door immediately. It takes the
    // REAL door path — bank, breath beat, Act 2 — so what you land in
    // is the shipping transition, just without playing four minutes
    // first. Gated on import.meta.env.DEV, so it cannot exist in a
    // built game. 'B' collides with nothing (R/C results, ESC/P pause,
    // F jitter capture, Z/J/X/K/SPACE gameplay).
    this.bossSkipKey = import.meta.env.DEV ? this.input.keyboard.addKey('B') : null

    if (this.resumeBoss) {
      const cp = this.game.registry.get(CHECKPOINT_KEY)
      if (cp) {
        this.restoreCheckpoint(cp)
        this.startAct2()
        return
      }
    }
    this.game.registry.remove(CHECKPOINT_KEY) // fresh run: no stale bank
  }

  // ---- the Boss Door -------------------------------------------------

  // Act 1 ending on the rush timer is NOT the end of the run: bank and
  // walk through the door. Losing all three items in Act 1 still ends it.
  endRun(cleared) {
    if (this.act === 1 && cleared && !this.runOver) {
      this.beginBossDoor()
      return
    }
    if (this.act === 2 && cleared) {
      this.game.registry.remove(CHECKPOINT_KEY) // shift complete
      this.finaleWin = true // the results screen leads on ITEM RETURN RATE
    }
    super.endRun(cleared)
  }

  bankCheckpoint() {
    const cp = {
      lostItems: this.lostItems,
      score: this.score,
      itemsReturned: this.itemsReturned,
      tagsCollected: this.tagsCollected,
      cardsUsed: this.cardsUsed,
      insightsCaught: this.insightsCaught,
      bestMultiplier: this.bestMultiplier,
    }
    this.game.registry.set(CHECKPOINT_KEY, cp)
    return cp
  }

  restoreCheckpoint(cp) {
    this.lostItems = cp.lostItems
    this.score = cp.score
    this.itemsReturned = cp.itemsReturned
    this.tagsCollected = cp.tagsCollected
    this.cardsUsed = cp.cardsUsed
    this.insightsCaught = cp.insightsCaught
    this.bestMultiplier = cp.bestMultiplier
    this.emitHud()
  }

  beginBossDoor() {
    this.act = 'door'
    this.bankCheckpoint()
    this.clockTimer?.remove()
    this.waveRunner.entries = []
    this.clearHold()
    // the lobby empties, paper starts swirling
    for (const e of this.enemies.getChildren().slice()) e.destroy()
    for (const i of this.items.getChildren().slice()) {
      if (!i.getData('tagged')) i.destroy()
    }
    audio.play('chime') // threshold beat (rushEnd has no synth)
    this.game.events.emit('system-bubble', {
      text: 'The lobby empties… something enormous is unfolding.',
      accent: CLAW_RED,
      holdMs: TUNING.bossDoorBreathMs,
    })
    this.time.delayedCall(TUNING.bossDoorBreathMs, () => this.startAct2())
  }

  startAct2() {
    this.act = 2
    this.runOver = false
    // Act 2 has no rush clock — the fight ends on the meter, not the
    // timer. Both entries converge here, so this is the ONE place the
    // act-1 countdown must die: a resumed boss retry that kept ticking
    // would "win" the shift when the old clock hit zero.
    this.clockTimer?.remove()
    // single wide screen, no scroll (BOSS-SPEC arena): lock the world to
    // one screen centred on the venue and put Chexy inside it
    const w = this.scale.width
    this.arenaX = Math.round(this.worldWidth / 2 - w / 2)
    this.physics.world.setBounds(this.arenaX, 0, w, this.worldHeight)
    this.cameras.main.setScroll(this.arenaX, 0)
    this.player.body.reset(this.arenaX + w / 2, this.worldHeight - 60)
    for (const i of this.items.getChildren().slice()) i.destroy()

    this.king = new PaperTicketKing(this, this.arenaX + w / 2, this.worldHeight - 32)
    this.physics.add.overlap(this.player.sprite, this.claws, null, () => false)
    this.waveRunner = new WaveRunnerFor(this, 'exodus-boss-waves.json')
    audio.startMusic('boss')
    this.game.events.emit('system-bubble', {
      text: 'THE PAPER TICKET KING. Keep the line moving!',
      accent: CLAW_RED,
      holdMs: 4000,
    })
  }

  // a boss defeat retries ACT 2 ONLY — Act 1 is never replayed in a run
  teardownRun(destination) {
    if (destination === 'retry' && this.game.registry.get(CHECKPOINT_KEY)) {
      audio.play('uiSelect')
      this.game.events.emit('run-reset')
      this.scene.restart({ mapKey: this.mapKey, resumeBoss: true })
      return
    }
    if (destination !== 'retry') this.game.registry.remove(CHECKPOINT_KEY)
    super.teardownRun(destination)
  }

  // ---- Act 2: returns stay racked ------------------------------------

  completeTag(item, viaCard = false) {
    if (this.act !== 2) return super.completeTag(item, viaCard)

    item.setData('tagged', true)
    item.setData('returned', true)
    this.physics.pause()
    this.time.delayedCall(TUNING.hitstopMs, () => {
      if (!this.runOver) this.physics.resume()
    })
    this.tagParticles.emitParticleAt(item.x, item.y)
    audio.play(item.getData('heavy') ? 'heavyTag' : 'tag', this.panFor(item.x))
    if (!viaCard) this.player.triggerAnim('tap')
    this.game.events.emit('guest-happy', {
      guest: item.getData('guest'),
      ...this.guestSubject(item),
    })
    this.rackItem(item)
    this.onItemTagged(item.getData('tier') ?? 1)
  }

  // racked: parked in place wearing its chip, where the claw can reach it
  rackItem(item) {
    item.body.setVelocity(0, 0)
    item.body.moves = false
    item.setData('brakePending', false)
    if (!item.getData('chip')) {
      const chip = this.add.image(0, 0, 'tag-chip').setDepth(1)
      chip.setTint(categoryColor(item.getData('category')))
      item.setData('chip', chip)
      item.once(Phaser.GameObjects.Events.DESTROY, () => chip.destroy())
    }
    this.syncChip(item)
  }

  itemWeight(item) {
    const tier = item.getData('tier') ?? 1
    return tier >= 3 ? 2.0 : tier === 2 ? 1.5 : 1.0
  }

  onItemTagged(tier) {
    super.onItemTagged(tier)
    // the line moves: the meter advances by the item's WEIGHT
    if (this.act === 2 && this.king?.alive) {
      this.king.addReturn(tier >= 3 ? 2.0 : tier === 2 ? 1.5 : 1.0)
    }
  }

  // ---- the claw: rip grammar (a giant elite) --------------------------

  launchClaw() {
    if (!this.king?.alive) return
    const racked = this.items
      .getChildren()
      .filter((i) => i.active && i.getData('returned') && !i.getData('clawed'))
    if (!racked.length) return
    const target = Phaser.Utils.Array.GetRandom(racked)
    target.setData('clawed', true)

    const claw = this.claws.create(target.x, target.y - 34, 'ticket')
    claw.setTint(CLAW_RED)
    claw.setDisplaySize(14, 18)
    claw.setDepth(5)
    claw.setData('claw', true)
    claw.setData('target', target)
    claw.setData('mode', 'telegraph')
    claw.setData('until', this.time.now + TUNING.bossTelegraphMsByPhase[this.king.phase])
    audio.play('gloat', this.panFor(claw.x))
  }

  updateClaws(time) {
    for (const claw of this.claws.getChildren()) {
      if (!claw.active) continue
      const mode = claw.getData('mode')
      const target = claw.getData('target')

      if (mode === 'telegraph') {
        // wind-up: hovers over the racked item, flashing. Tap it here and
        // the rip never happens (rescue rules — no score, no streak)
        claw.setAlpha(Math.sin(time / 60) > 0 ? 1 : 0.45)
        if (!target?.active || !target.getData('returned')) {
          this.releaseClaw(claw)
          continue
        }
        claw.setPosition(Math.round(target.x), Math.round(target.y - 30))
        if (time >= claw.getData('until')) this.ripReturn(claw, target)
      } else if (mode === 'carry') {
        claw.setAlpha(1)
        const kx = this.king?.sprite.x ?? claw.x
        const ky = this.king?.sprite.y ?? 0
        const ang = Phaser.Math.Angle.Between(claw.x, claw.y, kx, ky)
        claw.body.setVelocity(Math.cos(ang) * 90, Math.sin(ang) * 90)
        const chip = claw.getData('chip')
        chip?.setPosition(Math.round(claw.x), Math.round(claw.y - 8))
        if (Phaser.Math.Distance.Between(claw.x, claw.y, kx, ky) < 40) {
          chip?.destroy() // he eats the paperwork; the item stays re-taggable
          this.releaseClaw(claw)
        }
      }
    }
  }

  // the rip: the return UN-COUNTS and the item goes re-taggable. No new
  // loss channel — the King undoes WORK, he never creates losses.
  ripReturn(claw, item) {
    const weight = this.itemWeight(item)
    item.setData('returned', false)
    item.setData('tagged', false)
    item.body.moves = item.getData('mover') === true
    const chip = item.getData('chip')
    item.setData('chip', null)
    claw.setData('mode', 'carry')
    claw.setData('chip', chip)
    claw.setData('weight', weight)
    claw.setData('ripped', item)
    this.king?.regress(weight)
    this.itemsReturned = Math.max(0, this.itemsReturned - 1)
    this.emitHud()
    audio.play('interrupt', this.panFor(claw.x))
  }

  releaseClaw(claw) {
    claw.getData('target')?.setData('clawed', false)
    claw.getData('chip')?.destroy()
    claw.destroy()
  }

  // the claw is tap-stunnable in BOTH windows: during the telegraph
  // (prevents the rip) and mid-carry (restores the return)
  stunnableCandidates() {
    return [...super.stunnableCandidates(), ...this.claws.getChildren()]
  }

  isStunnable(obj) {
    if (obj.getData?.('claw')) return obj.active
    return super.isStunnable(obj)
  }

  stunEnemy(obj, time) {
    if (!obj.getData?.('claw')) return super.stunEnemy(obj, time)
    const mode = obj.getData('mode')
    this.physics.pause()
    this.time.delayedCall(TUNING.hitstopMs, () => {
      if (!this.runOver) this.physics.resume()
    })
    this.tagParticles.emitParticleAt(obj.x, obj.y)
    audio.play('stun', this.panFor(obj.x))
    this.player.triggerAnim('tap')
    if (mode === 'carry') {
      // restore: re-rack the item and re-add EXACTLY the ripped weight
      const item = obj.getData('ripped')
      const weight = obj.getData('weight') ?? 1
      if (item?.active) {
        item.setData('tagged', true)
        item.setData('returned', true)
        this.rackItem(item)
        this.itemsReturned += 1
        this.emitHud()
        this.king?.addReturn(weight)
      }
    }
    this.releaseClaw(obj)
  }

  // ---- minions: Stub Spew --------------------------------------------

  stubSpew(count) {
    for (let i = 0; i < count; i++) {
      this.time.delayedCall(i * 180, () => {
        if (!this.runOver && this.king?.alive) this.spawnEnemy()
      })
    }
  }

  // per-phase steal spacing while the King is up
  stealCooldown() {
    if (this.act === 2 && this.time.now < (this.lastGaspUntil ?? 0)) {
      return TUNING.lastGaspStealCooldownMs // compressed, never absent
    }
    if (this.act === 2 && this.king?.alive) {
      return TUNING.bossStealCooldownMs[this.king.phase] ?? super.stealCooldown()
    }
    return super.stealCooldown()
  }

  bossBurst(x, y, scale = 1) {
    for (let i = 0; i < 12 * scale; i++) this.bossParticles.emitParticleAt(x, y)
  }

  // ---- his kit (BRIEF-07 §3 reconciliations) --------------------------

  // PAPER CARPET: a litter zone that saps traction. Runs the swarm
  // contact-slow rules exactly — speed CAP, refresh-not-stack, NOT
  // interrupt-class — and dash crosses clean, which is the dash's
  // promised finale moment.
  dropCarpet() {
    const w = TUNING.bossCarpetWidth
    const x0 = Phaser.Math.Clamp(
      Math.round(this.player.x - w / 2 + Phaser.Math.Between(-40, 40)),
      this.arenaX + 8,
      this.arenaX + this.scale.width - w - 8
    )
    const until = this.time.now + TUNING.bossCarpetMs
    const stubs = []
    for (let i = 0; i < 10; i++) {
      const s = this.add
        .image(x0 + Phaser.Math.Between(0, w), this.worldHeight - 40 + Phaser.Math.Between(-3, 3), 'ticket')
        .setTint(0xf2e9d0)
        .setAlpha(0.85)
        .setDepth(0)
        .setAngle(Phaser.Math.Between(-40, 40))
      stubs.push(s)
    }
    this.carpets.push({ x0, x1: x0 + w, until, stubs })
    audio.play('spawn', this.panFor(x0 + w / 2))
  }

  updateCarpets(time) {
    for (let i = this.carpets.length - 1; i >= 0; i--) {
      const c = this.carpets[i]
      if (time >= c.until) {
        for (const s of c.stubs) s.destroy()
        this.carpets.splice(i, 1)
        continue
      }
      const p = this.player
      const inZone = p.body.bottom >= this.worldHeight - 52 && p.x >= c.x0 && p.x <= c.x1
      // TRACTION scaling, not a speed cap (ratified 2026-08-13-b): the
      // stubs make the floor SLIPPERY — slower to get going, slower to
      // stop — rather than simply slow. Dash immunity needs no guard
      // here: a dash sets velocity directly with acceleration zeroed,
      // so scaling accel/decel cannot touch it.
      if (inZone) p.traction = TUNING.slipFactor
    }
  }

  // TICKET TORNADO: scatters UNCHECKED items to fresh positions —
  // re-routing pressure, never a loss. Every landing runs through the
  // placement-validity gate, as all item placement must.
  ticketTornado() {
    const loose = this.items
      .getChildren()
      .filter((i) => i.active && !i.getData('returned') && !i.getData('stolen'))
    if (!loose.length) return
    const picks = Phaser.Utils.Array.Shuffle(loose).slice(0, TUNING.bossTornadoCount)
    for (const item of picks) {
      this.bossBurst(item.x, item.y)
      const { x, y } = this.scatterDestination()
      this.placeItemClear(item, x, y)
      item.body.setVelocity(0, -40)
    }
    audio.play('interrupt', this.panFor(this.player.x))
  }

  // SCATTER CLAMP (ratified 2026-08-13-b): displacement obeys the same
  // principle as placement — a destination must be CONTESTABLE. Landing
  // spots are bounded to the arena's floor, inset from both walls, and
  // pushed clear of the King's own footprint. No item may be thrown
  // where only he can reach it.
  scatterDestination() {
    const margin = 34
    const lo = this.arenaX + margin
    const hi = this.arenaX + this.scale.width - margin
    const k = this.king?.sprite
    for (let tries = 0; tries < 8; tries++) {
      const x = Phaser.Math.Between(lo, hi)
      const clearOfKing = !k || !this.king.alive || Math.abs(x - k.x) > k.displayWidth / 2 + 24
      if (clearOfKing) return { x, y: this.worldHeight - 60 }
    }
    // every roll landed under him: step out to the far side of the arena
    const away = k.x - this.arenaX > this.scale.width / 2 ? lo : hi
    return { x: away, y: this.worldHeight - 60 }
  }

  // GRAB CHEXY (phase 3): telegraphed lunge; on connect it costs TIME,
  // never items. Interrupt-class, so post-interrupt grace shields it —
  // a graced player walks through the lunge untouched.
  startGrab() {
    if (this.grab || this.time.now < this.graceUntil || !this.king?.alive) return
    const tel = TUNING.bossTelegraphMsByPhase[this.king.phase]
    this.grab = { state: 'telegraph', until: this.time.now + tel }
    // hand the King over to the grab: his idle drift would otherwise
    // overwrite the lunge velocity every frame. The watchdog covers the
    // borrowed state, so a grab that never resolves can't wedge him.
    this.king.state = 'grab'
    this.king.watchdogAt = this.time.now + TUNING.bossWatchdogMs
    this.king.sprite.setTint(0xff8888)
    audio.play('gloat', this.panFor(this.king?.sprite.x ?? this.player.x))
  }

  updateGrab(time) {
    const g = this.grab
    if (!g) return
    const k = this.king?.sprite
    if (!k || !this.king.alive) return this.endGrab()

    if (g.state === 'telegraph') {
      if (time < g.until) return
      g.state = 'lunge'
      g.until = time + 900
      const ang = Phaser.Math.Angle.Between(k.x, k.y, this.player.x, this.player.y)
      k.body.setVelocity(Math.cos(ang) * 260, Math.sin(ang) * 260)
      return
    }
    if (g.state === 'lunge') {
      const caught =
        Phaser.Math.Distance.Between(k.x, k.y, this.player.x, this.player.y) < 34 &&
        time >= this.graceUntil // grace shields the grab (-07-e)
      if (caught) {
        g.state = 'held'
        g.until = time + TUNING.grabMashMs
        this.player.frozen = true
        this.player.body.setVelocity(0, 0)
        if (this.hold) this.interruptHold(true) // interrupt-class
        this.king.sprite.clearTint()
        audio.play('interrupt', this.panFor(this.player.x))
        return
      }
      if (time >= g.until) this.endGrab()
      return
    }
    // held: mash ANY key to shorten it — lost time, nothing more
    if (this.anyKeyPressed()) g.until -= TUNING.grabMashRelief
    this.player.body.setVelocity(0, 0)
    if (time >= g.until) {
      this.graceUntil = time + TUNING.iframesMs // released with grace, as any interrupt
      this.endGrab()
    }
  }

  // Mash detection must do its OWN edge tracking: Player.update runs
  // first and consumes every one of these keys through JustDown (which
  // clears the flag), so a JustDown check here would almost never see a
  // press and the mash would silently do nothing.
  anyKeyPressed() {
    const p = this.player
    const keys = [
      p.cursors.left,
      p.cursors.right,
      p.cursors.up,
      p.cursors.down,
      p.keys.SPACE,
      p.keys.Z,
      p.keys.J,
      p.keys.X,
      p.keys.K,
    ].filter(Boolean)
    const prev = this.mashDown ?? new Set()
    const now = new Set()
    let pressed = false
    for (const k of keys) {
      if (!k.isDown) continue
      now.add(k)
      if (!prev.has(k)) pressed = true
    }
    this.mashDown = now
    return pressed
  }

  endGrab() {
    this.grab = null
    this.player.frozen = false
    if (!this.king) return
    this.king.sprite.clearTint()
    if (this.king.state === 'grab') {
      this.king.state = 'idle'
      this.king.watchdogAt = 0
    }
  }

  // LAST GASP: one scripted all-out wave as a phase closes. The SPAWN
  // burst is exempt from pacing — the swarm IS the spectacle — but
  // steal INITIATIONS inside the window run a compressed dedicated
  // clock instead (ratified 2026-08-13-b), so chases stay SEQUENTIAL
  // even at the climax. A simultaneous multi-grab stays impossible by
  // construction: every steal passes one global gate.
  lastGasp(phase) {
    this.lastGaspUntil = this.time.now + TUNING.bossLastGaspMs
    this.stubSpew(TUNING.bossSpewCountByPhase[phase])
    this.dropCarpet()
    if (phase >= 1) this.ticketTornado()
    this.game.events.emit('system-bubble', {
      text: 'The King empties his drawers!',
      accent: CLAW_RED,
      holdMs: 2200,
    })
  }

  // THE ENDING (BOSS-SPEC, scripted and short): the last perforation
  // gives → the crown falls with an oversized clatter → the body
  // collapses into dead stubs → the 0045 stub flutters down and lands
  // → a rubber stamp slams. Then results, leading with ITEM RETURN
  // RATE. "Death to the paper ticket."
  onKingDefeated() {
    this.endGrab()
    this.player.frozen = true
    const kx = this.king.sprite.x
    const ky = this.king.sprite.y
    for (const c of this.carpets) for (const s of c.stubs) s.destroy()
    this.carpets.length = 0
    for (const e of this.enemies.getChildren().slice()) e.destroy()
    for (const c of this.claws.getChildren().slice()) this.releaseClaw(c)

    // 1. the crown falls, oversized, and clatters
    const crown = this.add.rectangle(kx, ky - 40, 44, 14, CLAW_RED).setDepth(9)
    this.tweens.add({
      targets: crown,
      y: this.worldHeight - 40,
      angle: 220,
      duration: 900,
      ease: 'Quad.easeIn',
      onComplete: () => {
        audio.play('heavyTag', this.panFor(kx))
        this.tweens.add({ targets: crown, alpha: 0, delay: 900, duration: 500 })
      },
    })
    // 2. the body collapses into a confetti burst of dead stubs
    this.bossBurst(kx, ky, 4)
    audio.play('runClear')

    // 3. the 0045 stub flutters down, swaying, and lands
    this.time.delayedCall(900, () => {
      const stub = this.add.image(kx, ky - 10, 'ticket').setTint(0xfffdf5).setDepth(9)
      const swayFrom = kx
      this.tweens.add({
        targets: stub,
        y: this.worldHeight - 44,
        duration: 1400,
        ease: 'Sine.easeInOut',
        onUpdate: (tw) => {
          stub.x = swayFrom + Math.sin(tw.progress * Math.PI * 3) * 14
          stub.setAngle(Math.sin(tw.progress * Math.PI * 6) * 22)
        },
        onComplete: () => {
          // 4. the rubber stamp slams
          const stamp = this.add
            .text(stub.x, stub.y - 6, '0045', {
              fontFamily: 'monospace',
              fontSize: '16px',
              fontStyle: 'bold',
              color: '#c01818',
            })
            .setOrigin(0.5)
            .setDepth(10)
            .setScale(4)
            .setAlpha(0)
            .setAngle(-12)
          this.tweens.add({
            targets: stamp,
            scale: 1,
            alpha: 1,
            duration: 180,
            ease: 'Quad.easeIn',
            onComplete: () => {
              this.physics.pause()
              audio.play('stamp')
              this.cameras.main.shake(160, 0.008)
              this.time.delayedCall(900, () => {
                this.player.frozen = false
                if (!this.runOver) this.endRun(true)
              })
            },
          })
        },
      })
    })
  }

  // Instrument applicability is per-level GRAMMAR (handoff
  // 2026-08-11-b): Act 2 is a single 480px arena, so serial routing
  // feasibility is answered by the arena itself — the travel budget
  // reads N/A here rather than firing on tight simultaneity that a
  // player can see and reach. Act 1's 2112px venue still prices it.
  recordTravelEvent(x) {
    if (this.act === 2) return
    super.recordTravelEvent(x)
  }

  // ---- frame ----------------------------------------------------------

  updateCamera() {
    if (this.act === 2) return this.cameras.main.setScroll(this.arenaX, 0)
    super.updateCamera()
  }

  update(time, delta) {
    super.update(time, delta)
    if (
      this.bossSkipKey &&
      Phaser.Input.Keyboard.JustDown(this.bossSkipKey) &&
      this.act === 1 &&
      !this.runOver
    ) {
      this.game.events.emit('system-bubble', {
        text: 'DEBUG: skipping to the Boss Door',
        accent: CLAW_RED,
        holdMs: 1600,
      })
      this.beginBossDoor()
      return
    }
    if (this.runOver || this.act !== 2) return
    this.king?.update(time, delta)
    this.updateClaws(time)
    this.updateCarpets(time)
    this.updateGrab(time)
  }
}

// the act-2 schedule runs on its own clock: a fresh runner, so elapsed
// starts at zero when the door closes behind you
function WaveRunnerFor(scene, file) {
  return new WaveRunner(scene, getWaveSchedule(file), {
    spawnItem: (pt, cat, tier, fallbacks) => scene.spawnScheduledItem(pt, cat, tier, fallbacks),
    spawnEnemy: (entry) => scene.spawnEnemy(entry),
    spawnCollectible: (type, pt) => scene.spawnCollectible(type, pt),
  })
}
