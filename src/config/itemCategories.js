// Item category colors = the REAL ChexApp tag colors from the brand
// guidelines (art/palette-brand.md §"Chexology Tag Colors") — a deep-cut
// easter egg the team will recognize. Category keys are referenced by
// wave files (assets/waves/*.json).
export const ITEM_CATEGORIES = {
  coat: 0xfe701e, // orange
  luggage: 0x006483, // teal
  valet: 0xe91717, // red
  stroller: 0xffc0cb, // pink
  rental: 0x68a11c, // green
  // museum items (BRIEF-06) — NOT a ChexApp tag color; picked clear of
  // enemy paper tones and Chexy orange (cups cut 2026-08-11; the
  // museum's third class re-uses coats)
  backpack: 0x8a5a2b, // kid-pack brown
}

export function categoryColor(category) {
  return ITEM_CATEGORIES[category] ?? 0xffffff
}
