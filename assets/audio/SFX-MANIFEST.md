# SFX-MANIFEST — Chexy's BIG DAY

**For:** the composer (Davey) + one agent reconciliation task.
**Sources:** jsfxr (core blips), ChipTone (layered), phone-mic
foley + Audacity (paper/cloth/brass — pitch down ~20%, light
bitcrush to sit in-world).
**Global rules:** interaction sounds 50–150ms; good = rises,
bad = falls/flat (the color language's audio twin); 3–4
pitch-jitter variants for anything marked [VAR]; mix against
the loudest music track; ceremony sounds exempt from brevity.

**Agent task before production:** reconcile this manifest's
event names against the actual AudioBus table (the -07-c
unknown-event warning makes misnames loud, but a printed list
is cheaper); report any event that exists in code but not
here, or vice versa. Also confirm/add variant-pool support
([VAR] events cycle or randomize a small file set) BEFORE
files are produced — it changes export counts.

## Session 1 — the core loop (80% of what a player hears)

| Event | Character | Source | Len | Notes |
|---|---|---|---|---|
| tap (land) [VAR] | bright, dry, rising minor-third blip — "the sound of correct" | jsfxr | 80ms | fires with hitstop on the effect frame; the game's most-heard sound |
| tap whiff | near-silent dry tick, flat | jsfxr | 40ms | a shrug, not a punishment — clean miss per -04-b |
| holdStart | low warm hum fading in, anticipatory | ChipTone | 120ms | leads the meter |
| holdComplete | resolved two-note rise into the tap-land family | jsfxr | 120ms | shares DNA with tap: hold ENDS in a tap |
| holdInterrupt | descending buzz + the paper hit under it | ChipTone + foley | 150ms | the struggle price made audible |
| stealGrab (gloat) | gloating paper crinkle + tiny nasty chuckle contour (two descending notes) | foley + jsfxr | 200ms | the chase-starts broadcast; pairs with the arrow spike |
| rescueStun (poof) [VAR] | REAL crumpled paper burst, pitched down, dry | foley | 150ms | the signature villain sound; record actual ticket stock |
| itemLost | falling three-note sag, muted, final | ChipTone | 250ms | sad but not punishing — the hanger tarnish carries the sting visually |
| multiplierUp | tiny ascending shimmer | jsfxr | 90ms | "heating up" cue per §2.5 |
| multiplierDown | single flat low tick | jsfxr | 70ms | legible, never scolding |
| dash | short air-whip with pitch fall-then-rise | jsfxr | 110ms | matches the afterimage; also plays for dash-through |
| land (jump) | soft dry thump, felt more than heard | foley (knuckle on desk) | 60ms | quiet — landing is constant |

## Session 2 — collectibles, ceremony, UI

| Event | Character | Source | Len | Notes |
|---|---|---|---|---|
| tagPickup (NFC) [VAR] | classic coin: two rising squares | jsfxr | 90ms | family: brightest of the pickups |
| cardPickup | gentle notification "tri-tone" contour (it IS a text) | ChipTone | 180ms | product joke in audio form |
| cardReturn | whoosh-rise into a soft happy chime | ChipTone | 300ms | tracks the Success-Green flight |
| insightPickup | upward data-sparkle arpeggio | ChipTone | 200ms | brainy, cool-toned |
| insightEnd | the same arpeggio's last two notes, reversed | ChipTone | 150ms | bookend; countdown ring handles warning |
| hangerChime ×3 | ascending brass-ish bell tones, one per hanger; third slightly longer | foley (real bell/glass) + pitch | 300ms ea | THE results beat; record something real |
| bigDayStamp | composed moment: felt thump + brass hit + paper flutter tail | layered foley | 500ms | the game's signature; give it a session |
| rushStart | rising three-count into a downbeat ("Let's gooooo!" energy) | ChipTone | 400ms | consider a countdown family with uiSelect |
| rushEnd | exhale: soft falling resolve, unhurried | ChipTone | 400ms | the breath beat's audio |
| uiSelect / uiConfirm / uiBack | dry ticks: neutral / rising / falling | jsfxr | 50ms | one family, three inflections |
| muteToggle | single dry tick (plays on UNMUTE only, obviously) | jsfxr | 40ms | confirms the 'm' key |

## Session 3 — level-specific (garage + museum)

| Event | Character | Source | Len | Notes |
|---|---|---|---|---|
| requestFired | crisp service-bell ding, single | foley (real bell) | 200ms | the garage queue's heartbeat; the Bell Desk's desk bell can share the recording, re-pitched |
| driveOff | short engine-purr sweep away (stylized, not literal) | ChipTone | 350ms | pans with the car if the bus supports it |
| safeAtEdge (bank) | soft "cha-ching" without the cash-register cliché — two-note secure click-rise | jsfxr | 120ms | the two-stage return zone's payoff |
| eliteRip | sharp tearing paper, REAL, quick | foley | 130ms | must cut through — it's an alarm |
| chipRestore | the rip reversed conceptually: quick zip-rise + tap-land tail | jsfxr | 130ms | closes the loop audibly |
| edgePush | rubbery boing-nudge, comic | ChipTone | 150ms | pushes, never harms — sound agrees |
| swarmSlowContact | papery flutter-drag, brief | foley | 120ms | friction, not damage |
| strollerBrake | tiny squeak + settle click | foley (chair wheel?) | 150ms | the tame-the-chaos verb |

## Session 4 — PARKED with the finale (produce when the
boss reopens; listed so the manifest is complete)

rip_tele (claw drawback creak — paper under tension),
clawStun (recoil crunch), spew (flutter-burst), carpetLay
(sheet of paper settling), tornado (paper cyclone swirl),
grabChexy (big crumple + muffled squeak), mashEscape
(tearing free), phaseStagger (heavy paper collapse +
crown-spool clatter), meterTear [weighted: bigger returns =
longer tear — one recording, three trims], lastGasp (rising
paper storm), collapse (the composed ending: cascade +
crown clatter + stub flutter + THE STAMP — reuse/extend
bigDayStamp so the ending and the perfect-clear share a
signature).

## Production order

1. Agent reconciliation + variant-pool confirm.
2. Session 1 (foley day first if convenient: record paper
   crumples, tears, flutters, a bell, a thump — one hour of
   recording feeds half the manifest).
3. Sessions 2–3 in either order.
4. Session 4 rides with the finale's un-parking.
