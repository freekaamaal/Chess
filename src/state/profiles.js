// Kid profiles with fun, easy passwords. Each child gets her OWN saved progress
// (streak, plan day, trophies) by namespacing all storage keys per profile.
//
// NOTE: this is a friendly child login to separate accounts and build
// accountability — not real security. Passwords are easy on purpose. To change a
// name/password/avatar, edit this list.
export const PROFILES = [
  { id: 'navya', name: 'Navya', avatar: '🦄', password: 'banana' },
  { id: 'aadhya', name: 'Aadhya', avatar: '🐯', password: 'mango' },
]

const ACTIVE_KEY = 'chess-active-profile'

export function getActiveProfileId() {
  try {
    return localStorage.getItem(ACTIVE_KEY) || null
  } catch {
    return null
  }
}

export function getActiveProfile() {
  return PROFILES.find((p) => p.id === getActiveProfileId()) || null
}

export function setActiveProfile(id) {
  localStorage.setItem(ACTIVE_KEY, id)
}

export function logout() {
  localStorage.removeItem(ACTIVE_KEY)
}

// Check a name+password (forgiving: case/space-insensitive). Returns the profile
// on success, or null.
export function tryLogin(profileId, password) {
  const profile = PROFILES.find((p) => p.id === profileId)
  if (!profile) return null
  const clean = (s) => String(s).trim().toLowerCase()
  return clean(password) === clean(profile.password) ? profile : null
}

// Build a per-profile storage key so each child's data is separate.
export function keyFor(base) {
  return `${base}::${getActiveProfileId() || 'guest'}`
}
