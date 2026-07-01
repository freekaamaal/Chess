import { useMemo, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import { speak, sfx } from '../audio/speak.js'
import { PLAYER_NAME } from '../config.js'
import { getMascot } from '../state/coach.js'
import InteractiveBoard from './InteractiveBoard.jsx'
import Mascot from './Mascot.jsx'

// Guided opening lesson: the child plays the 4 golden opening moves, and Leo
// explains the rule behind each. Black replies automatically so it feels like a
// real game and castling becomes available.
const STEPS = [
  { from: 'e2', to: 'e4', reply: { from: 'e7', to: 'e5' }, say: 'Rule 1: Control the center! Push your King’s pawn two squares to e4.' },
  { from: 'g1', to: 'f3', reply: { from: 'b8', to: 'c6' }, say: 'Rule 2: Develop a Knight toward the center — bring it to f3.' },
  { from: 'f1', to: 'c4', reply: { from: 'g8', to: 'f6' }, say: 'Rule 3: Develop a Bishop — aim it at the enemy with Bc4.' },
  { from: 'e1', to: 'g1', reply: null, say: 'Rule 4: Castle to keep your King safe! Move your King two squares to the Rook.' },
]

export default function OpeningLesson({ onExit, onComplete }) {
  const chessRef = useRef(new Chess())
  const [step, setStep] = useState(0)
  const [position, setPosition] = useState(chessRef.current.fen())
  const [done, setDone] = useState(false)
  const busy = useRef(false)
  const recorded = useRef(false)

  const chess = chessRef.current
  const current = STEPS[step]

  useMemo(() => { if (current) speak(current.say) }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  const extraStyles = current
    ? { [current.from]: { boxShadow: 'inset 0 0 0 4px #ffb300' }, [current.to]: { backgroundImage: 'radial-gradient(circle, rgba(255,179,0,0.5) 30%, transparent 32%)' } }
    : {}

  function legalTargets(square) {
    return chess.moves({ square, verbose: true }).map((m) => m.to)
  }
  function canSelect(square) {
    if (busy.current || done) return false
    const p = chess.get(square)
    return p && p.color === 'w'
  }

  function finish() {
    if (!recorded.current) { recorded.current = true; onComplete?.() }
    setDone(true)
    sfx.win()
    speak(`Brilliant, ${PLAYER_NAME}! You know the opening rules: center, Knights, Bishops, and castle!`)
  }

  function onMove(from, to) {
    if (busy.current || done) return false
    if (from !== current.from || to !== current.to) {
      speak('Try the golden move I showed you — follow the glowing squares!')
      return false
    }
    try { chess.move({ from, to, promotion: 'q' }) } catch { return false }
    setPosition(chess.fen())
    sfx.good()
    busy.current = true
    const reply = current.reply
    const isLast = step === STEPS.length - 1
    setTimeout(() => {
      if (reply) { chess.move(reply); setPosition(chess.fen()) }
      busy.current = false
      if (isLast) finish()
      else setStep(step + 1)
    }, 550)
    return true
  }

  if (done) {
    return (
      <div className="lesson celebrate">
        <Mascot speaking message={`Great opening, ${PLAYER_NAME}! ${getMascot().emoji}`} />
        <div className="confetti">📖⭐♟️⭐📖</div>
        <h1>Opening Rules Learned!</h1>
        <p className="tagline">Center → Knights → Bishops → Castle. Use these every game!</p>
        <button className="big-btn" onClick={onExit}>Back 🏠</button>
      </div>
    )
  }

  return (
    <div className="lesson">
      <div className="lesson-top">
        <button className="back-btn" onClick={onExit} aria-label="Back">⬅️</button>
        <div className="progress-pips">
          {STEPS.map((_, i) => <span key={i} className={`pip ${i <= step ? 'on' : ''}`} />)}
        </div>
        <div className="star-count">📖 {step + 1}/{STEPS.length}</div>
      </div>

      <Mascot speaking message={current.say} />

      <div className="board-wrap">
        <InteractiveBoard
          boardId={`opening-${step}`}
          position={position}
          onMove={onMove}
          legalTargets={legalTargets}
          canSelect={canSelect}
          extraStyles={extraStyles}
        />
      </div>

      <div className="lesson-buttons">
        <button className="speak-btn" onClick={() => speak(current.say)}>🔊 Hear again</button>
        <div className="hint-text">Play the move on the glowing squares</div>
      </div>
    </div>
  )
}
