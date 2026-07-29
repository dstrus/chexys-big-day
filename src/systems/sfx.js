// Placeholder jsfxr-style SFX, synthesized with the Web Audio API so the
// grey-box ships zero audio assets and zero dependencies.

let ctx = null

// Must be called from a user gesture (browsers block audio before one).
export function unlockAudio() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (AudioCtx) ctx = new AudioCtx()
  }
  if (ctx && ctx.state === 'suspended') ctx.resume()
}

function tone({ type = 'square', from = 880, to = from, dur = 0.08, vol = 0.14, delay = 0 }) {
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
  gain.connect(ctx.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

const SFX = {
  // punchy tap-tag blip
  tag: () => {
    tone({ from: 700, to: 1400, dur: 0.06 })
    tone({ type: 'triangle', from: 1400, to: 2100, dur: 0.05, delay: 0.03, vol: 0.09 })
  },
  holdStart: () => tone({ type: 'triangle', from: 220, to: 330, dur: 0.1, vol: 0.08 }),
  heavyTag: () => {
    tone({ from: 330, to: 660, dur: 0.09 })
    tone({ from: 660, to: 1320, dur: 0.12, delay: 0.06 })
  },
  interrupt: () => tone({ type: 'sawtooth', from: 420, to: 120, dur: 0.14, vol: 0.11 }),
  steal: () => tone({ type: 'square', from: 240, to: 90, dur: 0.18, vol: 0.11 }),
  lose: () => {
    tone({ type: 'square', from: 200, to: 100, dur: 0.15, vol: 0.12 })
    tone({ type: 'square', from: 100, to: 60, dur: 0.2, delay: 0.12, vol: 0.12 })
  },
  heatUp: () => {
    tone({ from: 523, dur: 0.06, vol: 0.08 })
    tone({ from: 659, dur: 0.06, delay: 0.06, vol: 0.08 })
    tone({ from: 784, dur: 0.09, delay: 0.12, vol: 0.08 })
  },
  runFail: () => {
    tone({ type: 'sawtooth', from: 300, to: 150, dur: 0.25, vol: 0.11 })
    tone({ type: 'sawtooth', from: 150, to: 75, dur: 0.35, delay: 0.2, vol: 0.11 })
  },
  runClear: () => {
    tone({ from: 523, dur: 0.08, vol: 0.1 })
    tone({ from: 659, dur: 0.08, delay: 0.08, vol: 0.1 })
    tone({ from: 784, dur: 0.08, delay: 0.16, vol: 0.1 })
    tone({ from: 1047, dur: 0.18, delay: 0.24, vol: 0.1 })
  },
}

export function playSfx(name) {
  const fx = SFX[name]
  if (fx) fx()
}
