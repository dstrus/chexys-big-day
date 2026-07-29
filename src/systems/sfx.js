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

export function playSfx(name) {
  // blips land with the tagging deliverable
}
