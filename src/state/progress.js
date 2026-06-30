// Per-child practice progress (which Practice levels are complete + stars).
import { keyFor } from './profiles.js'

const KEY = () => keyFor('chess-progress-v1')

export function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(KEY())) || { completed: {}, stars: {} }
  } catch {
    return { completed: {}, stars: {} }
  }
}

export function saveStageComplete(stageId, stars) {
  const p = loadProgress()
  p.completed[stageId] = true
  p.stars[stageId] = Math.max(p.stars[stageId] || 0, stars)
  localStorage.setItem(KEY(), JSON.stringify(p))
  return p
}

export function totalStars(p = loadProgress()) {
  return Object.values(p.stars).reduce((a, b) => a + b, 0)
}
