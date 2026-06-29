import { useState } from 'react'
import MeetThePieces from './components/MeetThePieces.jsx'
import MoveGames from './components/MoveGames.jsx'
import CaptureGames from './components/CaptureGames.jsx'
import CheckmateGames from './components/CheckmateGames.jsx'
import SpecialMoves from './components/SpecialMoves.jsx'
import PlayGame from './components/PlayGame.jsx'
import { loadProgress, saveStageComplete, totalStars } from './state/progress.js'
import { speak, setVoiceEnabled, isVoiceEnabled, sfx } from './audio/speak.js'
import { PLAYER_NAME } from './config.js'

// The "world map" — a row of stages the child travels through. Stage 0 is
// playable now; later stages are shown as locked/coming-soon so the path is
// visible (and motivating) even before every stage is built.

const STAGES = [
  { id: 'meet', emoji: '🎭', title: 'Meet the Pieces', ready: true },
  { id: 'move', emoji: '🕹️', title: 'How They Move', ready: true },
  { id: 'capture', emoji: '⚔️', title: 'Capturing', ready: true },
  { id: 'checkmate', emoji: '👑', title: 'Checkmate!', ready: true },
  { id: 'special', emoji: '✨', title: 'Special Moves', ready: true },
  { id: 'play', emoji: '♟️', title: 'Play a Game', ready: true },
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

  if (screen === 'capture') {
    return (
      <CaptureGames
        onExit={() => setScreen('map')}
        onComplete={() => setProgress(saveStageComplete('capture', 6))}
      />
    )
  }

  if (screen === 'checkmate') {
    return (
      <CheckmateGames
        onExit={() => setScreen('map')}
        onComplete={() => setProgress(saveStageComplete('checkmate', 5))}
      />
    )
  }

  if (screen === 'special') {
    return (
      <SpecialMoves
        onExit={() => setScreen('map')}
        onComplete={() => setProgress(saveStageComplete('special', 3))}
      />
    )
  }

  if (screen === 'play') {
    return <PlayGame onExit={() => setScreen('map')} />
  }

  return (
    <div className="map">
      <header className="map-header">
        <h1>{PLAYER_NAME}'s Chess 🦁</h1>
        <div className="header-right">
          <span className="total-stars">⭐ {totalStars(progress)}</span>
          <button className="icon-btn" onClick={toggleVoice} aria-label="Toggle voice">
            {voiceOn ? '🔊' : '🔇'}
          </button>
        </div>
      </header>

      <p className="tagline">Hi {PLAYER_NAME}! Tap an adventure to start! 👇</p>

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
