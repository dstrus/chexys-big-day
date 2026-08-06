# BRIEF-04 — Collectibles System (Phase 3, code track)

**For:** Claude Code (one session)
**Prerequisite:** Gate 2 passed (satisfied, -c 2026-08-03). Runs
against the Coatroom first; must work in any level (Bell Desk
inherits automatically via wave/map data).
**Read first:** DESIGN.md §4, §2.5 (multiplier), §2.4;
BRIEF-ART-03 §3 (NFC tag icon); DECISIONS.md.

**Scope:** the three DESIGN.md §4 collectibles, level-agnostic.
Placeholder art acceptable (icon art is queued on the art
track); systems, spawning, pickup, scoring, and HUD are the
deliverable.

## 1. NFC Tags (the coin)

- **Sources:** (a) placed via a new Tiled object layer
  `collectibles` (point objects, type "nfcTag"); (b) dropped
  by rescue-stunned enemies (1 tag per stun, from the enemy's
  position, small pop arc).
- **Pickup:** magnet radius (tagMagnetRadius, default 20px
  from body center) — tags drift toward Chexy within radius,
  collect on contact. No action button; collection is passive.
- **Value:** +score per tag (tagScoreValue, default 50),
  multiplied by the current adaptive multiplier. Tag count
  shown on HUD (small counter, NFC icon) and on results.
- **Art hook:** 12×12, 2-frame glint per BRIEF-ART-03 §3;
  placeholder = small orange diamond until the icon lands.

## 2. Contact Card (renamed from "phone number pickup" —
   human ruling 2026-08-03; a guest's contact info, vCard icon)

- **Effect:** on pickup, instantly auto-returns ONE item —
  the guest "got the text." Target: the **MOST-ENDANGERED
  item** (human ruling 2026-08-03), resolved by priority
  chain: (1) an item currently carried toward an exit,
  (2) an item locked by a loitering/approaching enemy —
  nearest-to-dive first, (3) the item longest at rest.
  Ties break toward the item farthest from the player (the
  card saves what Chexy can't reach). Thematically: "we
  texted the guest just in time."
  The returned item scores normally but awards NO streak
  progress (parallel to rescue neutrality, §2 item 4b — saves
  aren't clean play).
- **Spawning:** rare; wave-file entries only (no Tiled
  placement) — the wave designer places 0–2 per rush,
  typically in the back half. Despawns after cardLingerMs
  (default 8000) with a blink warning in the last 2000.
- **Feedback:** on use, the rescued item flies to the return
  zone with a Success Green trail; the owning guest fires a
  happy bubble variant ("Got your text — lifesaver!"-tone,
  add 2 variants to guestLines.js).
- **HUD:** none (instant use, no inventory).
- **Art hook:** 12×12 vCard icon (white card, person-dot +
  lines, orange corner); placeholder = white rect.

## 3. Insights Report (renamed from "analytics star" — human
   ruling 2026-08-03; the multiplier boost)

- **Effect:** for insightDurationMs (default 10000), score
  gains ×insightFactor (default 2.0), MULTIPLICATIVE with the
  adaptive multiplier — displayed as its own brief HUD chip
  next to the adaptive multiplier so the adaptive state is
  never masked (per design chat: the report must not hide the
  §2.5 HUD legibility rule).
- **Spawning:** wave-file entries, 0–1 per rush; high/awkward
  placements (reward routing, not luck).
- **Feedback:** pickup fanfare SFX event ("insightPickup" on
  the AudioBus), subtle screen-edge shimmer during effect,
  chip countdown ring for the final 3s.
- The report does not pause, extend, or interact with adaptive
  band movement — the bands move on their own rules.
- **Art hook:** 12×12 DIGITAL screen/tablet icon with a rising
  chart line — deliberately NOT a paper document (paper is
  enemy-owned per the actors palette law; the Insights Report
  is a dashboard, and even the power-ups are paperless).
  Screen glow teal/green chart on dark chip, Warning Yellow
  #FFE123 accent border for pickup pop; placeholder = yellow
  diamond.

## 4. Shared plumbing

- One collectible registry (type → spawn/pickup/effect/score
  hooks) so future pickups (v2 list) are data + one handler.
- All values above in tuning.js with debug-panel sliders;
  collectible spawns visible in the debug overlay.
- Results screen: tags collected already has a line (per
  BRIEF-02 Chunk 6); add cards used + insights caught as
  minor lines only when nonzero.
- AudioBus events: tagPickup, cardPickup, cardReturn,
  insightPickup, insightEnd — placeholder synths fine.

## 5. Amendments to apply this session

1. DESIGN.md §4: rename "Phone number pickup" → "Contact
   Card (vCard) — a guest's contact info; auto-returns the
   most-endangered item (priority chain per BRIEF-04 §2,
   human ruling 2026-08-03)"; rename "Analytics star" →
   "Insights Report (digital screen icon — never paper; boosts
   score ×2 for 10s)"; note streak-neutrality; note report
   multiplicative-with-adaptive + HUD non-masking rule.
2. assets/maps/README.md: document the `collectibles` object
   layer and wave-file entry shapes.
3. Log in DECISIONS.md per protocol, citing this brief and
   the ruling ID once filled.

## Acceptance

- Coatroom rush with all three collectible types live (test
  wave file), values tunable from the panel, 60fps held.
- Contact card demonstrably returns the most-endangered item
  in a staged scenario: three items in distinct danger states
  (one being carried, one loiter-locked, one merely aging) —
  the carried one must be saved.
- Insight chip never obscures the adaptive multiplier readout.
- Rescue-stun drops verified alongside the -b poof (drop and
  particles coexist).
