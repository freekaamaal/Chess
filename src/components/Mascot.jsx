// Leo the Lion — the friendly guide who talks the child through everything.
// He bounces when he's "speaking" so a non-reading child knows to listen.

export default function Mascot({ speaking, message }) {
  return (
    <div className="mascot">
      <div className={`mascot-face ${speaking ? 'talking' : ''}`} aria-hidden="true">
        🦁
      </div>
      {message && <div className="mascot-bubble">{message}</div>}
    </div>
  )
}
