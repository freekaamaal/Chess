import { loadCoach } from '../state/coach.js'
import { loadProgress, totalStars } from '../state/progress.js'
import { PLAYER_NAME } from '../config.js'

// Navya's progress at a glance: streak, days, stars, and the badges she's won.
export default function TrophyRoom({ onExit }) {
  const coach = loadCoach()
  const progress = loadProgress()
  const stars = totalStars(progress)
  const c = progress.completed

  const badges = [
    { emoji: '🌟', label: 'First Lesson', earned: coach.totalLessons >= 1 },
    { emoji: '🎭', label: 'Met the Pieces', earned: !!c.meet },
    { emoji: '🕹️', label: 'Mover', earned: !!c.move },
    { emoji: '⚔️', label: 'Capturer', earned: !!c.capture },
    { emoji: '👑', label: 'Checkmate Hero', earned: !!c.checkmate },
    { emoji: '✨', label: 'Special Agent', earned: !!c.special },
    { emoji: '🔥', label: '3-Day Streak', earned: coach.longestStreak >= 3 },
    { emoji: '🏅', label: '7-Day Streak', earned: coach.longestStreak >= 7 },
    { emoji: '⭐', label: 'Star Collector', earned: stars >= 20 },
  ]
  const earnedCount = badges.filter((b) => b.earned).length

  return (
    <div className="map">
      <div className="lesson-top">
        <button className="back-btn" onClick={onExit} aria-label="Back">⬅️</button>
        <h1 style={{ margin: 0, fontSize: 26 }}>{PLAYER_NAME}'s Trophies 🏆</h1>
        <span style={{ width: 48 }} />
      </div>

      <div className="stat-row">
        <div className="stat-box"><div className="stat-num">🔥 {coach.streak}</div><div className="stat-label">Day Streak</div></div>
        <div className="stat-box"><div className="stat-num">📅 {coach.daysPracticed}</div><div className="stat-label">Days Played</div></div>
        <div className="stat-box"><div className="stat-num">⭐ {stars}</div><div className="stat-label">Stars</div></div>
        <div className="stat-box"><div className="stat-num">🏅 {coach.longestStreak}</div><div className="stat-label">Best Streak</div></div>
      </div>

      <h2 className="section-title">Badges ({earnedCount}/{badges.length})</h2>
      <div className="badge-grid">
        {badges.map((b) => (
          <div key={b.label} className={`badge ${b.earned ? 'earned' : ''}`}>
            <div className="badge-emoji">{b.earned ? b.emoji : '🔒'}</div>
            <div className="badge-label">{b.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
