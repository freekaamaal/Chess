// A chess opponent for a young beginner, with three gentleness levels so the
// coach (Leo) can grow with Navya:
//   easy   — mostly random; rarely grabs material (she wins a lot)
//   medium — usually takes free material and obvious mates
//   hard   — looks one move ahead and plays the materially best move

const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Material score from Black's point of view after a position is reached.
function materialForBlack(chess) {
  let score = 0
  for (const row of chess.board()) {
    for (const sq of row) {
      if (!sq) continue
      score += (sq.color === 'b' ? 1 : -1) * VALUE[sq.type]
    }
  }
  return score
}

export function chooseMove(chess, difficulty = 'easy') {
  const moves = chess.moves({ verbose: true })
  if (!moves.length) return null

  // Every level takes an immediate checkmate when offered.
  for (const m of moves) {
    chess.move(m)
    const mate = chess.isCheckmate()
    chess.undo()
    if (mate) return m
  }

  const captures = moves.filter((m) => m.captured)

  if (difficulty === 'easy') {
    if (captures.length && Math.random() < 0.3) {
      captures.sort((a, b) => VALUE[b.captured] - VALUE[a.captured])
      return captures[0]
    }
    return pick(moves)
  }

  if (difficulty === 'medium') {
    if (captures.length && Math.random() < 0.8) {
      captures.sort((a, b) => VALUE[b.captured] - VALUE[a.captured])
      return captures[0]
    }
    return pick(moves)
  }

  // hard: one-move-ahead greedy on material, with a little randomness among ties.
  let best = -Infinity
  let bestMoves = []
  for (const m of moves) {
    chess.move(m)
    const score = materialForBlack(chess)
    chess.undo()
    if (score > best) {
      best = score
      bestMoves = [m]
    } else if (score === best) {
      bestMoves.push(m)
    }
  }
  return pick(bestMoves)
}
