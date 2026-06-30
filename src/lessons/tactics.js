// Tactic puzzles for the daily lesson and the adaptive Tactics Trainer.
//
// Each puzzle has:
//   type:  'capture' (grab a piece) | 'mate' (checkmate in one) | 'solution'
//          (play one specific best move, e.g. a fork)
//   level: 1 (easy) .. 3 (hard) — used by the adaptive picker
//   theme: a kid-friendly label
//   from:  the piece to move (glows as a hint); 'solution' puzzles also give `to`
// Success is verified with chess.js (capture made / real checkmate / exact move).
export const TACTICS = [
  // --- Level 1: win a free piece ---
  { id: 'cap-rook', type: 'capture', level: 1, theme: 'Win a piece', fen: '7k/8/8/8/8/8/r7/R6K w - - 0 1', from: 'a1', hint: "Win the piece! Capture the enemy Rook with your Rook." },
  { id: 'cap-knight', type: 'capture', level: 1, theme: 'Win a piece', fen: '7k/8/8/8/4n3/8/2B5/7K w - - 0 1', from: 'c2', hint: "Win the piece! Slide your Bishop to grab the enemy Knight." },
  { id: 'cap-pawn', type: 'capture', level: 1, theme: 'Win a piece', fen: '7k/8/8/8/4p3/3P4/8/7K w - - 0 1', from: 'd3', hint: "Pawns capture diagonally — grab the enemy Pawn!" },
  { id: 'cap-bishop2', type: 'capture', level: 1, theme: 'Win a piece', fen: '7k/8/8/8/8/2r5/8/B6K w - - 0 1', from: 'a1', hint: "Win the piece! Slide your Bishop along the diagonal to grab the Rook." },
  { id: 'cap-knight2', type: 'capture', level: 1, theme: 'Win a piece', fen: '7k/8/3b4/8/4N3/8/8/7K w - - 0 1', from: 'e4', hint: "Win the piece! Hop your Knight onto the enemy Bishop." },

  // --- Level 2: win the big pieces & mate in one ---
  { id: 'cap-queen', type: 'capture', level: 2, theme: 'Win the Queen', fen: '7k/8/5q2/8/4N3/8/8/7K w - - 0 1', from: 'e4', hint: "Big prize! Hop your Knight onto the enemy Queen." },
  { id: 'cap-rook2', type: 'capture', level: 2, theme: 'Win the Rook', fen: '7k/8/8/8/8/3r4/8/3Q3K w - - 0 1', from: 'd1', hint: "Win the Rook! Send your Queen up to take it." },
  { id: 'cap-queen2', type: 'capture', level: 2, theme: 'Win the Queen', fen: '7k/8/8/3n4/8/8/8/3Q3K w - - 0 1', from: 'd1', hint: "Win the piece! Send your Queen up to take the Knight." },
  { id: 'cap-bigq', type: 'capture', level: 2, theme: 'Win the Queen', fen: '7k/8/8/8/3q4/8/8/3R3K w - - 0 1', from: 'd1', hint: "Win the Queen! Send your Rook straight up the file." },
  { id: 'mate-rook', type: 'mate', level: 2, theme: 'Checkmate', fen: '6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1', from: 'a1', hint: "Checkmate! Send your Rook to the back row to trap the King." },
  { id: 'mate-queen', type: 'mate', level: 2, theme: 'Checkmate', fen: '6k1/5ppp/8/8/8/8/5PPP/3Q2K1 w - - 0 1', from: 'd1', hint: "Checkmate! Slide your Queen to the back row." },
  { id: 'mate-qk', type: 'mate', level: 2, theme: 'Checkmate', fen: '7k/8/6K1/8/7Q/8/8/8 w - - 0 1', from: 'h4', hint: "Checkmate! Put your Queen next to the King — your King guards her." },

  // --- Level 3: forks & harder mates ---
  { id: 'mate-2rook', type: 'mate', level: 3, theme: 'Two-Rook mate', fen: '7k/R7/8/8/8/8/8/1R4K1 w - - 0 1', from: 'b1', hint: "Two-Rook ladder! Move the bottom Rook up to checkmate." },
  { id: 'fork-1', type: 'solution', level: 3, theme: 'Knight Fork', fen: '2q3k1/8/8/3N4/8/8/8/7K w - - 0 1', from: 'd5', to: 'e7', hint: "Fork! Jump your Knight to e7 — it checks the King AND attacks the Queen!" },
  { id: 'fork-2', type: 'solution', level: 3, theme: 'Knight Fork', fen: 'k3q3/8/8/3N4/8/8/8/7K w - - 0 1', from: 'd5', to: 'c7', hint: "Fork! Hop your Knight to c7 — it checks the King AND attacks the Queen!" },
]

// Pick today's puzzles deterministically from the date (stable all day, fresh
// tomorrow). Used by the random daily fallback.
export function dailyPlan(dateStr, count = 4) {
  let seed = 0
  for (const ch of dateStr) seed = (seed * 31 + ch.charCodeAt(0)) % 100000
  const start = seed % TACTICS.length
  const plan = []
  for (let i = 0; i < count; i++) plan.push(TACTICS[(start + i) % TACTICS.length])
  return plan
}

// Adaptive picker: choose puzzles near the child's tactics rating (1..3) so the
// Tactics Trainer gets harder as she improves. A little randomness keeps it fresh.
export function pickAdaptive(count, rating) {
  const target = Math.max(1, Math.min(3, Math.round(rating)))
  const pool = [...TACTICS]
  pool.sort(
    (a, b) =>
      Math.abs((a.level || 1) - target) - Math.abs((b.level || 1) - target) + (Math.random() - 0.5) * 0.7,
  )
  return pool.slice(0, count)
}
