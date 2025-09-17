import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// GET current user profile
export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('auth-session')
    
    if (!session?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const user = JSON.parse(session.value)
    
    const userProfile = await prisma.user.findUnique({
      where: { id: Number(user.id) },
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
        status: true,
        batch: true,
        image: true,
        phoneNumber: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

// UPDATE USER PROFILE
export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('auth-session')
    
    if (!session?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const user = JSON.parse(session.value)
    const userData = await request.json();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(user.id) },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare update data - only include fields that are provided
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (userData.name !== undefined) {
      updateData.name = userData.name;
    }

    if (userData.email !== undefined) {
      updateData.email = userData.email;
    }

    if (userData.batch !== undefined) {
      updateData.batch = userData.batch;
    }

    if (userData.phoneNumber !== undefined) {
      updateData.phoneNumber = userData.phoneNumber;
    }

    if (userData.address !== undefined) {
      updateData.address = userData.address;
    }

    if (userData.image !== undefined) {
      updateData.image = userData.image;
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: Number(user.id) },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        batch: true,
        image: true,
        phoneNumber: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Update the session with new data
    const newSession = {
      id: updatedUser.id.toString(),
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      image: updatedUser.image,
      status: updatedUser.status,
      batch: updatedUser.batch,
      phoneNumber: updatedUser.phoneNumber,
      address: updatedUser.address
    }

    // Update session cookie
    const response = NextResponse.json(updatedUser)
    response.cookies.set('auth-session', JSON.stringify(newSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Error updating user:', error);
    
    // Handle unique constraint violations (e.g., duplicate email)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Email address is already in use' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}