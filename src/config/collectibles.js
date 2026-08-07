import { TUNING } from './tuning.js'

// ONE collectible registry (BRIEF-04 §4): a future pickup is a data
// entry here plus its effect hook — spawning (map layer / wave entry /
// enemy drop), magnetism, linger, pickup plumbing, and the debug
// overlay are shared in LevelScene. Placeholder textures generate in
// Boot; real 12×12 icons drop in per BRIEF-ART-03 §3 under the
// `texture` key with the usual zero-code-change contract.
export const COLLECTIBLES = {
  // the coin (BRIEF-04 §1): map-placed and dropped by rescue stuns
  nfcTag: {
    texture: 'nfc-tag',
    placeholder: 'collectible-nfcTag',
    magnet: true, // drifts to Chexy inside tagMagnetRadius
    sfx: 'tagPickup',
    onPickup(scene) {
      scene.tagsCollected += 1
      scene.addScore(TUNING.tagScoreValue)
      scene.emitHud()
    },
  },
  // a guest's contact info (BRIEF-04 §2): auto-returns the
  // MOST-ENDANGERED item — "we texted the guest just in time"
  contactCard: {
    texture: 'contact-card',
    placeholder: 'collectible-contactCard',
    lingerMs: () => TUNING.cardLingerMs, // pickups may time out; ITEMS never do (-05-a)
    sfx: 'cardPickup',
    onPickup(scene) {
      scene.contactCardSave()
    },
  },
  // the multiplier boost (BRIEF-04 §3): a dashboard, never paper
  insightReport: {
    texture: 'insight-report',
    placeholder: 'collectible-insightReport',
    sfx: 'insightPickup',
    onPickup(scene) {
      scene.startInsight()
    },
  },
}
