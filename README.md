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
- ⚔️ **Level 3 — Capturing**: knock out enemy pieces by moving onto them. This is
  where the pawn's special diagonal capture is taught.
- 👑 **Level 4 — Checkmate!**: guided mate-in-one puzzles; the piece that delivers
  mate glows as a hint. Real checkmate is verified by `chess.js`.
- ✨ **Level 5 — Special Moves**: promotion (make a Queen!), castling, and en
  passant — one puzzle each.
- ♟️ **Level 6 — Play a Game**: a full game against "Leo", a deliberately gentle
  AI so she can win, gain confidence, and learn from real play.
- 🎀 **Personalised**: greets the player by name (set `PLAYER_NAME` in
  `src/config.js`).
- ⭐ Stars, sounds, and a celebration when she finishes each level.
- 🔊 Voice on/off toggle (the mascot speaks every line — great for pre-readers).
- 💾 Progress saved on the device.

All six levels of the curriculum are now playable. Every level supports both
**tapping** (tap a piece, then tap where to go — easiest for little fingers) and
dragging. Levels 4–6 use the full `chess.js` rules engine.

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
