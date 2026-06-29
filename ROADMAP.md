# Chess for Kids — Product & Curriculum Roadmap

A chess-learning app designed for a 6-year-old, built to feel like a game first
and a lesson second. The guiding rule: **every screen should be playable, not
read.** A young child learns by tapping, watching, and being rewarded — not by
reading instructions.

---

## 1. Design principles (why this app is different)

| Principle | What it means in practice |
|-----------|---------------------------|
| **Play, don't lecture** | No walls of text. Every concept is a tappable mini-game. |
| **Voice over reading** | A mascot speaks every instruction aloud (Web Speech API). A 6-year-old can't read fast — she can listen. |
| **Tiny sessions** | Lessons are 3–8 minutes. A child's focus runs out fast; end on a win. |
| **Always reward** | Stars, badges, sounds, confetti, an unlockable trophy room. |
| **Never stuck** | Legal moves glow. Wrong moves are gently undone, never punished. |
| **Grows with her** | The AI opponent starts deliberately weak and ramps up as she wins. |

---

## 2. The learning path (Chess "Steps" method, kid-ified)

Chess is taught best in tiny stages, each ending in a small victory.

### Stage 0 — Meet the Pieces 🎭
Each piece is a *character* with a personality, introduced one at a time.
- The **Pawn** — the brave little soldier (only forward!)
- The **Rook** — the castle-tank (straight lines)
- The **Bishop** — the diagonal slider
- The **Knight** — the horse that *hops* (the famous L)
- The **Queen** — the most powerful (any direction)
- The **King** — the most important (one step, must be protected)

*Mini-game per piece:* tap the piece, hear its name, watch it wiggle.

### Stage 1 — How Pieces Move 🕹️
Drag-the-piece puzzles. The board shows one piece; glowing squares show where
it can go. "Eat all the snacks" — capture stray pawns scattered on the board.

### Stage 2 — Capturing & Protecting 🍪
"Take the piece" puzzles. Then: "don't lose your piece" (notice when a piece
is in danger).

### Stage 3 — Check & Checkmate 👑
Start with King + one piece endgames. "Put the king in a trap!" Simple
one-move and two-move mates.

### Stage 4 — Special Moves ✨
Castling (the king's secret hideout), promotion (turn a pawn into a queen! —
kids love this), en passant (the sneaky capture).

### Stage 5 — Play a Real Game ♟️
Full game vs. a gentle AI. Difficulty auto-adjusts. Hints available.
Post-game: "Here's a cool move you made!"

### Stage 6 — Puzzles & Tactics (the road to champion) 🏆
Daily puzzles, forks, pins, simple combinations. Streaks and a puzzle ladder.

---

## 3. Reward & motivation system

- **Stars** (1–3) on every lesson, based on tries.
- **Badges** for milestones ("Knight Master", "First Checkmate").
- **Trophy room** — a visual shelf that fills up over time.
- **Mascot reactions** — cheers on wins, encourages on misses.
- **Unlockable piece skins / themes** as long-term goals.
- **Streak counter** — "You've played 3 days in a row!"

---

## 4. Technical architecture

A **tablet-first web app** — no app store, instant updates, touch-friendly.

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **React + Vite** | Fast, modern, simple to extend. |
| Chess rules | **chess.js** | Battle-tested legal-move/checkmate logic — we never reimplement chess. |
| Board UI | **react-chessboard** | Drag-and-drop board, touch support, customizable. |
| AI opponent | **Stockfish (WASM)** | Free, strong engine; we cap its strength for beginners. |
| Voice | **Web Speech API** | Built into browsers, free, no audio files to record. |
| Progress | **localStorage** (later: cloud) | Saves stars/badges on the device; no login needed for v1. |
| Styling | **CSS** with big, bright, kid-friendly visuals | Large touch targets, playful colors. |

### Project structure (target)
```
src/
  components/      # Board, mascot, buttons, reward popups
  lessons/         # One module per stage (data-driven lessons)
  engine/          # chess.js wrappers + Stockfish hookup
  audio/           # speech + sound-effect helpers
  state/           # progress, stars, badges (localStorage)
  App.jsx          # navigation between the "world map" of lessons
```

---

## 5. Build phases (how we ship it)

- **Phase 1 — Foundation (first build).** Scaffold the app, render a real
  chessboard, and ship **Stage 0: Meet the Pieces** with mascot voice. ✅ This
  is what we build first so you can hand her a working thing today.
- **Phase 2 — Movement & captures.** Stages 1–2 mini-games + star rewards +
  progress saving.
- **Phase 3 — Checkmate & special moves.** Stages 3–4 with guided puzzles.
- **Phase 4 — Play the AI.** Stockfish integration with adjustable difficulty.
- **Phase 5 — Puzzles, badges, polish.** Tactics ladder, trophy room, themes,
  sound design.

---

## 6. Tips for *you* (the coach)

- Keep sessions short. Stop while she's still having fun.
- Celebrate effort, not just wins.
- Play alongside her — make some "mistakes" so she can win and explain why.
- Use the real pieces too; the app and a physical board reinforce each other.
