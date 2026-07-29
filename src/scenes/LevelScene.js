import Phaser from 'phaser'
import { TUNING } from '../config/tuning.js'
import Player from '../entities/Player.js'
import { playSfx } from '../systems/sfx.js'

// Generic level scene: boots any Tiled map by key (assets/maps/README.md
// documents the conventions). The map supplies geometry, spawn points,
// zones, and rush parameters; gameplay systems are shared across levels.
export default class LevelScene extends Phaser.Scene {
  constructor() {
    super('Level')
  }

  init(data) {
    this.mapKey = data.mapKey || 'coatroom'
  }

  create() {
    // run state
    this.score = 0
    this.lostItems = 0
    this.tagsCollected = 0
    this.itemsReturned = 0
    this.cleanStreak = 0
    this.intensity = 1.0
    this.multiplier = 1.0
    this.runOver = false

    this.buildMap()
    this.timeLeft = this.levelProps.rushSeconds ?? TUNING.rushSeconds

    this.player = new Player(this, this.playerSpawn.x, this.playerSpawn.y)
    this.physics.add.collider(this.player.sprite, this.mainLayer)

    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight)
    this.cameras.main.startFollow(this.player.sprite, true, 0.15, 0.15)

    // tagging
    this.items = this.physics.add.group()
    this.physics.add.collider(this.items, this.mainLayer)
    this.target = null
    this.hold = null
    this.targetGfx = this.add.graphics().setDepth(10)
    this.holdGfx = this.add.graphics().setDepth(11)
    // screen-space edge arrows pointing at off-screen untagged items
    this.indicatorGfx = this.add.graphics().setScrollFactor(0).setDepth(20)
    this.tagParticles = this.add
      .particles(0, 0, 'pixel', {
        emitting: false,
        speed: { min: 40, max: 130 },
        lifespan: 300,
        quantity: 14,
        scale: { start: 1, end: 0 },
      })
      .setDepth(9)

    // ticket enemies (paper — the villain)
    this.enemies = this.physics.add.group({ allowGravity: false })
    this.physics.add.overlap(this.enemies, this.items, (enemy, item) =>
      this.onEnemyTouchItem(enemy, item)
    )
    this.physics.add.overlap(this.player.sprite, this.enemies, (p, e) =>
      this.onEnemyTouchPlayer(p, e)
    )

    this.keyR = this.input.keyboard.addKey('R')
    this.pauseKeys = this.input.keyboard.addKeys('ESC,P')

    // rush schedule: an opening wave, then intensity-scaled timers
    this.spawnWave()
    this.scheduleNextWave()
    this.scheduleNextEnemy()
    this.clockTimer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.tickClock(),
    })

    this.emitHud()
  }

  // ---- map ----

  buildMap() {
    const map = this.make.tilemap({ key: this.mapKey })
    const tileset = map.addTilesetImage('placeholder', 'tiles')
    map.createLayer('bg2', tileset).setDepth(-4)
    map.createLayer('bg1', tileset).setDepth(-3)
    this.mainLayer = map.createLayer('main', tileset).setDepth(-2)
    map.createLayer('fg', tileset).setDepth(8)
    this.mainLayer.setCollisionByExclusion([-1])

    this.map = map
    this.worldWidth = map.widthInPixels
    this.worldHeight = map.heightInPixels
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight)

    this.levelProps = {}
    for (const p of map.properties ?? []) this.levelProps[p.name] = p.value

    const spawns = map.getObjectLayer('spawns').objects
    this.playerSpawn = spawns.find((o) => o.name === 'player')
    this.itemSpawnPoints = spawns.filter((o) => o.name.startsWith('item'))
    this.zones = (map.getObjectLayer('zones')?.objects ?? []).slice() // reserved for later chunks
  }

  itemSpawnPoint(name) {
    if (name && name !== 'any') {
      const pt = this.itemSpawnPoints.find((o) => o.name === name)
      if (pt) return pt
    }
    return Phaser.Utils.Array.GetRandom(this.itemSpawnPoints)
  }

  // ---- rush schedule ----

  scheduleNextWave() {
    const delay = (TUNING.itemWaveIntervalSec / this.intensity) * 1000
    this.waveTimer = this.time.delayedCall(delay, () => {
      this.spawnWave()
      this.scheduleNextWave()
    })
  }

  scheduleNextEnemy() {
    const delay = (TUNING.enemySpawnSec / this.intensity) * 1000
    this.enemyTimer = this.time.delayedCall(delay, () => {
      this.spawnEnemy()
      this.scheduleNextEnemy()
    })
  }

  spawnWave() {
    const onField = this.items.getChildren().filter((i) => this.isTaggable(i)).length
    const budget = Math.max(0, TUNING.maxItemsOnField - onField)
    const count = Math.min(budget, Math.max(1, Math.round(TUNING.itemsPerWave * this.intensity)))
    for (let i = 0; i < count; i++) {
      const pt = this.itemSpawnPoint('any')
      const heavy = Math.random() < TUNING.heavyItemChance
      this.spawnItem(pt.x, pt.y, heavy)
    }
  }

  spawnEnemy() {
    if (this.enemies.countActive() >= 6) return
    const fromLeft = Math.random() < 0.5
    const enemy = this.enemies.create(
      fromLeft ? -12 : this.worldWidth + 12,
      Phaser.Math.Between(40, this.worldHeight - 80),
      'ticket'
    )
    enemy.body.setAllowGravity(false)
    enemy.setData('seed', Math.random() * 1000)
  }

  tickClock() {
    this.timeLeft -= 1
    this.emitHud()
    if (this.timeLeft <= 0) this.endRun(true)
  }

  // ---- enemies ----

  updateEnemies(time) {
    for (const enemy of this.enemies.getChildren()) {
      const stunnedUntil = enemy.getData('stunnedUntil')
      if (stunnedUntil) {
        if (time < stunnedUntil) {
          enemy.body.setVelocity(0, 0) // dazed paper just hangs there
          continue
        }
        // wake up, with a short no-steal grace so it can't instantly
        // re-grab the item it just dropped
        enemy.setData('stunnedUntil', null)
        enemy.setData('stealGraceUntil', time + TUNING.enemyStealGraceMs)
        enemy.clearTint()
      }

      const carried = enemy.getData('carrying')
      if (carried) {
        // fleeing upward with the goods; off the top = item lost
        carried.setPosition(enemy.x, enemy.y + 10)
        if (enemy.y < -24) this.onItemLost(enemy, carried)
        continue
      }

      let nearest = null
      let nearestD = Infinity
      for (const item of this.items.getChildren()) {
        if (!this.isTaggable(item)) continue
        const d = Phaser.Math.Distance.Between(enemy.x, enemy.y, item.x, item.y)
        if (d < nearestD) {
          nearestD = d
          nearest = item
        }
      }

      const goal = nearest || this.player // no loot left: loiter near Chexy (body center)
      const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, goal.x, goal.y)
      const bob = Math.sin(time / 300 + enemy.getData('seed')) * 18
      enemy.body.setVelocity(
        Math.cos(angle) * TUNING.enemySpeed,
        Math.sin(angle) * TUNING.enemySpeed + bob
      )
    }
  }

  onEnemyTouchItem(enemy, item) {
    if (enemy.getData('carrying') || !this.isTaggable(item)) return
    if (enemy.getData('stunnedUntil')) return
    const grace = enemy.getData('stealGraceUntil')
    if (grace && this.time.now < grace) return
    item.setData('stolen', true)
    item.body.enable = false
    enemy.setData('carrying', item)
    enemy.body.setVelocity(Phaser.Math.Between(-20, 20), -90)
    playSfx('steal', this.panFor(item.x))
  }

  onEnemyTouchPlayer(playerSprite, enemy) {
    // paper can't hurt Chexy, but a hit breaks a hold — unless the
    // ticket is stunned; dazed paper is harmless
    if (this.hold && !enemy.getData('stunnedUntil')) this.interruptHold()
  }

  onItemLost(enemy, item) {
    const pan = this.panFor(enemy.x)
    item.destroy()
    enemy.destroy()
    playSfx('lose', pan)
    this.onStruggle()
    if (!TUNING.godMode) {
      this.lostItems += 1
      if (this.lostItems >= 3) this.endRun(false)
    }
    this.emitHud()
  }

  // ---- adaptive intensity & score multiplier (DESIGN.md §2.5) ----

  setIntensity(value) {
    const band = TUNING.adaptiveBand
    this.intensity = Phaser.Math.Clamp(value, 1 - band, 1 + band)
    // 1.0x at baseline, multiplierFloor at the easiest band edge, and a
    // symmetric bonus above baseline so full heat pays
    if (band === 0) {
      this.multiplier = 1
    } else {
      const slope = (1 - TUNING.multiplierFloor) / band
      this.multiplier = Math.round((1 + (this.intensity - 1) * slope) * 100) / 100
      this.multiplier = Math.max(TUNING.multiplierFloor, this.multiplier)
    }
  }

  onStruggle() {
    this.cleanStreak = 0
    this.setIntensity(this.intensity - TUNING.adaptiveStep)
    this.emitHud()
  }

  onCleanProgress() {
    this.cleanStreak += 1
    if (this.cleanStreak < TUNING.cleanStreakForRamp) return
    this.cleanStreak = 0
    const before = this.intensity
    this.setIntensity(this.intensity + TUNING.adaptiveStep)
    if (this.intensity > before) {
      playSfx('heatUp')
      this.game.events.emit('heat-up')
    }
  }

  // ---- run lifecycle ----

  emitHud() {
    this.game.events.emit('hud', {
      score: this.score,
      lost: this.lostItems,
      multiplier: this.multiplier,
      timeLeft: this.timeLeft,
    })
  }

  endRun(cleared) {
    if (this.runOver) return
    this.runOver = true
    this.physics.pause()
    this.waveTimer?.remove()
    this.enemyTimer?.remove()
    this.clockTimer?.remove()
    this.clearHold()
    this.targetGfx.clear()
    this.indicatorGfx.clear()
    playSfx(cleared ? 'runClear' : 'runFail')
    this.game.events.emit('run-over', {
      cleared,
      score: this.score,
      itemsReturned: this.itemsReturned,
      tagsCollected: this.tagsCollected,
      lost: this.lostItems,
    })
  }

  // stereo position of a world x relative to the player: -1 left .. 1 right
  panFor(x) {
    return Phaser.Math.Clamp((x - this.player.x) / 360, -1, 1)
  }

  spawnItem(x, y, heavy) {
    const item = this.items.create(x, y, heavy ? 'item-heavy' : 'item-standard')
    item.setData('heavy', heavy)
    item.setTint(0xfe701e) // coats — category colors go data-driven in Chunk 2
    item.setBounce(0.1)
    item.setCollideWorldBounds(true)
    playSfx('spawn', this.panFor(x))
    return item
  }

  isTaggable(item) {
    return item.active && !item.getData('tagged') && !item.getData('stolen')
  }

  // pulsing edge arrows for untagged items outside the camera view,
  // color-coded by weight, vertically tracking the item
  updateIndicators(time) {
    this.indicatorGfx.clear()
    const view = this.cameras.main.worldView
    const pulse = 0.55 + 0.35 * Math.sin(time / 150)
    for (const item of this.items.getChildren()) {
      if (!this.isTaggable(item)) continue
      let edgeX = 0
      let dir = 0
      if (item.x < view.x - 8) {
        edgeX = 8
        dir = -1
      } else if (item.x > view.right + 8) {
        edgeX = this.scale.width - 8
        dir = 1
      } else {
        continue
      }
      const y = Phaser.Math.Clamp(item.y - view.y, 20, this.scale.height - 24)
      this.indicatorGfx.fillStyle(item.getData('heavy') ? 0x9b6ee8 : 0x59c2e8, pulse)
      this.indicatorGfx.fillTriangle(edgeX + dir * 5, y, edgeX - dir * 3, y - 5, edgeX - dir * 3, y + 5)
    }
  }

  // a ticket fleeing with an item can be tagged to stun it and free the loot
  isStunnable(enemy) {
    return enemy.active && enemy.getData('carrying') && !enemy.getData('stunnedUntil')
  }

  // auto-target: nearest valid target within TUNING.targetRadius — untagged
  // items and carrying tickets both count — with a visible outline so the
  // player always knows what a press will do
  updateTargeting() {
    let best = null
    let bestD = TUNING.targetRadius
    const consider = (obj) => {
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, obj.x, obj.y)
      if (d <= bestD) {
        bestD = d
        best = obj
      }
    }
    for (const item of this.items.getChildren()) {
      if (this.isTaggable(item)) consider(item)
    }
    for (const enemy of this.enemies.getChildren()) {
      if (this.isStunnable(enemy)) consider(enemy)
    }
    this.target = best
    this.targetGfx.clear()
    if (best) {
      const b = best.getBounds()
      this.targetGfx.lineStyle(1, 0xffffff, 0.9)
      this.targetGfx.strokeRect(b.x - 2, b.y - 2, b.width + 4, b.height + 4)
    }
  }

  updateTagging(time) {
    if (this.hold) {
      this.updateHold(time)
      return
    }
    if (this.player.tagPressed && this.target) {
      // rescue is ALWAYS instant tap (DESIGN.md §2 item 4b)
      if (this.isStunnable(this.target)) this.stunEnemy(this.target, time)
      else if (this.target.getData('heavy')) this.startHold(time)
      else this.completeTag(this.target)
    }
  }

  // one tag press on a carrying ticket: stun it and drop the item, taggable
  // again. No score/streak/adaptive effect — rescue is damage prevention,
  // not a reward loop (DESIGN.md §2 item 4b).
  stunEnemy(enemy, time) {
    const item = enemy.getData('carrying')
    enemy.setData('carrying', null)
    enemy.setData('stunnedUntil', time + TUNING.enemyStunMs)
    enemy.setTint(0x777777)
    enemy.body.setVelocity(0, 0)

    item.setData('stolen', false)
    item.body.enable = true
    item.setPosition(enemy.x, enemy.y + 10)
    item.body.setVelocity(Phaser.Math.Between(-30, 30), -60) // pop free

    this.physics.pause()
    this.time.delayedCall(TUNING.hitstopMs, () => {
      if (!this.runOver) this.physics.resume()
    })
    this.tagParticles.emitParticleAt(enemy.x, enemy.y)
    playSfx('stun', this.panFor(enemy.x))
  }

  startHold(time) {
    this.hold = { item: this.target, startedAt: time }
    this.player.frozen = true
    playSfx('holdStart')
  }

  updateHold(time) {
    const { item } = this.hold
    const p = this.player
    const moveInput =
      p.cursors.left.isDown || p.cursors.right.isDown || p.cursors.up.isDown || p.keys.SPACE.isDown

    if (!this.isTaggable(item) || !p.tagHeld) {
      this.clearHold() // target gone or button released: quiet reset
      return
    }
    if (moveInput) {
      this.interruptHold()
      return
    }

    const progress = (time - this.hold.startedAt) / TUNING.holdTagMs
    if (progress >= 1) {
      this.clearHold()
      this.completeTag(item)
    } else {
      this.drawHoldMeter(progress)
    }
  }

  drawHoldMeter(progress) {
    // anchored above the physics body so tail/canvas overhang on the art
    // sprite won't push the meter around
    const x = this.player.x
    const y = this.player.body.top - 16
    this.holdGfx.clear()
    this.holdGfx.lineStyle(3, 0x101018, 1)
    this.holdGfx.beginPath()
    this.holdGfx.arc(x, y, 9, 0, Math.PI * 2)
    this.holdGfx.strokePath()
    this.holdGfx.lineStyle(3, 0xffe066, 1)
    this.holdGfx.beginPath()
    this.holdGfx.arc(x, y, 9, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2)
    this.holdGfx.strokePath()
  }

  clearHold() {
    this.hold = null
    this.player.frozen = false
    this.holdGfx.clear()
  }

  // a hit or deliberate movement breaks the hold — the meter resets
  interruptHold() {
    this.clearHold()
    playSfx('interrupt')
    this.player.sprite.setTint(0xff6666)
    this.time.delayedCall(150, () => this.player.sprite.clearTint())
    this.onHoldInterrupted()
  }

  completeTag(item) {
    item.setData('tagged', true)
    item.body.enable = false
    const heavy = item.getData('heavy')

    // 2-3 frames of hitstop
    this.physics.pause()
    this.time.delayedCall(TUNING.hitstopMs, () => {
      if (!this.runOver) this.physics.resume()
    })

    this.tagParticles.emitParticleAt(item.x, item.y)
    playSfx(heavy ? 'heavyTag' : 'tag')

    // checked in: flash green, then whisk it away
    item.setTint(0x7ee87e)
    this.tweens.add({
      targets: item,
      y: item.y - 24,
      alpha: 0,
      duration: 250,
      delay: 60,
      onComplete: () => item.destroy(),
    })

    this.onItemTagged(heavy)
  }

  onItemTagged(heavy) {
    this.tagsCollected += 1
    this.itemsReturned += 1
    const base = heavy ? TUNING.heavyItemScore : TUNING.standardItemScore
    this.score += Math.round(base * this.multiplier)
    this.onCleanProgress()
    this.emitHud()
  }

  onHoldInterrupted() {
    this.onStruggle()
  }

  update(time, delta) {
    if (this.runOver) {
      if (Phaser.Input.Keyboard.JustDown(this.keyR)) {
        this.game.events.emit('run-reset')
        this.scene.restart({ mapKey: this.mapKey })
      }
      return
    }

    // Esc/P pauses the whole scene (physics, timers, tweens);
    // UIOverlay stays live and owns the resume
    if (
      Phaser.Input.Keyboard.JustDown(this.pauseKeys.ESC) ||
      Phaser.Input.Keyboard.JustDown(this.pauseKeys.P)
    ) {
      this.game.events.emit('paused')
      this.scene.pause()
      return
    }

    // gravity is read live so the tuning panel affects it immediately
    this.physics.world.gravity.y = TUNING.gravity

    this.player.update(time, delta)
    this.updateTargeting()
    this.updateTagging(time)
    this.updateEnemies(time)
    this.updateIndicators(time)
  }
}
