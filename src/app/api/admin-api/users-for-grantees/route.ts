import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET users with role "user" for grantee enrollment
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: 'user'
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phoneNumber: true,
        address: true,
        status: true,
        batch: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users for grantees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
