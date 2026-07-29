import Phaser from 'phaser'
import { TUNING } from '../config/tuning.js'

// Chexy (grey-box: a 44x44 rect). Platformer feel baseline per BRIEF-01:
// acceleration/deceleration movement, variable jump height, coyote time,
// jump input buffering, and a dash stub gated off by tuning flag.
export default class Player {
  constructor(scene, x, y) {
    this.scene = scene
    this.sprite = scene.physics.add.sprite(x, y, 'chexy')
    this.sprite.setCollideWorldBounds(true)
    this.sprite.setDisplaySize(TUNING.playerSize, TUNING.playerSize)

    const kb = scene.input.keyboard
    this.cursors = kb.createCursorKeys()
    this.keys = kb.addKeys('SPACE,Z,J,X,K')

    this.lastGroundedAt = -Infinity
    this.jumpPressedAt = -Infinity
    this.dashUntil = 0
    this.facing = 1
    this.frozen = false // true while a hold-tag is charging

    // set each frame for the tagging system to read (JustDown may only be
    // sampled once per key per frame)
    this.tagPressed = false
    this.tagHeld = false
  }

  get body() {
    return this.sprite.body
  }

  get x() {
    return this.sprite.x
  }

  get y() {
    return this.sprite.y
  }

  onGround() {
    return this.body.blocked.down || this.body.touching.down
  }

  update(time, delta) {
    const { body } = this
    const JustDown = Phaser.Input.Keyboard.JustDown
    const JustUp = Phaser.Input.Keyboard.JustUp

    // live-sync sprite size with the tuning slider (arcade body follows scale)
    if (this.sprite.displayWidth !== TUNING.playerSize) {
      this.sprite.setDisplaySize(TUNING.playerSize, TUNING.playerSize)
    }

    const dashing = time < this.dashUntil
    body.setMaxVelocity(dashing ? TUNING.dashSpeed : TUNING.maxSpeed, TUNING.fallMaxSpeed)

    if (this.onGround()) this.lastGroundedAt = time

    const left = this.cursors.left.isDown
    const right = this.cursors.right.isDown
    if (left !== right) this.facing = left ? -1 : 1

    if (this.frozen) {
      body.setAccelerationX(0)
      body.setVelocityX(0)
    } else if (dashing) {
      body.setAccelerationX(0)
    } else if (left !== right) {
      body.setAccelerationX(left ? -TUNING.moveAccel : TUNING.moveAccel)
    } else {
      // no input: decelerate to a stop rather than sliding
      body.setAccelerationX(0)
      const dv = (TUNING.moveDecel * delta) / 1000
      if (Math.abs(body.velocity.x) <= dv) body.setVelocityX(0)
      else body.setVelocityX(body.velocity.x - Math.sign(body.velocity.x) * dv)
    }

    // jump: buffered press meeting a coyote-time ground window
    if (JustDown(this.cursors.up) || JustDown(this.keys.SPACE)) {
      this.jumpPressedAt = time
    }
    const buffered = time - this.jumpPressedAt <= TUNING.bufferMs
    const grounded = time - this.lastGroundedAt <= TUNING.coyoteMs
    if (buffered && grounded && !this.frozen) {
      body.setVelocityY(TUNING.jumpVelocity)
      this.jumpPressedAt = -Infinity
      this.lastGroundedAt = -Infinity
    }

    // variable jump height: releasing while rising cuts the jump short
    const jumpReleased = JustUp(this.cursors.up) || JustUp(this.keys.SPACE)
    const jumpStillHeld = this.cursors.up.isDown || this.keys.SPACE.isDown
    if (jumpReleased && !jumpStillHeld && body.velocity.y < 0) {
      body.setVelocityY(body.velocity.y * TUNING.jumpCutMultiplier)
    }

    // dash stub — fully wired, but TUNING.dashEnabled is false in the
    // grey-box (dash unlocks in Level 2 per DESIGN.md)
    if (
      (JustDown(this.keys.X) || JustDown(this.keys.K)) &&
      TUNING.dashEnabled &&
      !this.frozen &&
      !dashing
    ) {
      this.dashUntil = time + TUNING.dashDurationMs
      body.setVelocityX(TUNING.dashSpeed * this.facing)
      body.setVelocityY(0)
    }

    this.tagPressed = JustDown(this.keys.Z) || JustDown(this.keys.J)
    this.tagHeld = this.keys.Z.isDown || this.keys.J.isDown
  }
}
