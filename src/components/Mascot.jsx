import { getMascot } from '../state/coach.js'

// The friendly coach who guides Navya. The character (lion, puppy, unicorn…) is
// whatever she picked in Settings. He bounces while "speaking" so a non-reading
// child knows to listen.
export default function Mascot({ speaking, message }) {
  const coach = getMascot()
  return (
    <div className="mascot">
      <div className={`mascot-face ${speaking ? 'talking' : ''}`} aria-hidden="true">
        {coach.emoji}
      </div>
      {message && <div className="mascot-bubble">{message}</div>}
    </div>
  )
}
