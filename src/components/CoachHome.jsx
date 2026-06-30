import { loadCoach, secondsLeftToday, getMascot } from '../state/coach.js'
import { PLAYER_NAME } from '../config.js'
import Mascot from './Mascot.jsx'

// The daily coach home: the coach greets Navya, shows her streak and today's
// status, and offers Today's Lesson plus Practice, Trophies and Settings.
export default function CoachHome({ onStartLesson, onPractice, onTrophy, onSettings }) {
  const coach = loadCoach()
  const mascot = getMascot()
  const left = secondsLeftToday(coach)
  const outOfTime = left <= 0
  const lessonDone = coach.today.lessonDone
  const mins = left === Infinity ? null : Math.ceil(left / 60)

  let greeting
  if (lessonDone) greeting = `Great job today, ${PLAYER_NAME}! Come back tomorrow for more. ${mascot.emoji}`
  else if (outOfTime) greeting = `That's enough for today, ${PLAYER_NAME}. See you tomorrow! ${mascot.emoji}`
  else greeting = `Hi ${PLAYER_NAME}! I'm ${mascot.name}, your chess coach. Ready for today's lesson?`

  return (
    <div className="map coach-home">
      <header className="map-header">
        <h1>{PLAYER_NAME}'s Chess</h1>
        <div className="header-right">
          <span className="total-stars">🔥 {coach.streak}</span>
        </div>
      </header>

      <Mascot speaking message={greeting} />

      <div className="today-card">
        {lessonDone ? (
          <>
            <div className="today-big">✅ Lesson Done!</div>
            <div className="today-sub">🔥 {coach.streak} day streak — see you tomorrow!</div>
          </>
        ) : outOfTime ? (
          <>
            <div className="today-big">⏰ Time's up for today</div>
            <div className="today-sub">Your coach will be back tomorrow!</div>
          </>
        ) : (
          <>
            <div className="today-big">Today's Lesson</div>
            <div className="today-sub">A few quick puzzles with your coach{mins != null ? ` · ${mins} min left today` : ''}</div>
            <button className="big-btn start-btn" onClick={onStartLesson}>▶ Start Today's Lesson</button>
          </>
        )}
      </div>

      <div className="home-nav">
        <button className="nav-card" onClick={onPractice}>
          <span className="nav-emoji">🗺️</span>
          <span>Practice</span>
          <span className="nav-sub">Learn the 6 levels</span>
        </button>
        <button className="nav-card" onClick={onTrophy}>
          <span className="nav-emoji">🏆</span>
          <span>Trophies</span>
          <span className="nav-sub">See your progress</span>
        </button>
        <button className="nav-card" onClick={onSettings}>
          <span className="nav-emoji">⚙️</span>
          <span>Settings</span>
          <span className="nav-sub">Coach & time</span>
        </button>
      </div>
    </div>
  )
}
