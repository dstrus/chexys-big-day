// Placeholder jsfxr-style SFX, synthesized with the Web Audio API so the
// grey-box ships zero audio assets and zero dependencies.
// playSfx(name, pan) pans -1 (hard left) .. 1 (hard right) so world events
// off to the side of the player read directionally in stereo.

let ctx = null

// Must be called from a user gesture (browsers block audio before one).
export function unlockAudio() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (AudioCtx) ctx = new AudioCtx()
  }
  if (ctx && ctx.state === 'suspended') ctx.resume()
}

function tone({ type = 'square', from = 880, to = from, dur = 0.08, vol = 0.14, delay = 0, pan = 0 }) {
  if (!ctx) return
  const t0 = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(from, t0)
  osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t0 + dur)
  gain.gain.setValueAtTime(vol, t0)
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur)
  osc.connect(gain)
  if (ctx.createStereoPanner && pan !== 0) {
    const panner = ctx.createStereoPanner()
    panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), t0)
    gain.connect(panner)
    panner.connect(ctx.destination)
  } else {
    gain.connect(ctx.destination)
  }
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

const SFX = {
  // punchy tap-tag blip
  tag: (pan) => {
    tone({ from: 700, to: 1400, dur: 0.06, pan })
    tone({ type: 'triangle', from: 1400, to: 2100, dur: 0.05, delay: 0.03, vol: 0.09, pan })
  },
  holdStart: (pan) => tone({ type: 'triangle', from: 220, to: 330, dur: 0.1, vol: 0.08, pan }),
  heavyTag: (pan) => {
    tone({ from: 330, to: 660, dur: 0.09, pan })
    tone({ from: 660, to: 1320, dur: 0.12, delay: 0.06, pan })
  },
  interrupt: (pan) => tone({ type: 'sawtooth', from: 420, to: 120, dur: 0.14, vol: 0.11, pan }),
  steal: (pan) => tone({ type: 'square', from: 240, to: 90, dur: 0.18, vol: 0.11, pan }),
  lose: (pan) => {
    tone({ type: 'square', from: 200, to: 100, dur: 0.15, vol: 0.12, pan })
    tone({ type: 'square', from: 100, to: 60, dur: 0.2, delay: 0.12, vol: 0.12, pan })
  },
  // soft directional cue when a new item drops in
  spawn: (pan) => tone({ type: 'triangle', from: 480, to: 640, dur: 0.09, vol: 0.06, pan }),
  // paper crumple: tagging a carrying ticket stuns it and frees the item
  stun: (pan) => {
    tone({ type: 'sawtooth', from: 900, to: 200, dur: 0.08, vol: 0.12, pan })
    tone({ type: 'square', from: 500, to: 700, dur: 0.07, delay: 0.06, vol: 0.1, pan })
  },
  heatUp: (pan) => {
    tone({ from: 523, dur: 0.06, vol: 0.08, pan })
    tone({ from: 659, dur: 0.06, delay: 0.06, vol: 0.08, pan })
    tone({ from: 784, dur: 0.09, delay: 0.12, vol: 0.08, pan })
  },
  runFail: (pan) => {
    tone({ type: 'sawtooth', from: 300, to: 150, dur: 0.25, vol: 0.11, pan })
    tone({ type: 'sawtooth', from: 150, to: 75, dur: 0.35, delay: 0.2, vol: 0.11, pan })
  },
  runClear: (pan) => {
    tone({ from: 523, dur: 0.08, vol: 0.1, pan })
    tone({ from: 659, dur: 0.08, delay: 0.08, vol: 0.1, pan })
    tone({ from: 784, dur: 0.08, delay: 0.16, vol: 0.1, pan })
    tone({ from: 1047, dur: 0.18, delay: 0.24, vol: 0.1, pan })
  },
}

export function playSfx(name, pan = 0) {
  const fx = SFX[name]
  if (fx) fx(pan)
}
