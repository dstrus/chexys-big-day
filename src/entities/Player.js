import Phaser from 'phaser'
import { TUNING } from '../config/tuning.js'

// Chexy (grey-box: a 44x44 rect). Platformer feel baseline per BRIEF-01:
// acceleration/deceleration movement, variable jump height, coyote time,
// jump input buffering, and a dash stub gated off by tuning flag.
export default class Player {
  constructor(scene, x, y) {
    this.scene = scene
    // Sprite source priority (BRIEF-02 Chunk 4): Aseprite atlas export >
    // static style-proof frame > grey-box rect. See assets/sprites/README.md.
    this.mode = scene.textures.exists('chexy-atlas')
      ? 'atlas'
      : scene.textures.exists('chexy-idle')
        ? 'frame'
        : 'rect'
    const textureKey = { atlas: 'chexy-atlas', frame: 'chexy-idle', rect: 'chexy' }[this.mode]
    // atlas frames are tag-named (idle_0, ...) — pass the first explicitly
    // or Phaser warns about a missing default frame "0"
    const firstFrame =
      this.mode === 'atlas' ? scene.textures.get(textureKey).getFrameNames()[0] : undefined
    this.sprite = scene.physics.add.sprite(x, y, textureKey, firstFrame)
    this.sprite.setCollideWorldBounds(true)
    if (this.mode === 'rect') {
      this.sprite.setDisplaySize(TUNING.playerSize, TUNING.playerSize)
    } else {
      // DESIGN.md §5 (locked): art canvas over a 32-TALL physics body,
      // bottom-centers aligned — tail/ear overhang never collides.
      // Offset per handoff 2026-07-29-e: horizontally centered, flush
      // with the texture bottom (texture bottom == body bottom).
      //
      // The WIDTH is TUNING.playerBodyWidth (2026-08-26) and narrower
      // than the old 32: the box stays CENTRED, so nothing about
      // targeting, carrying or teetering moves — it just stops claiming
      // the empty air behind her as solid.
      this.applyBodyWidth()
      this.sprite.setFlipX(true) // default spawn facing: right (levels scroll rightward)
    }

    // animation state (atlas mode only)
    this.stateAnim = null
    this.animLock = false
    this.endPosed = false
    this.wasAirborne = false
    if (this.mode === 'atlas') this.playState('idle')

    const kb = scene.input.keyboard
    this.cursors = kb.createCursorKeys()
    this.keys = kb.addKeys('SPACE,Z,J,X,K')

    this.lastGroundedAt = -Infinity
    this.jumpPressedAt = -Infinity
    // TRACTION multiplier on accel AND decel (1 = normal ground).
    // Surfaces that scale it — the King's Paper Carpet — make Chexy
    // slide rather than crawl, and dash immunity is FREE: a dash sets
    // velocity directly with acceleration zeroed, so traction never
    // touches it. Consumed each frame; a surface must re-assert it.
    this.traction = 1
    this.dashUntil = 0
    this.lastDashAt = -Infinity
    this.airDashUsed = false // ONE air dash per airborne period (-g)
    this.dashStartedGrounded = false
    this.lastTapAt = { left: -Infinity, right: -Infinity } // double-tap detection
    this.lastGhostAt = 0
    this.dashedOnce = false // first-dash confirmation bubble (BRIEF-03)
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

  // Gameplay position = physics body center, NOT the sprite center.
  // Identical on the grey-box rect, but once the 48x48 art sprite anchors
  // bottom-center over the 32x32 body they diverge (DESIGN.md §5 locks
  // targeting to the body).
  // Body width is read live so the panel can dial the feel mid-run;
  // centred, so the body's CENTRE never moves and every system measuring
  // from it (auto-target, carry, teeter) is unaffected by the change.
  applyBodyWidth() {
    if (this.mode !== 'atlas') return
    const w = Math.round(TUNING.playerBodyWidth)
    if (this.appliedBodyWidth === w) return
    this.appliedBodyWidth = w
    this.sprite.body.setSize(w, 32)
    this.sprite.body.setOffset((this.sprite.width - w) / 2, this.sprite.height - 32)
  }

  get x() {
    return this.body.center.x
  }

  get y() {
    return this.body.center.y
  }

  onGround() {
    return this.body.blocked.down || this.body.touching.down
  }

  update(time, delta) {
    const { body } = this
    const JustDown = Phaser.Input.Keyboard.JustDown
    const JustUp = Phaser.Input.Keyboard.JustUp

    // live-sync sprite size with the tuning slider (arcade body follows
    // scale) — rect only; art modes' canvas/body split is fixed
    if (this.mode === 'rect' && this.sprite.displayWidth !== TUNING.playerSize) {
      this.sprite.setDisplaySize(TUNING.playerSize, TUNING.playerSize)
    }

    const dashing = time < this.dashUntil
    this.applyBodyWidth() // live from the panel
    body.setMaxVelocity(dashing ? TUNING.dashSpeed : TUNING.maxSpeed, TUNING.fallMaxSpeed)

    if (this.onGround()) {
      this.lastGroundedAt = time
      this.airDashUsed = false // the air dash refreshes on landing, not on cooldown (-g)
    }

    const left = this.cursors.left.isDown
    const right = this.cursors.right.isDown
    if (left !== right) this.facing = left ? -1 : 1
    // Facing convention (DESIGN.md §5, locked): character sprites are
    // LEFT-FACING native; flipX for rightward movement. Mirror-flip is
    // clean — no badge on the gameplay sprite.
    if (this.mode !== 'rect') this.sprite.setFlipX(this.facing === 1)

    if (this.frozen) {
      body.setAccelerationX(0)
      body.setVelocityX(0)
    } else if (dashing) {
      // purely horizontal (-g): no steering, no vertical drift
      body.setAccelerationX(0)
      body.setVelocityY(0)
    } else if (left !== right) {
      body.setAccelerationX((left ? -TUNING.moveAccel : TUNING.moveAccel) * this.traction)
    } else {
      // no input: decelerate to a stop rather than sliding
      body.setAccelerationX(0)
      const dv = (TUNING.moveDecel * this.traction * delta) / 1000
      if (Math.abs(body.velocity.x) <= dv) body.setVelocityX(0)
      else body.setVelocityX(body.velocity.x - Math.sign(body.velocity.x) * dv)
    }

    // jump: buffered press meeting a coyote-time ground window
    if (JustDown(this.cursors.up) || JustDown(this.keys.SPACE)) {
      this.jumpPressedAt = time
    }
    const buffered = time - this.jumpPressedAt <= TUNING.bufferMs
    const grounded = time - this.lastGroundedAt <= TUNING.coyoteMs
    // jump cannot initiate mid-dash (-g) — the press above still records,
    // so it buffers per the standard window and fires on dash end
    if (buffered && grounded && !this.frozen && !dashing) {
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

    // dash (BRIEF-03): X/K or a double-tap on ←/→. Enabled by the Bell
    // Desk unlock beat (persists via progress) or the debug panel flag.
    // Locked out during a hold unless dashCancelsHold trials the opposite.
    let dashDir = 0
    if (JustDown(this.keys.X) || JustDown(this.keys.K)) dashDir = this.facing
    for (const [key, name, dir] of [
      [this.cursors.left, 'left', -1],
      [this.cursors.right, 'right', 1],
    ]) {
      if (JustDown(key)) {
        if (time - this.lastTapAt[name] <= TUNING.dashDoubleTapMs) dashDir = dir
        this.lastTapAt[name] = time
      }
    }
    if (
      dashDir !== 0 &&
      this.scene.isDashAvailable() && // level-gated + progression (§3.2)
      (!this.frozen || TUNING.dashCancelsHold) &&
      !dashing &&
      time - this.lastDashAt >= TUNING.dashCooldownMs &&
      // ONE air dash per airborne period (-g): airborne availability is
      // landing-refreshed, never cooldown-refreshed — no hover-stalling
      (this.onGround() || !this.airDashUsed)
    ) {
      this.dashStartedGrounded = this.onGround()
      if (!this.dashStartedGrounded) this.airDashUsed = true
      this.dashUntil = time + TUNING.dashDurationMs
      this.lastDashAt = time
      this.dashedOnce = true
      this.facing = dashDir
      // raise the cap NOW — the frame-start value would clamp the burst
      // back to run speed before the dash flag is ever seen
      body.setMaxVelocity(TUNING.dashSpeed, TUNING.fallMaxSpeed)
      body.setVelocityX(TUNING.dashSpeed * dashDir)
      // purely horizontal (-g): flatten any rise/fall instantly and
      // suspend gravity for the duration
      body.setVelocityY(0)
      body.setAllowGravity(false)
    }

    // white flash while dashing so the burst reads even on a grey-box
    // rect, plus a 2-3 ghost-frame afterimage (additive blend, DESIGN.md
    // §5 effects language)
    const dashingNow = time < this.dashUntil
    if (dashingNow) {
      this.sprite.setTintFill(0xffffff)
      if (time - this.lastGhostAt >= TUNING.dashDurationMs / 3) {
        this.lastGhostAt = time
        this.spawnGhost()
      }
    } else if (this.wasDashing) {
      this.sprite.clearTint()
      // dash end (-g): gravity resumes as a FRESH fall — vy starts from
      // zero, never a resume of pre-dash momentum
      body.setAllowGravity(true)
      body.setVelocityY(0)
      // a dash that carried us off a ledge edge: coyote counts from the
      // dash ending, so the buffered jump window behaves at the brink
      if (this.dashStartedGrounded && !this.onGround()) this.lastGroundedAt = time
    }
    this.wasDashing = dashingNow

    this.tagPressed = JustDown(this.keys.Z) || JustDown(this.keys.J)
    this.tagHeld = this.keys.Z.isDown || this.keys.J.isDown

    if (this.mode === 'atlas') this.updateAnimState()
    this.traction = 1 // consumed: surfaces re-assert every frame
  }

  // dash afterimage: a snapshot of the current sprite frame, additive
  // blend, quick fade — 2-3 of these trail a full dash
  spawnGhost() {
    const s = this.sprite
    const ghost = this.scene.add
      .image(s.x, s.y, s.texture.key, s.frame.name)
      .setFlipX(s.flipX)
      .setDisplaySize(s.displayWidth, s.displayHeight)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setAlpha(0.45)
      .setDepth(s.depth - 1)
    this.scene.tweens.add({
      targets: ghost,
      alpha: 0,
      duration: 150,
      onComplete: () => ghost.destroy(),
    })
  }

  // ---- animations (atlas mode; frame tags per assets/sprites/README.md) ----

  updateAnimState() {
    const grounded = this.onGround()
    if (grounded && this.wasAirborne) this.triggerAnim('land')
    this.wasAirborne = !grounded
    if (this.animLock) return

    let next
    // dash pose wins while dashing (grounded or flat-air — the -g
    // trajectory makes them the same picture)
    if (this.wasDashing && this.scene.anims.exists('dash')) next = 'dash'
    // frozen covers both hold-charging and the tap windup root — the
    // windup is costumed by the tap one-shot, so 'hold' only plays for
    // actual holds (avoids a 1-frame hold flash at tap end)
    else if (this.frozen && !this.scene.tapAction) next = 'hold'
    else if (!grounded) next = this.body.velocity.y < 0 ? 'jump' : 'fall'
    else if (Math.abs(this.body.velocity.x) > 10) next = 'run'
    else {
      // teeter (handoff 2026-08-05-b): replaces ONLY idle — grounded,
      // stationary, overhanging an edge. Pure visual, zero mechanics.
      const drop = this.teeterSide()
      if (drop !== 0 && this.scene.anims.exists('teeter')) {
        next = 'teeter'
        // face the DROP; this.facing stays untouched, so the main
        // update's facing sync restores it the moment the player moves
        this.sprite.setFlipX(drop === 1)
      } else {
        next = 'idle'
      }
    }
    this.playState(next)
  }

  // which side of the body overhangs a ledge enough to teeter:
  // 0 = adequately supported, -1 = drop on the left, 1 = drop on the
  // right (the side with LESS support). Support = fraction of the
  // body's bottom edge with a colliding tile directly beneath.
  teeterSide() {
    const b = this.body
    const layer = this.scene.mainLayer
    if (!layer) return 0
    const y = b.bottom + 1
    let leftSupport = 0
    let rightSupport = 0
    for (let tx = Math.floor(b.left / 16); tx * 16 < b.right; tx++) {
      const tile = layer.getTileAtWorldXY(tx * 16 + 8, y)
      if (!tile || !tile.collides) continue
      const lo = Math.max(b.left, tile.pixelX)
      const hi = Math.min(b.right, tile.pixelX + 16)
      if (hi <= lo) continue
      const mid = b.center.x
      leftSupport += Math.max(0, Math.min(hi, mid) - lo)
      rightSupport += Math.max(0, hi - Math.max(lo, mid))
    }
    const frac = (leftSupport + rightSupport) / b.width
    if (frac === 0 || frac >= TUNING.teeterSupportFraction) return 0
    return rightSupport < leftSupport ? 1 : -1
  }

  // looping state anim; missing tags fall back to idle so incremental
  // art drops (idle first, run later...) never break. 'dash' plays ONCE
  // and parks on its final frame — the pose holds for the dash's
  // remainder (frame timing stays the .ase's; only the loop differs).
  playState(name) {
    if (this.mode !== 'atlas' || this.animLock) return
    if (!this.scene.anims.exists(name)) name = 'idle'
    if (this.stateAnim === name || !this.scene.anims.exists(name)) return
    this.stateAnim = name
    this.sprite.play({ key: name, repeat: name === 'dash' ? 0 : -1 }, true)
  }

  // one-shot anim (land/tag/hit); locks the state machine until complete
  triggerAnim(name) {
    if (this.mode !== 'atlas' || this.endPosed || !this.scene.anims.exists(name)) return
    this.animLock = true
    this.stateAnim = null
    this.sprite.play(name, true)
    this.sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + name, () => {
      this.animLock = false
    })
  }

  // results pose. 'win' plays ONCE and parks on its final frame (the
  // celebration lands and holds — 2026-08-09); 'lose' loops. The anim
  // lock is never released here, so the pose holds until the scene
  // restarts either way.
  playEndPose(cleared) {
    const name = cleared ? 'win' : 'lose'
    if (this.mode !== 'atlas' || !this.scene.anims.exists(name)) return
    this.endPosed = true
    this.animLock = true
    this.stateAnim = null
    this.sprite.play({ key: name, repeat: name === 'win' ? 0 : -1 }, true)
  }
}
