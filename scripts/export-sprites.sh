#!/usr/bin/env bash
# One-command art->game path (BRIEF-02 Chunk 4): exports the Aseprite
# source to the atlas the game auto-loads. Degrades gracefully when
# Aseprite isn't installed — prints instructions, never fails a build.
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="art/aseprite/chexy.ase"
SHEET="assets/sprites/chexy.png"
DATA="assets/sprites/chexy.json"

ASE="${ASEPRITE:-aseprite}"
if ! command -v "$ASE" >/dev/null 2>&1; then
  MAC_APP="/Applications/Aseprite.app/Contents/MacOS/aseprite"
  if [ -x "$MAC_APP" ]; then
    ASE="$MAC_APP"
  else
    echo "Aseprite CLI not found (looked for 'aseprite' on PATH and $MAC_APP)."
    echo "Install Aseprite, or set ASEPRITE=/path/to/aseprite and re-run."
    echo
    echo "This script would run:"
    echo "  aseprite -b $SRC --sheet $SHEET --data $DATA \\"
    echo "    --format json-array --sheet-type packed --list-tags \\"
    echo "    --filename-format '{frame}'"
    exit 0
  fi
fi

if [ ! -f "$SRC" ]; then
  echo "Missing $SRC — save the Aseprite source file there, then re-run."
  exit 0
fi

# NOTE: '{frame}' names frames by index ("0","1",...) — required:
# Phaser's createFromAseprite looks frames up by numeric index.
"$ASE" -b "$SRC" \
  --sheet "$SHEET" \
  --data "$DATA" \
  --format json-array \
  --sheet-type packed \
  --list-tags \
  --filename-format '{frame}'

echo "Exported $SHEET + $DATA — the game picks them up automatically."
