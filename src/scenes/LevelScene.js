import Phaser from 'phaser'
import { TUNING } from '../config/tuning.js'
import { categoryColor } from '../config/itemCategories.js'
import { luggageArtFor, BAG_BODY_INSET } from '../config/itemArt.js'
import { COLLECTIBLES } from '../config/collectibles.js'
import { getWaveSchedule } from '../config/waveRegistry.js'
import Player from '../entities/Player.js'
import WaveRunner from '../systems/WaveRunner.js'
import { audio } from '../systems/AudioBus.js'
import { recordRun, isDashUnlocked, unlockDash } from '../systems/progress.js'
import { isTuningPanelOpen, setPanelReadout } from '../debug/tuningPanel.js'
import { createParallax, updateParallax } from '../systems/parallax.js'

// TILE SKINS (2026-08-13). Keyed by levelId; applied only when the
// sheet's texture is present, so deleting the art file reverts the look
// with no code change. coatroom2 (art/aseprite/coatroom-tiles2):
//   row 1 — [4 floor tiles][platform left cap][2 middles][right cap]
//   row 2 — [4 counter TOP tiles][4 counter BOTTOM tiles]
const TILE_SKINS = {
  coatroom: {
    texture: 'tiles-coatroom2',
    ground: (x) => 1 + (x % 4), // the four floor tiles repeat, in order
    leftCap: () => 5,
    middle: (x) => 6 + (x % 2), // the two middles alternate
    rightCap: () => 8,
    // the counter reads left-to-right across its own block: top row
    // 9-12, every row beneath it 13-16
    counter: (x, y, { dx, isTop }) => (isTop ? 9 : 13) + (dx % 4),
    hideDressing: true, // this sheet draws no bg1/bg2 dressing
  },
  // garage-tile sheet. Row 1: three walked SURFACE tiles + two FILL
  // tiles. Row 2: pillar-top, deck left/middle/right, bay-number and
  // oil-stain breakers. Row 3 col 0: pillar-bottom.
  garage: {
    texture: 'tiles-garage',
    // the garage floor is two rows: 15 is walked, 16 is fill beneath.
    // The 3-tile surface period is interrupted by breakers on two
    // out-of-phase cadences (23 and 17) so they never line up into a
    // visible grid — the SotN lesson from BRIEF-ART-04 §3.
    // The floor and the decks have SEPARATE oil stains — each drawn with
    // its own bottom edge (the floor's meets asphalt fill, the deck's is
    // an underside), so they are not interchangeable. Sheet index 6 is
    // the floor stain; index 14 is the deck stain. (Sheet index ≠ the
    // map's role gid: map gid 6 means "deck left cap" and skins to 10.)
    // Four floor breakers on out-of-phase prime cadences, ordered
    // RAREST FIRST so a collision shows the more meaningful tile. Each
    // cadence is tuned against how loud the tile is (pixels differing
    // from plain concrete): grate 136/256 → rarest, crack 28 → densest.
    ground: (x, y) => {
      if (y >= 16) return 4 + (x % 2) // sub-floor fill
      if (x % 37 === 18) return 19 // drain grate — the loud one, ~2.7%
      if (x % 23 === 11) return 13 // painted bay number: wayfinding rhythm
      if (x % 17 === 5) return 6 // floor oil stain
      if (x % 11 === 4) return 18 // hairline crack — subtlest, ~9%
      return 1 + (x % 3)
    },
    // deck strips are laid 6 [2 …] 7 and are DOUBLE-FACED (walked top,
    // visible underside). The deck's own oil stain rides the middles
    // about once per strip — cars park up here too.
    middle: (x, y, { dx }) => (dx % 9 === 5 ? 14 : 11),
    leftCap: () => 10,
    rightCap: () => 12,
    // CONCRETE PILLARS (2026-08-13): sheet col 0 of rows 2-3 — gid 9
    // fades in at its top, gid 17 fades out at its bottom, so the pair
    // tiles vertically as precast segments with a dark joint every 32px.
    // bg2's dressing runs are 1-wide and 6 tall → 9,17,9,17,9,17.
    dressing: (x, y, { dy }) => (dy % 2 === 0 ? 9 : 17),
    // sodium lamp pools live on the fg layer (gids 20/21/22) and are
    // LIGHT, not paint — see the blend note in buildMap
    fgAdditive: true,
    fgFlicker: true,
    // the pools only read against a dimmed room — see TUNING.fgAmbient
    fgAmbient: true,
  },
  // belldesk-tile sheet (BRIEF-ART-07, laid out in art/belldesk-inventory
  // .md). 9 columns × 6 rows. Written ahead of the art: the texture
  // doesn't exist yet, so useSkin is false and the level keeps its
  // placeholder bones until the PNG lands — then this table wakes up
  // with no code session, and deleting the PNG reverts it.
  belldesk: {
    texture: 'tiles-belldesk',
    // rows 15/16 across all 120 columns. Row 16 is fill; row 15 is the
    // carpet the player spends the level on. Breakers ride out-of-phase
    // prime cadences (the SotN lesson), rarest first. The carpet runs
    // UNBROKEN under the hero desk: the marble border role was retired
    // by handoff 2026-08-14-c as an orphaned apron spec, since the
    // chosen references seat the desk directly on the leopard.
    ground: (x, y) => {
      if (y >= 16) return 8 // sub-floor fill
      if (x % 29 === 13) return 5 // brass medallion — the loud one
      if (x % 13 === 6) return 6 // worn patch
      return 1 + (x % 4)
    },
    // all three platform tiers speak the same role gids, so the tier is
    // read off the ROW: 12 = bell-cart platforms, 6 and 9 = mezzanines
    leftCap: (x, y) => (y === 12 ? 19 : 10),
    rightCap: (x, y) => (y === 12 ? 21 : 13),
    middle: (x, y, { dx }) => {
      if (y === 12) return 20 // cart deck, no breaker (runs are 4 wide)
      return dx % 7 === 4 ? 14 : 11 + (dx % 2) // brass drip once per strip
    },
    // BESPOKE DESK (human ruling 2026-08-14): dx maps straight onto the
    // nine drawn columns, top row and face row. A counter wider than 9
    // repeats the last column rather than wrapping to garbage.
    counter: (x, y, { dx, isTop }) => (isTop ? 28 : 37) + Math.min(dx, 8),
    // the marble is drawn 7px down so the service bell has room to
    // stand; collision follows the art (see insetCounterTops)
    counterTopInset: 7,
    // Dressing is bg1 only now: the column rank was CUT (human ruling
    // 2026-08-17) and bg2 is empty, so this can branch on the row with
    // no risk of a floor-level tile being mistaken for a column segment.
    //   row 3      — the sconce line, twelve 1×1 tiles
    //   rows 13/14 — the potted palms flanking the hero desk, one 16×32
    //                plant per side: fronds above (9), pot below (18).
    //                Those two indices sit one above the other on the
    //                sheet, which is why the plant is drawn upright.
    dressing: (x, y) => {
      if (y === 3) return 24 // sconce line
      if (y === 13) return 9 // palm fronds
      if (y === 14) return 18 // palm pot
      return 24
    },
  },
}

// Generic level scene: boots any Tiled map by key (assets/maps/README.md
// documents the conventions). The map supplies geometry, spawn points,
// zones, and rush parameters; gameplay systems are shared across levels.
export default class LevelScene extends Phaser.Scene {
  constructor(key = 'Level') {
    super(key) // subclasses (GarageScene) pass their own scene key
  }

  init(data) {
    this.mapKey = data.mapKey || 'coatroom'
    // UIOverlay resumes/tears down the ACTIVE gameplay scene by key —
    // subclasses (GarageScene) register their own key here
    this.game.registry.set('activeLevelKey', this.scene.key)
  }

  create() {
    // run state
    this.score = 0
    this.lostItems = 0
    this.guestCounter = 0 // guests are lightweight data: one per item
    this.tagsCollected = 0 // COLLECTIBLE pickups (2026-08-05-a), not check-ins
    this.cardsUsed = 0
    this.insightsCaught = 0
    this.insightUntil = 0
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
    // counter tops that were inset to meet their art collide with
    // everything the tile they replaced did
    if (this.counterTops) this.physics.add.collider(this.player.sprite, this.counterTops)

    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight)
    // camera follow is manual + pixel-coherent — see updateCamera()

    // tagging
    this.items = this.physics.add.group()
    this.physics.add.collider(this.items, this.mainLayer)
    if (this.counterTops) this.physics.add.collider(this.items, this.counterTops)
    this.target = null
    this.hold = null
    this.holdArmed = false // fresh-press arm for deferred hold start (-e)
    this.graceUntil = 0 // post-interrupt immunity window (2026-08-07-e)
    this.graceFlickering = false
    this.tapAction = null // in-flight tap windup (EXPERIMENT 2026-08-04)
    this.targetGlow = null // additive-overlay glow on the current target
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
    // stub paper-poof for rescues (BRIEF-ART-03 §2); the tag burst above
    // stays a sparkle — check-ins shouldn't read as paper destruction
    this.stubPoof = this.textures.exists('particle-atlas')
      ? this.add
          .particles(0, 0, 'particle-atlas', {
            emitting: false,
            anim: 'fx-stub-poof',
            speed: { min: 30, max: 90 },
            lifespan: 450, // outlives the 390ms poof cycle
            quantity: 6,
            gravityY: 120,
            rotate: { min: -90, max: 90 },
          })
          .setDepth(9)
      : null

    // collectibles (BRIEF-04): one group, registry-driven behavior.
    // Pickup is a manual AABB check in updateCollectibles, NOT a physics
    // overlap pair — Arcade's overlap pass sets body.touching on both
    // bodies, which read as onGround() mid-air and silently refreshed
    // the air dash + coyote when flying through a tag (found by the
    // round-4 gap probe, 2026-08-10: a tag-touch coyote-jump could
    // cross the showcase gap with no dash).
    this.collectibles = this.physics.add.group({ allowGravity: false })
    this.physics.add.collider(this.collectibles, this.mainLayer)
    if (this.counterTops) this.physics.add.collider(this.collectibles, this.counterTops)
    // map-placed collectibles: `collectibles` object layer, point objects
    // typed by collectible key (assets/maps/README.md)
    for (const obj of this.map.getObjectLayer('collectibles')?.objects ?? []) {
      this.spawnCollectible(obj.type || 'nfcTag', null, { x: obj.x, y: obj.y, quiet: true })
    }

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
      spawnEnemy: (entry) => this.spawnEnemy(entry), // entry carries garage elite flags
      spawnCollectible: (type, spawnPoint) => this.spawnCollectible(type, spawnPoint),
    })
    this.fairnessGfx = this.add.graphics().setDepth(19)

    // steal fairness (DESIGN.md §2.4)
    this.lastStealAt = -Infinity
    this.stealFairnessWasOk = true
    this.travelEvents = []
    this.travelBudgetOk = true
    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        this.updateStealFairnessReadout()
        this.updateTravelBudget()
      },
    })
    this.clockTimer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.tickClock(),
    })

    audio.play('rushStart')
    audio.startMusic(this.levelProps.levelId ?? this.mapKey) // loop hook per level
    this.emitHud()

    // dash unlock beat (BRIEF-03): a 10s scripted open — the bell
    // captain (text bubble, no sprite) gifts "the Bell Desk hustle".
    // No modal, no pause; the unlock is immediate and persists for all
    // subsequent levels (DESIGN.md §3.2). Driven by the dashUnlockBeat
    // map property so later levels never re-run it.
    this.dashConfirmPending = false
    if (this.levelProps.dashUnlockBeat) {
      unlockDash()
      this.dashConfirmPending = true
      this.game.events.emit('system-bubble', {
        text: 'Double-tap ← or → (or X/K) to dash!',
        accent: 0xfe701e, // Chexology Orange — the captain's gift
        holdMs: 10000, // the 10s beat
      })
    }

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

  // Re-point ROLE gids at the indices a sheet actually uses, so new tile
  // art never requires rewriting a hand-owned map (2026-08-13). Map data
  // always speaks roles (assets/maps/README.md: 1 ground, 2 platform
  // middle, 6 left cap, 7 right cap, 3 counter, 4/5 dressing); the skin
  // translates. Collision is per-tile and already set, so re-indexing
  // for looks cannot change what's solid — re-asserted below regardless.
  applyTileSkin(skin, dressingLayers) {
    const MAIN_ROLES = { 1: 'ground', 2: 'middle', 3: 'counter', 6: 'leftCap', 7: 'rightCap' }
    this.skinLayer(this.mainLayer, (index) => MAIN_ROLES[index], skin)
    this.mainLayer.setCollisionByExclusion([-1])

    if (skin.hideDressing) {
      // a sheet with no dressing art would render bg1/bg2 as stray floor
      // and cap pieces — hide them; the paintings carry that depth
      for (const l of dressingLayers) l.setVisible(false)
    } else if (skin.dressing) {
      // the sheet dresses the background itself (the garage's pillars are
      // 1-wide vertical runs, so they skin by dy)
      for (const l of dressingLayers) this.skinLayer(l, () => 'dressing', skin)
    }
  }

  // Drop a counter block's standable surface by `inset` px to meet the
  // drawn marble. Tile collision is whole-tile and Arcade has no
  // sub-tile hitbox, so the block's TOP ROW goes non-solid and a static
  // body covers what remains of it (y + inset → y + 16). Consequences,
  // both intended: the inset strip above the marble is now open air, so
  // a bell or lamp drawn up there is scenery rather than a wall, and the
  // rows BELOW the top keep their own tile collision untouched.
  insetCounterTops(cells, inset) {
    const key = (x, y) => `${x},${y}`
    const present = new Set(cells.map((c) => key(c.x, c.y)))
    // a cell is a TOP cell when nothing sits directly above it
    const tops = cells
      .filter((c) => !present.has(key(c.x, c.y - 1)))
      .sort((a, b) => a.y - b.y || a.x - b.x)
    this.counterTops = this.physics.add.staticGroup()
    let run = null
    const flush = () => {
      if (!run) return
      const x = run.x0 * 16
      const w = (run.x1 - run.x0 + 1) * 16
      const y = run.y * 16 + inset
      const h = 16 - inset
      const bar = this.add.rectangle(x + w / 2, y + h / 2, w, h).setVisible(false)
      this.counterTops.add(bar)
      run = null
    }
    for (const c of tops) {
      this.mainLayer.getTileAt(c.x, c.y)?.setCollision(false, false, false, false)
      if (run && c.y === run.y && c.x === run.x1 + 1) run.x1 = c.x
      else {
        flush()
        run = { y: c.y, x0: c.x, x1: c.x }
      }
    }
    flush()
  }

  // remap one layer's tiles through the skin. Roles are BLOCK-RELATIVE:
  // a skin function receives dx / dy (columns and rows from the top-left
  // of its own contiguous run) and isTop, so multi-tile structures —
  // counters, pillars — skin correctly wherever they are placed.
  skinLayer(layer, roleOf, skin) {
    // snapshot the ORIGINAL indices first: neighbor lookups must never
    // see a tile this pass has already re-indexed
    const orig = new Map()
    layer.forEachTile((t) => orig.set(`${t.x},${t.y}`, t.index))
    const at = (x, y) => orig.get(`${x},${y}`) ?? -1
    layer.forEachTile((t) => {
      const index = at(t.x, t.y)
      if (index < 0) return
      const role = roleOf(index)
      if (!role || !skin[role]) return
      let dx = 0
      while (at(t.x - dx - 1, t.y) === index) dx++
      let dy = 0
      while (at(t.x, t.y - dy - 1) === index) dy++
      t.index = skin[role](t.x, t.y, { dx, dy, isTop: dy === 0 })
    })
  }

  buildMap() {
    const map = this.make.tilemap({ key: this.mapKey })
    // map properties are read FIRST: the tile skin below is chosen per
    // levelId, and the parallax/copy hooks downstream want them anyway
    this.levelProps = {}
    for (const p of map.properties ?? []) this.levelProps[p.name] = p.value
    const levelId = this.levelProps.levelId ?? this.mapKey
    // item vocabulary, declared per map (see resolveItemCategory)
    this.allowedItemCategories = String(this.levelProps.itemCategories ?? '')
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)

    const skin = TILE_SKINS[levelId]
    const useSkin = skin && this.textures.exists(skin.texture)
    const tileset = map.addTilesetImage('placeholder', useSkin ? skin.texture : 'tiles')
    const bg2 = map.createLayer('bg2', tileset).setDepth(-4)
    const bg1 = map.createLayer('bg1', tileset).setDepth(-3)
    this.mainLayer = map.createLayer('main', tileset).setDepth(-2)
    this.fgLayer = map.createLayer('fg', tileset).setDepth(8)
    this.mainLayer.setCollisionByExclusion([-1])
    // COLLISION FOLLOWS ART for counters, same principle as CAR_TOP_INSET
    // (BRIEF-ART-04 §0 as amended): the belldesk marble is drawn 7px
    // below the block's top edge so the service bell has room to stand,
    // and the surface the player lands on is the DRAWN surface. Counter
    // cells are captured BEFORE skinning, while they still speak role
    // gid 3 — skinLayer rewrites indices in place.
    // Phaser reuses scene instances across restart(), so a stale group
    // from a previous run must not survive into a map without insets
    this.counterTops = null
    const counterCells = []
    if (useSkin && skin.counterTopInset) {
      this.mainLayer.forEachTile((t) => {
        if (t.index === 3) counterCells.push({ x: t.x, y: t.y })
      })
    }
    if (useSkin) this.applyTileSkin(skin, [bg1, bg2])
    if (counterCells.length) this.insetCounterTops(counterCells, skin.counterTopInset)
    // fg draws IN FRONT of play, so a sheet whose fg tiles are LIGHT
    // (the garage's sodium pools) wants additive blending: the dark end
    // of their dither contributes nothing and the warm end brightens
    // whatever is beneath — floor, cars, and Chexy as she walks through.
    // Without this an opaque pool would paint over her instead.
    if (useSkin && skin.fgAdditive) this.fgLayer.setBlendMode(Phaser.BlendModes.ADD)
    // …and only an ADDITIVE fg may be alpha-flickered: on an opaque fg,
    // alpha under 1 would let the play field show through the art.
    this.fgFlickers = Boolean(useSkin && skin.fgAdditive && skin.fgFlicker)
    // Ambient scrim: MULTIPLY, above the play field but BELOW the pools
    // (depth 7.5 vs 8), so it dims the room and the additive light then
    // has headroom to read against it. Screen-fixed and one quad — the
    // whole lighting model is a rectangle. UIOverlay is a separate scene
    // and renders after, so the HUD never dims with the room.
    if (useSkin && skin.fgAmbient) {
      this.ambientScrim = this.add
        .rectangle(0, 0, this.scale.width, this.scale.height, 0xffffff)
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setDepth(7.5)
        .setBlendMode(Phaser.BlendModes.MULTIPLY)
    }

    this.map = map
    this.worldWidth = map.widthInPixels
    this.worldHeight = map.heightInPixels
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight)

    // fiction flip (BRIEF-07): exodus tags RETURN items to departing
    // guests — the bubble copy pools swap on this map property
    this.game.registry.set('handbackCopy', this.levelProps.handbackCopy === true)
    // parallax drop-in stack (BRIEF-ART-02 §2): whatever paintings
    // exist for this levelId render behind the tile layers
    this.parallaxLayers = createParallax(this, levelId)

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
    // collectible spawns visible while the panel is open (BRIEF-04 §4)
    for (const c of this.collectibles.getChildren()) {
      if (!c.active) continue
      this.fairnessGfx.lineStyle(1, 0xffe123, 0.8)
      this.fairnessGfx.strokeCircle(c.x, c.y, 8)
    }
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
    const dashBonus = this.isDashAvailable()
      ? (TUNING.dashSpeed - TUNING.maxSpeed) * (TUNING.dashDurationMs / 1000)
      : 0
    const traverseMs = (this.worldWidth / (TUNING.maxSpeed + dashBonus)) * 1000
    const ok = escapeMs >= traverseMs + TUNING.stealFairnessMarginMs
    return { ok, escapeMs, traverseMs }
  }

  // TRAVEL BUDGET — instrument three (handoff 2026-08-10-c). The
  // lineage: fairness floor = catchability per event, tension band =
  // heat per request, travel budget = serial ROUTING feasibility.
  // APPLICABILITY IS PER-LEVEL GRAMMAR (handoff 2026-08-11-b): a level
  // without a request surface has no tension band — its absence reads
  // as N/A, not omission. The exodus, e.g., is priced by spawn
  // fairness + the (c) inequality + this instrument. The
  // formalized event set (agent, per the handoff): (1) an untagged item
  // ENTERING danger — the first enemy lock landing on it, re-armed
  // after 4s so lock churn doesn't spam; (2) a steal INITIATING — the
  // grab/gloat start. Over a sliding window, the max-effort travel
  // between consecutive events may use at most travelBudgetFactor of
  // the wall-clock the window spans: no schedule may demand an
  // impossible itinerary. Level-agnostic; the museum exposed what the
  // scroll had been hiding.
  recordTravelEvent(x) {
    this.travelEvents?.push({ t: this.time.now / 1000, x })
  }

  updateTravelBudget() {
    const evs = this.travelEvents
    if (!evs) return
    const now = this.time.now / 1000
    while (evs.length && evs[0].t < now - TUNING.travelBudgetWindowS) evs.shift()
    if (evs.length < 2) {
      this.travelBudgetOk = true
      if (isTuningPanelOpen()) {
        setPanelReadout(`travel budget: ${evs.length} event(s) in window — idle`, true, 2)
      }
      return
    }
    const dashBonus = this.isDashAvailable()
      ? (TUNING.dashSpeed - TUNING.maxSpeed) * (TUNING.dashDurationMs / 1000)
      : 0
    const effSpeed = TUNING.maxSpeed + dashBonus
    let dist = 0
    for (let i = 1; i < evs.length; i++) dist += Math.abs(evs[i].x - evs[i - 1].x)
    const requiredS = dist / effSpeed
    const availableS = evs[evs.length - 1].t - evs[0].t
    const ok = availableS <= 0 || requiredS <= availableS * TUNING.travelBudgetFactor
    if (isTuningPanelOpen()) {
      setPanelReadout(
        `travel budget: ${requiredS.toFixed(1)}s transit / ${availableS.toFixed(1)}s window ` +
          `(${evs.length} events, factor ${TUNING.travelBudgetFactor})`,
        ok,
        2
      )
    }
    if (!ok && this.travelBudgetOk) {
      console.warn(
        `Travel budget RED: ${requiredS.toFixed(1)}s of serial max-effort travel demanded ` +
          `across a ${availableS.toFixed(1)}s window (${evs.length} events, factor ` +
          `${TUNING.travelBudgetFactor}) — the schedule is demanding an impossible itinerary.`
      )
    }
    this.travelBudgetOk = ok
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
    // field count is a per-level lever (BRIEF-06: density is the museum's
    // identity AND its perf ceiling) — map property overrides the global
    const cap = this.levelProps.maxItemsOnField ?? TUNING.maxItemsOnField
    if (onField >= cap) return // schedule pressure valve
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
        if (locked) {
          enemy.setData('lockedTarget', locked)
          // travel budget: an item ENTERING danger (first lock; 4s
          // re-arm so lock churn doesn't spam the itinerary)
          const dangerAt = locked.getData('dangerAt') ?? -Infinity
          if (this.time.now - dangerAt > 4000) {
            locked.setData('dangerAt', this.time.now)
            this.recordTravelEvent(locked.x)
          }
        }
      }

      const goal = locked || this.player // no loot left: loiter near Chexy (body center)
      let goalX = goal.x
      let goalY = goal.y
      if (locked && !this.clearedToSteal(enemy)) {
        // menace loiter (2026-08-03 investigation): not cleared to steal
        // yet, so circle the target instead of camping dead-center on it
        // — a parked enemy read as a wedged grab/gloat. Seed offsets the
        // phase so stacked enemies fan out around the same item.
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

  // dash is available where the LEVEL permits it (dashAllowed map
  // property) and progression has unlocked it — "persists for all
  // SUBSEQUENT levels" (DESIGN.md §3.2): the Coatroom precedes the Bell
  // Desk and never allows it. The panel flag stays a debug override.
  // Shared by player input AND the (c) fairness traversal model so the
  // readout never counts a dash the player can't perform.
  isDashAvailable() {
    return TUNING.dashEnabled || (isDashUnlocked() && this.levelProps.dashAllowed === true)
  }

  // the steal-initiation gates (global cooldown + post-stun grace) shared
  // by the grab itself and the approach behavior: an enemy that couldn't
  // complete a grab right now menace-loiters instead of diving in
  clearedToSteal(enemy) {
    const grace = enemy.getData('stealGraceUntil')
    if (grace && this.time.now < grace) return false
    return this.time.now - this.lastStealAt >= this.stealCooldown()
  }

  onEnemyTouchItem(enemy, item) {
    if (enemy.getData('carrying') || !this.isTaggable(item) || this.isFreshItem(item)) return
    if (enemy.getData('stunnedUntil')) return
    // global cooldown gates steal INITIATIONS only — enemies still exist
    // and menace freely; only the chase-starting event is spaced
    if (!this.clearedToSteal(enemy)) return

    this.lastStealAt = this.time.now
    this.recordTravelEvent(item.x) // travel budget: a steal INITIATES
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
    // dash passes THROUGH ticket enemies — no contact (BRIEF-03)
    if (this.time.now < this.player.dashUntil) return
    // post-interrupt grace (handoff 2026-08-07-e): enemy contact cannot
    // interrupt or fire the hit/struggle path during the window. This
    // protects Chexy's BODY only — the item stays stealable, so the
    // steal race and its gloat-window rescue counter are untouched.
    // Nothing here stuns, displaces, or phases the enemy.
    if (this.time.now < this.graceUntil) return
    // paper can't hurt Chexy, but a hit breaks a hold — unless the
    // ticket is stunned; dazed paper is harmless
    if (this.hold && !enemy.getData('stunnedUntil')) this.interruptHold(true)
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
      tags: this.tagsCollected,
      insightMs: Math.max(0, this.insightUntil - this.time.now),
    })
  }

  endRun(cleared) {
    if (this.runOver) return
    this.runOver = true
    this.physics.pause()
    this.clockTimer?.remove()
    this.clearHold()
    this.targetGlow?.setVisible(false)
    this.player.sprite.setAlpha(1) // never freeze mid-grace-flicker on results
    this.indicatorGfx.clear()
    this.player.playEndPose(cleared)
    // Results music (human request 2026-08-16): a cleared run hands the
    // summary screen its own track instead of ducking the level loop.
    // Drop-in, like every other asset: with no file for the outcome the
    // old duck is exactly what happens, so deleting success.mp3 reverts
    // this. `fail` is the name reserved for the unsuccessful-run track,
    // which is still to come — it needs no code when it lands.
    const resultsTrack = cleared ? 'success' : 'fail'
    if (audio.hasMusic(resultsTrack)) audio.startMusic(resultsTrack)
    else audio.duckMusic() // music dips under the results screen
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
      cardsUsed: this.cardsUsed,
      insightsCaught: this.insightsCaught,
      lost: this.lostItems,
      bestMultiplier: this.bestMultiplier,
      returnRate,
      // the Paper Ticket King is dead: the results screen leads with
      // ITEM RETURN RATE (BOSS-SPEC's ending)
      finale: this.finaleWin === true,
    })
  }

  // ---- collectibles (BRIEF-04): registry-driven, shared plumbing ----

  spawnCollectible(type, spawnPointName, opts = {}) {
    if (this.runOver) return null
    const def = COLLECTIBLES[type]
    if (!def) {
      console.warn(`Unknown collectible type "${type}" — register it in src/config/collectibles.js`)
      return null
    }
    let { x, y } = opts
    if (x == null) {
      const pt = this.itemSpawnPoint(spawnPointName)
      x = pt.x
      y = pt.y
    }
    const useArt = this.textures.exists(def.texture)
    const c = this.collectibles.create(x, y, useArt ? def.texture : def.placeholder, useArt ? 0 : undefined)
    c.setData('type', type)
    c.setDepth(1)
    if (def.lingerMs) c.setData('expiresAt', this.time.now + def.lingerMs())
    if (!opts.quiet) audio.play('spawn', this.panFor(x))
    return c
  }

  onCollectiblePickup(c) {
    if (!c.active) return
    const def = COLLECTIBLES[c.getData('type')]
    audio.play(def.sfx, this.panFor(c.x))
    c.destroy()
    def.onPickup(this)
  }

  updateCollectibles(time) {
    const pb = this.player.body
    for (const c of this.collectibles.getChildren()) {
      if (!c.active) continue
      // manual AABB pickup (no physics pair — see create): overlap
      // separation polluted body.touching and read as onGround mid-air
      if (
        pb.right > c.body.left &&
        pb.left < c.body.right &&
        pb.bottom > c.body.top &&
        pb.top < c.body.bottom
      ) {
        this.onCollectiblePickup(c)
        if (!c.active) continue
      }
      const def = COLLECTIBLES[c.getData('type')]
      // magnet drift (NFC tags): pull toward Chexy inside the radius
      if (def.magnet) {
        const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, c.x, c.y)
        if (d <= TUNING.tagMagnetRadius && d > 1) {
          c.body.setAllowGravity(false)
          const ang = Phaser.Math.Angle.Between(c.x, c.y, this.player.x, this.player.y)
          c.body.setVelocity(Math.cos(ang) * 90, Math.sin(ang) * 90)
        } else if (!c.body.allowGravity) {
          c.body.setVelocity(0, 0)
        }
      }
      // linger + blink warning in the final 2000ms (Contact Card)
      const expiresAt = c.getData('expiresAt')
      if (expiresAt) {
        const left = expiresAt - time
        if (left <= 0) {
          c.destroy()
          continue
        }
        c.setAlpha(left <= 2000 ? (Math.sin(time / 60) > 0 ? 1 : 0.25) : 1)
      }
    }
    // Insights Report expiry
    if (this.insightUntil && time >= this.insightUntil) {
      this.insightUntil = 0
      audio.play('insightEnd')
      this.emitHud()
    }
  }

  // central score gain: adaptive multiplier always applies; the
  // Insights Report doubles ALL gains while active — MULTIPLICATIVE
  // with adaptive, never touching the band itself (BRIEF-04 §3)
  addScore(base) {
    const insight = this.time.now < this.insightUntil ? TUNING.insightFactor : 1
    this.score += Math.round(base * this.multiplier * insight)
    this.emitHud()
  }

  startInsight() {
    this.insightsCaught += 1
    this.insightUntil = this.time.now + TUNING.insightDurationMs
    this.emitHud()
  }

  // Contact Card (BRIEF-04 §2): instantly auto-return the
  // MOST-ENDANGERED item — consumes THE shared endangerment ranking
  // (§2.4): carried > enemy-locked (nearest-to-dive first) > at-rest
  // (longest at rest); ties break toward the item FARTHEST from the
  // player — the card saves what Chexy can't reach.
  mostEndangeredItem() {
    let best = null
    let bestKey = null
    for (const item of this.items.getChildren()) {
      if (!item.active || item.getData('tagged')) continue
      const rank = this.itemDangerRank(item)
      let refine = 0
      if (rank === 1) {
        let dive = Infinity
        for (const e of this.enemies.getChildren()) {
          if (e.getData('lockedTarget') === item) {
            dive = Math.min(dive, Phaser.Math.Distance.Between(e.x, e.y, item.x, item.y))
          }
        }
        refine = dive // closer enemy = sooner dive = more endangered
      } else if (rank === 2) {
        refine = item.getData('spawnedAt') ?? 0 // older = more endangered
      }
      // negative distance: lexicographically smaller = farther away
      const tieBreak = -Phaser.Math.Distance.Between(this.player.x, this.player.y, item.x, item.y)
      const key = [rank, refine, tieBreak]
      if (
        !bestKey ||
        key[0] < bestKey[0] ||
        (key[0] === bestKey[0] &&
          (key[1] < bestKey[1] || (key[1] === bestKey[1] && key[2] < bestKey[2])))
      ) {
        best = item
        bestKey = key
      }
    }
    return best
  }

  contactCardSave() {
    const item = this.mostEndangeredItem()
    if (!item) return // nothing on field to save: the card fizzles
    this.cardsUsed += 1

    // a carried item is pulled straight out of the thief's grip — the
    // carrier resumes normal behavior (re-acquisition per target lock)
    const carrier = this.enemies.getChildren().find((e) => e.getData('carrying') === item)
    if (carrier) {
      carrier.setData('carrying', null)
      carrier.setData('gloatUntil', null)
    }
    item.setData('stolen', false)
    item.setData('tagged', true)
    item.body.enable = false

    // scores normally, awards NO streak progress (parallel to rescue
    // neutrality, DESIGN.md §2 item 4b — saves aren't clean play)
    this.itemsReturned += 1
    const tier = item.getData('tier') ?? 1
    const factor =
      tier >= 3 ? TUNING.tier3ScoreFactor : tier === 2 ? TUNING.tier2ScoreFactor : 1
    this.addScore(TUNING.standardItemScore * factor)

    // checked in: chip + Success Green, then fly to the return zone
    const chip = this.add.image(0, 0, 'tag-chip').setDepth(1)
    chip.setTint(categoryColor(item.getData('category')))
    item.setData('chip', chip)
    item.once(Phaser.GameObjects.Events.DESTROY, () => chip.destroy())
    this.syncChip(item)
    item.setTint(0x12b76a) // Success Green — "got the text"

    const zone = this.zones.find((z) => z.name === 'return')
    const tx = zone ? zone.x + zone.width / 2 : item.x
    const ty = zone ? zone.y + zone.height / 2 : item.y - 24
    const trail = this.time.addEvent({
      delay: 60,
      repeat: 8,
      callback: () => this.tagParticles.emitParticleAt(item.x, item.y),
    })
    this.tweens.add({
      targets: item,
      x: tx,
      y: ty,
      alpha: 0,
      duration: 550,
      ease: 'Quad.easeIn',
      onComplete: () => {
        trail.remove()
        item.destroy()
      },
    })
    audio.play('cardReturn', this.panFor(item.x))
    this.game.events.emit('guest-card', { guest: item.getData('guest') })
    this.emitHud()
  }

  // ONE teardown for every way a run ends short of the results flow —
  // retry and exit share it so reset paths can never diverge (handoff
  // 2026-08-04-e). An abandoned rush records NOTHING: recordRun lives
  // only in endRun on a cleared run; all per-run state (score, streaks,
  // adaptive band, timers) dies with the scene and is rebuilt in
  // create(). Level unlocks are progression storage and are untouched.
  teardownRun(destination) {
    audio.play('uiSelect')
    this.game.events.emit('run-reset')
    if (destination === 'retry') {
      this.scene.restart({ mapKey: this.mapKey })
    } else {
      // exit: back to the shift board, music to menu state
      audio.stopMusic()
      this.scene.stop('UIOverlay')
      this.scene.start('LevelSelect')
    }
  }

  // stereo position of a world x relative to the player: -1 left .. 1 right
  panFor(x) {
    return Phaser.Math.Clamp((x - this.player.x) / 360, -1, 1)
  }

  // A level's item vocabulary is the map's to declare (`itemCategories`,
  // comma-separated). Where it does, that list is BINDING: a category
  // from outside it is corrected to the level's first, loudly in dev.
  // The Bell Desk is luggage and bags exclusively (human ruling
  // 2026-08-17) and no scheduling slip may put a coat in its lobby;
  // `category = 'coat'` is spawnItem's ancient default, which is exactly
  // the kind of thing that leaks. Maps that declare nothing are
  // unchanged.
  resolveItemCategory(category) {
    const allowed = this.allowedItemCategories
    if (!allowed?.length || allowed.includes(category)) return category
    if (import.meta.env.DEV) {
      console.warn(
        `${this.mapKey}: item category "${category}" is not in this level's ` +
          `vocabulary [${allowed.join(', ')}] — spawning "${allowed[0]}" instead. ` +
          `Fix the wave entry, or widen the map's itemCategories property.`
      )
    }
    return allowed[0]
  }

  spawnItem(x, y, tier = 1, category = 'coat') {
    category = this.resolveItemCategory(category)
    const heavy = tier >= 3
    // real coat art (3 garment-colored variants) when the strip exists —
    // coats only; luggage stays on the accepted interim convention
    // (tinted rect + chip, BRIEF-03 execution note 3) until its art
    // lands. Tier silhouette = rect size (small / medium / large).
    const useCoatArt = tier === 1 && category === 'coat' && this.textures.exists('coats')
    // luggage art (art/luggage-kit.md): one file per tier, each a strip
    // of same-size variants — the tier is the GROUP SIZE, so tier 3 is a
    // trolley load rather than a bigger single case. Frame = body.
    const bagArt = category === 'luggage' ? luggageArtFor(tier) : null
    const useBagArt = bagArt && this.textures.exists(bagArt.key)
    const rectKey = tier >= 3 ? 'item-heavy' : tier === 2 ? 'item-medium' : 'item-standard'
    const item = useCoatArt
      ? this.items.create(x, y, 'coats', Phaser.Math.Between(0, 2))
      : useBagArt
        ? this.items.create(
            x,
            y,
            bagArt.key,
            Phaser.Math.Between(0, this.textures.get(bagArt.key).frameTotal - 2)
          )
        : this.items.create(x, y, rectKey)
    item.setData('heavy', heavy)
    item.setData('tier', tier)
    item.setData('category', category)
    item.setData('spawnedAt', this.time.now) // fresh-item grace (DESIGN.md §2.4)
    item.setData('guest', ++this.guestCounter) // every item belongs to a guest
    if (useCoatArt) {
      // garment colors are baked in (-b ruling: the chip carries the
      // category); BRIEF-ART-03 §1: smaller centered physics body
      item.body.setSize(16, 18)
    } else if (useBagArt) {
      // drawn bags carry their own colours; the chip carries the
      // category, so no tint (tinting would muddy leather and canvas).
      // Body inset 2px per side from the ink and centered (-15-a): a
      // little overhang is free, and the CENTRE is unmoved, which is why
      // tag feel can't shift — auto-target measures from body centre.
      // sitFlush keeps the bottom inset at 0 so the drawn floor edge IS
      // the collision floor edge; setSize centres, so the offset then
      // pushes the body down to sit against the ink's bottom row
      const inset = BAG_BODY_INSET
      const bh = bagArt.h - inset * (bagArt.sitFlush ? 1 : 2)
      item.body.setSize(bagArt.w - inset * 2, bh)
      if (bagArt.sitFlush) item.body.setOffset(inset, inset)
    } else {
      item.setTint(categoryColor(category)) // ChexApp tag colors
    }
    // placement-validity gate (handoff 2026-08-04-d): EVERY item
    // placement routes through the shared de-embed path — an embedded
    // spawn defeats arcade separation and falls through the floor
    this.placeItemClear(item, x, y)
    item.setBounce(0.1)
    item.setCollideWorldBounds(true)
    // horizontal skid decay: without drag a rescue-dropped item keeps its
    // pop velocity forever and slides to the nearest wall — invisible
    // under instant taps, hostile under hold-tags (2026-08-03 fix)
    item.body.setDragX(TUNING.itemDragX)
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
    // subtle screen-edge shimmer while an Insights Report is active
    // (BRIEF-04 §3) — a thin Warning Yellow border pulse, screen-space
    if (this.time.now < this.insightUntil) {
      this.indicatorGfx.lineStyle(2, 0xffe123, 0.18 + 0.1 * Math.sin(time / 120))
      this.indicatorGfx.strokeRect(1, 1, this.scale.width - 2, this.scale.height - 2)
    }
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
      // hold-tag tiers (2+) share the heavy-variant purple (ruled as-is
      // 2026-08-09-a): the arrow only says "this one needs a hold" —
      // tier identity rides on silhouette, dots, and meter speed
      this.indicatorGfx.fillStyle((item.getData('tier') ?? 1) >= 2 ? 0x9b6ee8 : 0x59c2e8, pulse)
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

  // what the tap's rescue class (0) may target. Subclasses extend it —
  // the Exodus adds the King's claw, which is stunnable but is NOT a
  // thief and must never see the thief AI (BRIEF-07 Act 2).
  stunnableCandidates() {
    return this.enemies.getChildren()
  }

  // THE one endangerment ranking (DESIGN.md §2.4, handoff 2026-08-04-d):
  // carried (0) > enemy-locked (1) > at-rest (2). Every system that
  // reasons about item danger — tap auto-target, the Contact Card save
  // priority (BRIEF-04), urgency-arrow weighting — consumes this and
  // refines within a class; the game never disagrees with itself about
  // what is most at risk. Class-2 danger refinement is at-rest age,
  // OLDEST first (2026-08-05-a: expiry is out of v1 — steals are the
  // only loss channel; age via getData('spawnedAt')).
  itemDangerRank(item) {
    if (item.getData('stolen')) return 0
    for (const enemy of this.enemies.getChildren()) {
      if (enemy.getData('lockedTarget') === item) return 1
    }
    return 2
  }

  // auto-target: the most AT-RISK valid target within TUNING.targetRadius
  // (human ruling 2026-08-04, DESIGN.md §2.3 amended) — ranked by the
  // shared endangerment order, nearest within a class. A carrying ticket
  // stands in for its carried item (rank 0) as the interaction point.
  // Visible outline so the player always knows what a press will do.
  updateTargeting() {
    let best = null
    let bestClass = Infinity
    let bestD = Infinity
    const consider = (obj, cls) => {
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, obj.x, obj.y)
      if (d > TUNING.targetRadius) return
      if (cls < bestClass || (cls === bestClass && d < bestD)) {
        bestClass = cls
        bestD = d
        best = obj
      }
    }
    for (const enemy of this.stunnableCandidates()) {
      if (this.isStunnable(enemy)) consider(enemy, 0) // carried: rescue first
    }
    for (const item of this.items.getChildren()) {
      if (this.isTaggable(item)) consider(item, this.itemDangerRank(item))
    }
    this.target = best
    this.updateTargetGlow(this.time.now)
  }

  // target highlight (human ruling 2026-08-08): an additive-blend copy
  // of the target rides on top of it with a breathing alpha — additive
  // genuinely brightens toward white-hot on ANY art (multiply tints
  // can't brighten, which made tint pulses invisible on this warm
  // palette). The target's own tint is never touched, so stun gray /
  // check-in green / category colors need no ownership handling.
  updateTargetGlow(now) {
    const t = this.target
    if (!t || !t.active) {
      this.targetGlow?.setVisible(false)
      return
    }
    if (!this.targetGlow) {
      this.targetGlow = this.add
        .image(0, 0, t.texture.key, t.frame.name)
        .setBlendMode(Phaser.BlendModes.ADD)
    }
    const g = this.targetGlow
    if (g.texture.key !== t.texture.key || g.frame.name !== t.frame.name) {
      g.setTexture(t.texture.key, t.frame.name)
    }
    // mirror the target: rounded position (same convention as the render
    // snap and chips, so the halo never sits a subpixel off), frame,
    // flip, size, and tint — glowing an orange item toward orange-white
    // reads better than washing it to pure white
    g.setPosition(Math.round(t.x), Math.round(t.y))
    g.setFlipX(t.flipX)
    g.setDisplaySize(t.displayWidth, t.displayHeight)
    g.setDepth(t.depth + 0.5) // above the sprite, below its chip
    if (t.isTinted) g.setTint(t.tintTopLeft)
    else g.clearTint()
    g.setAlpha(0.6 * (0.5 + 0.5 * Math.sin(now / 110)))
    g.setVisible(true)
  }

  updateTagging(time) {
    if (this.tapAction) {
      this.updateTapAction(time)
      if (this.tapAction) return // still winding up: one action at a time
    }
    if (this.hold) {
      this.updateHold(time)
      return
    }
    const p = this.player
    // dash-through does not tag (handoff 2026-08-09-g): no tag verb may
    // INITIATE mid-dash. The tap windup's movement freeze would zero
    // the dash velocity inside a vehicle, and extend-until-clear could
    // then never clear — Chexy hung wedged inside the car until the
    // edge push arrived (the dash-wedge, reported and reproduced
    // 2026-08-10). A mid-dash press is dropped, not buffered.
    if (time < p.dashUntil) {
      this.holdArmed = false
      return
    }
    // one press, one action (handoff 2026-08-03-f, generalizing -e): a
    // press ARMS exactly one action; the FIRST action it produces —
    // instant tap, rescue stun, or hold start — consumes the arm. An
    // unconsumed arm (pressed in transit) waits per hold start
    // buffering (-d). Buffering forgives timing, never multiplies
    // actions.
    if (p.tagPressed) this.holdArmed = true
    else if (!p.tagHeld) this.holdArmed = false
    if (p.tagPressed && this.target) {
      // rescue is ALWAYS instant tap (DESIGN.md §2 item 4b)
      if (this.isStunnable(this.target)) {
        this.holdArmed = false // arm consumed by the stun
        this.stunEnemy(this.target, time)
        return
      }
      // tier 1 stays a PRESS event: a held button never repeat-fires
      // taps (handoff 2026-08-03-d item 2)
      if ((this.target.getData('tier') ?? 1) < 2) {
        this.holdArmed = false // arm consumed by the tap
        this.beginTap(this.target, time)
        return
      }
    }

    // hold start for tier 2+, buffered like jump input (DESIGN.md §2.3,
    // handoff 2026-08-03-d): held tag intent WAITS while movement keys
    // are down and the hold starts the moment they release — input
    // overlap at arrival can never fire an interrupt or struggle
    // penalty. holdDeferredStart=false restores legacy press-start for
    // playtest comparison.
    const t = this.target
    if (!t || this.isStunnable(t) || (t.getData('tier') ?? 1) < 2) return
    const wantsHold = TUNING.holdDeferredStart ? p.tagHeld && this.holdArmed : p.tagPressed
    if (!wantsHold) return
    const moveInput =
      p.cursors.left.isDown || p.cursors.right.isDown || p.cursors.up.isDown || p.keys.SPACE.isDown
    if (TUNING.holdDeferredStart && moveInput) return // buffered: wait for release
    this.holdArmed = false // arm consumed by this hold, however it ends
    this.startHold(time)
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
    this.placeItemClear(item, enemy.x, enemy.y + 10)
    item.body.setVelocity(Phaser.Math.Between(-30, 30), -60) // pop free

    this.physics.pause()
    this.time.delayedCall(TUNING.hitstopMs, () => {
      if (!this.runOver) this.physics.resume()
    })
    ;(this.stubPoof ?? this.tagParticles).emitParticleAt(enemy.x, enemy.y)
    audio.play('stun', this.panFor(enemy.x))

    // NFC tag drop (BRIEF-04 §1): one per rescue stun, small pop arc —
    // rides the same placement-validity gate as items so a low stun
    // can't embed the tag in the floor
    const tag = this.spawnCollectible('nfcTag', null, { x: enemy.x, y: enemy.y - 4, quiet: true })
    if (tag) {
      this.placeItemClear(tag, enemy.x, enemy.y - 4)
      tag.body.setAllowGravity(true)
      tag.setBounce(0.3)
      tag.body.setVelocity(Phaser.Math.Between(-40, 40), -90)
    }
  }

  // place a dropped item so its body never overlaps solid tiles — an
  // embedded body defeats arcade separation and the item sits inside
  // the floor until an enemy lifts it out (human bug report 2026-08-04:
  // low carriers, and carriers flying through platforms, dropped
  // embedded trunks). Walks upward out of any colliding tile.
  placeItemClear(item, x, y) {
    const half = (item.body?.height ?? item.height) / 2
    for (let guard = 0; guard < 8; guard++) {
      const tile = this.mainLayer.getTileAtWorldXY(x, y + half - 1)
      if (!tile || !tile.collides) break
      y = tile.pixelY - half - 1 // sit just above the colliding tile
    }
    item.setPosition(x, y)
    item.body.reset(x, y)
  }

  startHold(time) {
    const item = this.target
    // tier-2 rollers charge faster than tier-3 trunks (holdTier2Factor);
    // duration is fixed at hold start so a mid-hold slider drag can't
    // finish or extend a charge retroactively
    const durationMs =
      (item.getData('tier') ?? 3) === 2 ? TUNING.holdTagMs * TUNING.holdTier2Factor : TUNING.holdTagMs
    this.hold = { item, startedAt: time, durationMs }
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
    // dashCancelsHold trial (BRIEF-03): a dash STARTED during this hold
    // breaks it like deliberate movement would. With the flag off (the
    // default lockout) Player never starts a dash while frozen.
    if (moveInput || p.lastDashAt > this.hold.startedAt) {
      this.interruptHold()
      return
    }

    const progress = (time - this.hold.startedAt) / this.hold.durationMs
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

  // a hit or deliberate movement breaks the hold — the meter resets.
  // Only ENEMY interrupts grant grace (2026-08-07-e): grace shields
  // against enemies, never against the player's own movement exit.
  interruptHold(fromEnemy = false) {
    this.clearHold()
    audio.play('interrupt')
    this.player.triggerAnim('hit')
    this.player.sprite.setTint(0xff6666)
    this.time.delayedCall(150, () => this.player.sprite.clearTint())
    if (fromEnemy) this.graceUntil = this.time.now + TUNING.iframesMs
    this.onHoldInterrupted()
  }

  // grace flicker (2026-08-07-e): alpha oscillation so the immunity
  // state is legible; persists through the hold pose since it rides the
  // sprite, not the animation
  updateGraceFlicker(time) {
    const active = time < this.graceUntil
    if (active) this.player.sprite.setAlpha(Math.sin(time / 40) > 0 ? 1 : 0.45)
    else if (this.graceFlickering) this.player.sprite.setAlpha(1)
    this.graceFlickering = active
  }

  // Tap windup (ruled 2026-08-04 after playtest): the tap lands on the
  // tap anim's 2nd frame and Chexy is rooted for the full 2 frames —
  // fast, but not instant. Timing reads from the anim so the .ase stays
  // the authority. Scope: item taps only — rescue stuns stay instant
  // (DESIGN §2 item 4b lock) and hold completions already paid the
  // meter. Without tap art the tap stays instant (graceful degradation).
  beginTap(item, time) {
    const anim = this.anims.get('tap')
    if (!anim) {
      this.completeTag(item)
      return
    }
    const firstFrameMs = anim.frames[0].duration || anim.duration / anim.frames.length
    this.tapAction = { item, fired: false, effectAt: time + firstFrameMs, endAt: time + anim.duration }
    this.player.frozen = true // rooted for the windup, like a hold
    this.player.triggerAnim('tap')
  }

  updateTapAction(time) {
    const act = this.tapAction
    if (!act.fired && time >= act.effectAt) {
      act.fired = true
      // re-validate the PRESS-TIME target only (-b ruling): invalid at
      // landing = clean whiff — no retarget to other items in radius,
      // no penalty, arm already consumed per -f
      if (this.isTaggable(act.item)) this.completeTag(act.item)
    }
    if (time >= act.endAt) {
      this.tapAction = null
      if (!this.hold) this.player.frozen = false
    }
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
    // one-shot check-in pose — the artist's tag name is 'tap' (renamed
    // from the reserved-but-never-drawn 'tag' key, 2026-08-04); plays on
    // hold completions too, as the shared check-in beat
    this.player.triggerAnim('tap')
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

    this.onItemTagged(item.getData('tier') ?? 1)
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

  onItemTagged(tier) {
    // tagsCollected is NOT bumped here (2026-08-05-a): "Tags" counts
    // COLLECTIBLE pickups (BRIEF-04 §1); check-in volume is
    // itemsReturned — the counters never double-count one event
    this.itemsReturned += 1
    // score by commitment (handoff 2026-08-04-a): 1× / 1.5× / 2× by
    // weight tier; addScore applies the adaptive multiplier and any
    // active Insights Report factor
    const factor =
      tier >= 3 ? TUNING.tier3ScoreFactor : tier === 2 ? TUNING.tier2ScoreFactor : 1
    this.addScore(TUNING.standardItemScore * factor)
    this.onCleanProgress()
    this.emitHud()
  }

  onHoldInterrupted() {
    this.onStruggle()
  }

  update(time, delta) {
    if (this.runOver) {
      if (Phaser.Input.Keyboard.JustDown(this.keyR)) this.teardownRun('retry')
      else if (Phaser.Input.Keyboard.JustDown(this.keyC)) this.teardownRun('exit')
      return
    }

    // Esc/P pauses the whole scene (physics, timers, tweens);
    // UIOverlay stays live and owns the resume
    if (
      Phaser.Input.Keyboard.JustDown(this.pauseKeys.ESC) ||
      Phaser.Input.Keyboard.JustDown(this.pauseKeys.P)
    ) {
      audio.pauseMusic() // position held; menu SFX stay audible (-07-d)
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
    // first dash of the beat run → Success Green confirmation (BRIEF-03)
    if (this.dashConfirmPending && this.player.dashedOnce) {
      this.dashConfirmPending = false
      this.game.events.emit('system-bubble', {
        text: "Let's gooooo!", // Chexology catchphrase — canon per 2026-08-04-a
        accent: 0x12b76a, // Success Green
      })
    }
    this.updateCamera()
    updateParallax(this.parallaxLayers, this.cameras.main, time)
    this.updateFgLight(time)
    this.updateTargeting()
    this.updateTagging(time)
    this.updateEnemies(time)
    this.updateGraceFlicker(time)
    this.updateCollectibles(time)
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
  // The garage's lighting, such as it is: a dimmed room and pools that
  // buzz. Both values are read live so the panel tunes them mid-run,
  // and both cost one write per frame regardless of how many pools are
  // on screen — no per-tile work, no extra frames.
  updateFgLight(time) {
    if (this.ambientScrim) {
      const v = Math.round(Phaser.Math.Clamp(TUNING.fgAmbient, 0, 1) * 255)
      this.ambientScrim.setFillStyle((v << 16) | (v << 8) | v)
    }
    if (!this.fgFlickers) return
    if (!TUNING.fgFlicker) {
      this.fgLayer.setAlpha(1)
      return
    }
    const min = TUNING.fgFlickerMin
    const max = TUNING.fgFlickerMax
    // 0.65 breath + 0.35 ripple: the two periods are deliberately not
    // multiples, so the pattern doesn't visibly repeat on a short loop
    const wave =
      0.65 * Math.sin((time / TUNING.fgFlickerHumMs) * Math.PI * 2) +
      0.35 * Math.sin((time / TUNING.fgFlickerBuzzMs) * Math.PI * 2)
    this.fgLayer.setAlpha((max + min) / 2 + ((max - min) / 2) * wave)
  }

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
