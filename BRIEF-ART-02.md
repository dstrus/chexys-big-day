# BRIEF-ART-02 — The Coatroom Environment (tileset + parallax)

**For:** Art track (human in Aseprite; agent support tasks listed)
**Read first:** CLAUDE.md, DESIGN.md §5, art/palette-brand.md,
assets/maps/README.md (Chunk 1 layer conventions)
**Prerequisite art:** none — independent of the character queue.
**Canonical mood:** nightclub pre-show. Anchors: Accent Indigo
#402076 and Accent Purple #712676 (marketing palette) for the
venue depths, with Chexology Orange #FE701E reserved for lit
accents (stage glow, signage, lamps). Coats on racks read Tag
Orange; keep environment oranges dim so items pop.

## 0. Ground rules (readability first)

The environment is a stage, not a competitor:
- **Value structure:** backgrounds sit DARKER and LOWER-CONTRAST
  than gameplay elements. Chexy (bright orange) and items must
  pop at a squint. If a screenshot squint-test can't find the
  player instantly, the background is too loud.
- **Saturation budget:** parallax layers desaturate with depth —
  farthest layer is nearly monochrome indigo; only the fg layer
  may approach item-level saturation, sparingly.
- No text in backgrounds (fake signage = blurred shapes/glows).
- Dithering IS allowed on environment layers (unlike characters)
  for gradients in lighting — use coarse 2×2 patterns max.

## 1. Deliverable A — the tileset (do this first)

File: art/aseprite/coatroom-tiles.aseprite → exports to
assets/tiles/coatroom.png. **16×16 tiles**, laid out on a grid.
Replaces the runtime-generated placeholder from Chunk 1.

Needed tile groups (est. 35–50 tiles total):
- **Floor:** club floorboards/checker, 2–3 variants + edge tiles.
- **Platforms:** coat-rack shelving / riser edges (the jumpable
  surfaces) — left cap, middle repeat, right cap, single.
- **Walls/bounds:** side walls, baseboard, ceiling trim.
- **Coat rack dressing (fg/bg1 accents):** rack posts, rails,
  hanging-coat silhouette clusters (non-interactive dressing —
  actual items are sprites), rope stanchions, "cloakroom"
  counter pieces.
- **Detail accents:** wall sconce (2-frame flicker pair), poster
  glow blobs, floor scuffs.

Palette: new per-asset environment palette, 24–32 colors —
indigo/purple ramp, neutral darks, dim wood tones, one orange
accent ramp. Build it in the file; export as
art/palettes/coatroom-env.gpl for reuse in the parallax layers.

Tiled wiring (agent task, not yours): register the real tileset
in coatroom.json, map placeholder tile indices → final indices,
re-dress the existing 100×17 layout. Note: the map is 17 tiles
(272px) against the 270px viewport BY DESIGN — the camera pins
scrollY per the render-snap architecture; do not "fix" the map
height.

## 2. Deliverable B — the parallax stack (far to near)

Five layers total (four paintings + the tile map). Paintings are
PNGs (not tilesets) at the sizes below; Phaser scrollFactors
listed for the agent's wiring pass:

| Layer | Content | Size | scrollFactor |
|-------|---------|------|--------------|
| P4 (farthest) | venue back wall: stage glow, truss silhouettes, haze gradient | 480×270, static | 0.05 |
| P3 | crowd silhouette mass, heads/hands, nearly black-on-indigo | 960×270, repeats | 0.2 |
| P2 | mid architecture: columns, balcony rail, hung coats in shadow | 1280×270 | 0.45 |
| P1 | near dressing behind play plane: rack rows, velvet rope line | 1600×270 | 0.7 |
| (map) | bg1/main/fg tile layers | full map | 1.0 |

- Draw P4 first, P1 last — establish the mood cheap, spend
  detail close to the camera (asymmetric fidelity applies to
  depth too).
- Horizontal seams: P3/P2/P1 must tile horizontally (repeat-x).
  Aseprite: Sprite → Canvas Size trick or wrap-mode preview via
  View → Tiled Mode to check seams.
- Vertical: no repeat; layers are viewport-height. P4 static.

## 3. Deliverable C — autonomous motion (after A+B land)

Per DESIGN.md §5 "subtle autonomous motion":
- Sconce flicker: 2-frame tile animation (Tiled animated tile or
  agent-side frame swap, slow irregular timer).
- Crowd sway: P3 gets a ±1px slow horizontal drift (code-side
  sine, no art needed) — agent task.
- Stage glow pulse: P4 glow region as a separate small overlay
  PNG the agent alpha-pulses (draw the glow as its own file:
  coatroom-glow.png, additive-friendly).
Nothing in this section blocks Gate 2 if time is short — log as
polish debt if deferred.

## 4. Export & wiring contract

- Yours: .aseprite sources in art/aseprite/, exported PNGs to
  assets/tiles/ and assets/parallax/coatroom/ (P1..P4 named).
- Agent's (one session after your first export): tileset
  registration + index mapping, parallax loader with the
  scrollFactor table, tiled-mode seam verification, sconce
  animation hookup, glow pulse, crowd drift. The 60fps
  acceptance (DESIGN.md §7) re-verifies with all five layers
  live — this is the frame-budget moment of truth for the
  whole game.

## 5. Suggested order & effort

1. Environment palette + floor/platform/wall tiles (1 session)
   → agent wires → the Coatroom stops being placeholder.
2. P4 + P3 (1 session — they're mostly mood and silhouette).
3. Rack dressing tiles + P2 + P1 (1 session, the detail-heavy
   one).
4. Deliverable C motion bits (half session, deferrable).

Estimated total: 2.5–3.5 sessions at demonstrated pace. After
step 1 the game already looks transformed; steps 2–3 are where
the SotN depth arrives.
