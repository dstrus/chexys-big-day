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
    if (this.act === 2 && cleared) this.game.registry.remove(CHECKPOINT_KEY) // shift complete
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
    audio.play('rushEnd')
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
    this.game.events.emit('guest-happy', { guest: item.getData('guest') })
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
    if (this.act === 2 && this.king?.alive) {
      return TUNING.bossStealCooldownMs[this.king.phase] ?? super.stealCooldown()
    }
    return super.stealCooldown()
  }

  bossBurst(x, y, scale = 1) {
    for (let i = 0; i < 12 * scale; i++) this.bossParticles.emitParticleAt(x, y)
  }

  onKingDefeated() {
    // S2 lands the outcome; the scripted collapse/stamp ending is S3
    this.time.delayedCall(700, () => {
      if (!this.runOver) this.endRun(true)
    })
  }

  // ---- frame ----------------------------------------------------------

  updateCamera() {
    if (this.act === 2) return this.cameras.main.setScroll(this.arenaX, 0)
    super.updateCamera()
  }

  update(time, delta) {
    super.update(time, delta)
    if (this.runOver || this.act !== 2) return
    this.king?.update(time, delta)
    this.updateClaws(time)
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
