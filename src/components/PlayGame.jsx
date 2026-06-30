import { useEffect, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import { chooseMove } from '../engine/ai.js'
import { speak, sfx } from '../audio/speak.js'
import { PLAYER_NAME } from '../config.js'
import { getSettings, getMascot } from '../state/coach.js'
import InteractiveBoard from './InteractiveBoard.jsx'
import Mascot from './Mascot.jsx'

const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

export default function PlayGame({ onExit, onGameEnd }) {
  const chessRef = useRef(new Chess())
  const coach = getMascot()
  const difficulty = getSettings().difficulty
  const [position, setPosition] = useState(START)
  const [message, setMessage] = useState(`Your turn, ${PLAYER_NAME}! You are the white pieces. Tap a piece to move it.`)
  const [over, setOver] = useState(false)
  const busy = useRef(false) // true while the computer is "thinking"

  const chess = chessRef.current

  useEffect(() => {
    speak(`Let's play a real game, ${PLAYER_NAME}! You go first.`)
  }, [])

  function newGame() {
    chessRef.current = new Chess()
    setPosition(START)
    setOver(false)
    busy.current = false
    setMessage(`New game! Your turn, ${PLAYER_NAME}.`)
    speak('New game! Your move.')
    sfx.tap()
  }

  function announceIfOver() {
    if (chess.isCheckmate()) {
      const playerWon = chess.turn() === 'b' // side to move is checkmated
      setOver(true)
      onGameEnd?.()
      if (playerWon) {
        sfx.win()
        setMessage(`Checkmate! You win, ${PLAYER_NAME}! 🏆`)
        speak(`Checkmate! You win, ${PLAYER_NAME}! You are amazing!`)
      } else {
        setMessage(`Checkmate! ${coach.name} won this time — try again! ${coach.emoji}`)
        speak('Checkmate! I won this time. Let us play again!')
      }
      return true
    }
    if (chess.isDraw() || chess.isStalemate()) {
      setOver(true)
      onGameEnd?.()
      setMessage("It's a tie! Nobody wins. Good game! 🤝")
      speak("It's a tie! Great game!")
      return true
    }
    if (chess.inCheck()) {
      setMessage(chess.turn() === 'w' ? 'Watch out — your King is in check!' : 'Check! Nice one!')
    }
    return false
  }

  function computerMove() {
    const move = chooseMove(chess, difficulty)
    if (!move) {
      announceIfOver()
      busy.current = false
      return
    }
    chess.move(move)
    setPosition(chess.fen())
    if (move.captured) sfx.tap()
    if (!announceIfOver()) {
      if (!chess.inCheck()) setMessage(`Your turn, ${PLAYER_NAME}!`)
    }
    busy.current = false
  }

  function legalTargets(square) {
    return chess.moves({ square, verbose: true }).map((m) => m.to)
  }
  function canSelect(square) {
    if (busy.current || over || chess.turn() !== 'w') return false
    const p = chess.get(square)
    return p && p.color === 'w'
  }

  function onMove(from, to) {
    if (busy.current || over || chess.turn() !== 'w') return false
    let move
    try {
      move = chess.move({ from, to, promotion: 'q' })
    } catch {
      return false
    }
    setPosition(chess.fen())
    if (move.captured) sfx.good()
    if (announceIfOver()) return true
    // Hand over to the computer after a short, friendly pause.
    busy.current = true
    setMessage(`${coach.name} is thinking… ${coach.emoji}`)
    setTimeout(computerMove, 650)
    return true
  }

  return (
    <div className="lesson">
      <div className="lesson-top">
        <button className="back-btn" onClick={onExit} aria-label="Back">
          ⬅️
        </button>
        <div className="play-title">Play vs {coach.name} {coach.emoji}</div>
        <button className="icon-btn" onClick={newGame} aria-label="New game">
          🔄
        </button>
      </div>

      <Mascot speaking message={message} />

      <div className="board-wrap">
        <InteractiveBoard
          boardId="play"
          position={position}
          onMove={onMove}
          legalTargets={legalTargets}
          canSelect={canSelect}
        />
      </div>

      <div className="lesson-buttons">
        <button className="speak-btn" onClick={() => speak(message)}>
          🔊 Hear again
        </button>
        <button className="big-btn" onClick={newGame}>
          New Game 🔄
        </button>
      </div>
    </div>
  )
}
