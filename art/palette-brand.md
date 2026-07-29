# art/palette-brand.md — Official Chexology Brand Colors

Source: Chexology Brand Guidelines v1 (sections 2.3, 2.4, 3.2).
This closes the DESIGN.md §5 TODO. These are the OFFICIAL hexes —
use for UI, menus, HUD, title screen, and game chrome. The Chexy
character sprite keys on the mascot-extracted palette in
BRIEF-ART-01 §2 (see "Brand vs. Chexy delta" below).

## Core brand

| Name | Hex | Game usage |
|------|-----|-----------|
| Chexology Orange | `#FE701E` | Primary accent: title, buttons, NFC glow, score pops |
| Background Tan | `#F8F5F3` | Menu/title backgrounds, results screens |
| Action Blue | `#1528A6` | Secondary UI accent (selected state, links) |
| Action Blue light | `#E6EFFC` | UI fills behind blue elements |

## Semantic colors (Marketing palette 2.4)

| Name | Hex | Game usage |
|------|-----|-----------|
| Success Green | `#12B76A` | Successful check-in feedback, "item returned" |
| Alert Red | `#EA5151` | Lost item, angry guest bubble accent |
| Warning Yellow | `#FFE123` | Rush timer warnings, expiring item flash |

## Chexology Tag Colors (ChexApp 2.3) — item category colors

These are the ACTUAL tag colors from the real app. Use them to
color-code in-game item categories and NFC tag collectibles —
a deep-cut easter egg the team will recognize:

`#FE701E` (orange) · `#E91717` (red) · `#68A11C` (green) ·
`#006483` (teal) · `#FFFFFF` (white) · `#F3B024` (gold) ·
`#FFC0CB` (pink) · `#59595B` (gray) · `#774068` (plum) ·
`#EAECF0` (2+ items)

Suggested mapping: coats=orange, luggage=teal, valet=red,
strollers=pink, rentals=green, "2+ items" gray-lavender for
multi-item guests.

## Marketing accents (2.4) — level mood colors

`#E76256` coral · `#A64762` berry · `#712676` purple ·
`#402076` indigo · `#2D5378` steel blue · `#386E6F` teal green ·
`#59595B` charcoal

Good anchors for per-level background mood (e.g., nightclub
purple/indigo for Coatroom, steel blue for Bell Desk, teal for
Stroller Valet/museum).

## Gray ramp (25→900)

`#FCFCFD` `#F9FAFB` `#F2F4F7` `#EAECF0` `#D0D5DD` `#98A2B3`
`#667085` `#475467` `#344054` `#1D2939` `#101828`

UI text on light: primary `#344054`, secondary `#98A2B3` (per
guidelines typography colors). Dark mode text: `#FCFCFD` /
`#D0D5DD`. Gray 900 `#101828` is the darkest brand value — use
for HUD panels over gameplay.

## Typography note

Brand fonts: Poppins (headers) / Open Sans (body) for marketing.
For in-game UI we use a pixel font (32-bit aesthetic), but the
title screen wordmark treatment should echo Poppins' rounded
geometry. Keep the actual logo out of pixelated contexts per
logo don'ts (no distortion/effects) — if the logo appears (e.g.,
splash), use the official file at native resolution.

## Brand vs. Chexy delta

Brand orange `#FE701E` (254,112,30) vs. Chexy body orange
`#F06018` (240,96,24): close family, brand is slightly brighter/
lighter. DECISION (logged): the character sprite keys on the
Chexy-extracted palette (canon mascot appearance); UI and game
chrome key on brand hexes. The two oranges never appear side by
side at equal weight — UI orange frames the play area, Chexy
lives inside it — so the mismatch reads as lighting, not error.
