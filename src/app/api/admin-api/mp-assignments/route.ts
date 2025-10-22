import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST - Assign grantee to MP
export async function POST(request: Request) {
  try {
    const { granteeId, mpId } = await request.json();

    if (!granteeId || !mpId) {
      return NextResponse.json(
        { error: 'Grantee ID and MP ID are required' },
        { status: 400 }
      );
    }

    // Check if grantee exists
    const grantee = await prisma.user.findUnique({
      where: { id: Number(granteeId) },
    });

    if (!grantee) {
      return NextResponse.json(
        { error: 'Grantee not found' },
        { status: 404 }
      );
    }

    // Check if MP exists
    const mp = await prisma.mP.findUnique({
      where: { id: Number(mpId) },
    });

    if (!mp) {
      return NextResponse.json(
        { error: 'MP not found' },
        { status: 404 }
      );
    }

    // Update grantee to assign to MP
    const updatedGrantee = await prisma.user.update({
      where: { id: Number(granteeId) },
      data: {
        mpId: Number(mpId),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        batch: true,
        status: true,
        image: true,
        phoneNumber: true,
        address: true,
        mp: {
          select: {
            id: true,
            name: true,
            district: true,
            party: true,
          }
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedGrantee);
  } catch (error) {
    console.error('Error assigning grantee to MP:', error);
    return NextResponse.json(
      { error: 'Failed to assign grantee to MP' },
      { status: 500 }
    );
  }
}

// DELETE - Remove grantee from MP
export async function DELETE(request: Request) {
  try {
    const { granteeId } = await request.json();
    
    if (!granteeId) {
      return NextResponse.json(
        { error: 'Grantee ID is required' },
        { status: 400 }
      );
    }

    // Check if grantee exists
    const grantee = await prisma.user.findUnique({
      where: { id: Number(granteeId) },
    });

    if (!grantee) {
      return NextResponse.json(
        { error: 'Grantee not found' },
        { status: 404 }
      );
    }

    // Remove MP assignment
    const updatedGrantee = await prisma.user.update({
      where: { id: Number(granteeId) },
      data: {
        mpId: null,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        batch: true,
        status: true,
        image: true,
        phoneNumber: true,
        address: true,
        mp: null,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedGrantee);
  } catch (error) {
    console.error('Error removing grantee from MP:', error);
    return NextResponse.json(
      { error: 'Failed to remove grantee from MP' },
      { status: 500 }
    );
  }
}
