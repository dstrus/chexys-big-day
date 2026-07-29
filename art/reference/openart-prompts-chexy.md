# OpenArt Prompt Pack — Chexy Pose References

Purpose: generate REFERENCE images (not shippable art) that solve
the views missing from canon — especially the side profile. Use
with Chexy.png as the input image (image-to-image / character
reference mode).

## Setup that matters more than the prompt

- **Mode:** image-to-image with Chexy.png as reference, or
  OpenArt's character/consistency feature if your plan has it.
- **Strength/denoise:** ~0.5–0.65 for pose changes. Lower (~0.35)
  keeps the design but resists changing pose; higher (~0.75)
  changes pose freely but drifts the design. Run a strength sweep
  on the first prompt to find the sweet spot, then hold it.
- **Batch:** generate 6–10 per prompt; expect to keep 1–2. You're
  shopping for anatomy answers, not finished images.
- **Aspect:** square, 1024×1024.

## Character lock (paste at the start of EVERY prompt)

> Chexy, a squat anthropomorphic squirrel mascot: bright orange
> fur, large cream muzzle with two buck teeth, cream belly, huge
> round dark eyes with small eyelashes, tall tufted ears with
> dark tips, a swoop of hair between the ears, small dark brown
> hands and feet, and an enormous fluffy spiral tail curling up
> behind, tail with lighter cream underside. Flat modern cartoon
> mascot style, clean bold shapes, warm palette, white background,
> full body visible.

## Negative prompt (use on all)

> realistic, photorealistic, fur texture detail, extra limbs,
> human proportions, tall slender body, small tail, cropped body,
> text, watermark, busy background, multiple characters

## The pose prompts

**P1 — Side profile idle (THE key reference):**
[character lock] + "standing still in strict left-facing side
profile view, orthographic side view like a video game sprite
sheet, both feet flat on the ground, arms relaxed, tail curling
up and over behind the back, muzzle in profile showing one eye"

**P2 — Side profile run:**
[character lock] + "running fast in strict left-facing side
profile, mid-stride with front leg extended, body leaning
forward, tail streaming out behind horizontally, energetic
cartoon sprint pose"

**P3 — Side profile jump:**
[character lock] + "leaping upward in left-facing side profile,
knees tucked, arms up, tail trailing below the body, dynamic
jump pose"

**P4 — Hold/press pose (for the hold-tag animation):**
[character lock] + "in left-facing side profile, crouching
slightly and pressing both hands down firmly on a small glowing
tag on the ground in front of it, concentrating, tail raised
high behind for balance"

**P5 — Three-quarter front (for UI portraits/results screen):**
[character lock] + "three-quarter front view turned slightly to
the left, confident smile, one hand giving a thumbs up, wearing
a small round white badge on its chest"

**P6 — Sad slump (lose pose):**
[character lock] + "in left-facing side profile, slumped
shoulders, ears drooping down, tail drooping flat on the ground
behind, sad but cute expression"

**P7 — Victory (win pose):**
[character lock] + "in left-facing side profile, jumping with
one fist raised in celebration, ears perked, tail in a proud
high curl, joyful expression"

## Selection criteria (what makes a keeper)

1. Tail reads as the biggest shape and sits BEHIND the body
   without hiding the face.
2. Body proportions stay squat — head roughly as big as body.
3. The muzzle survives the turn to profile (still clearly cream,
   still has the tooth).
4. Pose would fit inside a 48×48 canvas with body in a 32×32
   bottom-center box (squint test).

Keepers go into Aseprite as low-opacity reference layers next to
canon Chexy.png. Nothing generated ships as game art.

## Bonus — Paper Ticket King concepts (for the boss design session)

Fresh generations, no reference image needed:
> "towering monster made entirely of paper claim tickets and
> ticket stubs, a giant crumpled paper-roll king with a ticket
> number 45 on its chest, cartoon villain, flat modern cartoon
> style, menacing but silly, full body, white background"
Vary with: "wearing a paper crown", "long ticket-spool arms",
"swirling storm of ticket stubs around it". Generate 8–12; bring
favorites to the boss design session.
