import { useEffect, useMemo, useRef, useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { MOVE_LESSONS } from '../lessons/moveGames.js'
import { reachableSquares, singlePieceFen } from '../engine/moves.js'
import { speak, sfx } from '../audio/speak.js'
import { PLAYER_NAME } from '../config.js'
import Mascot from './Mascot.jsx'

// A cookie drawn as an SVG emoji so it can sit as a square background.
const COOKIE_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><text x='50' y='78' font-size='66' text-anchor='middle'>🍪</text></svg>\")"

const YUMS = ['Yum!', 'Nom nom!', 'Delicious!', 'Tasty!', 'Great move!']

// Pick a random square the piece can move to (for the next cookie), avoiding one.
function pickCookie(pieceId, fromSquare, avoid) {
  const reach = reachableSquares(pieceId, fromSquare).filter((s) => s !== avoid)
  return reach[Math.floor(Math.random() * reach.length)]
}

export default function MoveGames({ onExit, onComplete }) {
  const [index, setIndex] = useState(0)
  const [pieceSquare, setPieceSquare] = useState(null)
  const [cookie, setCookie] = useState(null)
  const [eaten, setEaten] = useState(0)
  const [stars, setStars] = useState(0)
  const [done, setDone] = useState(false)
  // Blocks a second move while the board is still animating the first, so an
  // excited double-tap can't race the board into an error.
  const busy = useRef(false)

  const lesson = MOVE_LESSONS[index]

  // (Re)start a piece's game whenever we move to a new piece.
  useEffect(() => {
    busy.current = false
    setPieceSquare(lesson.start)
    setEaten(0)
    setCookie(pickCookie(lesson.id, lesson.start, lesson.start))
    speak(lesson.intro)
    sfx.tap()
  }, [index]) // eslint-disable-line react-hooks/exhaustive-deps

  const squareStyles = useMemo(() => {
    const styles = {}
    if (pieceSquare) {
      for (const s of reachableSquares(lesson.id, pieceSquare)) {
        styles[s] = {
          backgroundImage: 'radial-gradient(circle, rgba(124,77,255,0.45) 28%, transparent 30%)',
        }
      }
      styles[pieceSquare] = { boxShadow: 'inset 0 0 0 4px #ffd54f' }
    }
    if (cookie) {
      styles[cookie] = {
        ...(styles[cookie] || {}),
        backgroundImage: COOKIE_BG,
        backgroundSize: '78%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        boxShadow: 'inset 0 0 0 4px #66bb6a',
      }
    }
    return styles
  }, [lesson.id, pieceSquare, cookie])

  function finishPiece() {
    sfx.win()
    const earned = stars + 1
    setStars(earned)
    if (index === MOVE_LESSONS.length - 1) {
      setDone(true)
      speak(`Incredible, ${PLAYER_NAME}! You can move every piece now! You are a chess star!`)
      onComplete?.()
    } else {
      speak('You ate them all! Next piece!')
      setIndex(index + 1)
    }
  }

  // Shared by both ways to play: dragging the piece (good with a mouse) and
  // tapping the cookie (easiest for little fingers on a tablet).
  function moveTo(target) {
    if (done || busy.current || !pieceSquare) return false
    const reachable = reachableSquares(lesson.id, pieceSquare)
    if (target === cookie && reachable.includes(target)) {
      busy.current = true
      setTimeout(() => { busy.current = false }, 220)
      const newCount = eaten + 1
      sfx.good()
      if (newCount >= lesson.goal) {
        setEaten(newCount)
        finishPiece()
        return true
      }
      setEaten(newCount)
      setPieceSquare(target)
      setCookie(pickCookie(lesson.id, target, target))
      speak(YUMS[newCount % YUMS.length])
      return true
    }
    speak('Move onto the cookie on a glowing square!')
    return false
  }

  function onDrop(source, target) {
    if (source !== pieceSquare) return false
    return moveTo(target)
  }

  if (done) {
    return (
      <div className="lesson celebrate">
        <Mascot speaking message="You can move every piece! 🎉" />
        <div className="confetti">🍪⭐🏆⭐🍪</div>
        <h1>Level 2 Complete!</h1>
        <div className="star-row big">{'⭐'.repeat(MOVE_LESSONS.length)}</div>
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
          {MOVE_LESSONS.map((l, i) => (
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
            <span key={i} className={i < eaten ? 'eaten' : ''}>
              🍪
            </span>
          ))}
        </div>
      </div>

      <div className="board-wrap">
        <Chessboard
          id={`move-${lesson.id}`}
          position={pieceSquare ? singlePieceFen(lesson.id, pieceSquare) : '8/8/8/8/8/8/8/8 w - - 0 1'}
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
        <div className="hint-text">Tap or drag the {lesson.name} to the 🍪</div>
      </div>
    </div>
  )
}
