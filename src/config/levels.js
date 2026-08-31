import { levelCleared } from '../systems/progress.js'

// Level roster for the select screen (BRIEF-02 Chunk 6). Later levels
// show as "?" slots until their maps land (DESIGN.md §3). Unlock state
// is progression-driven — resolve it via isLevelUnlocked, not the
// static field.
//
// The first THREE shifts are open from the start (human ruling
// 2026-08-31, superseding BRIEF-03's "Bell Desk opens after a Coatroom
// clear"). The finished levels are the ones anyone should be able to
// reach; gating them behind clears mostly punished a returning player
// with cleared localStorage. Levels 4-5 stay gated — they are still
// unbuilt.
//
// Consequence handled in LevelScene: the Garage can now be entered
// without the Bell Desk's dash-unlock beat, and its dash gaps are
// load-bearing, so a level that DECLARES dashAllowed grants dash on
// entry (DESIGN §3.2 — a level's ability set is fixed regardless of
// the route taken to it).
export const LEVELS = [
  { id: 'coatroom', name: 'THE COATROOM', mapKey: 'coatroom', unlocked: true },
  { id: 'belldesk', name: 'THE BELL DESK', mapKey: 'belldesk', unlocked: true },
  // the garage runs its own scene (auto-scroll core, BRIEF-05)
  { id: 'garage', name: 'THE GARAGE', mapKey: 'garage', sceneKey: 'Garage', unlocked: true },
  // the museum runs its own scene (rolling items, BRIEF-06)
  { id: 'museum', name: 'THE MUSEUM', mapKey: 'museum', sceneKey: 'Museum', requiresClear: 'garage' },
  // the finale runs its own scene (medley + boss, BRIEF-07)
  { id: 'exodus', name: 'THE MASS EXODUS', mapKey: 'exodus', sceneKey: 'Exodus', requiresClear: 'museum' },
]

export function isLevelUnlocked(lvl) {
  if (lvl.requiresClear) return levelCleared(lvl.requiresClear)
  return lvl.unlocked === true
}
