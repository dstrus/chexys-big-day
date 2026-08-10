import Phaser from 'phaser'
import LevelScene from './LevelScene.js'
import { TUNING } from '../config/tuning.js'
import { audio } from '../systems/AudioBus.js'
import { isGarageDashTipShown, markGarageDashTipShown } from '../systems/progress.js'
import { isTuningPanelOpen, setPanelReadout } from '../debug/tuningPanel.js'

// Level 3: The Valet Garage (BRIEF-05, session 1 — scroll/request core).
// Extends the generic LevelScene: tagging verbs, holds, grace, render
// snap, collectibles, teardown, and HUD plumbing are all inherited.
// What changes here: the camera is driven by a scroll clock instead of
// the player; "items" are parked cars (standable, request-driven);
// the loss channel is scroll-out misses; enemies split into swarms
// (obstruct only) and elites (untag tagged cars and flee with the
// chip). Garage design session rulings: handoff 2026-08-09-b.

// car body colors: garment-hue family, never ChexApp tag colors
const CAR_COLORS = [0x8a4b2a, 0x3e5f8a, 0x6d7f43, 0x7a5f9e, 0x555f66, 0x9e6b4a]
const ELITE_ACCENT = 0xd94848 // raffle-red accent until V3 art exists
const CHIP_TEAL = 0x006483 // the applied claim chip, as everywhere
const SAFE_GREEN = 0x12b76a // Success Green — the banked-at-edge cue

export default class GarageScene extends LevelScene {
  constructor() {
    super('Garage')
  }

  create() {
    super.create()

    // ---- scroll clock (pixel-coherent: float accumulator, rounded
    // render in updateCamera — same discipline that closed the jitter
    // saga; scrollSpeed is a map property, constant for v1)
    this.scrollSpeed = this.levelProps.scrollSpeed ?? 20
    this.scrollX = 0
    this.maxScroll = this.worldWidth - this.scale.width
    // rush duration = scroll length (BRIEF-05 §5)
    this.timeLeft = Math.ceil(this.maxScroll / this.scrollSpeed)

    // ---- cars: the level's item vocabulary AND platform vocabulary
    this.makeCarTextures()
    let colorIdx = 0
    for (const obj of this.map.getObjectLayer('cars')?.objects ?? []) {
      this.spawnCar(obj, CAR_COLORS[colorIdx++ % CAR_COLORS.length])
    }
    // roofs are standable: cars are immovable, the player collides —
    // except while dashing (dash-through, 2026-08-09-g) or while a
    // pinching vehicle yields to the edge push (anti-crush guarantee).
    // Structure tiles keep their own collider: dash never passes walls.
    this.crushYieldCar = null
    this.physics.add.collider(this.player.sprite, this.items, null, (_p, car) =>
      this.carCollideFilter(car)
    )

    // one-time tutorial bubble on the first garage rush (2026-08-09-g),
    // gated like the Bell Desk beat: a persisted control tip, shown once
    if (!isGarageDashTipShown()) {
      markGarageDashTipShown()
      this.game.events.emit('system-bubble', {
        text: "Dash goes THROUGH cars! Let's gooooo!", // canon phrase (2026-08-04-a)
        accent: 0xfe701e, // Chexology Orange — tutorial voice, as the beat
        holdMs: 10000,
      })
    }

    // ---- request plumbing
    this.waveRunner.fireRequest = (carName) => this.fireRequest(carName)
    this.requestChecks = this.validateRequests()
    const red = this.requestChecks.filter((c) => !c.ok)
    for (const c of red) {
      console.warn(
        `Request readout RED: ${c.car} requested at t=${c.time}s exits at ` +
          `${c.exitT.toFixed(1)}s — lead ${(c.exitT - c.time).toFixed(1)}s < required ` +
          `${c.requiredLead.toFixed(1)}s (travel ${c.travelS.toFixed(1)}s + grace` +
          `${c.luxury ? ', ×luxuryLeadFactor' : ''}). Move the request earlier or the car later.`
      )
    }

    this.emitHud()
  }

  makeCarTextures() {
    if (this.textures.exists('car-sedan')) return
    const g = this.add.graphics()
    const make = (key, w, h) => {
      g.clear()
      g.fillStyle(0xffffff, 1)
      g.fillRect(0, 3, w, h - 3) // body
      g.fillRect(Math.round(w * 0.22), 0, Math.round(w * 0.5), 4) // cabin hint
      g.generateTexture(key, w, h)
    }
    make('car-sedan', 40, 14)
    make('car-suv', 44, 18)
    make('car-lux', 56, 16)
    g.destroy()
  }

  spawnCar(obj, color) {
    const tier = Number(obj.properties?.find((p) => p.name === 'tier')?.value ?? 1)
    const key = tier >= 3 ? 'car-lux' : obj.properties?.find((p) => p.name === 'suv')?.value ? 'car-suv' : 'car-sedan'
    const car = this.items.create(obj.x, obj.y, key)
    car.setName(obj.name)
    car.setTint(color)
    car.setData('tier', tier)
    car.setData('heavy', tier >= 3)
    car.setData('bodyColor', color)
    car.setData('spawnedAt', this.time.now)
    car.body.setAllowGravity(false)
    car.body.setImmovable(true)
    car.body.moves = false
    this.placeItemClear(car, obj.x, obj.y) // placement-validity gate, as any item
    return car
  }

  // ---- request lifecycle -------------------------------------------

  // fairness translated to scroll coordinates (BRIEF-05 §1): every
  // request must be issuable with lead ≥ max-effort scroll-relative
  // traversal from the WORST plausible position (the trailing edge at
  // fire time) + grace; luxury requests need luxuryLeadFactor × that.
  // Fully precomputable: cars are static and the scroll is constant.
  validateRequests() {
    const schedule = this.waveRunner.entries.filter((e) => e.type === 'request')
    const effSpeed =
      TUNING.maxSpeed +
      (this.isDashAvailable()
        ? (TUNING.dashSpeed - TUNING.maxSpeed) * (TUNING.dashDurationMs / 1000)
        : 0)
    return schedule.map((e) => {
      const car = this.items.getChildren().find((c) => c.name === e.car)
      if (!car) return { car: e.car, time: e.time, ok: false, exitT: 0, requiredLead: 0, travelS: 0, luxury: false, missing: true }
      const luxury = (car.getData('tier') ?? 1) >= 3
      const right = car.x + car.displayWidth / 2
      // trailing edge never passes maxScroll: end-of-level cars can't exit
      const exitT = right >= this.maxScroll ? Infinity : right / this.scrollSpeed
      const distAtFire = Math.max(0, car.x - Math.min(e.time * this.scrollSpeed, this.maxScroll))
      const travelS = distAtFire / effSpeed
      const baseLead = travelS + TUNING.requestGraceMs / 1000 + (luxury ? TUNING.holdTagMs / 1000 : 0)
      const requiredLead = luxury ? baseLead * TUNING.luxuryLeadFactor : baseLead
      const available = exitT - e.time
      return {
        car: e.car,
        time: e.time,
        exitT,
        travelS,
        requiredLead,
        luxury,
        ok: available >= requiredLead,
        // tension band (first-punch-list lesson): the readout ensures
        // FAIR; this ensures INTERESTING. Green-but-SLACK means the
        // lead is so generous the request carries no pressure.
        slack: available >= requiredLead && available > requiredLead * 3,
      }
    })
  }

  fireRequest(carName) {
    const car = this.items.getChildren().find((c) => c.name === carName && c.active)
    if (!car || car.getData('requested') || car.getData('tagged')) return
    car.setData('requested', true)
    car.setData('requestedAt', this.time.now)
    audio.play('spawn', this.panFor(car.x)) // the "text" arrives, panned
    this.game.events.emit('request-added', {
      key: carName,
      color: car.getData('bodyColor'),
      luxury: (car.getData('tier') ?? 1) >= 3,
    })
  }

  timeToExit(car) {
    return (car.x + car.displayWidth / 2 - this.scrollX) / this.scrollSpeed
  }

  // DASH-THROUGH-VEHICLES + ANTI-CRUSH (handoff 2026-08-09-g). The
  // collider's process callback: returning false suspends this pair's
  // separation for the frame. Dash-through ignores car state entirely —
  // safe/tagged/inert pass identically, and passing through never tags
  // (tagging stays on the tap/hold verbs and the request gate).
  carCollideFilter(car) {
    if (this.time.now < this.player.dashUntil) return false // dash-through
    // anti-crush: a pinching vehicle yields to the edge push, latched
    // until Chexy is clear of it (structure tiles NEVER yield)
    if (car === this.crushYieldCar) return false
    if (this.isPinch(car)) {
      this.crushYieldCar = car
      return false
    }
    return true
  }

  // the pinch (2026-08-09-g): edge push pressing + vehicle blocking
  // ahead + no vertical escape (structure too low overhead to jump the
  // car). In open sky the car stays solid — jumping out (or popping to
  // the standable roof) is the escape; the yield exists for the case
  // where geometry forbids both.
  isPinch(car) {
    const b = this.player.body
    if (b.left > this.scrollX + TUNING.edgePushMargin + 2) return false // push not pressing
    if (car.body.left < b.right - 4) return false // car isn't ahead-blocking
    const needed = car.body.height + 8 // rise required to clear the car
    const tiles = this.mainLayer.getTilesWithinWorldXY(b.left, b.top - needed, b.width + 8, needed)
    return tiles.some((t) => t.collides)
  }

  // REQUEST GATE (handoff 2026-08-09-d, structural): a car is taggable
  // ONLY while its request is live. Before its request — and always,
  // for dressing — it is inert scenery: auto-target skips it (no
  // whiff), the glow never lands on it, tap and hold cannot reach it.
  // Elite untags return a car to requested-unmet, so it re-gates open.
  // Tag-banking is dead; POSITION-banking is the intended skill.
  isTaggable(car) {
    return car.active && car.getData('requested') === true && !car.getData('tagged')
  }

  onCarMissed(car) {
    // the garage's loss channel (design session ruling 1): a REQUESTED,
    // untagged car crossing the trailing edge = 1 lost item
    this.game.events.emit('request-done', { key: car.name, ok: false })
    audio.play('lose', this.panFor(car.x))
    this.game.events.emit('guest-angry', { guest: car.name })
    this.onStruggle()
    if (!TUNING.godMode) {
      this.lostItems += 1
      if (this.lostItems >= 3) this.endRun(false)
    }
    this.emitHud()
    car.destroy()
  }

  // ---- tagging cars -------------------------------------------------

  // full override: cars don't whisk to a rack — they keep their body
  // (roof stays standable), wear the chip, and pull out after
  // driveOffDelayMs (the elite-vulnerability window). Score lands on
  // FIRST tag only; an elite untag never refunds, a re-tag never
  // double-pays.
  completeTag(item, viaCard = false) {
    item.setData('tagged', true)

    this.physics.pause()
    this.time.delayedCall(TUNING.hitstopMs, () => {
      if (!this.runOver) this.physics.resume()
    })
    this.tagParticles.emitParticleAt(item.x, item.y)
    audio.play(item.getData('heavy') ? 'heavyTag' : 'tag', this.panFor(item.x))
    if (!viaCard) this.player.triggerAnim('tap')

    // chip on the windshield (same diegetic language as everywhere)
    if (!item.getData('chip')) {
      const chip = this.add.image(0, 0, 'tag-chip').setDepth(1)
      chip.setTint(CHIP_TEAL)
      item.setData('chip', chip)
      item.once(Phaser.GameObjects.Events.DESTROY, () => chip.destroy())
      this.syncChip(item)
    }

    // the request gate means only live requests ever reach here; the
    // unrequested-tag bonus was REMOVED with the gate (2026-08-09-d —
    // it rewarded the dominant tag-on-sight strategy)
    if (!item.getData('scored')) {
      item.setData('scored', true)
      this.itemsReturned += 1
      const factor = (item.getData('tier') ?? 1) >= 3 ? TUNING.tier3ScoreFactor : 1
      this.addScore(TUNING.standardItemScore * factor)
      if (!viaCard) this.onCleanProgress() // card saves stay streak-neutral
      this.game.events.emit(viaCard ? 'guest-card' : 'guest-happy', { guest: item.name })
    }

    this.scheduleDriveOff(item)
    this.emitHud()
  }

  scheduleDriveOff(car) {
    this.time.delayedCall(TUNING.driveOffDelayMs, () => {
      if (car.active && car.getData('tagged') && !car.getData('drivingOff')) {
        this.startDriveOff(car)
      }
    })
  }

  startDriveOff(car) {
    car.setData('drivingOff', true)
    car.body.enable = false // the roof leaves with the car
    if (car.getData('requested')) {
      this.game.events.emit('request-done', { key: car.name, ok: true })
    }
    this.tweens.add({
      targets: car,
      x: car.x + 340,
      duration: 800,
      ease: 'Quad.easeIn',
      onComplete: () => car.destroy(),
    })
  }

  // Contact Card in the garage (BRIEF-05 §4): saves the most-endangered
  // REQUEST — may re-tag an untagged car or pre-tag an unreached one;
  // never wastes on unrequested dressing.
  mostEndangeredItem() {
    let best = null
    let bestT = Infinity
    for (const car of this.items.getChildren()) {
      if (!car.active || !car.getData('requested') || car.getData('tagged')) continue
      const t = this.timeToExit(car)
      if (t < bestT) {
        bestT = t
        best = car
      }
    }
    return best
  }

  contactCardSave() {
    const car = this.mostEndangeredItem()
    if (!car) return // no live request: the card fizzles
    this.cardsUsed += 1
    this.completeTag(car, true)
    audio.play('cardReturn', this.panFor(car.x))
  }

  // garage scroll-aware endangerment (level-scoped, BRIEF-05 §4): a
  // nearly-scrolled-out requested car ranks carried-class; other live
  // requests rank locked-class; dressing ranks at-rest.
  itemDangerRank(item) {
    if (!item.getData('requested') || item.getData('tagged')) return 2
    return this.timeToExit(item) < 4 ? 0 : 1
  }

  // ---- enemies: swarms obstruct, elites untag ------------------------

  spawnEnemy(entry = {}) {
    if (this.runOver) return
    if (this.enemies.countActive() >= 8) return
    const elite = !!entry.elite
    const useArt = this.textures.exists('enemy-atlas')
    // spawn relative to the VIEW, always AHEAD (2026-08-09-c): elites
    // enter from the leading edge and fly back toward tagged targets,
    // visibly crossing the play space — never behind the player
    const x = this.scrollX + this.scale.width + 20
    const y = Phaser.Math.Between(40, this.worldHeight - 80)
    const enemy = this.enemies.create(
      x,
      y,
      useArt ? 'enemy-atlas' : 'ticket',
      useArt ? this.textures.get('enemy-atlas').getFrameNames()[0] : undefined
    )
    enemy.body.setAllowGravity(false)
    enemy.setData('seed', Math.random() * 1000)
    if (useArt) {
      enemy.body.setSize(18, 16)
      this.anims.createFromAseprite('enemy-atlas', undefined, enemy)
      this.setEnemyAnim(enemy, 'move')
    }
    if (elite) {
      enemy.setData('elite', true)
      enemy.setTint(ELITE_ACCENT)
    } else {
      enemy.setData('driftVy', Phaser.Math.Between(14, 30))
      enemy.setData('driftVx', -Phaser.Math.Between(8, 22))
    }
    return enemy
  }

  // swarm teeth (handoff 2026-08-09-c): contact briefly slows Chexy —
  // position is the garage's currency. Refresh-not-stack; NOT
  // interrupt-class (no hit anim, no struggle, no grace interaction —
  // a graced player is still draggable); dash is immune and starting a
  // dash cancels an active drag. The inherited hold-interrupt + grace
  // path still runs via super.
  onEnemyTouchPlayer(playerSprite, enemy) {
    super.onEnemyTouchPlayer(playerSprite, enemy)
    if (!enemy.getData('elite') && this.time.now >= this.player.dashUntil) {
      this.swarmSlowUntil = this.time.now + TUNING.swarmSlowMs
    }
  }

  // visibility rules (handoff 2026-08-09-e): no consequential elite
  // action offscreen — untags may INITIATE only while any part of the
  // target car is on-screen
  carVisible(car) {
    return (
      car.x + car.displayWidth / 2 > this.scrollX &&
      car.x - car.displayWidth / 2 < this.scrollX + this.scale.width
    )
  }

  // SAFE-AT-EDGE (handoff 2026-08-09-e): the moment any part of a
  // tagged car reaches the trailing edge, its check-in is BANKED —
  // locked against elites, chip unrippable. Safe cars stay tagged, so
  // the ranking, arrows, and Contact Card (which all skip tagged cars)
  // drop them for free. The trailing edge is the garage's return-zone
  // moment: a last-instant tag at the edge banks on the very next frame.
  bankCar(car) {
    car.setData('safe', true)
    const chip = car.getData('chip')
    if (chip) {
      chip.setTint(SAFE_GREEN) // brief Success Green flash — the cue
      this.time.delayedCall(500, () => {
        if (chip.active) chip.setTint(CHIP_TEAL)
      })
    }
  }

  // untag events are this level's steal initiations (design ruling 2):
  // stealCooldownMs, target lock, loiter, and post-stun grace all apply.
  // Carried-chip economy ratified (2026-08-09-f): revert at rip time;
  // the chase prize is the auto-reapply (labor + position, near the
  // edge potentially the bank), never the car as hostage. Near-edge
  // rips are the intended clutch moment — if playtests read them as
  // ambush, the lever is elite target preference (bias away from
  // near-safe cars), NOT the revert model.
  onEnemyTouchItem(enemy, item) {
    if (!enemy.getData('elite')) return // swarms obstruct only, take nothing
    if (!item.getData('tagged') || item.getData('drivingOff') || !item.active) return
    if (item.getData('safe')) return // banked at the edge — unrippable
    if (!this.carVisible(item)) return // untags initiate on-screen only
    if (enemy.getData('chipCar') || enemy.getData('stunnedUntil')) return
    if (!this.clearedToSteal(enemy)) return

    this.lastStealAt = this.time.now
    item.setData('tagged', false) // reverts to requested-unmet
    const chip = item.getData('chip')
    item.setData('chip', null)
    enemy.setData('chipCar', item)
    enemy.setData('chipImg', chip)
    enemy.setData('lockedTagged', null)
    audio.play('gloat', this.panFor(item.x))
  }

  isStunnable(enemy) {
    return enemy.active && !!enemy.getData('chipCar') && !enemy.getData('stunnedUntil')
  }

  // rescue-stun the chip carrier: the chip flies back and auto-reapplies
  // (rescue-neutral — the scored flag already spent, so no double pay)
  stunEnemy(enemy, time) {
    const car = enemy.getData('chipCar')
    const chip = enemy.getData('chipImg')
    enemy.setData('chipCar', null)
    enemy.setData('chipImg', null)
    enemy.setData('lockedTagged', null)
    enemy.setData('stunnedUntil', time + TUNING.enemyStunMs)
    enemy.setTint(0x777777)
    enemy.body.setVelocity(0, 0)

    this.physics.pause()
    this.time.delayedCall(TUNING.hitstopMs, () => {
      if (!this.runOver) this.physics.resume()
    })
    ;(this.stubPoof ?? this.tagParticles).emitParticleAt(enemy.x, enemy.y)
    audio.play('stun', this.panFor(enemy.x))

    // NFC tag drop per rescue stun (BRIEF-04 §1), same as everywhere
    const tag = this.spawnCollectible('nfcTag', null, { x: enemy.x, y: enemy.y - 4, quiet: true })
    if (tag) {
      this.placeItemClear(tag, enemy.x, enemy.y - 4)
      tag.body.setAllowGravity(true)
      tag.setBounce(0.3)
      tag.body.setVelocity(Phaser.Math.Between(-40, 40), -90)
    }

    if (car && car.active && chip) {
      this.tweens.add({
        targets: chip,
        x: Math.round(car.x + car.displayWidth / 4),
        y: Math.round(car.y - car.displayHeight / 6),
        duration: 260,
        ease: 'Quad.easeIn',
        onComplete: () => {
          if (!car.active) {
            chip.destroy()
            return
          }
          car.setData('tagged', true)
          car.setData('chip', chip)
          this.scheduleDriveOff(car)
        },
      })
    } else {
      chip?.destroy()
    }
  }

  updateEnemies(time) {
    for (const enemy of this.enemies.getChildren()) {
      if (!enemy.active) continue
      const stunnedUntil = enemy.getData('stunnedUntil')
      if (stunnedUntil) {
        if (time < stunnedUntil) {
          enemy.body.setVelocity(0, 0)
          this.setEnemyAnim(enemy, 'stun')
          continue
        }
        enemy.setData('stunnedUntil', null)
        enemy.setData('stealGraceUntil', time + TUNING.enemyStealGraceMs)
        enemy.clearTint()
        if (enemy.getData('elite')) enemy.setTint(ELITE_ACCENT)
      }

      if (!enemy.getData('elite')) {
        // swarm: flock drift across the path — pure obstruction
        const seed = enemy.getData('seed')
        enemy.body.setVelocity(
          enemy.getData('driftVx'),
          Math.sin(time / 260 + seed) * enemy.getData('driftVy')
        )
        this.setEnemyAnim(enemy, 'move')
        enemy.setFlipX(enemy.body.velocity.x > 0)
        if (enemy.x < this.scrollX - 48) enemy.destroy() // drifted out behind
        continue
      }

      // ---- elite ----
      const chipCar = enemy.getData('chipCar')
      if (chipCar) {
        // flee WITH the scroll, encumbered — always interceptable from
        // behind (fleeSpeed < player maxSpeed by construction)
        const fleeSpeed = TUNING.enemySpeed * TUNING.carrierSpeedFactor + this.scrollSpeed
        enemy.body.setVelocity(fleeSpeed, Math.sin(time / 300 + enemy.getData('seed')) * 10)
        this.setEnemyAnim(enemy, 'carry')
        enemy.setFlipX(true)
        const chip = enemy.getData('chipImg')
        chip?.setPosition(Math.round(enemy.x), Math.round(enemy.y - 14))
        if (enemy.x > this.scrollX + this.scale.width + 48) {
          // escaped ahead with the chip: the car stays requested-unmet
          chip?.destroy()
          enemy.destroy()
        }
        continue
      }

      // acquire: nearest TAGGED, not-driving-off, not-SAFE car (target
      // lock; a car going safe mid-flight releases the lock — 2026-08-09-e)
      let locked = enemy.getData('lockedTagged')
      if (
        locked &&
        (!locked.active ||
          !locked.getData('tagged') ||
          locked.getData('drivingOff') ||
          locked.getData('safe'))
      ) {
        enemy.setData('lockedTagged', null)
        locked = null
      }
      if (!locked) {
        let nearestD = Infinity
        for (const car of this.items.getChildren()) {
          if (!car.active || !car.getData('tagged') || car.getData('drivingOff')) continue
          if (car.getData('safe')) continue // banked — never a target
          const d = Phaser.Math.Distance.Between(enemy.x, enemy.y, car.x, car.y)
          if (d < nearestD) {
            nearestD = d
            locked = car
          }
        }
        if (locked) enemy.setData('lockedTagged', locked)
      }

      const goal = locked || this.player
      let goalX = goal.x
      let goalY = goal.y
      if (locked && (!this.clearedToSteal(enemy) || !this.carVisible(locked))) {
        // menace loiter, as ruled — circle until cleared to strike.
        // An offscreen target extends the same grammar (2026-08-09-e):
        // orbit, readable, dive only once the car is visible.
        const orbit = (time / TUNING.loiterOrbitMs) * Math.PI * 2 + enemy.getData('seed')
        goalX += Math.cos(orbit) * TUNING.loiterRadius
        goalY += Math.sin(orbit) * TUNING.loiterRadius
      }
      const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, goalX, goalY)
      const bob = Math.sin(time / 300 + enemy.getData('seed')) * 18
      enemy.body.setVelocity(
        Math.cos(angle) * TUNING.enemySpeed,
        Math.sin(angle) * TUNING.enemySpeed + bob
      )
      this.setEnemyAnim(enemy, 'move')
      enemy.setFlipX(enemy.body.velocity.x > 0)
    }
  }

  // ---- scroll, edge, and per-frame garage state ----------------------

  updateCamera() {
    const cam = this.cameras.main
    cam.setScroll(Math.min(Math.round(this.scrollX), this.maxScroll), 0)
  }

  update(time, delta) {
    if (!this.runOver && !this.scene.isPaused()) {
      this.scrollX = Math.min(this.scrollX + (this.scrollSpeed * delta) / 1000, this.maxScroll)
    }
    // dash extend-until-clear (2026-08-09-g): a dash expiring while
    // overlapping a vehicle keeps going at dash speed until clear —
    // never ends embedded, never pops vertically. Checked BEFORE
    // Player.update so the expiry can't land this frame; once clear,
    // the dash ends on its own terms (fresh fall, -g air rules intact).
    if (
      this.player &&
      time < this.player.dashUntil &&
      this.physics.overlap(this.player.sprite, this.items)
    ) {
      this.player.dashUntil = Math.max(this.player.dashUntil, time + delta + 10)
    }
    super.update(time, delta)
    if (this.runOver) return
    this.updateGarage(time)
  }

  updateGarage(time) {
    // swarm contact-slow: cap ground speed while the drag is live;
    // Player.update re-asserts full maxVelocity every frame, so expiry
    // restores itself with no cleanup
    if (time < (this.swarmSlowUntil ?? 0)) {
      if (time < this.player.dashUntil) {
        this.swarmSlowUntil = 0 // dash cancels the drag
      } else {
        const cap = TUNING.maxSpeed * TUNING.swarmSlowFactor
        const vx = this.player.body.velocity.x
        if (Math.abs(vx) > cap) this.player.body.setVelocityX(Math.sign(vx) * cap)
        this.player.body.setMaxVelocity(cap, TUNING.fallMaxSpeed)
      }
    }

    // anti-crush latch release: the yielded vehicle re-solidifies the
    // moment Chexy is clear of it
    if (
      this.crushYieldCar &&
      (!this.crushYieldCar.active || !this.physics.overlap(this.player.sprite, this.crushYieldCar))
    ) {
      this.crushYieldCar = null
    }

    // trailing edge: pushes, never harms (design ruling 4)
    const edge = this.scrollX + TUNING.edgePushMargin
    const p = this.player
    if (p.body.left < edge) {
      if (this.hold) this.clearHold() // QUIET reset — the scroll is nobody's fault
      p.sprite.x += edge - p.body.left // firm clamp...
      if (p.body.velocity.x < 60) p.body.setVelocityX(60 + this.scrollSpeed) // ...with a bouncy nudge
    }

    // safe-at-edge bank pass (2026-08-09-e), then exit checks
    for (const car of this.items.getChildren()) {
      if (!car.active || car.getData('drivingOff')) continue
      if (
        car.getData('tagged') &&
        !car.getData('safe') &&
        car.x - car.displayWidth / 2 <= this.scrollX
      ) {
        this.bankCar(car)
      }
      const right = car.x + car.displayWidth / 2
      if (right >= this.scrollX - 4) continue
      if (car.getData('requested') && !car.getData('tagged')) this.onCarMissed(car)
      else if (car.getData('tagged')) this.startDriveOff(car) // served; leaves as it exits
      else car.destroy() // unrequested dressing scrolls out freely
    }

    // rush ends when the scroll completes
    if (this.scrollX >= this.maxScroll) this.endRun(true)
  }

  tickClock() {
    this.timeLeft = Math.ceil((this.maxScroll - this.scrollX) / this.scrollSpeed)
    this.emitHud()
  }

  // ---- indicators & debug -------------------------------------------

  updateIndicators(time) {
    this.indicatorGfx.clear()
    if (this.time.now < this.insightUntil) {
      this.indicatorGfx.lineStyle(2, 0xffe123, 0.18 + 0.1 * Math.sin(time / 120))
      this.indicatorGfx.strokeRect(1, 1, this.scale.width - 2, this.scale.height - 2)
    }
    const view = this.cameras.main.worldView
    const pulse = 0.55 + 0.35 * Math.sin(time / 150)
    // arrows point at REQUESTED cars; urgency rises with the shared
    // ranking as a car nears the trailing edge (rank 0 = alert red)
    for (const car of this.items.getChildren()) {
      if (!car.active || !car.getData('requested') || car.getData('tagged')) continue
      let edgeX = 0
      let dir = 0
      if (car.x < view.x - 8) {
        edgeX = 8
        dir = -1
      } else if (car.x > view.right + 8) {
        edgeX = this.scale.width - 8
        dir = 1
      } else {
        continue
      }
      const urgent = this.itemDangerRank(car) === 0
      const alpha = urgent ? 0.6 + 0.4 * Math.sin(time / 60) : pulse
      const size = urgent ? 8 : 5
      const color = urgent ? 0xea5151 : car.getData('heavy') ? 0x9b6ee8 : 0x59c2e8
      const y = Phaser.Math.Clamp(car.y - view.y, 20, this.scale.height - 24)
      this.indicatorGfx.fillStyle(color, alpha)
      this.indicatorGfx.fillTriangle(
        edgeX + dir * size,
        y,
        edgeX - dir * (size - 2),
        y - size,
        edgeX - dir * (size - 2),
        y + size
      )
    }
    // fleeing chip carriers get the alert arrow when off-view
    for (const enemy of this.enemies.getChildren()) {
      if (!enemy.active || !enemy.getData('chipCar')) continue
      if (enemy.x <= view.right + 8) continue
      const y = Phaser.Math.Clamp(enemy.y - view.y, 20, this.scale.height - 24)
      this.indicatorGfx.fillStyle(0xea5151, 0.6 + 0.4 * Math.sin(time / 60))
      this.indicatorGfx.fillTriangle(
        this.scale.width - 3,
        y,
        this.scale.width - 11,
        y - 8,
        this.scale.width - 11,
        y + 8
      )
    }
  }

  // the (c) steal-escape inequality doesn't apply here (no vertical
  // carry-out); the request lead-time readout is this level's fairness
  // assertion (BRIEF-05 §1), same philosophy on the same panel slot
  updateStealFairnessReadout() {
    if (!isTuningPanelOpen()) return
    const checks = this.requestChecks ?? []
    const red = checks.filter((c) => !c.ok).length
    const slack = checks.filter((c) => c.slack).length
    const worst = checks.length
      ? Math.min(...checks.map((c) => (c.exitT === Infinity ? 999 : c.exitT - c.time - c.requiredLead)))
      : 0
    setPanelReadout(
      `requests: ${checks.length - red}/${checks.length} green, ${slack} slack` +
        (checks.length ? ` (worst margin ${worst === 999 ? '∞' : worst.toFixed(1)}s)` : ''),
      red === 0
    )
  }

  updateFairnessDebug() {
    this.fairnessGfx.clear()
    if (!isTuningPanelOpen()) return
    // ring each request's car: green = fair, red = unfair, yellow =
    // green-but-slack (no pressure — the tension-band signal)
    for (const check of this.requestChecks ?? []) {
      const car = this.items.getChildren().find((c) => c.name === check.car && c.active)
      if (!car) continue
      const color = !check.ok ? 0xea5151 : check.slack ? 0xffe123 : 0x12b76a
      this.fairnessGfx.lineStyle(1, color, 0.9)
      this.fairnessGfx.strokeCircle(car.x, car.y, Math.max(10, car.displayWidth / 2 + 3))
    }
    // collectible spawns stay visible, as everywhere
    for (const c of this.collectibles.getChildren()) {
      if (!c.active) continue
      this.fairnessGfx.lineStyle(1, 0xffe123, 0.8)
      this.fairnessGfx.strokeCircle(c.x, c.y, 8)
    }
  }
}
