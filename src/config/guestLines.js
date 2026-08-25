// Guest text-bubble copy (BRIEF-02 Chunk 3). Placeholder lines, written
// freely — the human punches these up later. Tone: silly-affectionate
// workplace satire per DESIGN.md §1; the villain is paper, never people.

export const HAPPY_LINES = [
  'That was FAST!',
  '⭐️⭐️⭐️⭐️⭐️',
  'I *am* my claim ticket?! 🤯',
  "Great service! Squirrel, you know it's true!",
  "So fast! Squirrel can't help it!",
  'No paper? No problem. Amazing.',
  "I've been waiting for a squirrel like you!",
  'smoothest check-in of my life fr',
  'Last time I waited 45 minutes. This took 4 seconds.',
  "Chexy is this season's It Squirrel!",
  'Who needs flying cars? This is the future!',
  'no paper lol so random lol',
  'Atta squirrel, Chexy!',
  'I think I have a squirrel crush!',
  'Squirrel Power!',
  'Squirrels 5eva!',
  'Chexy is such a squirrelboss!',
  'Aww yeaaah!',
]

// Contact Card saves — "got the text just in time" (BRIEF-04 §2)
export const CARD_LINES = [
  'Got your text. THANK U!',
  'Saved by the text! You rock, Chexy!',
]

// The Mass Exodus fiction flip (BRIEF-07): the show is over — every
// tag RETURNS an item to a departing guest. Hand-back energy.
export const EXODUS_HAPPY_LINES = [
  'My coat! Goodnight, Chexy! 👋',
  'Handed back before I even stopped walking!',
  'Straight to the car. INCREDIBLE.',
  'The line is MOVING?! Unheard of.',
  'Got my bag, catch you next show!',
  'Fastest exit of my LIFE.',
  'No ticket, no wait, no problem. Bye!!',
  'They should name the exit after this squirrel.',
  'out the door in 4 seconds flat',
  'Chexy said gooooodnight! 🌙',
]

export const EXODUS_UNHAPPY_LINES = [
  'I was ALMOST out the door!!',
  'The paper took my coat INTO the crowd?!',
  'My bag is going the wrong way!!',
  "I can't leave without my stuff!!",
  'one star. the PAPER gets one star.',
  'my ride is HERE and my coat is THERE',
]

// ---------------------------------------------------------------------
// SUBJECT LINES — copy specific to WHAT was checked in or lost.
//
// A table may be keyed by the item's subject (the finest identity it
// has: `luggage-single`, `car-sedan`) or by its category (`coat`,
// `luggage`, `valet`), and it need only carry the outcomes it has
// something to say about.
//
// Specific copy is MIXED WITH the generic pool, never a replacement for
// it (ruling 2026-08-25): a subject or category line is
// TUNING.subjectLineWeight times as likely as a generic one, and both
// grains contribute at once — luggage-group draws on its own jokes, the
// luggage jokes, and the generic jokes together. So one bespoke line can
// never become the only thing a guest says, and the generic pool still
// carries the exodus hand-back swap when it is drawn from.
//
// Placeholder copy, like everything else in this file — the mechanism is
// the deliverable, the jokes are the human's.
export const SUBJECT_LINES = {
  // --- by category
  coat: {
    happy: [
      'Warm already. Thank you!',
      'My coat! And it still smells ok!',
      'Got my coat, thanks! 🎉',
      'chexmaxxing at da club is the new meta',
      'got my coat kthnxbai',
    ],
    unhappy: [
      'That ticket is wearing my coat!',
      'Ugh, I hate paper!',
    ],
  },
  luggage: {
    happy: [
      'You are a machine! In a good way!',
    ],
    unhappy: [
      'Really?! 🤨',
    ],
  },
  valet: {
    happy: [
      'That was my car in SECONDS!',
      'Like a well-oiled machine!',
    ],
    unhappy: [
      'A piece of paper is taking my car for a joy ride!',
    ],
  },
  stroller: {
    happy: ['You caught it! 😅'],
    unhappy: ['THE STROLLER!!'],
  },

  // --- by subject: finer than category, wins over it
  'luggage-single': {
    happy: [
      "One bag, one tap. It's so easy!",
      'My bag!! My itenerary is in there!'
    ],
    unhappy: [
      'It was one bag. ONE BAG! smh',
    ],
  },
  'luggage-pair': {
    happy: [
      'Both of them, together? Amazing!',
    ],
  },
  'luggage-group': {
    happy: [
      'All of it? In one go? Legend.',
      'That is the whole cart. THE WHOLE CART.',
      'Six bags. One ticket. No paper.',
      'Multi-tagging magic!',
    ],
    unhappy: [
      'There goes the entire cart!!',
      'All of it?! 😡',
    ],
  },
  'car-suv': {
    unhappy: [
      'How do you lose an entire SUV??!',
    ],
  },
  'car-lux': {
    happy: [
      'Service as elegant as a fine automobile!'
    ],
  },
}

export const UNHAPPY_LINES = [
  'Hey!! That ticket took my coat!',
  "losing my stuff is nobody's vibe",
  'My stuff!! It went THAT way!',
  'Where is that piece of paper taking my stuff?!',
  'One star. ONE. STAR.',
  'The paper has gone feral again.',
  'my stuuuuuuff',
  'ughghgh',
  'NOT COOL!',
]
