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
// The frame size IS the collision rect (collision follows art, the car
// precedent): draw to the frame edges. Each PNG may be a horizontal
// STRIP of same-size variants — the spawner picks one at random, the way
// coats do — so one file can carry a suitcase, a duffel and a backpack.
export const LUGGAGE_ART = {
  1: { key: 'luggage-single', w: 16, h: 14 },
  2: { key: 'luggage-pair', w: 24, h: 16 },
  3: { key: 'luggage-group', w: 32, h: 20 },
}

export function luggageArtFor(tier) {
  return LUGGAGE_ART[Math.min(Math.max(tier, 1), 3)]
}
