# BRIEF-ART-07 — The Bell Desk Environment

**For:** Art track. (Numbering note: ART-05 remains reserved
for the Museum, still owed by the design chat.)
**Read first:** BRIEF-ART-02 §0 (readability law — applies
verbatim), the skin convention (-12-a: maps speak role gids,
skins translate; this sheet ships as a skin like the garage's).
**Mood (BRIEF-03, amended by handoff 2026-08-14-a — the
FAENA DIRECTION):** grand hotel lobby, evening check-in
surge. Deep crimson lacquered walls in a brass seam grid;
a gold-leaf stepped COVE CROWN as the ceiling identity
(skylight vocabulary is demoted to chandelier backdrop
only); leopard carpet field — a quiet two-value mottle with
rosettes — bordered in wood; a marble-topped
circle-pattern hero desk with a service bell and malachite
lamps; brass luggage carts; palms. Anchor: Lacquer Face
#732032 with Gold Leaf Bright #C89A32. The Coatroom was
velvet-dark, the garage hard-lit gray; the Bell Desk is
CRIMSON AND GOLD.

## Palette (v2 — Faena direction)

Ships as `art/palettes/belldesk-env.gpl`. Hexes below are
that file, verbatim.

| Family | Swatches |
|---|---|
| Lacquer (walls) | Void `#2A0A12`, Deep `#40101C`, Dark `#581826`, Face `#732032`, Sheen `#8E2A3C` (sparse — panel highlights) |
| Brass (seam grid, fittings) | Shadow `#4A3010`, Mid `#7A5518`, Bright `#B08428`, Glint `#E0B858` (sparse) |
| Gold leaf (cove crown) | Shadow `#6E4A14`, Mid `#9C6E1E`, Bright `#C89A32`, Mottle Light `#EFC963` |
| Cove glow | Strip `#FFE9A8`, Core `#FFF7DC` (sparse px) |
| Carpet (leopard) | Base Dark `#6E4A26`, Base Tan `#8E6432`, Mottle Light `#A87E44`, Rosette Dark `#38200F`, Border Red `#7A1622` (deep, non-semantic) |
| Wood (border, panelling) | Dark `#2E1A10`, Mid `#4A2E1A`, Light `#6B4426` |
| Marble (desk top / standable) | Light `#D8D2C6`, Shade `#A89E8E` |
| Accents | Malachite Green `#1E4038` (lamp bases, desk top accent), Palm Silhouette `#1C2418`, Outline Cool `#101828` |

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
| P4 | upper crimson wall + the gold-leaf stepped COVE CROWN running its full length — the ceiling identity, unbroken (dusk windows DELETED) | 480×270 static | lacquer darks + gold leaf, cove glow (sparse) |
| P3 | the chandelier tier — one grand chandelier (the P4-glow-overlay trick: crystals as a separate warm overlay PNG for the pulse) against the brass wall-grid mid-band | 960×270 | lacquer deeps, brass seams, brass glints |
| P2 | mezzanine rail + the curved-stair hero passage + the revolving-door glow (appears once per ~1.5 screens) | 1280×270 | lacquer mids, brass rail, one warm door-glow |
| P1 | near dressing: luggage cart silhouettes, brass stanchion line, palm silhouettes | 1600×270 | fullest range, ceilinged below play-plane brightness |

Seam and value rules per ART-02 §2 verbatim. The cove glow
in P4 is the one hot passage allowed in the far field — it
reads as gilding catching light, not as competition.

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
