// Level 2 — "How They Move". For each piece the child drags it along its real
// moves to reach (eat) cookies scattered on the board. Movement only — capturing
// is taught in Level 3 — so cookies sit on empty squares the piece can move to.
//
// Name/emoji/color are reused from the Meet-the-Pieces character data so a piece
// looks and feels the same across levels.
import { PIECES } from './pieces.js'

const byId = Object.fromEntries(PIECES.map((p) => [p.id, p]))

// start: where the piece begins · goal: how many cookies to eat to finish.
const CONFIG = [
  { id: 'pawn', start: 'd2', goal: 3, intro: "Walk the Pawn forward to eat the cookies! It only moves forward." },
  { id: 'rook', start: 'd4', goal: 4, intro: "Help the Rook eat the cookies! Slide in straight lines." },
  { id: 'bishop', start: 'c4', goal: 4, intro: "Slide the Bishop diagonally to gobble the cookies!" },
  { id: 'knight', start: 'e4', goal: 4, intro: "Hop the Knight in an L shape to reach the cookies!" },
  { id: 'queen', start: 'd4', goal: 4, intro: "The mighty Queen can go any way. Eat all the cookies!" },
  { id: 'king', start: 'd4', goal: 5, intro: "Step the King one square at a time to munch the cookies!" },
]

export const MOVE_LESSONS = CONFIG.map((c) => ({
  ...c,
  name: byId[c.id].name,
  emoji: byId[c.id].emoji,
  color: byId[c.id].color,
}))
