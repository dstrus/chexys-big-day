import Phaser from 'phaser'
import LevelScene from './LevelScene.js'
import { TUNING } from '../config/tuning.js'
import { categoryColor } from '../config/itemCategories.js'
import { audio } from '../systems/AudioBus.js'

// Level 4: The Stroller Valet (BRIEF-06). Extends the generic
// LevelScene — tagging verbs, fairness stack, collectibles, HUD are
// all inherited; the museum is ground-plus-mezzanine like the Bell
// Desk (NO feet-reach rule — that's garage-scoped). The one bounded
// novelty is ROLLING ITEMS: strollers roll perpetually until tagged
// (tag = BRAKE — checked in, parked, static), backpacks bounce and
// settle, sippy cups are high-restitution comedy. Rulings baked in
// by the design session (handoff 2026-08-10-b): mover tap grace
// (press-time acquisition lands despite windup drift — the windup
// already re-validates taggability only, never radius); enemy locks
// and loiters follow movers (locks are object refs); spawn fairness
// validates at spawn position, kept honest by the ≤0.3× speed cap.
export default class MuseumScene extends LevelScene {
  constructor() {
    super('Museum')
  }

  create() {
    this.makeMuseumTextures()
    super.create()
  }

  makeMuseumTextures() {
    if (this.textures.exists('item-stroller')) return
    const g = this.add.graphics()
    const make = (key, w, h) => {
      g.clear()
      g.fillStyle(0xffffff, 1)
      g.fillRect(0, 0, w, h)
      g.generateTexture(key, w, h)
    }
    make('item-stroller', 26, 18) // wide
    make('item-backpack', 14, 14) // mid
    make('item-cup', 8, 8) // tiny
    g.destroy()
  }

  spawnItem(x, y, tier = 1, category = 'coat') {
    const item = super.spawnItem(x, y, tier, category)
    if (category === 'stroller') {
      item.setTexture('item-stroller')
      item.body.setSize(26, 18)
      item.setData('mover', true)
      item.setData('rollDir', Math.random() < 0.5 ? -1 : 1)
      // rebound off walls and solid verticals at full speed; roll off
      // edges and continue below (BRIEF-06 §1)
      item.setBounce(1, 0.15)
      item.body.setDragX(0) // perpetual until tagged
    } else if (category === 'backpack') {
      item.setTexture('item-backpack')
      item.body.setSize(14, 14)
      item.setBounce(TUNING.backpackBounce, TUNING.backpackBounce)
      item.body.setVelocity(Phaser.Math.Between(-40, 40), -130) // energetic entrance
    } else if (category === 'cup') {
      item.setTexture('item-cup')
      item.body.setSize(8, 8)
      item.setBounce(TUNING.cupBounce, TUNING.cupBounce)
      item.body.setVelocity(Phaser.Math.Between(-70, 70), -160) // confetti
    } else {
      return item
    }
    this.placeItemClear(item, x, y) // re-run the gate after the resize
    return item
  }

  // stroller tag = BRAKE (BRIEF-06 §1): the full check-in beat lands —
  // score, chip, pose, guest — but the item PARKS in place instead of
  // whisking away. Taming the chaos is literally the verb.
  completeTag(item) {
    const category = item.getData('category')
    if (category === 'cup') {
      // standard tap, small score (§1) — reroute just the scoring
      this.__cupTag = true
      super.completeTag(item)
      this.__cupTag = false
      return
    }
    if (category !== 'stroller') return super.completeTag(item)

    item.setData('tagged', true)
    this.physics.pause()
    this.time.delayedCall(TUNING.hitstopMs, () => {
      if (!this.runOver) this.physics.resume()
    })
    this.tagParticles.emitParticleAt(item.x, item.y)
    audio.play('tag')
    this.player.triggerAnim('tap')
    this.game.events.emit('guest-happy', { guest: item.getData('guest') })
    const chip = this.add.image(0, 0, 'tag-chip').setDepth(1)
    chip.setTint(categoryColor('stroller'))
    item.setData('chip', chip)
    item.once(Phaser.GameObjects.Events.DESTROY, () => chip.destroy())
    this.syncChip(item)
    // the brake: parked, static
    item.setData('braked', true)
    item.body.setVelocity(0, 0)
    item.setBounce(0, 0)
    item.body.moves = false
    item.setTint(0x7ee87e) // check-in flash...
    this.time.delayedCall(220, () => {
      if (item.active) item.setTint(categoryColor('stroller')) // ...then parked pink
    })
    this.onItemTagged(item.getData('tier') ?? 1)
  }

  onItemTagged(tier) {
    if (this.__cupTag) {
      this.itemsReturned += 1
      this.addScore(TUNING.standardItemScore * TUNING.cupScoreFactor)
      this.onCleanProgress()
      this.emitHud()
      return
    }
    super.onItemTagged(tier)
  }

  // perpetual until tagged: movers re-assert their roll speed whenever
  // grounded — this one loop covers the initial roll-out, resuming
  // after a rescue drop (a dropped stroller is still a mover), and any
  // speed lost to a landing. Wall rebounds flip vx via bounce; rollDir
  // tracks the live sign so a resume keeps the last heading.
  update(time, delta) {
    super.update(time, delta)
    if (this.runOver) return
    for (const item of this.items.getChildren()) {
      if (!item.active || !item.getData('mover') || !item.body?.enable) continue
      if (item.getData('tagged') || item.getData('stolen')) continue
      const vx = item.body.velocity.x
      if (Math.abs(vx) > 8) item.setData('rollDir', Math.sign(vx))
      if (item.body.blocked.down && Math.abs(vx) < TUNING.strollerSpeed) {
        item.body.setVelocityX(item.getData('rollDir') * TUNING.strollerSpeed)
      }
    }
  }
}
