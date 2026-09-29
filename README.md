# Run the site locally

Quick steps to run the static site from the project root (Windows / Git Bash / WSL):

- Using the included scripts:
  - Windows (double-click or run in Git Bash / CMD): [start_local.bat](start_local.bat)
  - Git Bash / WSL / macOS: `./start_local.sh` (make executable: `chmod +x start_local.sh`)

- Or run manually:
```bash
cd /c/Users/HP/Documents/GitHub/enactusmpstme
# Python 3
python3 -m http.server 8000
# or
python -m http.server 8000

# Or with Node
npx http-server -p 8000
```

Open http://localhost:8000/team.html in your browser.

Debugging tips:
- Open DevTools (F12) → Console: copy any JS exceptions.
- Network tab: look for failed script loads (SplitType / GSAP CDNs).
- Note: Windows filesystem is case-insensitive; hosting on a case-sensitive server may require filename fixes (e.g. `Team.html` vs `team.html`).

If you want, paste any Console errors here and I'll diagnose them.
