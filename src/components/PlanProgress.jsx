import { loadCoach } from '../state/coach.js'
import { PLAN } from '../lessons/plan.js'
import { getActiveProfile } from '../state/profiles.js'

// The 20-Day Journey tracker — shows which days are done (with the date), the
// current day, and what's still locked. Doubles as the parent's accountability view.
export default function PlanProgress({ onExit }) {
  const coach = loadCoach()
  const profile = getActiveProfile()
  const dateByDay = Object.fromEntries((coach.completedDays || []).map((d) => [d.day, d.date]))
  const current = coach.planDay // 0-based index of next day to do

  return (
    <div className="map">
      <div className="lesson-top">
        <button className="back-btn" onClick={onExit} aria-label="Back">⬅️</button>
        <h1 style={{ margin: 0, fontSize: 24 }}>{profile?.name}'s Journey 🚀</h1>
        <span style={{ width: 48 }} />
      </div>
      <p className="tagline">
        Day {Math.min(current + 1, PLAN.length)} of {PLAN.length} · 🔥 {coach.streak} day streak
      </p>

      <div className="plan-list">
        {PLAN.map((d, i) => {
          const done = i < current
          const isCurrent = i === current
          const status = done ? 'done' : isCurrent ? 'current' : 'locked'
          return (
            <div key={d.day} className={`plan-row ${status}`}>
              <div className="plan-day">{done ? '✅' : isCurrent ? '▶️' : '🔒'}</div>
              <div className="plan-info">
                <div className="plan-title">Day {d.day}: {d.title}</div>
                <div className="plan-focus">{d.focus}</div>
              </div>
              {done && <div className="plan-date">{dateByDay[d.day] || ''}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
