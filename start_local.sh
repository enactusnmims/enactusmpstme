#!/usr/bin/env bash
# Start a local Python HTTP server and open the default browser to team.html
cd "$(dirname "$0")"
echo "Starting Python HTTP server on port 8000..."
if command -v python3 >/dev/null 2>&1; then
  python3 -m http.server 8000 &
else
  python -m http.server 8000 &
fi
sleep 1
if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "http://localhost:8000/team.html"
elif command -v open >/dev/null 2>&1; then
  open "http://localhost:8000/team.html"
else
  cmd.exe /c start "http://localhost:8000/team.html"
fi
echo "Server started. To stop it, kill the Python process or close this terminal." 