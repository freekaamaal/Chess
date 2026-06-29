// A deliberately gentle chess opponent for a young beginner. It will take an
// obvious checkmate and sometimes grab a free piece, but mostly plays simple
// moves so the child can win, build confidence, and learn from real games.

const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Choose Black's reply. `chess` is a chess.js instance whose turn is Black.
export function chooseMove(chess) {
  const moves = chess.moves({ verbose: true })
  if (!moves.length) return null

  // 1) Always take a checkmate if one is available.
  for (const m of moves) {
    chess.move(m)
    const mate = chess.isCheckmate()
    chess.undo()
    if (mate) return m
  }

  // 2) About half the time, grab the most valuable safe-ish capture.
  const captures = moves.filter((m) => m.captured)
  if (captures.length && Math.random() < 0.5) {
    captures.sort((a, b) => VALUE[b.captured] - VALUE[a.captured])
    return captures[0]
  }

  // 3) Otherwise just play a random legal move (keeps it easy and fun).
  return pick(moves)
}
