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

### Kid accounts & the 20-Day Journey 🚀

- 👧 **Two child profiles** (Navya & Aadhya) with fun, easy passwords. Each girl
  taps her name, types her secret word, and gets her **own** saved progress.
  Profiles, passwords and avatars live in `src/state/profiles.js`.
  *(This is a friendly on-device login for accountability, not secure cloud
  auth — each child's progress is saved on the device she uses.)*
- 🗓️ **30-Day Journey** (`src/lessons/plan.js`): one short lesson per day that
  gets gradually harder (pieces → capturing → checkmate → tactics → real games →
  forks & combinations → tough games). The app allows **one journey day per
  calendar day**, so the habit is real, and it carries a full month.
- 📊 **Journey tracker** ("My Plan"): every day with a ✅ and the date it was
  completed — the parent's accountability view — plus current/locked days.

### Tactics Trainer & adaptive difficulty 🎯

- A **bank of 60+ puzzles** in `src/lessons/tacticsData.js`, auto-generated and
  **verified by chess.js** via `scripts/genTactics.mjs` (re-run it to grow the
  bank). Themes: win-a-piece, win-a-rook, win-the-queen, checkmate-in-one,
  two-rook mates, and **knight forks**, each tagged with a 1–3 difficulty level.
- **Tactics Trainer** (under Practice): endless rounds of 5 puzzles chosen near
  the child's tactics rating. The rating rises on first-try solves and eases off
  when she struggles, so the puzzles get **harder as she improves** (shown as
  Beginner → Improver → Sharp → Star in the Trophy Room).
- **Three AI levels** for "Leo": easy (mostly random), medium (takes free
  material), and hard (looks two moves ahead — recaptures and avoids hanging
  pieces).

### Regenerating the puzzle bank

```bash
node scripts/genTactics.mjs   # writes src/lessons/tacticsData.js (all verified)
```

### The Daily Coach 🦁

The app opens as a **daily coach**, not just a menu:

- 🗓️ **Today's Lesson** — a short, fresh set of bite-size tactic puzzles each day
  ("win the piece!" and "checkmate in one!"), shown as small steps so she's never
  overwhelmed.
- 🔥 **Streaks** — a day-streak that grows each day she practises (and resets if a
  day is missed), to build the daily habit.
- ⏰ **Daily time budget** — a gentle limit (default 15 min, configurable) that ends
  with a friendly "see you tomorrow!" so sessions stay short and special.
- 🏆 **Trophy Room** — streak, days played, stars, best streak, and unlockable
  badges, so she can watch her progress grow.
- ⚙️ **Settings** — pick the coach character (lion/puppy/unicorn/robot/cat), set
  the coach's difficulty (easy/medium/hard), the daily time limit, and voice on/off.
- 🗺️ **Practice** — the six levels, always available to revisit.

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
