import { useState } from 'react'
import { PROFILES, tryLogin, setActiveProfile } from '../state/profiles.js'
import { sfx } from '../audio/speak.js'

// Friendly child login: tap your name, type your funny secret word.
export default function Login({ onLogin }) {
  const [picked, setPicked] = useState(null)
  const [pw, setPw] = useState('')
  const [wrong, setWrong] = useState(false)

  function submit() {
    const profile = tryLogin(picked.id, pw)
    if (profile) {
      setActiveProfile(profile.id)
      sfx.win()
      onLogin(profile)
    } else {
      setWrong(true)
      sfx.tap()
    }
  }

  if (picked) {
    return (
      <div className="login">
        <div className="login-avatar">{picked.avatar}</div>
        <h1>Hi {picked.name}!</h1>
        <p className="tagline">Type your secret word 🤫</p>
        <input
          className="pw-input"
          value={pw}
          autoFocus
          onChange={(e) => { setPw(e.target.value); setWrong(false) }}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="secret word"
        />
        {wrong && <div className="pw-wrong">Oops! Try again 🙈</div>}
        <button className="big-btn" onClick={submit}>Let's Go! 🚀</button>
        <button className="speak-btn" onClick={() => { setPicked(null); setPw(''); setWrong(false) }}>⬅️ Back</button>
      </div>
    )
  }

  return (
    <div className="login">
      <h1>Who's playing? ♟️</h1>
      <p className="tagline">Tap your name to start!</p>
      <div className="profile-row">
        {PROFILES.map((p) => (
          <button key={p.id} className="profile-card" onClick={() => { setPicked(p); sfx.tap() }}>
            <span className="profile-avatar">{p.avatar}</span>
            <span className="profile-name">{p.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
