import { useEffect, useMemo, useRef, useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { CAPTURE_LESSONS } from '../lessons/captureGames.js'
import { captureSquares, buildPositionFen } from '../engine/moves.js'
import { speak, sfx } from '../audio/speak.js'
import { PLAYER_NAME } from '../config.js'
import Mascot from './Mascot.jsx'

const CHEERS = ['Got it!', 'Knockout!', 'Take that!', 'Bullseye!', 'Captured!']

// Pick a square the piece can capture onto for the next enemy, avoiding one.
function pickEnemy(pieceId, fromSquare, avoid) {
  const targets = captureSquares(pieceId, fromSquare).filter((s) => s !== avoid)
  return targets[Math.floor(Math.random() * targets.length)]
}

export default function CaptureGames({ onExit, onComplete }) {
  const [index, setIndex] = useState(0)
  const [pieceSquare, setPieceSquare] = useState(null)
  const [enemy, setEnemy] = useState(null)
  const [captured, setCaptured] = useState(0)
  const [stars, setStars] = useState(0)
  const [done, setDone] = useState(false)
  const busy = useRef(false)

  const lesson = CAPTURE_LESSONS[index]

  useEffect(() => {
    busy.current = false
    setPieceSquare(lesson.start)
    setCaptured(0)
    setEnemy(pickEnemy(lesson.id, lesson.start, lesson.start))
    speak(lesson.intro)
    sfx.tap()
  }, [index]) // eslint-disable-line react-hooks/exhaustive-deps

  const squareStyles = useMemo(() => {
    const styles = {}
    if (pieceSquare) {
      for (const s of captureSquares(lesson.id, pieceSquare)) {
        styles[s] = { backgroundImage: 'radial-gradient(circle, rgba(229,57,53,0.40) 28%, transparent 30%)' }
      }
      styles[pieceSquare] = { boxShadow: 'inset 0 0 0 4px #ffd54f' }
    }
    if (enemy) {
      styles[enemy] = { ...(styles[enemy] || {}), boxShadow: 'inset 0 0 0 4px #e53935' }
    }
    return styles
  }, [lesson.id, pieceSquare, enemy])

  // White piece + one black "enemy" pawn on the board.
  const fen = useMemo(() => {
    if (!pieceSquare) return '8/8/8/8/8/8/8/8 w - - 0 1'
    const map = { [pieceSquare]: { pawn: 'P', rook: 'R', bishop: 'B', knight: 'N', queen: 'Q', king: 'K' }[lesson.id] }
    if (enemy) map[enemy] = 'p'
    return buildPositionFen(map)
  }, [lesson.id, pieceSquare, enemy])

  function finishPiece() {
    sfx.win()
    setStars(stars + 1)
    if (index === CAPTURE_LESSONS.length - 1) {
      setDone(true)
      speak(`Amazing, ${PLAYER_NAME}! You can capture with every piece! You are a real chess champion!`)
      onComplete?.()
    } else {
      speak('All enemies down! Next piece!')
      setIndex(index + 1)
    }
  }

  function moveTo(target) {
    if (done || busy.current || !pieceSquare) return false
    const targets = captureSquares(lesson.id, pieceSquare)
    if (target === enemy && targets.includes(target)) {
      busy.current = true
      setTimeout(() => { busy.current = false }, 220)
      const newCount = captured + 1
      sfx.good()
      if (newCount >= lesson.goal) {
        setCaptured(newCount)
        finishPiece()
        return true
      }
      setCaptured(newCount)
      setPieceSquare(target)
      setEnemy(pickEnemy(lesson.id, target, target))
      speak(CHEERS[newCount % CHEERS.length])
      return true
    }
    speak('Move onto the enemy to knock it out!')
    return false
  }

  function onDrop(source, target) {
    if (source !== pieceSquare) return false
    return moveTo(target)
  }

  if (done) {
    return (
      <div className="lesson celebrate">
        <Mascot speaking message={`You're a chess champion, ${PLAYER_NAME}! 🏆`} />
        <div className="confetti">⚔️⭐🏆⭐⚔️</div>
        <h1>Level 3 Complete!</h1>
        <div className="star-row big">{'⭐'.repeat(CAPTURE_LESSONS.length)}</div>
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
          {CAPTURE_LESSONS.map((l, i) => (
            <span key={l.id} className={`pip ${i <= index ? 'on' : ''}`} />
          ))}
        </div>
        <div className="star-count">⭐ {stars}</div>
      </div>

      <Mascot speaking message={lesson.intro} />

      <div className="piece-card" style={{ '--piece-color': lesson.color }}>
        <div className="piece-emoji">{lesson.emoji}</div>
        <div className="piece-name">{lesson.name}</div>
        <div className="cookie-tracker">
          {Array.from({ length: lesson.goal }).map((_, i) => (
            <span key={i} className={i < captured ? 'eaten' : ''}>
              ⚔️
            </span>
          ))}
        </div>
      </div>

      <div className="board-wrap">
        <Chessboard
          id={`capture-${lesson.id}`}
          position={fen}
          onPieceDrop={onDrop}
          onSquareClick={moveTo}
          arePiecesDraggable
          animationDuration={180}
          customSquareStyles={squareStyles}
          customBoardStyle={{ borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.2)' }}
          customLightSquareStyle={{ backgroundColor: '#f3e9ff' }}
          customDarkSquareStyle={{ backgroundColor: '#b39ddb' }}
        />
      </div>

      <div className="lesson-buttons">
        <button className="speak-btn" onClick={() => speak(lesson.intro)}>
          🔊 Hear again
        </button>
        <div className="hint-text">Capture the enemy ♟️ with your {lesson.name}</div>
      </div>
    </div>
  )
}
