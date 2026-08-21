// Luggage art table (art/luggage-kit.md). The Bell Desk checks in
// LUGGAGE AND BAGS exclusively, and its hold tiers are GROUPS, not
// heavier single pieces — multi-tagging is the real Chexology process
// the hold represents (human ruling 2026-08-17). So the tiers read as
// how MANY bags share one ticket:
//
//   tier 1  one bag        tap
//   tier 2  a pair         short hold (holdTagMs × holdTier2Factor)
//   tier 3  a trolley load charged hold
//
// SIZES (handoff 2026-08-15-a): the first pass at 16×14 was too small
// for the class fiction. Canvas targets are ~20×18 / 24×22 / 30×24, the
// artist's final call within ±2px per drawing.
//
// Collision follows art (the -12-a car ruling, extended to items) with
// the car pattern's guard rails: the body is INSET 2px per side from the
// ink and stays centered, so a couple of pixels of silhouette overhang
// are free and no bag blocks more than it looks like it should. Carry
// visuals are unaffected — the thief positions the SPRITE, not the body.
// Tag feel is unchanged by construction: auto-target measures from body
// CENTER, which the inset does not move, and targetRadius is untouched.
//
// Each PNG may be a horizontal STRIP of same-size variants — the spawner
// picks one at random, the way coats do — so one file can carry a
// suitcase, a duffel and a backpack.
export const BAG_BODY_INSET = 2 // per side, from the ink

// `sitFlush` drops the BOTTOM inset only: the body's floor edge lines up
// with the drawn floor edge, so the bag rests ON the ground instead of
// 2px into it (human note 2026-08-20). Sides and top keep their inset,
// which preserves the -15-a top-of-body alignment for carry visuals.
// Per-tier because tiers 1 and 2 are drawn for the sink and are settled.
export const LUGGAGE_ART = {
  1: { key: 'luggage-single', w: 20, h: 18 },
  2: { key: 'luggage-pair', w: 24, h: 22 },
  3: { key: 'luggage-group', w: 30, h: 24, sitFlush: true },
}

export function luggageArtFor(tier) {
  return LUGGAGE_ART[Math.min(Math.max(tier, 1), 3)]
}
