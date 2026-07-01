import { useRef, useState } from 'react'
import { PLAN, PLAN_LENGTH, resolvePuzzles } from '../lessons/plan.js'
import { loadCoach, completeDailyLesson, getMascot } from '../state/coach.js'
import { speak, sfx } from '../audio/speak.js'
import { PLAYER_NAME } from '../config.js'
import PuzzlePlayer from './PuzzlePlayer.jsx'
import MeetThePieces from './MeetThePieces.jsx'
import MoveGames from './MoveGames.jsx'
import CaptureGames from './CaptureGames.jsx'
import CheckmateGames from './CheckmateGames.jsx'
import SpecialMoves from './SpecialMoves.jsx'
import OpeningLesson from './OpeningLesson.jsx'
import PlayGame from './PlayGame.jsx'
import Mascot from './Mascot.jsx'

const LEVELS = {
  meet: MeetThePieces,
  move: MoveGames,
  capture: CaptureGames,
  checkmate: CheckmateGames,
  special: SpecialMoves,
  openings: OpeningLesson,
}

// Puzzle difficulty grows as the journey goes on.
function diffForDay(day) {
  return Math.min(3, 1 + Math.floor((day - 1) / 10))
}

// Turn a day's single activity into a multi-part SESSION so each day has real
// substance (and daily tactics practice, which is what builds skill):
//   - a lesson day  → the lesson, then a bonus puzzle round
//   - a game day    → a puzzle warm-up, then the game
//   - a puzzle day  → the puzzles (already several)
function buildSession(plan) {
  const day = plan.day
  const bonus = { kind: 'puzzles', filter: { level: diffForDay(day) }, count: 4, label: `Day ${day} Puzzles` }
  if (plan.activity.kind === 'level') return [plan.activity, bonus]
  if (plan.activity.kind === 'play') return [{ ...bonus, count: 3, label: `Warm-up` }, plan.activity]
  return [plan.activity] // puzzle day
}

export default function DailyLesson({ onExit, onDone }) {
  const dayIndex = useRef(loadCoach().planDay).current
  const [seg, setSeg] = useState(0)
  const [finished, setFinished] = useState(false)
  const [streak, setStreak] = useState(0)
  const recorded = useRef(false)

  // Already finished the whole journey.
  if (dayIndex >= PLAN_LENGTH) {
    return (
      <div className="lesson celebrate">
        <Mascot speaking message={`You finished the whole journey, ${PLAYER_NAME}! ${getMascot().emoji}`} />
        <div className="confetti">🎓⭐🏆⭐🎓</div>
        <h1>Champion Graduate!</h1>
        <p className="tagline">You completed all {PLAN_LENGTH} days. Keep playing in Practice to stay sharp!</p>
        <button className="big-btn" onClick={onExit}>Back Home 🏠</button>
      </div>
    )
  }

  const plan = PLAN[dayIndex]
  const session = buildSession(plan)

  function markDone() {
    if (recorded.current) return
    recorded.current = true
    const s = completeDailyLesson()
    setStreak(s.streak)
    onDone?.(s)
  }

  // Called when the current segment finishes.
  function segmentDone() {
    if (seg < session.length - 1) {
      setSeg(seg + 1)
    } else {
      markDone()
      setFinished(true)
      sfx.win()
      speak(`Fantastic, ${PLAYER_NAME}! Day ${plan.day} done! See you tomorrow!`)
    }
  }

  if (finished) {
    return (
      <div className="lesson celebrate">
        <Mascot speaking message={`Day ${plan.day} done, ${PLAYER_NAME}! ${getMascot().emoji}`} />
        <div className="confetti">🎉⭐🔥⭐🎉</div>
        <h1>Day {plan.day} Complete!</h1>
        <div className="streak-big">🔥 {streak} day streak!</div>
        <p className="tagline">Come back tomorrow for Day {Math.min(plan.day + 1, PLAN_LENGTH)}!</p>
        <button className="big-btn" onClick={onExit}>Back Home 🏠</button>
      </div>
    )
  }

  const activity = session[seg]

  if (activity.kind === 'puzzles') {
    return (
      <PuzzlePlayer
        key={seg}
        puzzles={resolvePuzzles(activity, plan.day * 100 + seg)}
        title={activity.label || `Day ${plan.day}`}
        onExit={onExit}
        onComplete={segmentDone}
      />
    )
  }

  if (activity.kind === 'play') {
    return <PlayGame key={seg} onExit={onExit} onGameEnd={segmentDone} />
  }

  const LevelComponent = LEVELS[activity.level]
  return <LevelComponent key={seg} onExit={onExit} onComplete={segmentDone} />
}
