// Guest text-bubble copy (BRIEF-02 Chunk 3). Placeholder lines, written
// freely — the human punches these up later. Tone: silly-affectionate
// workplace satire per DESIGN.md §1; the villain is paper, never people.

export const HAPPY_LINES = [
  'Got my coat, thanks! 🎉',
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
  'chexmaxxing at da club is the new meta',
  'no paper lol so random lol',
  'got my coat kthnxbai',
  'Atta squirrel, Chexy!',
  'I think I have a squirrel crush!',
  'Squirrel Power!',
  'Squirrels 5eva!',
  'Chexy is such a squirrelboss!',
]

// Contact Card saves — "got the text just in time" (BRIEF-04 §2)
export const CARD_LINES = [
  'Got your text — lifesaver!',
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
// Keys are tried MOST SPECIFIC FIRST, so a table may be keyed either by
// the item's subject (the finest identity it has: `luggage-single`,
// `car-sedan`) or by its category (`coat`, `luggage`, `valet`). A key
// need only carry the outcomes it has something to say about; anything
// missing falls through to the generic pools above, including the
// exodus hand-back swap.
//
// Placeholder copy, like everything else in this file — the mechanism is
// the deliverable, the jokes are the human's.
export const SUBJECT_LINES = {
  // --- by category
  coat: {
    happy: ['Warm already. Thank you!', 'My coat! And it still smells fine!'],
    unhappy: ['That ticket is WEARING my coat!'],
  },
  luggage: {
    happy: ['Bags away! You are a machine.', 'All of it? In one go? Legend.'],
    unhappy: ['My bags!! Those have my whole trip in them!'],
  },
  valet: {
    happy: ['That was my car in SECONDS.'],
    unhappy: ['A piece of paper is driving off with my car.'],
  },
  stroller: {
    happy: ['You caught it! Bless you.'],
    unhappy: ['THE STROLLER IS ROLLING AWAY'],
  },
  backpack: {
    happy: ['His backpack! He would have cried.'],
  },

  // --- by subject: finer than category, wins over it
  'luggage-single': {
    happy: ['One bag, one tap. Beautiful.'],
  },
  'luggage-pair': {
    happy: ['Both of them! Together!'],
  },
  'luggage-group': {
    happy: ['That is the whole cart. THE WHOLE CART.', 'Six bags. One ticket. No paper.'],
    unhappy: ['There goes the entire cart!!'],
  },
  'car-lux': {
    happy: ['She rides. Thank you, Chexy.'],
  },
}

export const UNHAPPY_LINES = [
  'Hey!! That ticket took my coat!',
  "losing my stuff is nobody's vibe",
  'My stuff!! It went THAT way!',
  'Where is that piece of paper taking my bag?!',
  'One star. ONE. STAR.',
  'The paper has gone feral again.',
  'my stuuuuuuff',
  'ughghgh',
  
]
