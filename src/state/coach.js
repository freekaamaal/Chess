// The "daily coach" brain: streaks, daily time budget, settings (mascot,
// difficulty, daily limit), and badge tracking. Everything is stored on the
// device so the coach remembers Navya day to day with no login.

import { keyFor } from './profiles.js'
import { PLAN_LENGTH } from '../lessons/plan.js'

const KEY = () => keyFor('chess-coach-v1') // per-profile storage

const DEFAULTS = {
  streak: 0,
  longestStreak: 0,
  daysPracticed: 0,
  lastLessonDate: null, // YYYY-MM-DD of the last completed daily lesson
  totalLessons: 0,
  planDay: 0, // number of journey days completed (0..PLAN_LENGTH)
  completedDays: [], // [{ day, date }] for the parent's progress tracker
  puzzleRating: 1, // adaptive tactics level (1..3), rises as she solves faster
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
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY())) }
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
  localStorage.setItem(KEY(), JSON.stringify(s))
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

export const RATING_LABELS = ['Beginner', 'Improver', 'Sharp', 'Star']
export function ratingLabel(r = getPuzzleRating()) {
  return RATING_LABELS[Math.max(0, Math.min(3, Math.round(r) - 1))]
}
export function getPuzzleRating() {
  return loadCoach().puzzleRating || 1
}
// Nudge the tactics rating up on a first-try solve, down if it took retries.
export function updatePuzzleRating(firstTry) {
  const s = loadCoach()
  let r = (s.puzzleRating || 1) + (firstTry ? 0.18 : -0.12)
  s.puzzleRating = Math.max(1, Math.min(3, r))
  save(s)
  return s.puzzleRating
}

// Called when she finishes the day's lesson. Enforces ONE journey day per
// calendar day, advances the streak (or resets it if a day was missed), and
// records the date each day was completed for the parent's tracker.
export function completeDailyLesson() {
  const s = loadCoach()
  if (s.today.lessonDone) return s // already done today — no double advance
  const today = todayStr()

  s.streak = s.lastLessonDate === yesterdayStr() ? s.streak + 1 : 1
  s.longestStreak = Math.max(s.longestStreak, s.streak)
  s.daysPracticed += 1
  s.lastLessonDate = today

  const justDid = (s.planDay || 0) + 1 // 1-based day number completed
  s.planDay = Math.min((s.planDay || 0) + 1, PLAN_LENGTH)
  s.completedDays = [...(s.completedDays || []), { day: justDid, date: today }]

  s.today.lessonDone = true
  s.totalLessons += 1
  save(s)
  return s
}
