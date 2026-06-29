// Level 4 — "Checkmate!". Each puzzle is a mate-in-one: the player (White) has
// exactly one move that traps the enemy King. `from` is used only to gently hint
// which piece to move; success is judged by chess.js detecting real checkmate.
export const CHECKMATE_PUZZLES = [
  {
    fen: '6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1',
    from: 'a1',
    hint: "Send your Rook all the way to the back row to trap the King!",
  },
  {
    fen: '7k/8/6K1/8/7Q/8/8/8 w - - 0 1',
    from: 'h4',
    hint: "Bring your Queen right next to the King. Your King keeps her safe!",
  },
  {
    fen: '6k1/5ppp/8/8/8/8/5PPP/3Q2K1 w - - 0 1',
    from: 'd1',
    hint: "Slide your Queen up to the back row for checkmate!",
  },
  {
    fen: '7k/R7/8/8/8/8/8/1R4K1 w - - 0 1',
    from: 'b1',
    hint: "Two Rooks make a ladder! Move the bottom Rook up to trap the King.",
  },
  {
    fen: '7k/8/6K1/8/8/8/8/R7 w - - 0 1',
    from: 'a1',
    hint: "Your King guards the escape squares — now move the Rook to the back row!",
  },
]
