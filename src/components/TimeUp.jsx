import { PLAYER_NAME } from '../config.js'
import { getMascot } from '../state/coach.js'
import Mascot from './Mascot.jsx'

// Shown when the daily play-time budget is used up — a gentle, happy goodbye so
// stopping feels like part of the game, not a punishment.
export default function TimeUp({ onExit }) {
  return (
    <div className="lesson celebrate">
      <Mascot speaking message={`Great practising today, ${PLAYER_NAME}! ${getMascot().emoji}`} />
      <div className="confetti">🌙⭐😴⭐🌙</div>
      <h1>Time's Up for Today!</h1>
      <p className="tagline">You did great, {PLAYER_NAME}. Your coach will be back tomorrow with a new lesson. Rest those clever brains! 🧠</p>
      <button className="big-btn" onClick={onExit}>Back Home 🏠</button>
    </div>
  )
}
