// Voice + sound helpers.
//
// A 6-year-old can't read fluently, so the mascot SPEAKS every instruction.
// We use the browser's built-in Web Speech API — free, no audio files needed.

let voiceEnabled = true

export function setVoiceEnabled(on) {
  voiceEnabled = on
  if (!on) window.speechSynthesis?.cancel()
}

export function isVoiceEnabled() {
  return voiceEnabled
}

// Pick a friendly, higher-pitched voice when one is available.
function pickVoice() {
  const voices = window.speechSynthesis?.getVoices() || []
  // Prefer an English voice; many systems expose a child/female option.
  return (
    voices.find((v) => /en(-|_)?(US|GB)/i.test(v.lang) && /female|samantha|zira|google/i.test(v.name)) ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    voices[0]
  )
}

export function speak(text, { rate = 0.95, pitch = 1.25 } = {}) {
  if (!voiceEnabled || !('speechSynthesis' in window)) return
  window.speechSynthesis.cancel() // never let lines stack up on a fidgety tapper
  const u = new SpeechSynthesisUtterance(text)
  const v = pickVoice()
  if (v) u.voice = v
  u.rate = rate
  u.pitch = pitch
  window.speechSynthesis.speak(u)
}

// Tiny built-in sound effects using the Web Audio API (no files to ship).
let audioCtx
function tone(freq, duration, type = 'sine', when = 0) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = type
    osc.frequency.value = freq
    const t = audioCtx.currentTime + when
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.25, t + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration)
    osc.connect(gain).connect(audioCtx.destination)
    osc.start(t)
    osc.stop(t + duration + 0.02)
  } catch {
    /* audio not available — ignore */
  }
}

export const sfx = {
  tap: () => tone(660, 0.08, 'triangle'),
  good: () => {
    tone(660, 0.12, 'triangle', 0)
    tone(880, 0.16, 'triangle', 0.1)
  },
  win: () => {
    tone(523, 0.14, 'triangle', 0)
    tone(659, 0.14, 'triangle', 0.12)
    tone(784, 0.14, 'triangle', 0.24)
    tone(1046, 0.3, 'triangle', 0.36)
  },
}
