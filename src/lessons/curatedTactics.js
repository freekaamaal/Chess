// Hand-crafted, real-game puzzles to complement the generated bank:
//  - famous mating patterns kids should know (Scholar's mate, back-rank mate)
//  - DEFENSE puzzles ('save' type): your piece is attacked — move it to safety.
// All are verified by scripts/validateTactics.mjs.
//
// 'save' puzzles: `from` is the attacked piece; success = after her move that
// piece is safe (moved to an unattacked square, or the attacker was captured).
export const CURATED_TACTICS = [
  {
    id: 'scholars-mate', type: 'mate', level: 2, theme: 'Checkmate',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1',
    from: 'h5', to: 'f7',
    hint: "Scholar's Mate! Capture the f7 pawn with your Queen — your Bishop protects her.",
  },
  {
    id: 'backrank-mate', type: 'mate', level: 2, theme: 'Checkmate',
    fen: '6k1/5ppp/8/8/8/8/5PPP/1R4K1 w - - 0 1',
    from: 'b1', to: 'b8',
    hint: 'Back-rank mate! The King is trapped by its own pawns — slide your Rook to the back row.',
  },
  {
    id: 'royal-fork', type: 'solution', level: 3, theme: 'Knight Fork',
    fen: 'r3k3/pp3ppp/8/3N4/7q/8/PPP2PPP/4K3 w - - 0 1',
    from: 'd5', to: 'c7',
    hint: 'Royal fork! Jump your Knight to c7 — it checks the King and attacks the Rook!',
  },
  {
    id: 'save-queen', type: 'save', level: 1, theme: 'Defense',
    fen: '6k1/8/8/1p6/2Q5/8/6PP/6K1 w - - 0 1',
    from: 'c4',
    hint: 'Danger! Your Queen is attacked by the pawn. Move her to a safe square!',
  },
  {
    id: 'save-rook', type: 'save', level: 2, theme: 'Defense',
    fen: '6k1/8/8/8/3b4/8/5PP1/R6K w - - 0 1',
    from: 'a1',
    hint: 'Watch out! The Bishop attacks your Rook. Move your Rook to safety!',
  },
  {
    id: 'save-knight', type: 'save', level: 2, theme: 'Defense',
    fen: '6k1/8/8/8/8/3r4/3N2PP/6K1 w - - 0 1',
    from: 'd2',
    hint: 'Your Knight is under attack from the Rook! Hop it to a safe square.',
  },
  {
    id: 'save-bishop', type: 'save', level: 1, theme: 'Defense',
    fen: '6k1/8/8/8/2p5/3B4/6PP/6K1 w - - 0 1',
    from: 'd3',
    hint: 'The pawn attacks your Bishop! Slide it away to safety.',
  },
]
