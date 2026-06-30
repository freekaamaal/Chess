import { loadCoach, secondsLeftToday, getMascot } from '../state/coach.js'
import { PLAN, PLAN_LENGTH } from '../lessons/plan.js'
import { getActiveProfile } from '../state/profiles.js'
import Mascot from './Mascot.jsx'

// The daily coach home: the coach greets the child, shows her streak and TODAY's
// journey day, and offers Today's Lesson plus Plan, Practice, Trophies, Settings.
export default function CoachHome({ onStartLesson, onPlan, onPractice, onTrophy, onSettings }) {
  const coach = loadCoach()
  const mascot = getMascot()
  const profile = getActiveProfile()
  const name = profile?.name || 'friend'
  const left = secondsLeftToday(coach)
  const outOfTime = left <= 0
  const lessonDone = coach.today.lessonDone
  const mins = left === Infinity ? null : Math.ceil(left / 60)
  const graduated = coach.planDay >= PLAN_LENGTH
  const today = PLAN[Math.min(coach.planDay, PLAN_LENGTH - 1)]

  let greeting
  if (graduated) greeting = `You're a chess graduate, ${name}! ${mascot.emoji} Keep practising to stay sharp!`
  else if (lessonDone) greeting = `Great job today, ${name}! Come back tomorrow for Day ${coach.planDay + 1}. ${mascot.emoji}`
  else if (outOfTime) greeting = `That's enough for today, ${name}. See you tomorrow! ${mascot.emoji}`
  else greeting = `Hi ${name}! I'm ${mascot.name}, your chess coach. Ready for Day ${today.day}?`

  return (
    <div className="map coach-home">
      <header className="map-header">
        <h1>{name}'s Chess</h1>
        <div className="header-right">
          <span className="total-stars">🔥 {coach.streak}</span>
        </div>
      </header>

      <Mascot speaking message={greeting} />

      <div className="today-card">
        {graduated ? (
          <>
            <div className="today-big">🎓 Journey Complete!</div>
            <div className="today-sub">All {PLAN_LENGTH} days done. Play in Practice anytime!</div>
          </>
        ) : lessonDone ? (
          <>
            <div className="today-big">✅ Day {coach.planDay} Done!</div>
            <div className="today-sub">🔥 {coach.streak} day streak — come back tomorrow!</div>
          </>
        ) : outOfTime ? (
          <>
            <div className="today-big">⏰ Time's up for today</div>
            <div className="today-sub">Your coach will be back tomorrow!</div>
          </>
        ) : (
          <>
            <div className="today-pill">Day {today.day} of {PLAN_LENGTH}</div>
            <div className="today-big">{today.title}</div>
            <div className="today-sub">{today.focus}{mins != null ? ` · ${mins} min left` : ''}</div>
            <button className="big-btn start-btn" onClick={onStartLesson}>▶ Start Day {today.day}</button>
          </>
        )}
      </div>

      <div className="home-nav">
        <button className="nav-card" onClick={onPlan}>
          <span className="nav-emoji">🚀</span><span>My Plan</span><span className="nav-sub">20-day journey</span>
        </button>
        <button className="nav-card" onClick={onTrophy}>
          <span className="nav-emoji">🏆</span><span>Trophies</span><span className="nav-sub">Your progress</span>
        </button>
        <button className="nav-card" onClick={onPractice}>
          <span className="nav-emoji">🗺️</span><span>Practice</span><span className="nav-sub">The 6 levels</span>
        </button>
        <button className="nav-card" onClick={onSettings}>
          <span className="nav-emoji">⚙️</span><span>Settings</span><span className="nav-sub">Coach & time</span>
        </button>
      </div>
    </div>
  )
}
