import { useState } from 'react'
import { MASCOTS, getSettings, setSetting } from '../state/coach.js'
import { logout, getActiveProfile } from '../state/profiles.js'
import { speak, setVoiceEnabled } from '../audio/speak.js'

const DIFFICULTIES = [
  { id: 'easy', label: 'Easy 🟢', note: 'Best for starting out' },
  { id: 'medium', label: 'Medium 🟡', note: 'A bit more challenge' },
  { id: 'hard', label: 'Hard 🔴', note: 'Thinks ahead' },
]
const LIMITS = [10, 15, 20, 30, 0] // 0 = no limit

export default function Settings({ onExit, onChange, onLogout }) {
  const [settings, setSettings] = useState(getSettings())
  const profile = getActiveProfile()

  function update(key, value) {
    const s = setSetting(key, value)
    setSettings({ ...s.settings })
    onChange?.()
  }

  return (
    <div className="map">
      <div className="lesson-top">
        <button className="back-btn" onClick={onExit} aria-label="Back">⬅️</button>
        <h1 style={{ margin: 0, fontSize: 26 }}>Settings ⚙️</h1>
        <span style={{ width: 48 }} />
      </div>

      <h2 className="section-title">Choose your coach</h2>
      <div className="mascot-picker">
        {Object.entries(MASCOTS).map(([id, m]) => (
          <button
            key={id}
            className={`mascot-choice ${settings.mascot === id ? 'on' : ''}`}
            onClick={() => { update('mascot', id); speak(`Hi! I'm ${m.name}, your new coach!`) }}
          >
            <span className="mascot-choice-emoji">{m.emoji}</span>
            <span>{m.name}</span>
          </button>
        ))}
      </div>

      <h2 className="section-title">How tough is your coach?</h2>
      <div className="opt-row">
        {DIFFICULTIES.map((d) => (
          <button key={d.id} className={`opt-btn ${settings.difficulty === d.id ? 'on' : ''}`} onClick={() => update('difficulty', d.id)}>
            <div>{d.label}</div>
            <div className="opt-note">{d.note}</div>
          </button>
        ))}
      </div>

      <h2 className="section-title">Daily play time</h2>
      <div className="opt-row">
        {LIMITS.map((m) => (
          <button key={m} className={`opt-btn ${settings.dailyLimitMin === m ? 'on' : ''}`} onClick={() => update('dailyLimitMin', m)}>
            {m === 0 ? 'No limit' : `${m} min`}
          </button>
        ))}
      </div>

      <h2 className="section-title">Coach's voice</h2>
      <div className="opt-row">
        <button className={`opt-btn ${settings.voice !== false ? 'on' : ''}`} onClick={() => { update('voice', true); setVoiceEnabled(true); speak('Voice on!') }}>🔊 On</button>
        <button className={`opt-btn ${settings.voice === false ? 'on' : ''}`} onClick={() => { update('voice', false); setVoiceEnabled(false) }}>🔇 Off</button>
      </div>

      <h2 className="section-title">Account</h2>
      <button className="big-btn" style={{ background: '#ef6c00', boxShadow: '0 6px 0 #b35200' }} onClick={() => { logout(); onLogout?.() }}>
        {profile ? `Log out ${profile.name} 👋` : 'Log out 👋'}
      </button>
    </div>
  )
}
