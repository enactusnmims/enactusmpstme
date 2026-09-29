@echo off
REM Start a local Python HTTP server and open the default browser to team.html
cd /d %~dp0
echo Starting Python HTTP server on port 8000...
rem Launch server in a new window so this script can exit
start "" cmd /k "python -m http.server 8000"
timeout /t 1 > nul
start "" "http://localhost:8000/team.html"
echo Server started. Close the server CMD window to stop the server.