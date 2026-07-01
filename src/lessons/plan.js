// The "30-Day Chess Journey" — one short lesson per day, gradually harder,
// mirroring how kids' programs (ChessKid, the Steps Method) teach: pieces →
// capturing → checkmate → tactics → real games, with spaced repetition.
//
// Each day has an activity:
//   { kind: 'level',   level: 'meet'|'move'|'capture'|'checkmate'|'special' }
//   { kind: 'puzzles', filter: { level?, theme? }, count }  (drawn from the bank)
//   { kind: 'play',    difficulty: 'easy'|'medium'|'hard' }
import { pickPuzzles } from './tactics.js'

export const PLAN = [
  // --- Week 1: Foundations ---
  { day: 1, title: 'Meet Your Army', focus: 'The 6 chess pieces', activity: { kind: 'level', level: 'meet' } },
  { day: 2, title: 'How They Move', focus: 'Move every piece', activity: { kind: 'level', level: 'move' } },
  { day: 3, title: 'Capturing', focus: 'Knock out enemies', activity: { kind: 'level', level: 'capture' } },
  { day: 4, title: 'Win the Piece!', focus: 'Easy captures', activity: { kind: 'puzzles', filter: { level: 1 }, count: 4 } },
  { day: 5, title: 'Checkmate Basics', focus: 'Trap the King', activity: { kind: 'level', level: 'checkmate' } },
  { day: 6, title: 'Checkmate Practice', focus: 'Mate in one', activity: { kind: 'puzzles', filter: { theme: 'Checkmate' }, count: 4 } },
  { day: 7, title: 'Special Moves', focus: 'Castle, promote, en passant', activity: { kind: 'level', level: 'special' } },

  // --- Week 2: Tactics & first games ---
  { day: 8, title: 'Opening Rules', focus: 'Start every game smart', activity: { kind: 'level', level: 'openings' } },
  { day: 9, title: 'Your First Game!', focus: 'Play vs Leo', activity: { kind: 'play', difficulty: 'easy' } },
  { day: 10, title: 'Win the Piece Again', focus: 'Captures', activity: { kind: 'puzzles', filter: { level: 1 }, count: 4 } },
  { day: 11, title: 'Checkmate in One', focus: 'Finish the King', activity: { kind: 'puzzles', filter: { theme: 'Checkmate' }, count: 4 } },
  { day: 12, title: 'Play a Game', focus: 'Practice your skills', activity: { kind: 'play', difficulty: 'easy' } },
  { day: 13, title: 'Win the Queen', focus: 'Grab the big prize', activity: { kind: 'puzzles', filter: { theme: 'Win the Queen' }, count: 4 } },
  { day: 14, title: 'Checkmate Challenge', focus: 'Mate in one', activity: { kind: 'puzzles', filter: { theme: 'Checkmate' }, count: 5 } },

  // --- Week 3: Play & mastery ---
  { day: 15, title: 'Level Up!', focus: 'Play vs a tougher Leo', activity: { kind: 'play', difficulty: 'medium' } },
  { day: 16, title: 'Defense!', focus: 'Save your attacked pieces', activity: { kind: 'puzzles', filter: { theme: 'Defense' }, count: 4 } },
  { day: 17, title: 'Checkmate Mastery', focus: 'All the mates', activity: { kind: 'puzzles', filter: { theme: 'Checkmate' }, count: 5 } },
  { day: 18, title: 'Play a Game', focus: 'Medium Leo', activity: { kind: 'play', difficulty: 'medium' } },
  { day: 19, title: 'Knight Forks!', focus: 'The fork trick', activity: { kind: 'puzzles', filter: { theme: 'Knight Fork' }, count: 4 } },
  { day: 20, title: 'Championship! 🏆', focus: 'Beat the medium Leo', activity: { kind: 'play', difficulty: 'medium' } },

  // --- Week 4+: Sharpen & advance ---
  { day: 21, title: 'Sharp Tactics', focus: 'Win the big pieces', activity: { kind: 'puzzles', filter: { level: 2 }, count: 5 } },
  { day: 22, title: 'Mate Masters', focus: 'Harder mates', activity: { kind: 'puzzles', filter: { theme: 'Checkmate' }, count: 5 } },
  { day: 23, title: 'Play a Game', focus: 'Medium Leo', activity: { kind: 'play', difficulty: 'medium' } },
  { day: 24, title: 'Fork Frenzy', focus: 'More knight forks', activity: { kind: 'puzzles', filter: { theme: 'Knight Fork' }, count: 5 } },
  { day: 25, title: 'Tricky Tactics', focus: 'Level 3 puzzles', activity: { kind: 'puzzles', filter: { level: 3 }, count: 5 } },
  { day: 26, title: 'Tough Game', focus: 'Play the HARD Leo', activity: { kind: 'play', difficulty: 'hard' } },
  { day: 27, title: 'Checkmate Sprint', focus: 'Fast mates', activity: { kind: 'puzzles', filter: { theme: 'Checkmate' }, count: 6 } },
  { day: 28, title: 'Grand Tactics', focus: 'Everything together', activity: { kind: 'puzzles', filter: { level: 3 }, count: 6 } },
  { day: 29, title: 'Almost There!', focus: 'Play the HARD Leo', activity: { kind: 'play', difficulty: 'hard' } },
  { day: 30, title: 'Final Championship 🎓', focus: 'Beat the toughest Leo', activity: { kind: 'play', difficulty: 'hard' } },
]

export const PLAN_LENGTH = PLAN.length

// Resolve a 'puzzles' day's activity into actual puzzles (stable per day number).
export function resolvePuzzles(activity, daySeed) {
  return pickPuzzles(activity.filter, activity.count || 4, daySeed)
}
