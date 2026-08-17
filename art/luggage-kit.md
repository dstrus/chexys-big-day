# Luggage & bags — item drawing kit

The Bell Desk checks in **luggage and bags exclusively** (ruling
2026-08-17); its wave file has always scheduled only `luggage`, and the
map now declares that vocabulary bindingly. Luggage also appears in the
finale (exodus: 8 entries; the boss act: 15). It never appears in the
Coatroom or the Museum.

Item rules live in BRIEF-ART-03 §1; this kit is the measured, Bell
Desk–specific version of them.

## 0. The tiers are GROUP SIZES, not weights

Human ruling 2026-08-17, and the reason this kit exists: **multi-tagging
is a real Chexology process and it takes longer than checking a single
item.** So the hold isn't a heavy object — it's *more objects on one
ticket*. Draw the tiers as counts:

| Tier | What it is | Tag verb | Measured timing |
|---|---|---|---|
| 1 | **one bag** | tap | instant (2-frame tap) |
| 2 | **a pair** — two pieces | short hold | 180ms (`holdTagMs` 300 × `holdTier2Factor` 0.6) |
| 3 | **a trolley load** — three or four pieces | charged hold | 300ms (`holdTagMs`), radial meter on Chexy, interruptible |

Consequences for the drawing:

- A group sits on the floor, so tier 2 and 3 grow **wider, not taller**.
  A single tall monolith was the old "heavy" reading and it's wrong now.
- The count should read at a squint, before any detail does: one shape,
  two shapes, a cluster. That silhouette IS the difficulty tell — the
  player decides tap-or-hold from it while running.
- Variety inside a group is free flavour: a roller plus a duffel plus a
  backpack reads as a family's check-in. Keep one piece dominant so the
  cluster still has a clear silhouette.
- DESIGN §3.2 still calls these "weight tiers" and the code still says
  `weightTier` / `tier`. Those names are staying — the mechanic didn't
  change, only what it depicts.

## 1. What to draw, and at what size

Three files. Each may be a **horizontal strip of same-size variants** —
the spawner picks one at random per item, exactly as coats do — so one
file can carry a suitcase, a duffel and a backpack.

| Source | Export | Frame size | Contents |
|---|---|---|---|
| `art/aseprite/luggage-single.aseprite` | `assets/sprites/luggage-single.png` | **16 × 14** | one bag, N variants |
| `art/aseprite/luggage-pair.aseprite` | `assets/sprites/luggage-pair.png` | **24 × 16** | two pieces, N variants |
| `art/aseprite/luggage-group.aseprite` | `assets/sprites/luggage-group.png` | **32 × 20** | three or four pieces, N variants |

Export is wired: `./scripts/export-sprites.sh` picks each up the moment
its source exists and writes a tight horizontal strip (no JSON, no
extrude — the loader slices on a fixed grid). Nothing else is needed;
the game prefers drawn bags over the interim rects automatically, and
deleting a PNG reverts that tier to its rect.

**The frame IS the collision rect.** Same rule as the garage cars
(collision follows art): draw to the frame edges, don't pad with
transparency, and put the bottom row of ink where the bags touch the
floor. `src/config/itemArt.js` holds these three sizes; if a frame size
needs to change, say so and I'll change the table and re-run the
fairness instruments — item footprints feed spawn spacing and field
density, so a size change isn't purely cosmetic.

For reference, the interim rects being replaced are 14×14 / 20×22 /
26×30 — note the new tier-2 and tier-3 boxes are **wider and shorter**,
which is the group reading.

## 2. The hard constraint: one drawing, two value fields

Canon (handoff 2026-08-14-b): **items are one drawing across all levels.
No per-level item variants, ever.** The skin system dresses
environments only. So these bags must read in both places they appear:

- **The Bell Desk** — dark field: crimson lacquer walls, leopard carpet.
- **The finale** — still on placeholder tiles, and its environment may
  land bright (its scene descends from the Museum, whose readability law
  is *inverted*: pale field, saturated-and-darker actors).

Practically: give each bag **internal contrast** — a mid-value body with
both a darker shadow plane and a lighter top plane — rather than relying
on overall brightness against a dark background. A bag that is only
"bright" disappears on marble; a bag that is only "dark" disappears on
lacquer. Note that no item in the game currently carries an outline
(coats have none), so don't add one to bags alone; the value structure
does the work.

## 3. Palette

Bodies come from `art/palettes/actors.gpl` — it already ships body/shade
pairs. **Recommended bodies:** Coat Cobalt `#2E6FD0`/`#1E4C96`, Coat
Olive `#7A8C2E`/`#55621C`, Tag Plum `#774068`, Tag Teal `#006483`, Tag
Gray `#59595B`. Leather tan and brass are for **straps, handles and trim
only**.

**Do not use, and why:**

| Avoid | Hex | Reason |
|---|---|---|
| Chexology / Tag Orange | `#FE701E` | Chexy's own body colour |
| Tag Red / Alert Red | `#E91717` / `#EA5151` | semantic — lost item, urgency arrows |
| Paper manila | `#F2ECD8` | the ticket enemies are made of it |
| Carpet tans | `#8E6432` `#A87E44` | the Bell Desk floor — bags would sink into it |
| Lacquer crimsons | `#C22F3A` `#732032` `#581826` | the Bell Desk walls, same problem |

The **tag chip carries the category**, so bag colours are free: an 8×8
chip tinted luggage teal `#006483` is composited at
`+width/4, −height/6` from the item's centre once tagged. Keep that
upper-right area from being the busiest part of the drawing — a
riot of buckles there will fight the chip.

## 4. Order

1. `luggage-single` — tier 1 is most of what's on screen.
2. `luggage-group` — tier 3 next, not tier 2: it's the loudest
   silhouette and it proves the group reading works before you commit
   the middle case.
3. `luggage-pair` — the interpolation, once the two ends exist.
4. More variants per strip, whenever. Optional: the same PLTE
   palette-swap trick the cars use (`scripts/palette-variants.mjs`) can
   multiply one drawing into six hues without touching pixels, if you'd
   rather draw one great bag than three good ones.
