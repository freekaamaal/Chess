// Progress is saved on the device (localStorage) so there's no login for v1.
// Stores which stages are complete and how many stars were earned.

const KEY = 'chess-for-kids-progress-v1'

export function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { completed: {}, stars: {} }
  } catch {
    return { completed: {}, stars: {} }
  }
}

export function saveStageComplete(stageId, stars) {
  const p = loadProgress()
  p.completed[stageId] = true
  p.stars[stageId] = Math.max(p.stars[stageId] || 0, stars)
  localStorage.setItem(KEY, JSON.stringify(p))
  return p
}

export function totalStars(p = loadProgress()) {
  return Object.values(p.stars).reduce((a, b) => a + b, 0)
}
