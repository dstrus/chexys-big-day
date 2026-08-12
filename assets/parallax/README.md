# assets/parallax/ — painted background drop-in (BRIEF-ART-02 §2)

Same contract as sprites and audio: **drop a file in and it wins;
delete it and the layer simply doesn't exist.** Partial stacks are
fine — P4 alone works. Missing files are skipped, never crash.

## Filenames

`assets/parallax/<levelId>/<layer>.png` — levelId is the map's
levelId property (coatroom, belldesk, garage, museum, exodus).

| File | Content | Size | scrollFactor |
|------|---------|------|--------------|
| p4.png | farthest: back wall / haze | 480×270 | 0.05 |
| p3.png | crowd / far dressing mass | 960×270, repeat-x | 0.2 (+ ±1px code-side sway) |
| p2.png | mid architecture | 1280×270, repeat-x | 0.45 |
| p1.png | near dressing behind the play plane | 1600×270, repeat-x | 0.7 |
| glow.png (optional) | additive overlay, code alpha-pulsed | any | static |

P3/P2/P1 must tile horizontally (check seams with Aseprite's View →
Tiled Mode). Vertical never repeats — layers are viewport-height.
The garage stack is three layers per BRIEF-ART-04 §4 (p3/p2/p1 —
just omit p4.png).

Layers render at depths −9…−6, BEHIND the tile map's own bg2/bg1
dressing layers (−4/−3). The crowd sway and glow pulse (BRIEF-ART-02
§3 autonomous motion) are code-side — no extra frames needed.
