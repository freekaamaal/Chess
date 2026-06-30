// The "daily coach" brain: streaks, daily time budget, settings (mascot,
// difficulty, daily limit), and badge tracking. Everything is stored on the
// device so the coach remembers Navya day to day with no login.

const KEY = 'chess-coach-v1'

const DEFAULTS = {
  streak: 0,
  longestStreak: 0,
  daysPracticed: 0,
  lastLessonDate: null, // YYYY-MM-DD of the last completed daily lesson
  totalLessons: 0,
  today: { date: null, secondsSpent: 0, lessonDone: false },
  settings: { mascot: 'lion', difficulty: 'easy', dailyLimitMin: 15, voice: true },
}

export const MASCOTS = {
  lion: { emoji: '🦁', name: 'Leo' },
  puppy: { emoji: '🐶', name: 'Coco' },
  unicorn: { emoji: '🦄', name: 'Sparkle' },
  robot: { emoji: '🤖', name: 'Robo' },
  cat: { emoji: '🐱', name: 'Mittens' },
}

export function todayStr(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function yesterdayStr() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return todayStr(d)
}

function readRaw() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY)) }
  } catch {
    return { ...DEFAULTS }
  }
}

// Always normalise "today" so a new calendar day resets the daily timer/flag.
export function loadCoach() {
  const s = readRaw()
  s.settings = { ...DEFAULTS.settings, ...(s.settings || {}) }
  if (!s.today || s.today.date !== todayStr()) {
    s.today = { date: todayStr(), secondsSpent: 0, lessonDone: false }
    save(s)
  }
  return s
}

function save(s) {
  localStorage.setItem(KEY, JSON.stringify(s))
}

export function getMascot() {
  return MASCOTS[loadCoach().settings.mascot] || MASCOTS.lion
}

export function getSettings() {
  return loadCoach().settings
}

export function setSetting(key, value) {
  const s = loadCoach()
  s.settings[key] = value
  save(s)
  return s
}

// Seconds of practice spent today (timer ticks while she's in an activity).
export function addSeconds(n) {
  const s = loadCoach()
  s.today.secondsSpent += n
  save(s)
  return s
}

export function secondsLeftToday(s = loadCoach()) {
  const limit = s.settings.dailyLimitMin * 60
  if (!limit) return Infinity // 0 minutes means "no limit"
  return Math.max(0, limit - s.today.secondsSpent)
}

// Called when she finishes the daily lesson: advances the streak (or resets it
// if she missed a day) and records the practice day. No double-count per day.
export function completeDailyLesson() {
  const s = loadCoach()
  const today = todayStr()
  if (s.lastLessonDate !== today) {
    s.streak = s.lastLessonDate === yesterdayStr() ? s.streak + 1 : 1
    s.longestStreak = Math.max(s.longestStreak, s.streak)
    s.daysPracticed += 1
    s.lastLessonDate = today
  }
  s.today.lessonDone = true
  s.totalLessons += 1
  save(s)
  return s
}
