// Level roster for the select screen (BRIEF-02 Chunk 6). Only the
// Coatroom is unlocked in this phase; later levels show as "?" slots
// until their maps land (DESIGN.md §3).
export const LEVELS = [
  { id: 'coatroom', name: 'THE COATROOM', mapKey: 'coatroom', unlocked: true },
  { id: 'belldesk', name: '???', unlocked: false },
  { id: 'valet', name: '???', unlocked: false },
  { id: 'stroller', name: '???', unlocked: false },
  { id: 'exodus', name: '???', unlocked: false },
]
