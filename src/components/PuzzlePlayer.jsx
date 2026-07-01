import { useEffect, useMemo, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import { speak, sfx } from '../audio/speak.js'
import InteractiveBoard from './InteractiveBoard.jsx'
import Mascot from './Mascot.jsx'

// Plays an ordered list of tactic puzzles one at a time (the "legs"), showing a
// Step X of N bar. Calls onComplete() once every puzzle is solved.
export default function PuzzlePlayer({ puzzles, title = 'Puzzle', onExit, onComplete, onResult }) {
  const [index, setIndex] = useState(0)
  const [position, setPosition] = useState(puzzles[0].fen)
  const chessRef = useRef(new Chess(puzzles[0].fen))
  const busy = useRef(false)
  const tries = useRef(0)

  const puzzle = puzzles[index]

  useEffect(() => {
    chessRef.current = new Chess(puzzle.fen)
    setPosition(puzzle.fen)
    busy.current = false
    tries.current = 0
    speak(puzzle.hint)
    sfx.tap()
  }, [index]) // eslint-disable-line react-hooks/exhaustive-deps

  const chess = chessRef.current
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

  function solved(move) {
    if (puzzle.type === 'mate') return chess.isCheckmate()
    if (puzzle.type === 'capture') return move.from === puzzle.from && move.to === puzzle.to
    if (puzzle.type === 'solution') return move.from === puzzle.from && move.to === puzzle.to
    if (puzzle.type === 'save') {
      // The threatened piece (originally on puzzle.from) must now be safe: either
      // she moved it to an unattacked square, or she captured the attacker.
      const pieceSq = move.from === puzzle.from ? move.to : puzzle.from
      const stillThere = !!chess.get(pieceSq)
      const canBeTaken = chess.moves({ verbose: true }).some((m) => m.to === pieceSq)
      return stillThere && !canBeTaken
    }
    return false
  }

  function advance() {
    if (index === puzzles.length - 1) {
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
    if (solved(move)) {
      busy.current = true
      onResult?.({ id: puzzle.id, level: puzzle.level || 1, firstTry: tries.current === 0 })
      sfx.win()
      speak(puzzle.type === 'mate' ? 'Checkmate! Brilliant!' : 'Great move!')
      setTimeout(advance, 1100)
      return true
    }
    tries.current += 1
    busy.current = true
    speak('Not quite! Try again.')
    setTimeout(() => {
      chess.undo()
      setPosition(chess.fen())
      busy.current = false
    }, 700)
    return true
  }

  return (
    <div className="lesson">
      <div className="lesson-top">
        <button className="back-btn" onClick={onExit} aria-label="Back">
          ⬅️
        </button>
        <div className="step-bar">
          {puzzles.map((_, i) => (
            <span key={i} className={`step-seg ${i < index ? 'done' : ''} ${i === index ? 'current' : ''}`} />
          ))}
        </div>
        <div className="star-count">{index + 1}/{puzzles.length}</div>
      </div>

      <Mascot speaking message={puzzle.hint} />

      <div className="piece-card" style={{ '--piece-color': puzzle.type === 'mate' ? '#ab47bc' : puzzle.type === 'save' ? '#0288d1' : '#ef6c00' }}>
        <div className="piece-emoji">{puzzle.type === 'mate' ? '👑' : puzzle.type === 'save' ? '🛡️' : puzzle.type === 'solution' ? '🐴' : '🎯'}</div>
        <div className="piece-name">{title} {index + 1}</div>
        <div className="piece-title">{puzzle.theme || 'Puzzle'}</div>
      </div>

      <div className="board-wrap">
        <InteractiveBoard
          boardId={`puzzle-${puzzle.id}-${index}`}
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
        <div className="hint-text">Move the glowing piece</div>
      </div>
    </div>
  )
}
