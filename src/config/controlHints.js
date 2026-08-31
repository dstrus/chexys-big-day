import { helpDevice } from '../systems/deviceInput.js'

// Device-appropriate help copy (human 2026-08-31). Anywhere the game
// names a control, it names the one the player is actually holding.
//
// Pass an object keyed by device; keyboard is the fallback, both because
// it is the original scheme and because helpDevice() only reports pad or
// touch once one has genuinely been used.
//
//   hint({ keyboard: 'TAP Z', pad: 'TAP (X)', touch: 'TAP the TAG button' })
//
// A plain string passes straight through, so device-neutral copy needs
// no ceremony — most briefing rows say nothing about buttons at all.
export function hint(copy) {
  if (typeof copy === 'string') return copy
  if (!copy) return ''
  return copy[helpDevice()] ?? copy.keyboard ?? ''
}
