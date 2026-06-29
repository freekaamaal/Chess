// Level 3 — "Capturing". Now that each piece can move, the child learns to take
// enemy pieces. An enemy sits on a square the piece can capture; moving onto it
// knocks it out. The pawn is special — it captures diagonally, taught here.
import { PIECES } from './pieces.js'

const byId = Object.fromEntries(PIECES.map((p) => [p.id, p]))

const CONFIG = [
  { id: 'pawn', start: 'b2', goal: 3, intro: "Pawns capture diagonally! Knock out the enemies on the slanted squares." },
  { id: 'rook', start: 'd4', goal: 4, intro: "Send the Rook in straight lines to knock out the enemies!" },
  { id: 'bishop', start: 'c4', goal: 4, intro: "Slide the Bishop diagonally to capture the enemies!" },
  { id: 'knight', start: 'e4', goal: 4, intro: "Hop the Knight onto the enemies to knock them out!" },
  { id: 'queen', start: 'd4', goal: 4, intro: "The powerful Queen can capture any way. Get them all!" },
  { id: 'king', start: 'd4', goal: 4, intro: "Step the King onto the enemies next to it to capture them!" },
]

export const CAPTURE_LESSONS = CONFIG.map((c) => ({
  ...c,
  name: byId[c.id].name,
  emoji: byId[c.id].emoji,
  color: byId[c.id].color,
}))
