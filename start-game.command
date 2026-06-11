#!/bin/bash
# Double-click me to play The Shattered Crown!
# (Serves the game on a fixed port so save files always stick.)
cd "$(dirname "$0")"
PORT=8123
( sleep 1; open "http://localhost:$PORT" ) &
echo ""
echo "  ⚔  THE SHATTERED CROWN  ⚔"
echo "  Opening http://localhost:$PORT ..."
echo "  Leave this window open while playing. Close it when done!"
echo ""
exec python3 -m http.server "$PORT" 2>/dev/null
