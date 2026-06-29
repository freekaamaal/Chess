import { useState } from 'react'
import { Chessboard } from 'react-chessboard'

// A chess board that supports BOTH tapping (tap a piece, then tap where to go —
// easiest for young kids) and dragging. The parent owns the real chess.js game;
// this component only reports attempted moves and asks the parent what's legal.
export default function InteractiveBoard({
  position,
  onMove,            // (from, to) => boolean : apply the move, return if accepted
  legalTargets,      // (square) => string[] : squares the selected piece may go to
  canSelect,         // (square) => boolean  : may the player pick up this square's piece
  extraStyles = {},  // extra square styles (hints, check, last move)
  boardId = 'board',
}) {
  const [selected, setSelected] = useState(null)

  function clear() {
    setSelected(null)
  }

  function handleSquareClick(square) {
    if (selected) {
      if (square === selected) return clear()
      if (legalTargets(selected).includes(square)) {
        onMove(selected, square)
        return clear()
      }
      if (canSelect(square)) return setSelected(square)
      return clear()
    }
    if (canSelect(square)) setSelected(square)
  }

  function handleDrop(from, to) {
    clear()
    return onMove(from, to)
  }

  const styles = { ...extraStyles }
  if (selected) {
    styles[selected] = { ...(styles[selected] || {}), boxShadow: 'inset 0 0 0 4px #ffd54f' }
    for (const t of legalTargets(selected)) {
      styles[t] = {
        ...(styles[t] || {}),
        background: 'radial-gradient(circle, rgba(102,187,106,0.55) 28%, transparent 30%)',
      }
    }
  }

  return (
    <Chessboard
      id={boardId}
      position={position}
      onPieceDrop={handleDrop}
      onSquareClick={handleSquareClick}
      isDraggablePiece={({ sourceSquare }) => canSelect(sourceSquare)}
      autoPromoteToQueen
      animationDuration={180}
      customSquareStyles={styles}
      customBoardStyle={{ borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.2)' }}
      customLightSquareStyle={{ backgroundColor: '#f3e9ff' }}
      customDarkSquareStyle={{ backgroundColor: '#b39ddb' }}
    />
  )
}
