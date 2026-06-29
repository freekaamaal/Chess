// Lightweight move-pattern generator for the teaching demos.
//
// The "Meet the Pieces" stage shows ONE piece on an otherwise empty board and
// lights up every square it could move to. chess.js refuses positions without
// kings, so for these isolated demos we compute reachable squares ourselves.
// (Real games later use chess.js for full, correct rules.)

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

function toCoord(square) {
  return { x: FILES.indexOf(square[0]), y: Number(square[1]) - 1 }
}
function toSquare(x, y) {
  if (x < 0 || x > 7 || y < 0 || y > 7) return null
  return FILES[x] + (y + 1)
}

// Slide outward along a set of directions until the board edge (empty board).
function slide(square, directions) {
  const { x, y } = toCoord(square)
  const out = []
  for (const [dx, dy] of directions) {
    let nx = x + dx
    let ny = y + dy
    let sq
    while ((sq = toSquare(nx, ny))) {
      out.push(sq)
      nx += dx
      ny += dy
    }
  }
  return out
}

function step(square, offsets) {
  const { x, y } = toCoord(square)
  return offsets.map(([dx, dy]) => toSquare(x + dx, y + dy)).filter(Boolean)
}

const DIAGONALS = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
const STRAIGHTS = [[1, 0], [-1, 0], [0, 1], [0, -1]]

export function reachableSquares(pieceId, square) {
  switch (pieceId) {
    case 'pawn':
      // White pawn: one step forward (two from the starting rank).
      return step(square, square[1] === '2' ? [[0, 1], [0, 2]] : [[0, 1]])
    case 'rook':
      return slide(square, STRAIGHTS)
    case 'bishop':
      return slide(square, DIAGONALS)
    case 'queen':
      return slide(square, [...STRAIGHTS, ...DIAGONALS])
    case 'king':
      return step(square, [...STRAIGHTS, ...DIAGONALS])
    case 'knight':
      return step(square, [
        [1, 2], [2, 1], [2, -1], [1, -2],
        [-1, -2], [-2, -1], [-2, 1], [-1, 2],
      ])
    default:
      return []
  }
}

// FEN characters for white pieces, keyed by our piece ids.
const FEN_CHAR = { pawn: 'P', rook: 'R', bishop: 'B', knight: 'N', queen: 'Q', king: 'K' }

// Build a board-only FEN with a single white piece on the given square. Used by
// the movement games, which put one draggable piece on an otherwise empty board.
export function singlePieceFen(pieceId, square) {
  const { x, y } = toCoord(square)
  const rows = []
  for (let r = 7; r >= 0; r--) {
    let row = ''
    let empty = 0
    for (let f = 0; f < 8; f++) {
      if (f === x && r === y) {
        if (empty) { row += empty; empty = 0 }
        row += FEN_CHAR[pieceId]
      } else {
        empty++
      }
    }
    if (empty) row += empty
    rows.push(row)
  }
  return rows.join('/') + ' w - - 0 1'
}

// The square the demo piece sits on, read from its FEN (single piece only).
export function pieceSquareFromFen(fen) {
  const rows = fen.split(' ')[0].split('/')
  for (let r = 0; r < 8; r++) {
    let file = 0
    for (const ch of rows[r]) {
      if (/\d/.test(ch)) {
        file += Number(ch)
      } else {
        return FILES[file] + (8 - r)
      }
    }
  }
  return null
}
