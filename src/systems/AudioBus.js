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
const MUSIC_URLS = import.meta.glob('../../assets/audio/music/*', {
  eager: true,
  query: '?url',
  import: 'default',
})

const AUDIO_EXT = /\.(wav|mp3|ogg)$/
// finer-grained game events fall back to a canonical file name
// (BRIEF-02's event list) when no exact-name file exists
const CANONICAL = {
  heavyTag: 'holdComplete',
  interrupt: 'holdInterrupt',
  lose: 'itemLost',
  heatUp: 'multiplierUp',
  runClear: 'rushEnd',
  runFail: 'rushEnd',
}

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
    map[base.replace(AUDIO_EXT, '')] = url
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
  }

  // Boot.preload: queue every discovered audio file
  preload(scene) {
    for (const [name, url] of Object.entries(this.files)) scene.load.audio(`audio-${name}`, url)
    for (const [name, url] of Object.entries(this.music)) scene.load.audio(`music-${name}`, url)
  }

  init(game) {
    this.game = game
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

  play(name, pan = 0) {
    const fileKey = this.files[name] ? name : this.files[CANONICAL[name]] ? CANONICAL[name] : null
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
    if (this.music[levelId] && this.game?.cache.audio.exists(`music-${levelId}`)) {
      this.musicSound = this.game.sound.add(`music-${levelId}`, { loop: true })
      this.musicSound.play()
    } else {
      this.stub = startMusicStub()
    }
    this.refreshVolumes()
  }

  // Is there a REAL file for this track? Distinct from startMusic, which
  // falls back to the generated chiptune stub when a track is missing.
  // The results screen wants the file or nothing: a stub loop under a
  // summary would be worse than the duck it replaced.
  hasMusic(name) {
    return Boolean(this.music[name] && this.game?.cache.audio.exists(`music-${name}`))
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
