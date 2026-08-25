// Level briefings — one screen, shown once, for levels that introduce a
// mechanic (DESIGN.md §3 "New mechanic"). Not a cutscene and not a
// dialogue system (both remain out of scope per CLAUDE.md): a static
// panel over a paused level, dismissed with any key, in the same family
// as the one-time tutorial bubbles.
//
// Rows carry SPRITES so a rule can be shown rather than described — the
// three luggage silhouettes next to "tap" and "hold" teach the weight
// tiers faster than a sentence about them. Sprite keys are looked up at
// display time and skipped when absent, so a briefing never blocks on
// art that has not landed (the same drop-in contract as everything else).
//
// Keys, for reference when writing copy: arrows or A/D run, Up or Space
// jumps, Z or J tags, X or K dashes (double-tapping a direction dashes
// too). Esc or P pauses.

export const BRIEFINGS = {
  // Level 1 has no NEW mechanic — it is the tutorial, so its briefing is
  // the controls themselves.
  coatroom: {
    title: 'SHIFT ONE — THE COATROOM',
    subtitle: 'Guests are arriving. Check their coats in before the rush ends.',
    rows: [
      {
        sprites: [{ key: ['chexy-idle', 'chexy-atlas'] }],
        text: 'ARROWS run · UP or SPACE jumps',
      },
      {
        sprites: [{ key: 'coats', frame: 0 }, { key: 'coats', frame: 1 }],
        text: 'Z or J tags the nearest item — that checks it in. No paper needed.',
      },
      {
        sprites: [{ key: ['enemy-atlas', 'enemy-stub'] }],
        text: 'Paper tickets steal items. Tag one to stun it and it drops what it took.',
      },
    ],
  },

  // §3.2 — weight tiers + the dash unlock
  belldesk: {
    title: 'SHIFT TWO — THE BELL DESK',
    subtitle: 'Luggage, not coats. Some tickets cover more than one bag.',
    rows: [
      {
        sprites: [{ key: 'luggage-single' }],
        text: 'One bag — TAP Z to check it in.',
      },
      {
        sprites: [{ key: 'luggage-pair' }, { key: 'luggage-group' }],
        text: 'A pair or a whole cart — HOLD Z. Multi-tagging takes longer.',
      },
      {
        sprites: [{ key: ['enemy-atlas', 'enemy-stub'] }],
        text: 'You stand still while holding, and a ticket can interrupt you. Clear the room first.',
      },
    ],
  },

  // §3.3 — the request queue (plus the auto-scroll and dash-through it
  // arrives with)
  garage: {
    title: 'SHIFT THREE — THE GARAGE',
    subtitle: 'Night shift. The floor moves whether you do or not.',
    rows: [
      {
        sprites: [
          { key: 'request-chips', frame: 0, tint: 0x2e6fd0 }, // Coat Cobalt
          { key: 'request-chips', frame: 2, tint: 0xc22f3a }, // Coat Crimson
        ],
        text: 'Guests text for their cars. Their chips queue under the timer.',
      },
      {
        sprites: [{ key: 'car-sedan' }],
        text: 'A car is taggable only while its chip is up. Tag it and it drives itself out.',
      },
      {
        sprites: [{ key: ['chexy-idle', 'chexy-atlas'] }],
        text: 'DASH (X, K, or double-tap a direction) goes straight THROUGH a car.',
      },
    ],
  },

  // §3.4 — rolling items
  museum: {
    title: 'SHIFT FOUR — THE MUSEUM',
    subtitle: "Family day. Nothing here stays where you left it.",
    rows: [
      {
        // interim rects ship white and are category-tinted in play; the
        // tints here match what the player actually sees
        sprites: [{ key: 'item-stroller', tint: 0xffc0cb }], // Tag Pink
        text: 'Strollers roll on their own. A tag brakes one where it stands.',
      },
      {
        sprites: [{ key: 'item-backpack', tint: 0x8a5a2b }], // kid-pack brown
        text: 'Backpacks bounce in, then settle. Let them land.',
      },
      {
        sprites: [{ key: ['nfc-tag', 'collectible-nfcTag'] }],
        text: 'Loose NFC tags are worth points. Grab them on the way past.',
      },
    ],
  },

  // §3.5 — the fiction flips: every tag HANDS BACK
  exodus: {
    title: 'THE MASS EXODUS',
    subtitle: 'The show is over. Everyone wants their things at once.',
    rows: [
      {
        sprites: [{ key: 'luggage-group' }, { key: 'coats', frame: 0 }],
        text: 'Tagging now RETURNS an item to a departing guest. Same verb, opposite direction.',
      },
      {
        sprites: [{ key: ['enemy-atlas', 'enemy-stub'] }],
        text: 'The paper is everywhere, and it is not finished with you.',
      },
    ],
  },
}

export function briefingFor(levelId) {
  return BRIEFINGS[levelId] ?? null
}
