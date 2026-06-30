// Generates a large, fully-verified tactic puzzle bank and writes
// src/lessons/tacticsData.js. Every puzzle is checked with chess.js so we never
// ship an illegal position or a wrong solution.
//
// Run from the project root:  node scripts/genTactics.mjs
import { Chess } from 'chess.js'
import { writeFileSync } from 'node:fs'

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const sq = (f, r) => FILES[f] + (r + 1)
const coord = (s) => ({ f: FILES.indexOf(s[0]), r: Number(s[1]) - 1 })
const rint = (n) => Math.floor(Math.random() * n)
const randSquare = () => sq(rint(8), rint(8))
const adjacent = (a, b) => {
  const A = coord(a), B = coord(b)
  return Math.abs(A.f - B.f) <= 1 && Math.abs(A.r - B.r) <= 1 && a !== b
}

function buildFen(pieces, turn = 'w') {
  // pieces: { square: 'K'|'Q'|... uppercase=white, lowercase=black }
  const grid = {}
  for (const [s, p] of Object.entries(pieces)) { const c = coord(s); grid[`${c.f},${c.r}`] = p }
  const rows = []
  for (let r = 7; r >= 0; r--) {
    let row = '', empty = 0
    for (let f = 0; f < 8; f++) {
      const p = grid[`${f},${r}`]
      if (p) { if (empty) { row += empty; empty = 0 } row += p } else empty++
    }
    if (empty) row += empty
    rows.push(row)
  }
  return `${rows.join('/')} ${turn} - - 0 1`
}

// A position with White to move is legal for our purposes if it loads and Black
// (the side NOT to move) is not in check.
function legalWhiteToMove(pieces) {
  const fenW = buildFen(pieces, 'w')
  try {
    const cw = new Chess(fenW)
    if (cw.inCheck()) return false // white already in check — skip
    const cb = new Chess(buildFen(pieces, 'b'))
    if (cb.inCheck()) return false // black in check while white to move — illegal
    return fenW
  } catch {
    return false
  }
}

const PIECE_NAME = { Q: 'Queen', R: 'Rook', B: 'Bishop', N: 'Knight' }
const TARGET_NAME = { q: 'Queen', r: 'Rook', b: 'Bishop', n: 'Knight', p: 'Pawn' }

const out = []
const seen = new Set()
function add(p) {
  if (seen.has(p.fen)) return false
  seen.add(p.fen)
  out.push(p)
  return true
}

// ---------- 1) "Win a piece" captures ----------
function genCaptures(target, want, level) {
  // target counts per kind handled by caller via `want`
  let made = 0, tries = 0
  const attackers = ['Q', 'R', 'B', 'N']
  while (made < want && tries < 200000) {
    tries++
    const wK = randSquare(), bK = randSquare()
    if (wK === bK || adjacent(wK, bK)) continue
    const atk = attackers[rint(attackers.length)]
    const atkSq = randSquare()
    const tgtSq = randSquare()
    const all = [wK, bK, atkSq, tgtSq]
    if (new Set(all).size !== 4) continue
    if (adjacent(tgtSq, bK)) continue // keep the win clean (king can't recapture)
    const pieces = { [wK]: 'K', [bK]: 'k', [atkSq]: atk, [tgtSq]: target }
    const fen = legalWhiteToMove(pieces)
    if (!fen) continue
    const c = new Chess(fen)
    const caps = c.moves({ square: atkSq, verbose: true }).filter((m) => m.to === tgtSq && m.captured)
    if (!caps.length) continue
    // ensure capturing is safe (doesn't leave white in check)
    c.move(caps[0]); const okAfter = !c.inCheck(); c.undo()
    if (!okAfter) continue
    if (add({
      id: `cap-${target}-${made}-${tries % 9999}`,
      type: 'capture', level, theme: target === 'q' ? 'Win the Queen' : target === 'r' ? 'Win a Rook' : 'Win a piece',
      fen, from: atkSq,
      hint: `Win the ${TARGET_NAME[target]}! Move your ${PIECE_NAME[atk]} to capture it.`,
    })) made++
  }
  return made
}

// ---------- 2) Checkmate in one ----------
function genMates(material, want, level) {
  // material: array of white piece letters besides the king, e.g. ['Q'] or ['R','R']
  let made = 0, tries = 0
  while (made < want && tries < 400000) {
    tries++
    const squares = {}
    const wK = randSquare(), bK = randSquare()
    if (wK === bK || adjacent(wK, bK)) continue
    squares[wK] = 'K'; squares[bK] = 'k'
    let ok = true
    for (const m of material) {
      let s = randSquare(), guard = 0
      while (squares[s] && guard++ < 30) s = randSquare()
      if (squares[s]) { ok = false; break }
      squares[s] = m
    }
    if (!ok) continue
    const fen = legalWhiteToMove(squares)
    if (!fen) continue
    const c = new Chess(fen)
    const mating = c.moves({ verbose: true }).filter((mv) => { c.move(mv); const x = c.isCheckmate(); c.undo(); return x })
    if (!mating.length) continue
    const m0 = mating[0]
    if (add({
      id: `mate-${material.join('')}-${made}-${tries % 9999}`,
      type: 'mate', level, theme: 'Checkmate',
      fen, from: m0.from,
      hint: `Checkmate in one! Move your ${PIECE_NAME[m0.piece.toUpperCase()] || 'piece'} to trap the King.`,
    })) made++
  }
  return made
}

// ---------- 3) Knight forks (check + attack the Queen, and it's clean) ----------
const KN = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]]
function knightAttacks(from) {
  const { f, r } = coord(from)
  const out = []
  for (const [df, dr] of KN) { const nf = f + df, nr = r + dr; if (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) out.push(sq(nf, nr)) }
  return out
}
function genForks(want, level) {
  let made = 0, tries = 0
  while (made < want && tries < 400000) {
    tries++
    const wK = randSquare(), bK = randSquare(), nSq = randSquare(), qSq = randSquare()
    if (new Set([wK, bK, nSq, qSq]).size !== 4) continue
    if (adjacent(wK, bK)) continue
    const pieces = { [wK]: 'K', [bK]: 'k', [nSq]: 'N', [qSq]: 'q' }
    const fen = legalWhiteToMove(pieces)
    if (!fen) continue
    const c = new Chess(fen)
    const moves = c.moves({ square: nSq, verbose: true })
    // find a knight move to an empty square that checks the king and attacks the queen
    let chosen = null
    for (const mv of moves) {
      if (mv.captured) continue
      const atks = knightAttacks(mv.to)
      if (!atks.includes(bK) || !atks.includes(qSq)) continue // must hit both
      c.move(mv)
      const givesCheck = c.inCheck() // black to move now -> black in check
      // clean fork: black has no reply that captures the knight on its new square
      const safe = !c.moves({ verbose: true }).some((r) => r.to === mv.to)
      c.undo()
      if (givesCheck && safe) { chosen = mv; break }
    }
    if (!chosen) continue
    if (add({
      id: `fork-${made}-${tries % 9999}`,
      type: 'solution', level, theme: 'Knight Fork',
      fen, from: nSq, to: chosen.to,
      hint: 'Knight Fork! Jump your Knight so it checks the King AND attacks the Queen!',
    })) made++
  }
  return made
}

// Build the bank.
genCaptures('b', 6, 1)
genCaptures('n', 6, 1)
genCaptures('r', 9, 2)
genCaptures('q', 9, 2)
genMates(['Q'], 9, 2)
genMates(['R'], 6, 2)
genMates(['R', 'R'], 6, 3)
genForks(10, 3)

const byLevel = { 1: 0, 2: 0, 3: 0 }
for (const p of out) byLevel[p.level]++
console.log('TOTAL', out.length, '| by level', JSON.stringify(byLevel))
console.log('by theme', JSON.stringify(out.reduce((a, p) => ((a[p.theme] = (a[p.theme] || 0) + 1), a), {})))

const body =
  '// AUTO-GENERATED by scripts/genTactics.mjs — every puzzle verified with chess.js.\n' +
  '// Do not edit by hand; re-run the generator to refresh.\n' +
  'export const TACTICS = [\n' +
  out.map((p) => '  ' + JSON.stringify(p)).join(',\n') +
  ',\n]\n'
writeFileSync(new URL('../src/lessons/tacticsData.js', import.meta.url), body)
console.log('wrote src/lessons/tacticsData.js')
