import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    console.log('Session endpoint called')
    const cookieStore = await cookies()
    const session = cookieStore.get('auth-session')
    
    if (!session?.value) {
      console.log('No auth-session cookie found')
      return NextResponse.json({ user: null })
    }
    
    const user = JSON.parse(session.value)
    console.log('Parsed user from session:', user)
    
    // Ensure the user object has all required fields including image
    const userWithDefaults = {
      ...user,
      image: user.image || '/most-logo.png' // Provide default image if none exists
    }
    
    return NextResponse.json({ user: userWithDefaults })
    
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json(
      { user: null },
      { status: 200 }
    )
  }
}
