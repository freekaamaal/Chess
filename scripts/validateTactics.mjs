// Validates the curated puzzles AND the generated bank with chess.js.
import { Chess } from 'chess.js'
import { CURATED_TACTICS } from '../src/lessons/curatedTactics.js'
import { GENERATED_TACTICS } from '../src/lessons/tacticsData.js'

function attacked(chess, square) {
  // Is `square` capturable by the side to move? (used after White's move -> Black to move)
  return chess.moves({ verbose: true }).some((m) => m.to === square)
}

function check(t) {
  const c = new Chess(t.fen)
  if (t.type === 'mate') {
    try { c.move({ from: t.from, to: t.to, promotion: 'q' }) } catch { return 'illegal mate move' }
    return c.isCheckmate() ? null : 'not checkmate'
  }
  if (t.type === 'capture' || t.type === 'solution') {
    let m; try { m = c.move({ from: t.from, to: t.to, promotion: 'q' }) } catch { return 'illegal move' }
    if (!m) return 'illegal move'
    if (t.type === 'capture') return m.captured && !c.inCheck() && !attacked(c, t.to) ? null : 'not a free capture'
    return c.inCheck() ? null : 'fork gives no check'
  }
  if (t.type === 'save') {
    // The attacked piece must currently BE attacked, and at least one legal move
    // must make it safe; and no way to "solve" while leaving it hanging.
    const cb = new Chess(t.fen.replace(' w ', ' b '))
    if (!attacked(cb, t.from)) return 'piece not actually attacked'
    let anySafe = false
    for (const m of c.moves({ verbose: true })) {
      c.move(m)
      const pieceSq = m.from === t.from ? m.to : t.from
      const stillThere = !!c.get(pieceSq)
      const safe = stillThere && !attacked(c, pieceSq)
      c.undo()
      if (safe) { anySafe = true; break }
    }
    return anySafe ? null : 'no saving move'
  }
  return 'unknown type'
}

let bad = 0
for (const t of CURATED_TACTICS) {
  const err = check(t)
  console.log(`${err ? 'FAIL' : 'ok  '} ${t.id} [${t.type}] ${err || ''}`)
  if (err) bad++
}
let genBad = 0
for (const t of GENERATED_TACTICS) if (check(t)) genBad++
console.log(`\ncurated invalid: ${bad}/${CURATED_TACTICS.length} | generated invalid: ${genBad}/${GENERATED_TACTICS.length}`)
process.exit(bad + genBad ? 1 : 0)
