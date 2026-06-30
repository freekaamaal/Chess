// Bite-size tactic puzzles for the daily lesson. Two kid-friendly kinds:
//  - 'capture': "Win the piece!" — grab a free enemy piece.
//  - 'mate':    "Checkmate in one!" — trap the king in a single move.
// `from` glows as a hint; success is verified with chess.js (capture made, or
// real checkmate), so any correct solution counts.
export const TACTICS = [
  { id: 'cap-rook', type: 'capture', fen: '7k/8/8/8/8/8/r7/R6K w - - 0 1', from: 'a1', hint: "Win the piece! Capture the enemy Rook with your Rook." },
  { id: 'cap-knight', type: 'capture', fen: '7k/8/8/8/4n3/8/2B5/7K w - - 0 1', from: 'c2', hint: "Win the piece! Slide your Bishop to grab the enemy Knight." },
  { id: 'cap-queen', type: 'capture', fen: '7k/8/5q2/8/4N3/8/8/7K w - - 0 1', from: 'e4', hint: "Big prize! Hop your Knight onto the enemy Queen." },
  { id: 'cap-pawn', type: 'capture', fen: '7k/8/8/8/4p3/3P4/8/7K w - - 0 1', from: 'd3', hint: "Pawns capture diagonally — grab the enemy Pawn!" },
  { id: 'cap-rook2', type: 'capture', fen: '7k/8/8/8/8/3r4/8/3Q3K w - - 0 1', from: 'd1', hint: "Win the piece! Send your Queen up to take the enemy Rook." },
  { id: 'cap-bishop2', type: 'capture', fen: '7k/8/8/8/8/2r5/8/B6K w - - 0 1', from: 'a1', hint: "Win the piece! Slide your Bishop along the diagonal to grab the Rook." },
  { id: 'cap-knight2', type: 'capture', fen: '7k/8/3b4/8/4N3/8/8/7K w - - 0 1', from: 'e4', hint: "Win the piece! Hop your Knight onto the enemy Bishop." },
  { id: 'cap-queen2', type: 'capture', fen: '7k/8/8/3n4/8/8/8/3Q3K w - - 0 1', from: 'd1', hint: "Win the piece! Send your Queen up to take the enemy Knight." },
  { id: 'mate-rook', type: 'mate', fen: '6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1', from: 'a1', hint: "Checkmate! Send your Rook to the back row to trap the King." },
  { id: 'mate-queen', type: 'mate', fen: '6k1/5ppp/8/8/8/8/5PPP/3Q2K1 w - - 0 1', from: 'd1', hint: "Checkmate! Slide your Queen to the back row." },
  { id: 'mate-qk', type: 'mate', fen: '7k/8/6K1/8/7Q/8/8/8 w - - 0 1', from: 'h4', hint: "Checkmate! Put your Queen right next to the King — your King guards her." },
  { id: 'mate-2rook', type: 'mate', fen: '7k/R7/8/8/8/8/8/1R4K1 w - - 0 1', from: 'b1', hint: "Two-Rook ladder! Move the bottom Rook up to checkmate." },
]

// Pick today's puzzles deterministically from the date, so the coach brings a
// fresh-but-stable set each day (same all day, different tomorrow).
export function dailyPlan(dateStr, count = 4) {
  let seed = 0
  for (const ch of dateStr) seed = (seed * 31 + ch.charCodeAt(0)) % 100000
  const start = seed % TACTICS.length
  const plan = []
  for (let i = 0; i < count; i++) plan.push(TACTICS[(start + i) % TACTICS.length])
  return plan
}
