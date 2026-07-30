#!/usr/bin/env bash
# One-command art->game path (BRIEF-02 Chunk 4): exports the Aseprite
# source to the atlas the game auto-loads. Degrades gracefully when
# Aseprite isn't installed — prints instructions, never fails a build.
#
# Canonical source: art/aseprite/<name>.aseprite (the app's default
# extension); .ase is accepted too. Errors if both exist (ambiguous)
# or neither does (handoff 2026-07-30-b).
set -euo pipefail
cd "$(dirname "$0")/.."

CHARACTERS=(chexy)

resolve_source() {
  local name="$1"
  local aseprite="art/aseprite/${name}.aseprite"
  local ase="art/aseprite/${name}.ase"
  if [ -f "$aseprite" ] && [ -f "$ase" ]; then
    echo "ERROR: both $aseprite and $ase exist — remove one; the export would be ambiguous." >&2
    return 1
  elif [ -f "$aseprite" ]; then
    echo "$aseprite"
  elif [ -f "$ase" ]; then
    echo "$ase"
  else
    echo "ERROR: no source file for '$name' — expected $aseprite (or $ase)." >&2
    return 1
  fi
}

ASE_BIN="${ASEPRITE:-aseprite}"
if ! command -v "$ASE_BIN" >/dev/null 2>&1; then
  MAC_APP="/Applications/Aseprite.app/Contents/MacOS/aseprite"
  if [ -x "$MAC_APP" ]; then
    ASE_BIN="$MAC_APP"
  else
    echo "Aseprite CLI not found (looked for 'aseprite' on PATH and $MAC_APP)."
    echo "Install Aseprite, or set ASEPRITE=/path/to/aseprite and re-run."
    echo
    echo "For each character this script runs:"
    echo "  aseprite -b art/aseprite/<name>.aseprite --sheet assets/sprites/<name>.png \\"
    echo "    --data assets/sprites/<name>.json --format json-array --sheet-type packed \\"
    echo "    --list-tags --filename-format '{frame}'"
    exit 0
  fi
fi

for NAME in "${CHARACTERS[@]}"; do
  SRC="$(resolve_source "$NAME")"
  SHEET="assets/sprites/${NAME}.png"
  DATA="assets/sprites/${NAME}.json"

  # NOTE: '{frame}' names frames by index ("0","1",...) — required:
  # Phaser's createFromAseprite looks frames up by numeric index.
  "$ASE_BIN" -b "$SRC" \
    --sheet "$SHEET" \
    --data "$DATA" \
    --format json-array \
    --sheet-type packed \
    --list-tags \
    --filename-format '{frame}'

  echo "Exported $SHEET + $DATA from $SRC — the game picks them up automatically."
done
