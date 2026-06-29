import { useEffect, useMemo, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import { CHECKMATE_PUZZLES } from '../lessons/checkmatePuzzles.js'
import { speak, sfx } from '../audio/speak.js'
import { PLAYER_NAME } from '../config.js'
import InteractiveBoard from './InteractiveBoard.jsx'
import Mascot from './Mascot.jsx'

export default function CheckmateGames({ onExit, onComplete }) {
  const [index, setIndex] = useState(0)
  const [position, setPosition] = useState(CHECKMATE_PUZZLES[0].fen)
  const [stars, setStars] = useState(0)
  const [done, setDone] = useState(false)
  const [solvedFlash, setSolvedFlash] = useState(false)
  const chessRef = useRef(new Chess(CHECKMATE_PUZZLES[0].fen))
  const busy = useRef(false)

  const puzzle = CHECKMATE_PUZZLES[index]

  useEffect(() => {
    chessRef.current = new Chess(puzzle.fen)
    setPosition(puzzle.fen)
    setSolvedFlash(false)
    busy.current = false
    speak(puzzle.hint)
    sfx.tap()
  }, [index]) // eslint-disable-line react-hooks/exhaustive-deps

  const chess = chessRef.current

  // Gentle hint: glow the piece that delivers mate.
  const extraStyles = useMemo(
    () => ({ [puzzle.from]: { boxShadow: 'inset 0 0 0 4px #ffb300' } }),
    [puzzle.from],
  )

  function legalTargets(square) {
    return chess.moves({ square, verbose: true }).map((m) => m.to)
  }
  function canSelect(square) {
    if (busy.current) return false
    const p = chess.get(square)
    return p && p.color === 'w'
  }

  function nextPuzzle() {
    if (index === CHECKMATE_PUZZLES.length - 1) {
      setDone(true)
      sfx.win()
      speak(`Checkmate champion, ${PLAYER_NAME}! You trapped every King!`)
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
      return false // illegal
    }
    setPosition(chess.fen())
    if (chess.isCheckmate()) {
      busy.current = true
      setSolvedFlash(true)
      sfx.win()
      speak('Checkmate! You did it!')
      setTimeout(nextPuzzle, 1300)
      return true
    }
    // Legal but not mate — show it briefly, then take it back to try again.
    busy.current = true
    speak("So close! That's not checkmate yet. Try another move!")
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
        <Mascot speaking message={`Checkmate champion, ${PLAYER_NAME}! 👑`} />
        <div className="confetti">👑⭐🏆⭐👑</div>
        <h1>Level 4 Complete!</h1>
        <div className="star-row big">{'⭐'.repeat(CHECKMATE_PUZZLES.length)}</div>
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
          {CHECKMATE_PUZZLES.map((_, i) => (
            <span key={i} className={`pip ${i <= index ? 'on' : ''}`} />
          ))}
        </div>
        <div className="star-count">⭐ {stars}</div>
      </div>

      <Mascot speaking message={puzzle.hint} />

      <div className="piece-card" style={{ '--piece-color': '#ab47bc' }}>
        <div className="piece-emoji">{solvedFlash ? '🏆' : '👑'}</div>
        <div className="piece-name">Checkmate Puzzle {index + 1}</div>
        <div className="cookie-tracker">
          {CHECKMATE_PUZZLES.map((_, i) => (
            <span key={i} className={i < index || (i === index && solvedFlash) ? 'eaten' : ''}>
              👑
            </span>
          ))}
        </div>
      </div>

      <div className="board-wrap">
        <InteractiveBoard
          boardId={`mate-${index}`}
          position={position}
          onMove={onMove}
          legalTargets={legalTargets}
          canSelect={canSelect}
          extraStyles={extraStyles}
        />
      </div>

      <div className="lesson-buttons">
        <button className="speak-btn" onClick={() => speak(puzzle.hint)}>
          🔊 Hear again
        </button>
        <div className="hint-text">Move the glowing piece to checkmate the King 👑</div>
      </div>
    </div>
  )
}
