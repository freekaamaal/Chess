import { useEffect, useMemo, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import { SPECIAL_MOVES } from '../lessons/specialMoves.js'
import { speak, sfx } from '../audio/speak.js'
import { PLAYER_NAME } from '../config.js'
import InteractiveBoard from './InteractiveBoard.jsx'
import Mascot from './Mascot.jsx'

export default function SpecialMoves({ onExit, onComplete }) {
  const [index, setIndex] = useState(0)
  const [position, setPosition] = useState(SPECIAL_MOVES[0].fen)
  const [stars, setStars] = useState(0)
  const [done, setDone] = useState(false)
  const chessRef = useRef(new Chess(SPECIAL_MOVES[0].fen))
  const busy = useRef(false)

  const lesson = SPECIAL_MOVES[index]

  useEffect(() => {
    chessRef.current = new Chess(lesson.fen)
    setPosition(lesson.fen)
    busy.current = false
    speak(lesson.hint)
    sfx.tap()
  }, [index]) // eslint-disable-line react-hooks/exhaustive-deps

  const chess = chessRef.current

  const extraStyles = useMemo(
    () => ({ [lesson.from]: { boxShadow: 'inset 0 0 0 4px #ffb300' } }),
    [lesson.from],
  )

  function legalTargets(square) {
    return chess.moves({ square, verbose: true }).map((m) => m.to)
  }
  function canSelect(square) {
    if (busy.current) return false
    const p = chess.get(square)
    return p && p.color === 'w'
  }

  function nextLesson() {
    if (index === SPECIAL_MOVES.length - 1) {
      setDone(true)
      sfx.win()
      speak(`Wonderful, ${PLAYER_NAME}! You learned all the special moves!`)
      onComplete?.()
    } else {
      setIndex(index + 1)
    }
  }

  function onMove(from, to) {
    if (busy.current) return false
    let move
    try {
      move = chess.move({ from, to, promotion: 'q' })
    } catch {
      return false
    }
    setPosition(chess.fen())
    if (lesson.success(move)) {
      busy.current = true
      sfx.win()
      speak(lesson.win)
      setTimeout(nextLesson, 1500)
      return true
    }
    // A legal but non-special move — undo and nudge toward the special move.
    busy.current = true
    speak('Try the special move I told you about!')
    setTimeout(() => {
      chess.undo()
      setPosition(chess.fen())
      busy.current = false
    }, 700)
    return true
  }

  if (done) {
    return (
      <div className="lesson celebrate">
        <Mascot speaking message={`You learned the special moves, ${PLAYER_NAME}! ✨`} />
        <div className="confetti">✨👑🏰🥷✨</div>
        <h1>Level 5 Complete!</h1>
        <div className="star-row big">{'⭐'.repeat(SPECIAL_MOVES.length)}</div>
        <button className="big-btn" onClick={onExit}>
          Back to Map 🗺️
        </button>
      </div>
    )
  }

  return (
    <div className="lesson">
      <div className="lesson-top">
        <button className="back-btn" onClick={onExit} aria-label="Back">
          ⬅️
        </button>
        <div className="progress-pips">
          {SPECIAL_MOVES.map((_, i) => (
            <span key={i} className={`pip ${i <= index ? 'on' : ''}`} />
          ))}
        </div>
        <div className="star-count">⭐ {stars}</div>
      </div>

      <Mascot speaking message={lesson.hint} />

      <div className="piece-card" style={{ '--piece-color': '#26a69a' }}>
        <div className="piece-emoji">{lesson.emoji}</div>
        <div className="piece-name">{lesson.title}</div>
      </div>

      <div className="board-wrap">
        <InteractiveBoard
          boardId={`special-${index}`}
          position={position}
          onMove={onMove}
          legalTargets={legalTargets}
          canSelect={canSelect}
          extraStyles={extraStyles}
        />
      </div>

      <div className="lesson-buttons">
        <button className="speak-btn" onClick={() => speak(lesson.hint)}>
          🔊 Hear again
        </button>
        <div className="hint-text">{lesson.title}: move the glowing piece</div>
      </div>
    </div>
  )
}
