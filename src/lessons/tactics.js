// The tactic puzzle bank = curated real-game puzzles (curatedTactics.js) +
// auto-generated verified puzzles (tacticsData.js). This module merges them and
// provides pickers. All puzzles are verified by scripts/validateTactics.mjs.
import { GENERATED_TACTICS } from './tacticsData.js'
import { CURATED_TACTICS } from './curatedTactics.js'

export const TACTICS = [...CURATED_TACTICS, ...GENERATED_TACTICS]

// Deterministic shuffle so a given seed always yields the same order.
function seededShuffle(arr, seed) {
  const a = [...arr]
  let s = (seed * 9301 + 49297) % 233280 || 1
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Pick `count` puzzles matching a filter ({ level, theme }), stable per `seed`
// (used so each journey day shows a consistent set). Falls back gracefully.
export function pickPuzzles(filter = {}, count = 4, seed = 1) {
  let pool = TACTICS.filter(
    (t) => (filter.level ? t.level === filter.level : true) && (filter.theme ? t.theme === filter.theme : true),
  )
  if (pool.length === 0) pool = TACTICS
  const shuffled = seededShuffle(pool, seed)
  const out = []
  for (let i = 0; i < count; i++) out.push(shuffled[i % shuffled.length])
  return out
}

// Adaptive picker for the Tactics Trainer: puzzles near the child's rating (1..3),
// with a little randomness so rounds stay fresh as she improves.
export function pickAdaptive(count, rating) {
  const target = Math.max(1, Math.min(3, Math.round(rating)))
  const pool = [...TACTICS]
  pool.sort(
    (a, b) =>
      Math.abs((a.level || 1) - target) - Math.abs((b.level || 1) - target) + (Math.random() - 0.5) * 0.7,
  )
  return pool.slice(0, count)
}
