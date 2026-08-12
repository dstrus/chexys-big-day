import MuseumScene from './MuseumScene.js'

// Level 5, Act 1: The Mass Exodus (BRIEF-07 Session 1). The medley
// finale — every shipped item class in one static arena: coats
// (standard tap), luggage tiers 2–3 (holds), rolling strollers
// (brake-on-tag). Extending MuseumScene buys the whole mover stack
// (perpetual roll, brake, touchdown lock); coats and luggage flow
// through to the base scene untouched. Thieves run the full standard
// grammar — loiter, target lock, grace, per-map steal cooldown;
// sanctuary-less by construction (no scroll here). The fiction flips
// level-wide via the handbackCopy map property: tags RETURN items to
// departing guests. Act 2 (the Paper Ticket King) and the Boss Door
// checkpoint land in Session 2 at this brief's marked seam — Act 1
// currently ends at the rush timer with standard results.
export default class ExodusScene extends MuseumScene {
  constructor() {
    super('Exodus')
  }
}
