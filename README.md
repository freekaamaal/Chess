# Chess for Kids 🦁

A fun, voice-guided chess app for young children (designed for a 6-year-old).
Leo the Lion teaches chess one tiny, playful adventure at a time.

See **[ROADMAP.md](./ROADMAP.md)** for the full product plan and curriculum.

## What works today

- 🗺️ A **world map** of learning adventures (Levels 1–6).
- 🎭 **Level 1 — Meet the Pieces**: each piece is a friendly character. Leo
  introduces it *out loud*, and the board lights up to show where it can move.
- 🕹️ **Level 2 — How They Move**: drag *or tap* each piece along its real moves
  to eat cookies 🍪. Tapping is built in because it's easiest for little fingers
  on a tablet. Cookies respawn until the piece is mastered, then it's on to the
  next one.
- ⭐ Stars, sounds, and a celebration when she finishes each level.
- 🔊 Voice on/off toggle (the mascot speaks every line — great for pre-readers).
- 💾 Progress saved on the device.

Later levels (capturing, checkmate, special moves, playing the AI) are shown as
"coming soon" on the map and built in the next phases.

## Run it

```bash
npm install
npm run dev
```

Then open the printed URL. The dev server is exposed on your network, so you
can also open it on a **tablet** on the same Wi-Fi (best experience for a kid).

To make a production build: `npm run build`, then `npm run preview`.

## Tech

React + Vite · `chess.js` (rules) · `react-chessboard` (board) · Web Speech API
(Leo's voice) · Web Audio API (sound effects). No login, no tracking, no ads.
