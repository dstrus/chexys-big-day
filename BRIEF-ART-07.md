# BRIEF-ART-07 — The Bell Desk Environment

**For:** Art track. (Numbering note: ART-05 remains reserved
for the Museum, still owed by the design chat.)
**Read first:** BRIEF-ART-02 §0 (readability law — applies
verbatim), the skin convention (-12-a: maps speak role gids,
skins translate; this sheet ships as a skin like the garage's).
**Mood (BRIEF-03):** boutique hotel lobby, evening check-in
surge — warm lamps against cool dusk. Anchor: Accent Steel
Blue #2D5378. The Coatroom was velvet-dark, the garage
hard-lit gray; the Bell Desk is COOL DUSK WITH WARM ISLANDS —
the most hospitable palette in the game, befitting the only
level set somewhere people want to be.

## 0. Step zero, as ever

Request the Bell Desk tile-role inventory from Claude Code
(roles, gids, placements, double-faced mezzanine strips,
unused slots) — the map is 4 screens with desk run, cart
platforms, two mezzanine tiers, and the bell-cart return
zone. Draw to the inventory, not the memory.

## 1. Tileset (belldesk skin)

- **Lobby floor:** hotel carpet, 4–6 tile sequence period
  (the SotN lesson) — deep muted burgundy field with a
  quiet geometric figure; NOT alert-red (#EA5151 stays
  semantic). Two breakers: a brass floor medallion, a worn
  patch. Marble border tiles where carpet meets the desk
  run.
- **Mezzanine strips:** double-faced (top = carpeted walk
  with the standable light edge; underside = coffered soffit
  with a brass drip line). The garage deck grammar, dressed
  formal.
- **The front desk hero block** (counter precedent): 2-high,
  4–6 wide — wood paneling, marble top with the standable
  edge, a service bell glint (2px gold), room-key cubbies
  suggested on the face. The Coatroom counter was the set
  piece; this desk outranks it — it is the level's name.
- **Cart platforms:** brass luggage-cart tiles (frame + red
  velvet deck) where the blockout uses them as surfaces.
- **Dressing:** column bases, potted palm pair (muted
  green — the only green on the sheet), wall sconce flicker
  pair (warm), elevator door suggestion with a dim gold
  indicator.

## 2. Parallax (four layers, Coatroom depth grammar)

| Layer | Content | Size | Palette center |
|---|---|---|---|
| P4 | tall lobby windows, DUSK CITY beyond — steel-blue sky graded to a rose horizon line, building silhouettes; interior wall between windows | 480×270 static | steel ramp + dusk rose (sparse) |
| P3 | the chandelier tier — one grand chandelier (the P4-glow-overlay trick: crystals as a separate warm overlay PNG for the pulse), coffered ceiling line, mezzanine arch tops | 960×270 | steel darks, brass glints |
| P2 | column rank + palm silhouettes + the revolving-door glow at one end (the hero passage — appears once per ~1.5 screens) | 1280×270 | steel mids, muted palm, one warm door-glow |
| P1 | near dressing: luggage cart silhouettes, brass stanchion line, a "BELL DESK →" glow-smear shape | 1600×270 | fullest range, ceilinged below play-plane brightness |

Seam and value rules per ART-02 §2 verbatim. The dusk-rose
horizon in P4 is the one warm passage allowed in the far
field — it reads as sunset, not as competition.

## 3. Order & effort

1. Inventory + palette (free — belldesk-env.gpl ships with
   this brief).
2. Floor sequence + mezzanine strips + desk hero block
   (1–1.5 sessions) → skin drop transforms the level.
3. P4 + P3 (1 session — sky, silhouettes, chandelier).
4. P2 + P1 (1 session).
5. Sconce flicker pair + chandelier pulse overlay
   (half session, deferrable).
Total ~3.5–4 sessions. After step 2 the Bell Desk stops
wearing the Coatroom's placeholder bones.

## Appendix — concept prompts (fresh generations, wide/
panoramic, no people, no readable text)

P4: "Tall arched windows of a grand hotel lobby at dusk —
steel blue evening sky fading to a soft rose horizon, dark
city building silhouettes outside, elegant dark interior
wall between the windows, moody and serene, flat stylized
color planes, wide panoramic composition"

P3: "The upper reaches of a grand hotel lobby — one ornate
chandelier glowing warmly, a coffered ceiling in cool dusk
shadow, the tops of mezzanine arches, deep steel blue with
small warm gold lights, flat stylized shapes, wide panoramic
composition"

P2: "Grand hotel lobby architecture in evening shadow — a
rank of columns, potted palm silhouettes, a warm glowing
revolving door entrance at one side, cool steel blue with
one warm glow, flat stylized color planes, wide panoramic
composition"

P1: "Close dressing of a hotel bell desk area at dusk —
brass luggage carts in silhouette, a line of brass
stanchions with velvet rope, one warm glowing sign shape,
rich cool blues with small brass accents, flat stylized
color planes, wide panoramic composition"
