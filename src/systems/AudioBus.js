import { playSfx, startMusicStub, setSfxMuted } from './sfx.js'
import { TUNING } from '../config/tuning.js'
import { isMuted, setMuted } from './progress.js'

// Central audio layer (BRIEF-02 Chunk 5). A named event resolves to:
//   1. a file dropped in assets/audio/<event>.(wav|mp3|ogg) — wins
//   2. the generated jsfxr-style synth placeholder (systems/sfx.js)
// Missing files are silently skipped (the synth covers every event), so
// pulling any audio file can never crash — the same drop-in contract as
// sprites. Event names + music conventions: assets/audio/README.md.

const AUDIO_URLS = import.meta.glob('../../assets/audio/*', {
  eager: true,
  query: '?url',
  import: 'default',
})
// The `!_*` negation is load-bearing, not tidiness: skipping archived
// takes inside fileMap keeps them out of MEMORY, but Vite bundles
// whatever the glob imports, so without this the retired Coatroom and
// Title takes shipped anyway — 1.5MB of a 15MB payload (caught while
// preparing the first deploy).
const MUSIC_URLS = import.meta.glob(['../../assets/audio/music/*', '!../../assets/audio/music/_*'], {
  eager: true,
  query: '?url',
  import: 'default',
})

const AUDIO_EXT = /\.(wav|mp3|ogg)$/
// VARIANT POOLS (SFX-MANIFEST [VAR], confirmed 2026-08-19): `tag-1.mp3`,
// `tag-2.mp3`, ... form a pool for the event `tag`. play() picks at
// random and never repeats the previous pick, so the most-heard sounds
// stop sounding mechanical. A bare `tag.mp3` is still a valid single;
// pool and single can coexist, in which case the pool wins.
const VARIANT_SUFFIX = /-(\d+)$/
// finer-grained game events fall back to a canonical file name
// (BRIEF-02's event list) when no exact-name file exists. The second
// group are MANIFEST ALIASES (reconciled 2026-08-19): the design chat's
// manifest names some events differently from the code, so a file
// delivered under the manifest's name still plays. Code name wins when
// both exist.
const CANONICAL = {
  heavyTag: 'holdComplete',
  interrupt: 'holdInterrupt',
  lose: 'itemLost',
  heatUp: 'multiplierUp',
  runClear: 'rushEnd',
  runFail: 'rushEnd',
  // manifest aliases
  tag: 'tap',
  stun: 'rescueStun',
  gloat: 'stealGrab',
  stamp: 'bigDayStamp',
  chime: 'hangerChime',
}

// name -> url for singles; name -> [url, ...] for variant pools
function fileMap(globbed) {
  const map = {}
  for (const [path, url] of Object.entries(globbed)) {
    const base = path.split('/').pop()
    if (!AUDIO_EXT.test(base)) continue
    // `_name.mp3` is ARCHIVED, not playable: superseded takes kept in
    // the repo for reference. Boot loads every file this map returns,
    // so without the skip a retired track is still downloaded and
    // bundled — 1.5MB of pre-remix Coatroom and Title, in this case.
    if (base.startsWith('_')) continue
    const stem = base.replace(AUDIO_EXT, '')
    const m = stem.match(VARIANT_SUFFIX)
    if (m) {
      const event = stem.slice(0, -m[0].length)
      // a bare single may already sit here (glob order is not
      // guaranteed): the pool replaces it rather than pushing onto a
      // string, which is how the documented "pool wins" resolves
      if (!Array.isArray(map[event])) map[event] = []
      map[event].push({ stem, url })
    } else if (!Array.isArray(map[stem])) {
      map[stem] = url
    }
  }
  // deterministic pool order: -1, -2, -3 regardless of glob order
  for (const [k, v] of Object.entries(map)) {
    if (Array.isArray(v)) v.sort((a, b) => a.stem.localeCompare(b.stem, undefined, { numeric: true }))
  }
  return map
}

const clamp01 = (v) => Math.max(0, Math.min(1, v))

class AudioBus {
  constructor() {
    this.files = fileMap(AUDIO_URLS)
    this.music = fileMap(MUSIC_URLS)
    this.game = null
    this.musicSound = null // file-based music (Phaser sound)
    this.stub = null // generated chiptune loop
    this.currentLevelId = null
    this.ducked = false
    this.musicPaused = false
    this.pendingMusic = null // deferred start while the browser gates audio
    // master mute (handoff 2026-08-07-d): a persisted preference,
    // independent of the volume sliders — unmute restores prior levels
    this.muted = isMuted()
    this.lastVariant = {} // per-event: the previous pool pick, never repeated
    this.musicRequest = null // token for the in-flight per-level load
  }

  // Boot.preload: SFX only. Music is loaded PER LEVEL, on demand, in
  // startMusic — it was 12.1MB of a 13.8MB payload sitting in front of
  // the title screen while only ever one track plays (2026-08-26). SFX
  // stay eager: the whole set is a few KB and a cue that arrives late is
  // a cue that was missed.
  preload(scene) {
    for (const [name, entry] of Object.entries(this.files)) {
      if (Array.isArray(entry)) {
        for (const v of entry) scene.load.audio(`audio-${v.stem}`, v.url)
        continue
      }
      scene.load.audio(`audio-${name}`, entry)
    }
  }

  // Load a track and play it when it arrives. The request is TOKENISED:
  // by the time a 3MB file lands the player may have left the level, or
  // asked for a different track, so only the latest request may play.
  loadAndPlayMusic(levelId) {
    const key = `music-${levelId}`
    const url = this.music[levelId]
    if (!url) {
      this.stub = startMusicStub() // no file for this level: the synth
      this.refreshVolumes()
      return
    }
    // A loader belongs to a scene, and startMusic is called from a
    // scene's create() — at which point that scene is still CREATING, so
    // getScenes(true) is empty and there is nothing to load with. Wait
    // one game step for it to count as running. (Diagnosed the hard way:
    // every level silently fell back to the synth stub.)
    const scene = this.game?.scene.getScenes(true)[0]
    if (!scene) {
      this.game?.events.once('poststep', () => {
        if (this.currentLevelId === levelId) this.loadAndPlayMusic(levelId)
      })
      return
    }
    this.musicRequest = levelId
    scene.load.audio(key, url)
    scene.load.once(`filecomplete-audio-${key}`, () => {
      // stale request: the player moved on while this was in flight
      if (this.musicRequest !== levelId || this.currentLevelId !== levelId) return
      this.stub?.stop()
      this.stub = null
      this.musicSound = this.game.sound.add(key, { loop: true })
      this.musicSound.play()
      if (this.musicPaused) this.musicSound.pause()
      this.refreshVolumes()
    })
    if (!scene.load.isLoading()) scene.load.start()
  }

  init(game) {
    this.game = game
    // Volumes track the sliders GLOBALLY. This used to be polled from
    // UIOverlayScene.update, which meant it only ran during gameplay:
    // on the Title and Shift Select screens the music slider did
    // nothing at all (human report 2026-08-21). The game loop steps
    // regardless of which scenes exist — or whether they are paused —
    // so the poll belongs here.
    game.events.on('poststep', this.refreshVolumes, this)
    setSfxMuted(this.muted)
    // 'm' toggles master mute from ANY scene — DOM-level so it works on
    // menus, during gameplay, and while the Level scene is paused
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return
      if (e.key === 'm' || e.key === 'M') this.toggleMute()
    })
  }

  toggleMute() {
    this.muted = !this.muted
    setMuted(this.muted) // persists across sessions (preference, not a run stat)
    setSfxMuted(this.muted)
    this.refreshVolumes()
    return this.muted
  }

  // Resolve an event to a loaded cache key: the event's own pool or
  // single first, then its CANONICAL/alias name. Pools pick at random
  // without repeating the previous pick.
  resolveSfxKey(name) {
    for (const candidate of [name, CANONICAL[name]]) {
      if (!candidate) continue
      const entry = this.files[candidate]
      if (!entry) continue
      if (!Array.isArray(entry)) return candidate
      if (entry.length === 1) return entry[0].stem
      let pick
      do {
        pick = entry[Math.floor(Math.random() * entry.length)].stem
      } while (pick === this.lastVariant[candidate] && entry.length > 1)
      this.lastVariant[candidate] = pick
      return pick
    }
    return null
  }

  play(name, pan = 0) {
    const fileKey = this.resolveSfxKey(name)
    if (fileKey && this.game?.cache.audio.exists(`audio-${fileKey}`)) {
      if (this.muted) return // master mute covers file SFX too
      const snd = this.game.sound.add(`audio-${fileKey}`)
      if (typeof snd.setPan === 'function') snd.setPan(Math.max(-1, Math.min(1, pan)))
      snd.once('complete', () => snd.destroy())
      snd.play({ volume: clamp01(TUNING.masterVolume * TUNING.sfxVolume) })
      return
    }
    playSfx(name, pan) // generated placeholder (handles mute + unknown-event warn)
  }

  // ---- music: one looping track hook per level ----

  startMusic(levelId) {
    // browser autoplay policy: before the first user gesture the sound
    // manager is locked — defer, last request wins (Title cold load)
    if (this.game?.sound.locked) {
      this.pendingMusic = levelId
      this.game.sound.once('unlocked', () => {
        if (this.pendingMusic) this.startMusic(this.pendingMusic)
      })
      return
    }
    this.pendingMusic = null
    if (this.currentLevelId === levelId && (this.musicSound || this.stub)) {
      // same track already loaded (retry, or Title -> Shift Select as one
      // continuous menu space): un-duck and un-pause, never restart
      this.restoreMusic()
      this.resumeMusic()
      return
    }
    this.stopMusic()
    this.currentLevelId = levelId
    if (this.game?.cache.audio.exists(`music-${levelId}`)) {
      // already loaded (a retry, or a track heard earlier this session)
      this.musicSound = this.game.sound.add(`music-${levelId}`, { loop: true })
      this.musicSound.play()
      this.refreshVolumes()
      return
    }
    if (this.music[levelId]) {
      this.loadAndPlayMusic(levelId) // silence for a beat, then the track
      return
    }
    this.stub = startMusicStub() // no file for this level: the synth
    this.refreshVolumes()
  }

  // Is there a REAL file for this track? Distinct from startMusic, which
  // falls back to the generated chiptune stub when a track is missing.
  // The results screen wants the file or nothing: a stub loop under a
  // summary would be worse than the duck it replaced.
  hasMusic(name) {
    // A track's EXISTENCE, not its load state — with per-level loading
    // the cache is empty until something asks for it, and the results
    // screen decides whether to swap tracks before anything has.
    return Boolean(this.music[name])
  }

  // pause holds the track's position; resume continues it — never a
  // restart (handoff 2026-08-07-d; the stub holds at bar granularity)
  pauseMusic() {
    if (this.musicPaused) return
    this.musicPaused = true
    this.musicSound?.pause()
    this.stub?.pause?.()
  }

  resumeMusic() {
    if (!this.musicPaused) return
    this.musicPaused = false
    this.musicSound?.resume()
    this.stub?.resume?.()
  }

  duckMusic() {
    this.ducked = true
    this.refreshVolumes()
  }

  restoreMusic() {
    this.ducked = false
    this.refreshVolumes()
  }

  stopMusic() {
    this.musicRequest = null // an in-flight load must not start playing
    this.musicSound?.stop()
    this.musicSound?.destroy()
    this.musicSound = null
    this.stub?.stop()
    this.stub = null
    this.currentLevelId = null
    // stop returns the bus to menu state: a results-screen duck must
    // never leak into the next level's music (found during the -e
    // mid-rush-teardown verification — cross-level starts began ducked)
    this.ducked = false
    this.musicPaused = false
    this.pendingMusic = null
  }

  // cheap; polled from UIOverlay.update so volume sliders apply live
  refreshVolumes() {
    const v =
      clamp01(TUNING.masterVolume * TUNING.musicVolume) *
      (this.ducked ? 0.3 : 1) *
      (this.muted ? 0 : 1) // mute never touches the stored volumes
    if (this.musicSound) this.musicSound.setVolume(v)
    if (this.stub) this.stub.setVolume(v)
  }
}

export const audio = new AudioBus()
