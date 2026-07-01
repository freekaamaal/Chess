// Generates a large, fully-verified tactic puzzle bank and writes
// src/lessons/tacticsData.js. Every puzzle is checked with chess.js so we never
// ship an illegal position or a wrong solution.
//
// v2: after finding a tactic on a sparse board, it adds a game-like "backdrop"
// of extra pieces (pawns, home-rank pieces) — keeping ONLY additions that
// re-verify the exact solution still works — so puzzles look like real games.
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

function legalWhiteToMove(pieces) {
  const fenW = buildFen(pieces, 'w')
  try {
    const cw = new Chess(fenW)
    if (cw.inCheck()) return false
    const cb = new Chess(buildFen(pieces, 'b'))
    if (cb.inCheck()) return false
    return fenW
  } catch {
    return false
  }
}

// Verify the exact intended solution still holds for a piece map.
function solutionHolds(pieces, sol) {
  const fen = legalWhiteToMove(pieces)
  if (!fen) return false
  const c = new Chess(fen)
  if (sol.type === 'mate') {
    try { c.move({ from: sol.from, to: sol.to, promotion: 'q' }) } catch { return false }
    return c.isCheckmate()
  }
  if (sol.type === 'capture') {
    const m = c.moves({ square: sol.from, verbose: true }).find((x) => x.to === sol.to && x.captured)
    if (!m) return false
    c.move(m)
    const ok = !c.inCheck() && !c.moves({ verbose: true }).some((x) => x.to === sol.to) // free piece
    return ok
  }
  if (sol.type === 'fork') {
    let m
    try { m = c.move({ from: sol.from, to: sol.to }) } catch { return false }
    if (!m) return false
    const gives = c.inCheck()
    const clean = !c.moves({ verbose: true }).some((x) => x.to === sol.to) // knight can't be captured
    return gives && clean
  }
  return false
}

// Try to add a realistic backdrop of pieces without changing the solution.
const WHITE_BACKDROP = ['a2:P', 'b2:P', 'c2:P', 'f2:P', 'g2:P', 'h2:P', 'd3:P', 'e3:P', 'a1:R', 'h1:R', 'b1:N', 'c1:B']
const BLACK_BACKDROP = ['a7:p', 'b7:p', 'c7:p', 'f7:p', 'g7:p', 'h7:p', 'd6:p', 'e6:p', 'a8:r', 'h8:r', 'b8:n', 'c8:b']
function shuffle(a) { const x = [...a]; for (let i = x.length - 1; i > 0; i--) { const j = rint(i + 1);[x[i], x[j]] = [x[j], x[i]] } return x }

function addBackdrop(base, sol, occupied) {
  const pieces = { ...base }
  const cands = shuffle([...WHITE_BACKDROP, ...BLACK_BACKDROP])
  let added = 0
  const wantMin = 6 + rint(5) // aim for 6-10 extra pieces
  for (const cand of cands) {
    if (added >= wantMin) break
    const [s, p] = cand.split(':')
    if (pieces[s] || occupied.has(s)) continue
    const trial = { ...pieces, [s]: p }
    if (solutionHolds(trial, sol)) { pieces[s] = p; added++ }
  }
  return added >= 3 ? pieces : null // require a decent backdrop, else reject
}

const PIECE_NAME = { Q: 'Queen', R: 'Rook', B: 'Bishop', N: 'Knight' }
const TARGET_NAME = { q: 'Queen', r: 'Rook', b: 'Bishop', n: 'Knight', p: 'Pawn' }

const out = []
const seen = new Set()
function add(p) { if (seen.has(p.fen)) return false; seen.add(p.fen); out.push(p); return true }

const KN = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]]
function knightAttacks(from) {
  const { f, r } = coord(from), o = []
  for (const [df, dr] of KN) { const nf = f + df, nr = r + dr; if (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) o.push(sq(nf, nr)) }
  return o
}

// ---------- Captures ("win a piece") ----------
function genCaptures(target, want, level) {
  let made = 0, tries = 0
  const attackers = ['Q', 'R', 'B', 'N']
  while (made < want && tries < 400000) {
    tries++
    const wK = randSquare(), bK = randSquare(), atkSq = randSquare(), tgtSq = randSquare()
    if (new Set([wK, bK, atkSq, tgtSq]).size !== 4) continue
    if (adjacent(wK, bK) || adjacent(tgtSq, bK)) continue
    const atk = attackers[rint(attackers.length)]
    const base = { [wK]: 'K', [bK]: 'k', [atkSq]: atk, [tgtSq]: target }
    const sol = { type: 'capture', from: atkSq, to: tgtSq }
    if (!solutionHolds(base, sol)) continue
    const full = addBackdrop(base, sol, new Set([wK, bK, atkSq, tgtSq]))
    if (!full) continue
    const fen = buildFen(full, 'w')
    if (add({
      id: `cap-${target}-${made}-${tries % 9999}`, type: 'capture', level,
      theme: target === 'q' ? 'Win the Queen' : target === 'r' ? 'Win a Rook' : 'Win a piece',
      fen, from: atkSq, to: tgtSq,
      hint: `Win the ${TARGET_NAME[target]}! Move your ${PIECE_NAME[atk]} to capture it.`,
    })) made++
  }
  return made
}

// ---------- Checkmate in one ----------
function genMates(material, want, level) {
  let made = 0, tries = 0
  while (made < want && tries < 800000) {
    tries++
    const squares = {}
    const wK = randSquare(), bK = randSquare()
    if (wK === bK || adjacent(wK, bK)) continue
    squares[wK] = 'K'; squares[bK] = 'k'
    let ok = true
    for (const m of material) { let s = randSquare(), g = 0; while (squares[s] && g++ < 30) s = randSquare(); if (squares[s]) { ok = false; break } squares[s] = m }
    if (!ok) continue
    const fen0 = legalWhiteToMove(squares)
    if (!fen0) continue
    const c = new Chess(fen0)
    const mating = c.moves({ verbose: true }).filter((mv) => { c.move(mv); const x = c.isCheckmate(); c.undo(); return x })
    if (!mating.length) continue
    const m0 = mating[0]
    const sol = { type: 'mate', from: m0.from, to: m0.to }
    const full = addBackdrop(squares, sol, new Set(Object.keys(squares)))
    if (!full) continue
    const fen = buildFen(full, 'w')
    if (add({
      id: `mate-${material.join('')}-${made}-${tries % 9999}`, type: 'mate', level, theme: 'Checkmate',
      fen, from: m0.from, to: m0.to,
      hint: `Checkmate in one! Move your ${PIECE_NAME[m0.piece.toUpperCase()] || 'piece'} to trap the King.`,
    })) made++
  }
  return made
}

// ---------- Knight forks ----------
function genForks(want, level) {
  let made = 0, tries = 0
  while (made < want && tries < 800000) {
    tries++
    const wK = randSquare(), bK = randSquare(), nSq = randSquare(), qSq = randSquare()
    if (new Set([wK, bK, nSq, qSq]).size !== 4 || adjacent(wK, bK)) continue
    const base = { [wK]: 'K', [bK]: 'k', [nSq]: 'N', [qSq]: 'q' }
    const fen0 = legalWhiteToMove(base)
    if (!fen0) continue
    const c = new Chess(fen0)
    let chosen = null
    for (const mv of c.moves({ square: nSq, verbose: true })) {
      if (mv.captured) continue
      const atks = knightAttacks(mv.to)
      if (!atks.includes(bK) || !atks.includes(qSq)) continue
      c.move(mv); const gives = c.inCheck(); const safe = !c.moves({ verbose: true }).some((r) => r.to === mv.to); c.undo()
      if (gives && safe) { chosen = mv; break }
    }
    if (!chosen) continue
    const sol = { type: 'fork', from: nSq, to: chosen.to }
    const full = addBackdrop(base, sol, new Set([wK, bK, nSq, qSq]))
    if (!full) continue
    const fen = buildFen(full, 'w')
    if (add({
      id: `fork-${made}-${tries % 9999}`, type: 'solution', level, theme: 'Knight Fork',
      fen, from: nSq, to: chosen.to,
      hint: 'Knight Fork! Jump your Knight so it checks the King AND attacks the Queen!',
    })) made++
  }
  return made
}

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
const avgPieces = (out.reduce((a, p) => a + p.fen.split(' ')[0].replace(/[^a-zA-Z]/g, '').length, 0) / out.length).toFixed(1)
console.log('TOTAL', out.length, '| by level', JSON.stringify(byLevel), '| avg pieces/board', avgPieces)

const body =
  '// AUTO-GENERATED by scripts/genTactics.mjs — every puzzle verified with chess.js.\n' +
  '// Do not edit by hand; re-run the generator to refresh.\n' +
  'export const GENERATED_TACTICS = [\n' +
  out.map((p) => '  ' + JSON.stringify(p)).join(',\n') +
  ',\n]\n'
writeFileSync(new URL('../src/lessons/tacticsData.js', import.meta.url), body)
console.log('wrote src/lessons/tacticsData.js')
