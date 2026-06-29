// Each chess piece is introduced as a friendly CHARACTER with a personality.
// This data drives the "Meet the Pieces" stage. Keeping it as plain data means
// new lessons can reuse the same descriptions and voice lines.

export const PIECES = [
  {
    id: 'pawn',
    name: 'Pawn',
    emoji: '♟️',
    color: '#8d6e63',
    title: 'The Brave Little Soldier',
    say: "Hi! I am the Pawn, the brave little soldier. I only march forward, one step at a time. But if I reach the very end of the board, I can become a Queen!",
    // A board position that demonstrates this piece's moves (FEN, white to move).
    demoFen: '8/8/8/8/8/4P3/8/8 w - - 0 1',
  },
  {
    id: 'rook',
    name: 'Rook',
    emoji: '♜',
    color: '#5c6bc0',
    title: 'The Castle Tank',
    say: "I am the Rook! I am like a strong castle tank. I roll in straight lines, up and down and side to side, as far as I want!",
    demoFen: '8/8/8/8/4R3/8/8/8 w - - 0 1',
  },
  {
    id: 'bishop',
    name: 'Bishop',
    emoji: '♝',
    color: '#26a69a',
    title: 'The Diagonal Slider',
    say: "Hello! I am the Bishop. I love to slide diagonally, like sliding down a slide! I always stay on my own color.",
    demoFen: '8/8/8/8/4B3/8/8/8 w - - 0 1',
  },
  {
    id: 'knight',
    name: 'Knight',
    emoji: '♞',
    color: '#ec407a',
    title: 'The Hopping Horse',
    say: "Neigh! I am the Knight, the hopping horse. I jump in the shape of the letter L. I can even hop right over other pieces!",
    demoFen: '8/8/8/8/4N3/8/8/8 w - - 0 1',
  },
  {
    id: 'queen',
    name: 'Queen',
    emoji: '♛',
    color: '#ab47bc',
    title: 'The Most Powerful',
    say: "I am the Queen, the most powerful piece! I can move in straight lines AND diagonally, as far as I like. I am super strong!",
    demoFen: '8/8/8/8/4Q3/8/8/8 w - - 0 1',
  },
  {
    id: 'king',
    name: 'King',
    emoji: '♚',
    color: '#ffa726',
    title: 'The Most Important',
    say: "I am the King, the most important piece of all. I move just one little step in any direction. You must always keep me safe!",
    demoFen: '8/8/8/8/4K3/8/8/8 w - - 0 1',
  },
]
