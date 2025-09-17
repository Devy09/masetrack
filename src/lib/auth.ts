'use client'

type User = {
  id: string
  email: string
  name: string | null
  // Add other user fields as needed
}

export function setUserSession(user: User) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user))
  }
}

export function getUserSession(): User | null {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }
  return null
}

export function clearUserSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user')
  }
}

export function isAuthenticated(): boolean {
  return getUserSession() !== null
}
