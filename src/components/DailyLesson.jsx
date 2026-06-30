import { useState } from 'react'
import { dailyPlan } from '../lessons/tactics.js'
import { todayStr, completeDailyLesson, getMascot } from '../state/coach.js'
import { speak, sfx } from '../audio/speak.js'
import { PLAYER_NAME } from '../config.js'
import PuzzlePlayer from './PuzzlePlayer.jsx'
import Mascot from './Mascot.jsx'

// Today's coaching session: a short sequence of tactic puzzles. Finishing it
// advances Navya's streak and marks the day done.
export default function DailyLesson({ onExit, onDone }) {
  const [plan] = useState(() => dailyPlan(todayStr(), 4))
  const [finished, setFinished] = useState(false)
  const [streak, setStreak] = useState(0)

  function handleComplete() {
    const s = completeDailyLesson()
    setStreak(s.streak)
    setFinished(true)
    sfx.win()
    const coach = getMascot()
    speak(`Fantastic work today, ${PLAYER_NAME}! That's a ${s.streak} day streak. See you tomorrow!`)
    onDone?.(s)
  }

  if (finished) {
    return (
      <div className="lesson celebrate">
        <Mascot speaking message={`See you tomorrow, ${PLAYER_NAME}! ${getMascot().emoji}`} />
        <div className="confetti">🎉⭐🔥⭐🎉</div>
        <h1>Lesson Done!</h1>
        <div className="streak-big">🔥 {streak} day streak!</div>
        <p className="tagline">Come back tomorrow for a new lesson with your coach.</p>
        <button className="big-btn" onClick={onExit}>
          Back Home 🏠
        </button>
      </div>
    )
  }

  return (
    <PuzzlePlayer
      puzzles={plan}
      title="Today's Puzzle"
      onExit={onExit}
      onComplete={handleComplete}
    />
  )
}
