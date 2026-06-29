import { useState } from 'react'
import MeetThePieces from './components/MeetThePieces.jsx'
import MoveGames from './components/MoveGames.jsx'
import { loadProgress, saveStageComplete, totalStars } from './state/progress.js'
import { speak, setVoiceEnabled, isVoiceEnabled, sfx } from './audio/speak.js'

// The "world map" — a row of stages the child travels through. Stage 0 is
// playable now; later stages are shown as locked/coming-soon so the path is
// visible (and motivating) even before every stage is built.

const STAGES = [
  { id: 'meet', emoji: '🎭', title: 'Meet the Pieces', ready: true },
  { id: 'move', emoji: '🕹️', title: 'How They Move', ready: true },
  { id: 'capture', emoji: '🍪', title: 'Capturing', ready: false },
  { id: 'checkmate', emoji: '👑', title: 'Checkmate!', ready: false },
  { id: 'special', emoji: '✨', title: 'Special Moves', ready: false },
  { id: 'play', emoji: '♟️', title: 'Play a Game', ready: false },
]

export default function App() {
  const [screen, setScreen] = useState('map')
  const [progress, setProgress] = useState(loadProgress)
  const [voiceOn, setVoiceOn] = useState(isVoiceEnabled())

  function toggleVoice() {
    const on = !voiceOn
    setVoiceOn(on)
    setVoiceEnabled(on)
    if (on) speak('Voice on!')
  }

  function openStage(stage) {
    if (!stage.ready) {
      sfx.tap()
      speak('This adventure is coming soon!')
      return
    }
    sfx.tap()
    setScreen(stage.id)
  }

  if (screen === 'meet') {
    return (
      <MeetThePieces
        onExit={() => setScreen('map')}
        onComplete={() => setProgress(saveStageComplete('meet', 6))}
      />
    )
  }

  if (screen === 'move') {
    return (
      <MoveGames
        onExit={() => setScreen('map')}
        onComplete={() => setProgress(saveStageComplete('move', 6))}
      />
    )
  }

  return (
    <div className="map">
      <header className="map-header">
        <h1>Chess for Kids 🦁</h1>
        <div className="header-right">
          <span className="total-stars">⭐ {totalStars(progress)}</span>
          <button className="icon-btn" onClick={toggleVoice} aria-label="Toggle voice">
            {voiceOn ? '🔊' : '🔇'}
          </button>
        </div>
      </header>

      <p className="tagline">Tap an adventure to start!</p>

      <div className="stage-grid">
        {STAGES.map((stage, i) => {
          const done = progress.completed[stage.id]
          return (
            <button
              key={stage.id}
              className={`stage-card ${stage.ready ? '' : 'locked'} ${done ? 'done' : ''}`}
              onClick={() => openStage(stage)}
            >
              <div className="stage-emoji">{stage.ready ? stage.emoji : '🔒'}</div>
              <div className="stage-num">Level {i + 1}</div>
              <div className="stage-title">{stage.title}</div>
              {done && <div className="stage-stars">⭐⭐⭐</div>}
              {!stage.ready && <div className="soon">Coming soon</div>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
