import { levelCleared } from '../systems/progress.js'

// Level roster for the select screen (BRIEF-02 Chunk 6). Later levels
// show as "?" slots until their maps land (DESIGN.md §3). Unlock state
// is progression-driven — resolve it via isLevelUnlocked, not the
// static field (BRIEF-03: Bell Desk opens after a Coatroom clear).
export const LEVELS = [
  { id: 'coatroom', name: 'THE COATROOM', mapKey: 'coatroom', unlocked: true },
  { id: 'belldesk', name: 'THE BELL DESK', mapKey: 'belldesk', requiresClear: 'coatroom' },
  // the garage runs its own scene (auto-scroll core, BRIEF-05)
  { id: 'garage', name: 'THE GARAGE', mapKey: 'garage', sceneKey: 'Garage', requiresClear: 'belldesk' },
  // the museum runs its own scene (rolling items, BRIEF-06)
  { id: 'museum', name: 'THE STROLLER VALET', mapKey: 'museum', sceneKey: 'Museum', requiresClear: 'garage' },
  { id: 'exodus', name: '???', unlocked: false },
]

export function isLevelUnlocked(lvl) {
  if (lvl.requiresClear) return levelCleared(lvl.requiresClear)
  return lvl.unlocked === true
}
