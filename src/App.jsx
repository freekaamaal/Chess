import { useEffect, useRef, useState } from 'react'
import MeetThePieces from './components/MeetThePieces.jsx'
import MoveGames from './components/MoveGames.jsx'
import CaptureGames from './components/CaptureGames.jsx'
import CheckmateGames from './components/CheckmateGames.jsx'
import SpecialMoves from './components/SpecialMoves.jsx'
import PlayGame from './components/PlayGame.jsx'
import CoachHome from './components/CoachHome.jsx'
import DailyLesson from './components/DailyLesson.jsx'
import TrophyRoom from './components/TrophyRoom.jsx'
import Settings from './components/Settings.jsx'
import TimeUp from './components/TimeUp.jsx'
import { loadProgress, saveStageComplete } from './state/progress.js'
import { addSeconds, secondsLeftToday, getSettings } from './state/coach.js'
import { setVoiceEnabled, sfx } from './audio/speak.js'

// The 6-level "Practice" curriculum (always available from the home screen).
const STAGES = [
  { id: 'meet', emoji: '🎭', title: 'Meet the Pieces' },
  { id: 'move', emoji: '🕹️', title: 'How They Move' },
  { id: 'capture', emoji: '⚔️', title: 'Capturing' },
  { id: 'checkmate', emoji: '👑', title: 'Checkmate!' },
  { id: 'special', emoji: '✨', title: 'Special Moves' },
  { id: 'play', emoji: '♟️', title: 'Play a Game' },
]

// Screens that count toward the daily play-time budget.
const ACTIVITY = new Set(['daily', 'meet', 'move', 'capture', 'checkmate', 'special', 'play'])

export default function App() {
  const [screen, setScreen] = useState('home')
  const [progress, setProgress] = useState(loadProgress)
  const tick = useRef(null)

  // Apply the saved voice preference once at startup.
  useEffect(() => {
    setVoiceEnabled(getSettings().voice !== false)
  }, [])

  // Count practice time while in an activity; end the day when the budget runs out.
  useEffect(() => {
    if (!ACTIVITY.has(screen)) return
    tick.current = setInterval(() => {
      addSeconds(1)
      if (secondsLeftToday() <= 0) {
        clearInterval(tick.current)
        setScreen('timeup')
      }
    }, 1000)
    return () => clearInterval(tick.current)
  }, [screen])

  function openActivity(target) {
    if (secondsLeftToday() <= 0) {
      sfx.tap()
      setScreen('timeup')
      return
    }
    sfx.tap()
    setScreen(target)
  }

  function backHome() {
    setProgress(loadProgress())
    setScreen('home')
  }

  // --- Activity screens ---
  if (screen === 'daily') return <DailyLesson onExit={backHome} onDone={() => setProgress(loadProgress())} />
  if (screen === 'meet')
    return <MeetThePieces onExit={backHome} onComplete={() => saveStageComplete('meet', 6)} />
  if (screen === 'move')
    return <MoveGames onExit={backHome} onComplete={() => saveStageComplete('move', 6)} />
  if (screen === 'capture')
    return <CaptureGames onExit={backHome} onComplete={() => saveStageComplete('capture', 6)} />
  if (screen === 'checkmate')
    return <CheckmateGames onExit={backHome} onComplete={() => saveStageComplete('checkmate', 5)} />
  if (screen === 'special')
    return <SpecialMoves onExit={backHome} onComplete={() => saveStageComplete('special', 3)} />
  if (screen === 'play') return <PlayGame onExit={backHome} />

  // --- Non-activity screens ---
  if (screen === 'trophy') return <TrophyRoom onExit={backHome} />
  if (screen === 'settings') return <Settings onExit={backHome} onChange={() => setProgress(loadProgress())} />
  if (screen === 'timeup') return <TimeUp onExit={backHome} />

  if (screen === 'practice') {
    return (
      <div className="map">
        <div className="lesson-top">
          <button className="back-btn" onClick={backHome} aria-label="Back">⬅️</button>
          <h1 style={{ margin: 0, fontSize: 26 }}>Practice 🗺️</h1>
          <span style={{ width: 48 }} />
        </div>
        <p className="tagline">Tap a level to learn and play!</p>
        <div className="stage-grid">
          {STAGES.map((stage, i) => {
            const done = progress.completed[stage.id]
            return (
              <button key={stage.id} className={`stage-card ${done ? 'done' : ''}`} onClick={() => openActivity(stage.id)}>
                <div className="stage-emoji">{stage.emoji}</div>
                <div className="stage-num">Level {i + 1}</div>
                <div className="stage-title">{stage.title}</div>
                {done && <div className="stage-stars">⭐⭐⭐</div>}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // --- Home (daily coach) ---
  return (
    <CoachHome
      onStartLesson={() => openActivity('daily')}
      onPractice={() => setScreen('practice')}
      onTrophy={() => setScreen('trophy')}
      onSettings={() => setScreen('settings')}
    />
  )
}
