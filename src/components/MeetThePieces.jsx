import { useEffect, useMemo, useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { PIECES } from '../lessons/pieces.js'
import { reachableSquares, pieceSquareFromFen } from '../engine/moves.js'
import { speak, sfx } from '../audio/speak.js'
import { PLAYER_NAME } from '../config.js'
import Mascot from './Mascot.jsx'

// Stage 0: meet each piece as a character, hear it talk, and watch the squares
// it can move to light up. Tap "Got it!" to collect a star and move on.

export default function MeetThePieces({ onExit, onComplete }) {
  const [index, setIndex] = useState(0)
  const [stars, setStars] = useState(0)
  const [done, setDone] = useState(false)

  const piece = PIECES[index]

  // Where the demo piece sits, and the squares it can reach (highlighted).
  const square = useMemo(() => pieceSquareFromFen(piece.demoFen), [piece])
  const highlights = useMemo(() => {
    const styles = {}
    for (const s of reachableSquares(piece.id, square)) {
      styles[s] = {
        background: 'radial-gradient(circle, rgba(124,77,255,0.55) 30%, transparent 32%)',
        borderRadius: '50%',
      }
    }
    if (square) {
      styles[square] = { boxShadow: 'inset 0 0 0 4px #ffd54f' }
    }
    return styles
  }, [piece, square])

  // Leo introduces each piece aloud as it appears.
  useEffect(() => {
    speak(piece.say)
    sfx.tap()
  }, [piece])

  function next() {
    sfx.good()
    const earned = stars + 1
    setStars(earned)
    if (index === PIECES.length - 1) {
      setDone(true)
      sfx.win()
      speak(`Wow ${PLAYER_NAME}! You met all the pieces! You are amazing!`)
      onComplete?.()
    } else {
      setIndex(index + 1)
    }
  }

  if (done) {
    return (
      <div className="lesson celebrate">
        <Mascot speaking message="You met all the pieces! 🎉" />
        <div className="confetti">🎉⭐🏆⭐🎉</div>
        <h1>All pieces met!</h1>
        <div className="star-row big">{'⭐'.repeat(PIECES.length)}</div>
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
          {PIECES.map((p, i) => (
            <span key={p.id} className={`pip ${i <= index ? 'on' : ''}`} />
          ))}
        </div>
        <div className="star-count">⭐ {stars}</div>
      </div>

      <Mascot speaking message={piece.say} />

      <div
        className="piece-card"
        style={{ '--piece-color': piece.color }}
      >
        <div className="piece-emoji">{piece.emoji}</div>
        <div className="piece-name">{piece.name}</div>
        <div className="piece-title">{piece.title}</div>
      </div>

      <div className="board-wrap">
        <Chessboard
          id={`demo-${piece.id}`}
          position={piece.demoFen}
          arePiecesDraggable={false}
          customSquareStyles={highlights}
          customBoardStyle={{ borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.2)' }}
          customLightSquareStyle={{ backgroundColor: '#f3e9ff' }}
          customDarkSquareStyle={{ backgroundColor: '#b39ddb' }}
        />
      </div>

      <div className="lesson-buttons">
        <button className="speak-btn" onClick={() => speak(piece.say)}>
          🔊 Hear again
        </button>
        <button className="big-btn" onClick={next}>
          {index === PIECES.length - 1 ? 'Finish! 🏆' : 'Got it! 👉'}
        </button>
      </div>
    </div>
  )
}
