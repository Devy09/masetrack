import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  const { email, password } = await req.json()
  console.log('Login attempt for email:', email);

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })
    
    console.log('Found user:', user ? 'Yes' : 'No');
    if (user) {
      console.log('User status:', user.status);
      console.log('Password hash exists:', !!user.password);
    }

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' }, 
        { status: 401 }
      )
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    console.log('Password match:', passwordMatch);
    
    if (!passwordMatch) {
      return NextResponse.json(
        { message: 'Invalid email or password' }, 
        { status: 401 }
      )
    }

    // Create session
    const session = {
      id: user.id.toString(), // Convert to string to match User type
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
      status: user.status,
      batch: user.batch,
      phoneNumber: user.phoneNumber,
      address: user.address
    }

    // Set session cookie
    const response = NextResponse.json({ 
      success: true,
      user: session
    })

    // Set secure cookie with proper Vercel configuration
    response.cookies.set('auth-session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? undefined : undefined, // Let Vercel handle domain
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' }, 
      { status: 500 }
    )
  }
}