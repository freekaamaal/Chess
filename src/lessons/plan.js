// The "20-Day Chess Journey" — one short lesson per day, getting gradually
// harder, mirroring how kids' programs (ChessKid, the Steps Method) teach:
// pieces → capturing → checkmate → tactics → real games, with lots of repetition.
//
// Each day has an activity:
//   { kind: 'level',   level: 'meet'|'move'|'capture'|'checkmate'|'special'|'play' }
//   { kind: 'puzzles', ids: [...tactic ids] }
//   { kind: 'play',    difficulty: 'easy'|'medium'|'hard' }
import { TACTICS } from './tactics.js'

export const PLAN = [
  // --- Week 1: Foundations ---
  { day: 1, title: 'Meet Your Army', focus: 'The 6 chess pieces', activity: { kind: 'level', level: 'meet' } },
  { day: 2, title: 'How They Move', focus: 'Move every piece', activity: { kind: 'level', level: 'move' } },
  { day: 3, title: 'Capturing', focus: 'Knock out enemies', activity: { kind: 'level', level: 'capture' } },
  { day: 4, title: 'Win the Piece!', focus: 'Capture tactics', activity: { kind: 'puzzles', ids: ['cap-rook', 'cap-knight', 'cap-pawn', 'cap-bishop2'] } },
  { day: 5, title: 'Checkmate Basics', focus: 'Trap the King', activity: { kind: 'level', level: 'checkmate' } },
  { day: 6, title: 'Checkmate Practice', focus: 'Mate in one', activity: { kind: 'puzzles', ids: ['mate-rook', 'mate-queen', 'mate-qk', 'mate-2rook'] } },
  { day: 7, title: 'Special Moves', focus: 'Castle, promote, en passant', activity: { kind: 'level', level: 'special' } },

  // --- Week 2: Tactics & first games ---
  { day: 8, title: 'Tactics Mix', focus: 'Captures + mates', activity: { kind: 'puzzles', ids: ['cap-queen', 'mate-rook', 'cap-knight2', 'mate-queen'] } },
  { day: 9, title: 'Your First Game!', focus: 'Play vs Leo', activity: { kind: 'play', difficulty: 'easy' } },
  { day: 10, title: 'Win the Piece Again', focus: 'Capture tactics', activity: { kind: 'puzzles', ids: ['cap-rook2', 'cap-queen2', 'cap-pawn', 'cap-bishop2'] } },
  { day: 11, title: 'Checkmate in One', focus: 'Finish the King', activity: { kind: 'puzzles', ids: ['mate-2rook', 'mate-qk', 'mate-rook', 'mate-queen'] } },
  { day: 12, title: 'Play a Game', focus: 'Practice your skills', activity: { kind: 'play', difficulty: 'easy' } },
  { day: 13, title: 'Tricky Captures', focus: 'Spot the prize', activity: { kind: 'puzzles', ids: ['cap-knight', 'cap-queen', 'cap-knight2', 'cap-queen2'] } },
  { day: 14, title: 'Checkmate Challenge', focus: 'Mate in one', activity: { kind: 'puzzles', ids: ['mate-queen', 'mate-2rook', 'mate-qk', 'mate-rook'] } },

  // --- Week 3: Play & mastery ---
  { day: 15, title: 'Level Up!', focus: 'Play vs a tougher Leo', activity: { kind: 'play', difficulty: 'medium' } },
  { day: 16, title: 'Tactics Review', focus: 'Captures + mates', activity: { kind: 'puzzles', ids: ['cap-bishop2', 'mate-rook', 'cap-queen2', 'mate-2rook'] } },
  { day: 17, title: 'Checkmate Mastery', focus: 'All the mates', activity: { kind: 'puzzles', ids: ['mate-rook', 'mate-queen', 'mate-qk', 'mate-2rook'] } },
  { day: 18, title: 'Play a Game', focus: 'Medium Leo', activity: { kind: 'play', difficulty: 'medium' } },
  { day: 19, title: 'Knight Forks!', focus: 'Forks + mates', activity: { kind: 'puzzles', ids: ['fork-1', 'cap-bigq', 'fork-2', 'mate-2rook'] } },
  { day: 20, title: 'Championship! 🏆', focus: 'Beat the toughest Leo', activity: { kind: 'play', difficulty: 'hard' } },
]

export const PLAN_LENGTH = PLAN.length

// Look up tactic puzzles by id, preserving order.
export function puzzlesByIds(ids) {
  return ids.map((id) => TACTICS.find((t) => t.id === id)).filter(Boolean)
}
