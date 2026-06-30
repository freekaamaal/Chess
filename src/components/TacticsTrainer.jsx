import { useState } from 'react'
import { pickAdaptive } from '../lessons/tactics.js'
import { getPuzzleRating, updatePuzzleRating, ratingLabel } from '../state/coach.js'
import { speak, sfx } from '../audio/speak.js'
import { PLAYER_NAME } from '../config.js'
import PuzzlePlayer from './PuzzlePlayer.jsx'
import Mascot from './Mascot.jsx'

const ROUND_SIZE = 5

// Endless adaptive puzzle practice: each round of 5 puzzles is chosen near the
// child's tactics rating, which rises as she solves them on the first try.
export default function TacticsTrainer({ onExit }) {
  const [round, setRound] = useState(() => pickAdaptive(ROUND_SIZE, getPuzzleRating()))
  const [key, setKey] = useState(0)
  const [finished, setFinished] = useState(false)

  function handleResult(r) {
    updatePuzzleRating(r.firstTry)
  }

  function handleComplete() {
    setFinished(true)
    sfx.win()
    speak(`Awesome tactics, ${PLAYER_NAME}! Your tactics level is ${ratingLabel()}.`)
  }

  function playAgain() {
    setRound(pickAdaptive(ROUND_SIZE, getPuzzleRating()))
    setKey((k) => k + 1)
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="lesson celebrate">
        <Mascot speaking message={`Tactics level: ${ratingLabel()}! 🎯`} />
        <div className="confetti">🎯⭐🧠⭐🎯</div>
        <h1>Round Complete!</h1>
        <div className="streak-big">🎯 Tactics: {ratingLabel()}</div>
        <div className="lesson-buttons">
          <button className="speak-btn" onClick={onExit}>🏠 Home</button>
          <button className="big-btn" onClick={playAgain}>Play Again 🔄</button>
        </div>
      </div>
    )
  }

  return (
    <PuzzlePlayer
      key={key}
      puzzles={round}
      title="Tactics"
      onExit={onExit}
      onResult={handleResult}
      onComplete={handleComplete}
    />
  )
}
