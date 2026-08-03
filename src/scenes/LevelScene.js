import Phaser from 'phaser'
import { TUNING } from '../config/tuning.js'
import { categoryColor } from '../config/itemCategories.js'
import { getWaveSchedule } from '../config/waveRegistry.js'
import Player from '../entities/Player.js'
import WaveRunner from '../systems/WaveRunner.js'
import { audio } from '../systems/AudioBus.js'
import { recordRun } from '../systems/progress.js'
import { isTuningPanelOpen, setPanelReadout } from '../debug/tuningPanel.js'

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
    this.guestCounter = 0 // guests are lightweight data: one per item
    this.tagsCollected = 0
    this.itemsReturned = 0
    this.cleanStreak = 0
    this.intensity = 1.0
    this.multiplier = 1.0
    this.bestMultiplier = 1.0
    this.runOver = false

    this.buildMap()
    this.timeLeft = this.levelProps.rushSeconds ?? TUNING.rushSeconds

    this.player = new Player(this, this.playerSpawn.x, this.playerSpawn.y)
    this.physics.add.collider(this.player.sprite, this.mainLayer)

    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight)
    // camera follow is manual + pixel-coherent — see updateCamera()

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
    this.keyC = this.input.keyboard.addKey('C')
    this.pauseKeys = this.input.keyboard.addKeys('ESC,P')

    // jitter instrumentation (bug investigation 2026-08-01): the panel
    // shows live render-fps vs physics-step rate; F logs 60 consecutive
    // frames of per-render-frame movement deltas to the console
    this.keyF = this.input.keyboard.addKey('F')
    this.stepCount = 0
    this.stepRate = 0
    this.physics.world.on(Phaser.Physics.Arcade.Events.WORLD_STEP, () => this.stepCount++)
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.stepRate = this.stepCount
        this.stepCount = 0
      },
    })
    this.jitterCapture = null
    this.prevPlayerX = 0
    this.prevCamX = 0

    // the rush is entirely data-driven: the map's waveFile property
    // names the schedule, WaveRunner plays it back
    this.waveRunner = new WaveRunner(this, getWaveSchedule(this.levelProps.waveFile), {
      spawnItem: (spawnPoint, category, tier, fallbacks) =>
        this.spawnScheduledItem(spawnPoint, category, tier, fallbacks),
      spawnEnemy: () => this.spawnEnemy(),
    })
    this.fairnessGfx = this.add.graphics().setDepth(19)

    // steal fairness (DESIGN.md §2.4)
    this.lastStealAt = -Infinity
    this.stealFairnessWasOk = true
    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => this.updateStealFairnessReadout(),
    })
    this.clockTimer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.tickClock(),
    })

    audio.play('rushStart')
    audio.startMusic(this.levelProps.levelId ?? this.mapKey) // loop hook per level
    this.emitHud()

    // RENDER SNAP (jitter fix, video-confirmed twice over): sprite
    // positions are float sums that can sit exactly on .5 rounding
    // boundaries — at rest via Body.postUpdate's incremental (+= dy)
    // float dust, and at max speed metronomically (2.5px/frame puts
    // frac(x) at exactly .5 every other frame). Either way round()
    // flips the rendered pixel and the sprite "vibrates". Fix: after
    // physics (POST_UPDATE, past Body.postUpdate) remember true
    // positions and snap sprites to whole pixels for the render; on
    // PRE_UPDATE (before the next physics step) restore the true
    // values so physics never sees the snap — no speed corruption,
    // no boundary left to flip.
    this.events.on(Phaser.Scenes.Events.POST_UPDATE, this.snapForRender, this)
    this.events.on(Phaser.Scenes.Events.PRE_UPDATE, this.restoreTruePositions, this)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.events.off(Phaser.Scenes.Events.POST_UPDATE, this.snapForRender, this)
      this.events.off(Phaser.Scenes.Events.PRE_UPDATE, this.restoreTruePositions, this)
    })
    this.renderSnapped = null
  }

  snapForRender() {
    this.renderSnapped = []
    const snap = (s) => {
      if (!s.active) return
      this.renderSnapped.push([s, s.x, s.y])
      s.setPosition(Math.round(s.x), Math.round(s.y))
    }
    snap(this.player.sprite)
    this.items.getChildren().forEach(snap)
    this.enemies.getChildren().forEach(snap)
  }

  restoreTruePositions() {
    if (!this.renderSnapped) return
    for (const [s, x, y] of this.renderSnapped) s.setPosition(x, y)
    this.renderSnapped = null
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
    // an embedded spawn defeats arcade separation and parks the body on
    // the world floor below the tiles — never let that be silent
    const spawnTile = this.mainLayer.getTileAtWorldXY(this.playerSpawn.x, this.playerSpawn.y)
    if (spawnTile && spawnTile.collides) {
      console.warn(
        `Player spawn (${this.playerSpawn.x}, ${this.playerSpawn.y}) is inside a ` +
          'colliding tile — move the spawn point in the map.'
      )
    }
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

  // ---- spawn fairness (DESIGN.md §2.4: unconditional, not adaptive) ----

  // seconds of slack for the player to contest an item at pt; positive =
  // fair. Straight-line distance / entity speed per spec — no pathfinding.
  fairnessMargin(pt) {
    const playerTime =
      Phaser.Math.Distance.Between(this.player.x, this.player.y, pt.x, pt.y) / TUNING.maxSpeed
    let enemyTime = Infinity
    for (const enemy of this.enemies.getChildren()) {
      if (!enemy.active || enemy.getData('carrying') || enemy.getData('stunnedUntil')) continue
      const t = Phaser.Math.Distance.Between(enemy.x, enemy.y, pt.x, pt.y) / TUNING.enemySpeed
      if (t < enemyTime) enemyTime = t
    }
    if (enemyTime === Infinity) return Infinity // no threats: always fair
    return enemyTime + TUNING.spawnFairnessGraceMs / 1000 - playerTime
  }

  // first fair candidate wins (list order = priority); if nothing passes,
  // the spawn is never dropped — use the least-unfair point
  pickFairSpawnPoint(spawnPointName, fallbackNames = []) {
    let candidates
    if (!spawnPointName || spawnPointName === 'any') {
      candidates = Phaser.Utils.Array.Shuffle([...this.itemSpawnPoints])
    } else {
      candidates = [spawnPointName, ...fallbackNames]
        .map((name) => this.itemSpawnPoints.find((o) => o.name === name))
        .filter(Boolean)
      if (!candidates.length) candidates = [this.itemSpawnPoint('any')]
    }
    let best = candidates[0]
    let bestMargin = -Infinity
    for (const pt of candidates) {
      const margin = this.fairnessMargin(pt)
      if (margin >= 0) return pt
      if (margin > bestMargin) {
        bestMargin = margin
        best = pt
      }
    }
    return best
  }

  // debug overlays (drawn only while the tuning panel is open):
  // - fairnessDebug: spawn points ringed green (fair) / red (unfair), with
  //   a line to the enemy that currently beats the player there
  // - targetLockDebug: a line from each enemy to its locked target
  updateFairnessDebug() {
    this.fairnessGfx.clear()
    if (!isTuningPanelOpen()) return
    if (TUNING.targetLockDebug) {
      for (const enemy of this.enemies.getChildren()) {
        if (!enemy.active) continue
        const locked = enemy.getData('lockedTarget')
        if (!locked || !locked.active) continue
        this.fairnessGfx.lineStyle(1, 0xffe066, 0.5)
        this.fairnessGfx.lineBetween(enemy.x, enemy.y, locked.x, locked.y)
      }
    }
    if (!TUNING.fairnessDebug) return
    for (const pt of this.itemSpawnPoints) {
      const margin = this.fairnessMargin(pt)
      const fair = margin >= 0
      this.fairnessGfx.lineStyle(1, fair ? 0x12b76a : 0xea5151, 0.9)
      this.fairnessGfx.strokeCircle(pt.x, pt.y, 6)
      if (!fair) {
        let culprit = null
        let culpritTime = Infinity
        for (const enemy of this.enemies.getChildren()) {
          if (!enemy.active || enemy.getData('carrying') || enemy.getData('stunnedUntil')) continue
          const t = Phaser.Math.Distance.Between(enemy.x, enemy.y, pt.x, pt.y) / TUNING.enemySpeed
          if (t < culpritTime) {
            culpritTime = t
            culprit = enemy
          }
        }
        if (culprit) {
          this.fairnessGfx.lineStyle(1, 0xea5151, 0.35)
          this.fairnessGfx.lineBetween(pt.x, pt.y, culprit.x, culprit.y)
        }
      }
    }
  }

  // (c) tuning assertion: worst-case carrier escape time must be >= a
  // max-effort player traversal from the far end of the level. Escape =
  // longest nearest-exit run (ground grab to the top edge) at encumbered
  // speed, plus the gloat beat. Traversal = level width at max speed;
  // when dash is enabled, its burst gain is added assuming ~one dash/sec.
  checkStealFairness() {
    const escapeMs =
      ((this.worldHeight + 24) / (TUNING.enemySpeed * TUNING.carrierSpeedFactor)) * 1000 +
      TUNING.gloatMs
    const dashBonus = TUNING.dashEnabled
      ? (TUNING.dashSpeed - TUNING.maxSpeed) * (TUNING.dashDurationMs / 1000)
      : 0
    const traverseMs = (this.worldWidth / (TUNING.maxSpeed + dashBonus)) * 1000
    const ok = escapeMs >= traverseMs + TUNING.stealFairnessMarginMs
    return { ok, escapeMs, traverseMs }
  }

  updateStealFairnessReadout() {
    const { ok, escapeMs, traverseMs } = this.checkStealFairness()
    if (isTuningPanelOpen()) {
      setPanelReadout(
        `steal fairness (c): escape ${(escapeMs / 1000).toFixed(1)}s ${ok ? '≥' : '<'} ` +
          `traverse ${(traverseMs / 1000).toFixed(1)}s + ${TUNING.stealFairnessMarginMs}ms margin`,
        ok
      )
    }
    if (!ok && this.stealFairnessWasOk) {
      const deficit = Math.round(traverseMs + TUNING.stealFairnessMarginMs - escapeMs)
      const needFactor =
        (this.worldHeight + 24) /
        (((traverseMs + TUNING.stealFairnessMarginMs - TUNING.gloatMs) / 1000) * TUNING.enemySpeed)
      const needGloat = Math.round(TUNING.gloatMs + deficit)
      console.warn(
        `Steal fairness (c) VIOLATED by ${deficit}ms for this level ` +
          `(width ${this.worldWidth}px): carrierSpeedFactor=${TUNING.carrierSpeedFactor}, ` +
          `gloatMs=${TUNING.gloatMs}, enemySpeed=${TUNING.enemySpeed}, ` +
          `maxSpeed=${TUNING.maxSpeed}, dashEnabled=${TUNING.dashEnabled}. ` +
          `To pass: carrierSpeedFactor <= ${needFactor.toFixed(2)} OR gloatMs >= ${needGloat}.`
      )
    }
    this.stealFairnessWasOk = ok
  }

  // ---- rush schedule (data-driven; see assets/waves/README.md) ----

  spawnScheduledItem(spawnPointName, category, tier, fallbackSpawnPoints = []) {
    if (this.runOver) return // late delayedCalls from a fired entry
    const onField = this.items.getChildren().filter((i) => this.isTaggable(i)).length
    if (onField >= TUNING.maxItemsOnField) return // schedule pressure valve
    const pt = this.pickFairSpawnPoint(spawnPointName, fallbackSpawnPoints)
    this.spawnItem(pt.x, pt.y, tier, category)
  }

  spawnEnemy() {
    if (this.runOver) return
    if (this.enemies.countActive() >= 6) return
    const fromLeft = Math.random() < 0.5
    const useArt = this.textures.exists('enemy-atlas')
    const enemy = this.enemies.create(
      fromLeft ? -12 : this.worldWidth + 12,
      Phaser.Math.Between(40, this.worldHeight - 80),
      useArt ? 'enemy-atlas' : 'ticket',
      useArt ? this.textures.get('enemy-atlas').getFrameNames()[0] : undefined
    )
    enemy.body.setAllowGravity(false)
    enemy.setData('seed', Math.random() * 1000)
    if (useArt) {
      enemy.body.setSize(18, 16) // visual mass ~18-22 on the 24x24 canvas
      // sprite-LOCAL anims (2026-07-30-a policy): tags live on this
      // sprite only, never in the global namespace
      this.anims.createFromAseprite('enemy-atlas', undefined, enemy)
      this.setEnemyAnim(enemy, 'move')
    }
  }

  // enemy state anims with graceful fallback: not-yet-drawn tags
  // (grab/carry/stun) fall back to 'move' and light up automatically
  // when their frames land in the atlas
  setEnemyAnim(enemy, name) {
    if (!enemy.anims || !this.textures.exists('enemy-atlas')) return
    const resolved = enemy.anims.exists(name) ? name : enemy.anims.exists('move') ? 'move' : null
    if (!resolved || enemy.getData('animKey') === resolved) return
    enemy.setData('animKey', resolved)
    enemy.play({ key: resolved, repeat: -1 })
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
          this.setEnemyAnim(enemy, 'stun')
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
        carried.setPosition(enemy.x, enemy.y + 10)
        if (time < (enemy.getData('gloatUntil') ?? 0)) {
          enemy.body.setVelocity(0, 0) // gloat beat: taunting before the getaway
          this.setEnemyAnim(enemy, 'grab')
        } else {
          // encumbered getaway: carrying slows the ticket (steal fairness)
          const speed = TUNING.enemySpeed * TUNING.carrierSpeedFactor
          enemy.body.setVelocity(enemy.getData('carryDriftX') ?? 0, -speed)
          this.setEnemyAnim(enemy, 'carry')
        }
        if (enemy.y < -24) this.onItemLost(enemy, carried) // off the top = lost
        continue
      }
      this.setEnemyAnim(enemy, 'move')

      // target lock (DESIGN.md §2.4): once acquired, an enemy commits to
      // its target until the target becomes unavailable — never because a
      // better option appears. Enemy intent is plannable information.
      let locked = enemy.getData('lockedTarget')
      if (locked && !this.isTaggable(locked)) {
        enemy.setData('lockedTarget', null)
        locked = null
      }
      if (!locked) {
        // (re-)acquisition: nearest item, respecting fresh-item grace
        let nearestD = Infinity
        for (const item of this.items.getChildren()) {
          if (!this.isTaggable(item) || this.isFreshItem(item)) continue
          const d = Phaser.Math.Distance.Between(enemy.x, enemy.y, item.x, item.y)
          if (d < nearestD) {
            nearestD = d
            locked = item
          }
        }
        if (locked) enemy.setData('lockedTarget', locked)
      }

      const goal = locked || this.player // no loot left: loiter near Chexy (body center)
      const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, goal.x, goal.y)
      const bob = Math.sin(time / 300 + enemy.getData('seed')) * 18
      enemy.body.setVelocity(
        Math.cos(angle) * TUNING.enemySpeed,
        Math.sin(angle) * TUNING.enemySpeed + bob
      )
      // left-facing native, same flip convention as Chexy
      enemy.setFlipX(enemy.body.velocity.x > 0)
    }
  }

  // enemies ignore items still inside their fresh-spawn window
  isFreshItem(item) {
    return this.time.now - (item.getData('spawnedAt') ?? 0) < TUNING.freshItemGraceMs
  }

  // per-level steal-initiation spacing; map property overrides the default
  stealCooldown() {
    return this.levelProps.stealCooldownMs ?? TUNING.stealCooldownMs
  }

  onEnemyTouchItem(enemy, item) {
    if (enemy.getData('carrying') || !this.isTaggable(item) || this.isFreshItem(item)) return
    if (enemy.getData('stunnedUntil')) return
    const grace = enemy.getData('stealGraceUntil')
    if (grace && this.time.now < grace) return
    // global cooldown gates steal INITIATIONS only — enemies still exist
    // and menace freely; only the chase-starting event is spaced
    if (this.time.now - this.lastStealAt < this.stealCooldown()) return

    this.lastStealAt = this.time.now
    item.setData('stolen', true)
    item.body.enable = false
    enemy.setData('carrying', item)
    enemy.setData('lockedTarget', null) // lock consumed by the grab
    enemy.setData('gloatUntil', this.time.now + TUNING.gloatMs)
    enemy.setData('carryDriftX', Phaser.Math.Between(-12, 12))
    enemy.body.setVelocity(0, 0) // frozen mid-taunt; getaway starts after the gloat
    audio.play('gloat', this.panFor(item.x))
  }

  onEnemyTouchPlayer(playerSprite, enemy) {
    // paper can't hurt Chexy, but a hit breaks a hold — unless the
    // ticket is stunned; dazed paper is harmless
    if (this.hold && !enemy.getData('stunnedUntil')) this.interruptHold()
  }

  onItemLost(enemy, item) {
    const pan = this.panFor(enemy.x)
    const guest = item.getData('guest')
    item.destroy()
    enemy.destroy()
    audio.play('lose', pan)
    this.game.events.emit('guest-angry', { guest })
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
    this.bestMultiplier = Math.max(this.bestMultiplier ?? 1, this.multiplier)
  }

  onStruggle() {
    this.cleanStreak = 0
    const before = this.intensity
    this.setIntensity(this.intensity - TUNING.adaptiveStep)
    if (this.intensity < before) audio.play('multiplierDown')
    this.emitHud()
  }

  onCleanProgress() {
    this.cleanStreak += 1
    if (this.cleanStreak < TUNING.cleanStreakForRamp) return
    this.cleanStreak = 0
    const before = this.intensity
    this.setIntensity(this.intensity + TUNING.adaptiveStep)
    if (this.intensity > before) {
      audio.play('heatUp')
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
    this.clockTimer?.remove()
    this.clearHold()
    this.targetGfx.clear()
    this.indicatorGfx.clear()
    this.player.playEndPose(cleared)
    audio.duckMusic() // music dips under the results screen
    audio.play(cleared ? 'runClear' : 'runFail')

    // grading per DESIGN.md §2 + the Golden Hanger / BIG DAY math (§2.5)
    const hangers = cleared ? Math.max(0, 3 - this.lostItems) : 0
    const bonus = hangers === 3 ? Math.round(this.score * TUNING.bigDayBonusFactor) : 0
    const contested = this.itemsReturned + this.lostItems
    const returnRate = contested === 0 ? 100 : Math.round((this.itemsReturned / contested) * 100)
    const levelId = this.levelProps.levelId ?? this.mapKey
    if (cleared) recordRun(levelId, { finalScore: this.score + bonus, hangers })

    this.game.events.emit('run-over', {
      cleared,
      score: this.score,
      bonus,
      itemsReturned: this.itemsReturned,
      guestsServed: this.itemsReturned, // one guest per item (Chunk 3 model)
      tagsCollected: this.tagsCollected,
      lost: this.lostItems,
      bestMultiplier: this.bestMultiplier,
      returnRate,
    })
  }

  // stereo position of a world x relative to the player: -1 left .. 1 right
  panFor(x) {
    return Phaser.Math.Clamp((x - this.player.x) / 360, -1, 1)
  }

  spawnItem(x, y, tier = 1, category = 'coat') {
    const heavy = tier >= 3
    // real coat art (3 garment-colored variants) when the strip exists;
    // rect + category tint as the fallback. Heavy items stay on the rect
    // until luggage art exists (L2).
    const useCoatArt = !heavy && this.textures.exists('coats')
    const item = useCoatArt
      ? this.items.create(x, y, 'coats', Phaser.Math.Between(0, 2))
      : this.items.create(x, y, heavy ? 'item-heavy' : 'item-standard')
    item.setData('heavy', heavy)
    item.setData('category', category)
    item.setData('spawnedAt', this.time.now) // fresh-item grace (DESIGN.md §2.4)
    item.setData('guest', ++this.guestCounter) // every item belongs to a guest
    if (useCoatArt) {
      // garment colors are baked in (-b ruling: the chip carries the
      // category); BRIEF-ART-03 §1: smaller centered physics body
      item.body.setSize(16, 18)
    } else {
      item.setTint(categoryColor(category)) // ChexApp tag colors
    }
    item.setBounce(0.1)
    item.setCollideWorldBounds(true)
    audio.play('spawn', this.panFor(x))
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

    // off-screen carriers get Alert Red arrows; during the gloat beat they
    // spike (bigger, faster pulse) — the "go now" signal (steal fairness)
    for (const enemy of this.enemies.getChildren()) {
      if (!enemy.active || !enemy.getData('carrying')) continue
      let edgeX = 0
      let dir = 0
      if (enemy.x < view.x - 8) {
        edgeX = 8
        dir = -1
      } else if (enemy.x > view.right + 8) {
        edgeX = this.scale.width - 8
        dir = 1
      } else {
        continue
      }
      const gloating = this.time.now < (enemy.getData('gloatUntil') ?? 0)
      const alpha = gloating ? 0.6 + 0.4 * Math.sin(time / 60) : pulse
      const size = gloating ? 8 : 5
      const y = Phaser.Math.Clamp(enemy.y - view.y, 20, this.scale.height - 24)
      this.indicatorGfx.fillStyle(0xea5151, alpha)
      this.indicatorGfx.fillTriangle(
        edgeX + dir * size,
        y,
        edgeX - dir * (size - 2),
        y - size,
        edgeX - dir * (size - 2),
        y + size
      )
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
    enemy.setData('gloatUntil', null)
    enemy.setData('lockedTarget', null) // stun breaks the lock; re-acquires on waking
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
    audio.play('stun', this.panFor(enemy.x))
  }

  startHold(time) {
    this.hold = { item: this.target, startedAt: time }
    this.player.frozen = true
    audio.play('holdStart')
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
    audio.play('interrupt')
    this.player.triggerAnim('hit')
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
    audio.play(heavy ? 'heavyTag' : 'tag')
    this.player.triggerAnim('tag')
    this.game.events.emit('guest-happy', { guest: item.getData('guest') })

    // diegetic tagged-state (handoff 2026-08-01-b): apply the category
    // tag chip. It position-syncs to the item every frame, so it
    // persists through any carry/rescue and dies with the item.
    const chip = this.add.image(0, 0, 'tag-chip').setDepth(1)
    chip.setTint(categoryColor(item.getData('category')))
    item.setData('chip', chip)
    item.once(Phaser.GameObjects.Events.DESTROY, () => chip.destroy())
    this.syncChip(item)

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

  // chip anchor: top-third of the item canvas, rack-hook side
  syncChip(item) {
    const chip = item.getData('chip')
    if (!chip) return
    chip.setPosition(
      Math.round(item.x + item.displayWidth / 4),
      Math.round(item.y - item.displayHeight / 6)
    )
    chip.setAlpha(item.alpha)
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
        audio.play('uiSelect')
        this.game.events.emit('run-reset')
        this.scene.restart({ mapKey: this.mapKey })
      } else if (Phaser.Input.Keyboard.JustDown(this.keyC)) {
        // continue: back to the shift board
        audio.play('uiSelect')
        audio.stopMusic()
        this.game.events.emit('run-reset')
        this.scene.stop('UIOverlay')
        this.scene.start('LevelSelect')
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
    // jitter-hunt A/B: flip stepping mode live from the panel
    this.physics.world.fixedStep = TUNING.physicsFixedStep

    this.waveRunner.update(delta, this.intensity)
    this.player.update(time, delta)
    this.updateCamera()
    this.updateTargeting()
    this.updateTagging(time)
    this.updateEnemies(time)
    this.updateIndicators(time)
    this.updateFairnessDebug()
    this.updateJitterProbe(delta)

    // tag chips ride their items (tween, carry, rescue — anything)
    for (const item of this.items.getChildren()) {
      if (item.getData('chip')) this.syncChip(item)
    }
  }

  // Pixel-coherent hard follow. Phaser's lerped follow floors the scroll
  // and stores it back (Camera.preRender), so the world advances in an
  // uneven px cadence against the player's fractional motion — player and
  // tiles round on different frames, which reads as jitter/ghosting, and
  // the post-stop lerp settles through floor() in irregular 1px steps
  // (jitter while idle). Deriving scroll from the ROUNDED player position
  // quantizes player and world to the same grid: the player renders at a
  // constant screen x and the world scrolls exactly its integer delta.
  updateCamera() {
    const cam = this.cameras.main
    cam.setScroll(
      Phaser.Math.Clamp(
        Math.round(this.player.x) - this.scale.width / 2,
        0,
        this.worldWidth - this.scale.width
      ),
      0
    )
  }

  // per-rendered-frame movement deltas: the smoking gun for fixed-step
  // physics rendering at a higher display rate is dx alternating 0 / 2x
  updateJitterProbe(delta) {
    const px = this.player.sprite.x
    const py = this.player.sprite.y
    const cx = this.cameras.main.scrollX
    const cy = this.cameras.main.scrollY
    const dxP = px - this.prevPlayerX
    const dyP = py - (this.prevPlayerY ?? py)
    const dxC = cx - this.prevCamX
    const dyC = cy - (this.prevCamY ?? cy)
    this.prevPlayerX = px
    this.prevPlayerY = py
    this.prevCamX = cx
    this.prevCamY = cy

    if (Phaser.Input.Keyboard.JustDown(this.keyF) && !this.jitterCapture) {
      this.jitterCapture = []
      console.log('[jitter-probe] capturing 60 frames — keep moving...')
    }
    if (this.jitterCapture) {
      const sp = this.player.sprite
      // also watch the on-screen item nearest the player ("one item jitters")
      let watch = null
      let watchD = Infinity
      for (const item of this.items.getChildren()) {
        if (!item.active) continue
        const d = Math.abs(item.x - px)
        if (d < watchD) {
          watchD = d
          watch = item
        }
      }
      const iy = watch ? watch.y : 0
      const dyI = iy - (this.prevItemY ?? iy)
      this.prevItemY = iy
      this.jitterCapture.push({
        // 7 decimals: float dust at rounding boundaries is real signal
        dxP: +dxP.toFixed(7),
        dyP: +dyP.toFixed(7),
        dxC: +dxC.toFixed(7),
        dyC: +dyC.toFixed(7),
        dyI: +dyI.toFixed(7),
        ms: +delta.toFixed(2),
        anim: `${sp.anims.currentAnim?.key ?? '-'}#${sp.anims.currentFrame?.frame.name ?? '-'}`,
        st: `${this.player.stateAnim}|lock=${this.player.animLock}|gnd=${this.player.onGround()}`,
      })
      if (this.jitterCapture.length >= 60) {
        const cam = this.cameras.main
        const stats = (key) => {
          const vals = this.jitterCapture.map((s) => s[key])
          const zeros = vals.filter((d) => Math.abs(d) < 0.01).length
          const mean = vals.reduce((a, b) => a + b, 0) / vals.length
          const sd = Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length)
          return `${key}: zeros=${zeros}/60 mean=${mean.toFixed(2)} sd=${sd.toFixed(2)}`
        }
        console.log(
          `[jitter-probe] fps=${this.game.loop.actualFps.toFixed(1)} ` +
            `physSteps=${this.stepRate}/s fixedStep=${this.physics.world.fixedStep} ` +
            `camLerp=(${cam.lerp.x},${cam.lerp.y}) roundPixels=${cam.roundPixels} | ` +
            `${stats('dxP')} | ${stats('dyP')} | ${stats('dxC')} | ${stats('dyC')}`
        )
        const animsSeen = {}
        for (const s of this.jitterCapture) animsSeen[s.anim] = (animsSeen[s.anim] ?? 0) + 1
        console.log('[jitter-probe/anim] frames shown:', JSON.stringify(animsSeen))
        // presentation-layer diagnostics: the game can be pixel-perfect in
        // world space and still shimmer if the canvas-to-device-pixel scale
        // is fractional (page zoom, fractional DPR, CSS rounding)
        const canvas = this.game.canvas
        const rect = canvas.getBoundingClientRect()
        const dpr = window.devicePixelRatio
        const scaleX = (rect.width * dpr) / canvas.width
        const scaleY = (rect.height * dpr) / canvas.height
        const integerScale = Number.isInteger(+scaleX.toFixed(4)) && Number.isInteger(+scaleY.toFixed(4))
        console.log(
          `[jitter-probe/display] dpr=${dpr} zoom=${this.game.scale.zoom} ` +
            `canvas=${canvas.width}x${canvas.height} cssRect=${rect.width.toFixed(2)}x${rect.height.toFixed(2)} ` +
            `devicePxScale=(${scaleX.toFixed(4)}, ${scaleY.toFixed(4)}) INTEGER=${integerScale}` +
            (integerScale ? '' : '  <-- FRACTIONAL SCALE: this shimmers moving pixels')
        )
        console.log('[jitter-probe] frames:', JSON.stringify(this.jitterCapture))
        this.jitterCapture = null
      }
    }

    if (isTuningPanelOpen()) {
      setPanelReadout(
        `fps ${this.game.loop.actualFps.toFixed(1)} · phys ${this.stepRate} steps/s · F logs 60 frames`,
        true,
        1
      )
    }
  }
}
