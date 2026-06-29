// Level 5 — "Special Moves". Three special chess moves, each as a one-move
// puzzle. `success` inspects the chess.js move object to confirm the right kind
// of move was played; `from` glows as a hint.
export const SPECIAL_MOVES = [
  {
    id: 'promote',
    title: 'Promotion',
    emoji: '👑',
    fen: '8/P6k/8/8/8/8/8/7K w - - 0 1',
    from: 'a7',
    hint: "Push your Pawn to the very top row to turn it into a powerful Queen!",
    win: 'You made a Queen! 👑',
    success: (m) => m.flags.includes('p'),
  },
  {
    id: 'castle',
    title: 'Castling',
    emoji: '🏰',
    fen: 'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1',
    from: 'e1',
    hint: "Castling keeps your King safe. Move your King two squares to the right, toward the Rook!",
    win: 'Castled! Your King is safe in its castle! 🏰',
    success: (m) => m.san.startsWith('O-O'),
  },
  {
    id: 'enpassant',
    title: 'En Passant',
    emoji: '🥷',
    fen: '7k/8/8/3pP3/8/8/8/7K w - d6 0 1',
    from: 'e5',
    hint: "A sneaky move! Your Pawn can capture the enemy Pawn next to it by stepping diagonally behind it.",
    win: 'En passant! What a sneaky capture! 🥷',
    success: (m) => m.flags.includes('e'),
  },
]
