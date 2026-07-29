import Phaser from 'phaser'
import { TUNING } from '../config/tuning.js'
import Player from '../entities/Player.js'
import { playSfx } from '../systems/sfx.js'

// Grey-box rush level: ~3 screens wide (BRIEF-01).
export const WORLD_WIDTH = 1440
export const WORLD_HEIGHT = 270

export default class PlaygroundScene extends Phaser.Scene {
  constructor() {
    super('Playground')
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)

    this.platforms = this.physics.add.staticGroup()
    this.buildLevel()

    this.player = new Player(this, 60, 190)
    this.physics.add.collider(this.player.sprite, this.platforms)

    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
    this.cameras.main.startFollow(this.player.sprite, true, 0.15, 0.15)

    // tagging
    this.items = this.physics.add.group()
    this.physics.add.collider(this.items, this.platforms)
    this.target = null
    this.hold = null
    this.targetGfx = this.add.graphics().setDepth(10)
    this.holdGfx = this.add.graphics().setDepth(11)
    this.tagParticles = this.add
      .particles(0, 0, 'pixel', {
        emitting: false,
        speed: { min: 40, max: 130 },
        lifespan: 300,
        quantity: 14,
        scale: { start: 1, end: 0 },
      })
      .setDepth(9)

    // starter items so tagging is playable before the wave scheduler lands
    this.spawnItem(200, 160, false)
    this.spawnItem(300, 220, false)
    this.spawnItem(400, 110, false)
    this.spawnItem(560, 220, true)
    this.spawnItem(680, 140, false)
    this.spawnItem(860, 90, true)
  }

  spawnItem(x, y, heavy) {
    const item = this.items.create(x, y, heavy ? 'item-heavy' : 'item-standard')
    item.setData('heavy', heavy)
    item.setBounce(0.1)
    item.setCollideWorldBounds(true)
    return item
  }

  isTaggable(item) {
    return item.active && !item.getData('tagged') && !item.getData('stolen')
  }

  // auto-target: nearest valid item within TUNING.targetRadius, with a
  // visible outline so the player always knows what a press will do
  updateTargeting() {
    let best = null
    let bestD = TUNING.targetRadius
    for (const item of this.items.getChildren()) {
      if (!this.isTaggable(item)) continue
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, item.x, item.y)
      if (d <= bestD) {
        bestD = d
        best = item
      }
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
      if (this.target.getData('heavy')) this.startHold(time)
      else this.completeTag(this.target)
    }
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
    const x = this.player.x
    const y = this.player.y - 32
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
    this.time.delayedCall(TUNING.hitstopMs, () => this.physics.resume())

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

  // scoring/adaptive hooks — filled in by the rush deliverable
  onItemTagged(heavy) {}

  onHoldInterrupted() {}

  buildLevel() {
    const slab = (x, y, w, h) => {
      const p = this.platforms.create(x + w / 2, y + h / 2, 'platform')
      p.setDisplaySize(w, h).refreshBody()
      return p
    }
    slab(0, 254, WORLD_WIDTH, 16) // ground
    slab(180, 196, 90, 10)
    slab(360, 150, 90, 10)
    slab(620, 180, 110, 10)
    slab(820, 130, 90, 10)
    slab(1000, 190, 100, 10)
    slab(1210, 150, 110, 10)
  }

  update(time, delta) {
    // gravity is read live so the tuning panel affects it immediately
    this.physics.world.gravity.y = TUNING.gravity

    this.player.update(time, delta)
    this.updateTargeting()
    this.updateTagging(time)
  }
}
