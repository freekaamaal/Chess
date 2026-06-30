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
import PlayGame from './PlayGame.jsx'
import Mascot from './Mascot.jsx'

const LEVELS = {
  meet: MeetThePieces,
  move: MoveGames,
  capture: CaptureGames,
  checkmate: CheckmateGames,
  special: SpecialMoves,
}

// Runs TODAY's journey day: whatever activity the plan says for the child's
// current day. Finishing it advances the streak and the journey by one day.
export default function DailyLesson({ onExit, onDone }) {
  const dayIndex = useRef(loadCoach().planDay).current
  const [finished, setFinished] = useState(false)
  const [streak, setStreak] = useState(0)
  const recorded = useRef(false)

  // Already finished the whole 20-day journey.
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

  function markDone() {
    if (recorded.current) return
    recorded.current = true
    const s = completeDailyLesson()
    setStreak(s.streak)
    onDone?.(s)
  }

  function finishWithCelebration() {
    markDone()
    setFinished(true)
    sfx.win()
    speak(`Fantastic, ${PLAYER_NAME}! Day ${plan.day} done! See you tomorrow!`)
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

  const { activity } = plan

  if (activity.kind === 'puzzles') {
    return (
      <PuzzlePlayer
        puzzles={resolvePuzzles(activity, plan.day)}
        title={`Day ${plan.day}`}
        onExit={onExit}
        onComplete={finishWithCelebration}
      />
    )
  }

  if (activity.kind === 'play') {
    return <PlayGame onExit={onExit} onGameEnd={markDone} />
  }

  // activity.kind === 'level' — the level shows its own celebration; we just
  // record the day when it reports completion.
  const LevelComponent = LEVELS[activity.level]
  return <LevelComponent onExit={onExit} onComplete={markDone} />
}
