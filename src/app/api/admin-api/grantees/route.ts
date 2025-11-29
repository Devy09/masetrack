import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { logActivity, ActivityActions, EntityTypes } from '@/lib/activity-log';

// GET all grantees from Grantee table
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('auth-session')

    let currentUser: { id: string | number; role: string } | null = null
    if (session?.value) {
      try { 
        currentUser = JSON.parse(session.value)
      } catch (error) {
        console.error('Error parsing session:', error)
        return NextResponse.json(
          { error: 'Invalid session' },
          { status: 401 }
        )
      }
    }

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const whereClause = currentUser.role === 'personnel'
      ? { addedById: Number(currentUser.id) }
      : {}

    const grantees = await prisma.grantee.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phoneNumber: true,
        address: true,
        status: true,
        batch: true,
        addedBy: { select: { id: true, name: true, email: true } },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(grantees);
  } catch (error) {
    console.error('Error fetching grantees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grantees' },
      { status: 500 }
    );
  }
}

// POST - Add new grantee (create Grantee record)
export async function POST(request: Request) {
  try {
    // Log the incoming request for debugging
    const requestBody = await request.json();
    console.log('POST /api/admin-api/grantees - Request body:', requestBody);
    
    const { userId, batch, phoneNumber, address, status = 'active' } = requestBody;

    const cookieStore = await cookies()
    const session = cookieStore.get('auth-session')
    if (!session?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    const currentUser = JSON.parse(session.value)

    if (!userId) {
      console.log('POST /api/admin-api/grantees - Missing userId in request');
      return NextResponse.json(
        { error: 'User ID is required', receivedData: requestBody },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is already a grantee
    const existingGrantee = await prisma.grantee.findUnique({
      where: { userId: Number(userId) },
    });

    if (existingGrantee) {
      console.log(`POST /api/admin-api/grantees - User ${userId} is already a grantee`);
      return NextResponse.json(
        { error: 'User is already a grantee' },
        { status: 400 }
      );
    }

    // Create new grantee record
    const newGrantee = await prisma.grantee.create({
      data: {
        userId: Number(userId),
        name: existingUser.name,
        email: existingUser.email,
        image: existingUser.image,
        batch: batch || existingUser.batch,
        phoneNumber: phoneNumber || existingUser.phoneNumber,
        address: address || existingUser.address,
        status: status,
        addedById: Number(currentUser.id),
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
        addedBy: { select: { id: true, name: true, email: true } },
        createdAt: true,
        updatedAt: true,
      },
    });

    // Log activity
    await logActivity({
      action: ActivityActions.GRANTEE_ADDED,
      entityType: EntityTypes.GRANTEE,
      entityId: newGrantee.id,
      description: `${currentUser.name} added ${existingUser.name} as a grantee (Batch: ${newGrantee.batch})`,
      userId: Number(currentUser.id),
      metadata: {
        granteeName: existingUser.name,
        granteeEmail: existingUser.email,
        batch: newGrantee.batch,
        status: newGrantee.status,
      },
    });

    return NextResponse.json(newGrantee);
  } catch (error) {
    console.error('Error adding grantee:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to add grantee', details: errorMessage },
      { status: 500 }
    );
  }
}

// PATCH - Update grantee details
export async function PATCH(request: Request) {
  try {
    const { id, batch, phoneNumber, address, status } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Grantee ID is required' },
        { status: 400 }
      );
    }

    // Check if grantee exists
    const existingGrantee = await prisma.grantee.findUnique({
      where: { id: Number(id) },
    });

    if (!existingGrantee) {
      return NextResponse.json(
        { error: 'Grantee not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (batch !== undefined) updateData.batch = batch;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (address !== undefined) updateData.address = address;
    if (status !== undefined) updateData.status = status;

    // Get current user for logging
    const cookieStore = await cookies()
    const session = cookieStore.get('auth-session')
    if (!session?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    const currentUser = JSON.parse(session.value)

    // Update grantee
    const updatedGrantee = await prisma.grantee.update({
      where: { id: Number(id) },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phoneNumber: true,
        address: true,
        status: true,
        batch: true,
        addedBy: { select: { id: true, name: true, email: true } },
        createdAt: true,
        updatedAt: true,
      },
    });

    // Log activity
    const changes = []
    if (batch !== undefined) changes.push(`batch to ${batch}`)
    if (phoneNumber !== undefined) changes.push(`phone number`)
    if (address !== undefined) changes.push(`address`)
    if (status !== undefined) changes.push(`status to ${status}`)

    await logActivity({
      action: ActivityActions.GRANTEE_UPDATED,
      entityType: EntityTypes.GRANTEE,
      entityId: updatedGrantee.id,
      description: `${currentUser.name} updated grantee ${updatedGrantee.name} (${changes.join(', ')})`,
      userId: Number(currentUser.id),
      metadata: {
        granteeName: updatedGrantee.name,
        changes: {
          batch: batch !== undefined ? batch : undefined,
          phoneNumber: phoneNumber !== undefined,
          address: address !== undefined,
          status: status !== undefined ? status : undefined,
        },
      },
    });

    return NextResponse.json(updatedGrantee);
  } catch (error) {
    console.error('Error updating grantee:', error);
    return NextResponse.json(
      { error: 'Failed to update grantee' },
      { status: 500 }
    );
  }
}

// DELETE - Remove grantee (delete Grantee record)
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Grantee ID is required' },
        { status: 400 }
      );
    }

    const existingGrantee = await prisma.grantee.findUnique({
      where: { id: Number(id) },
    });

    if (!existingGrantee) {
      return NextResponse.json(
        { error: 'Grantee not found' },
        { status: 404 }
      );
    }

    // Get current user for logging
    const cookieStore = await cookies()
    const session = cookieStore.get('auth-session')
    if (!session?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    const currentUser = JSON.parse(session.value)

    // Delete grantee record
    await prisma.grantee.delete({
      where: { id: Number(id) },
    });

    // Log activity
    await logActivity({
      action: ActivityActions.GRANTEE_DELETED,
      entityType: EntityTypes.GRANTEE,
      entityId: Number(id),
      description: `${currentUser.name} removed ${existingGrantee.name} from grantees`,
      userId: Number(currentUser.id),
      metadata: {
        granteeName: existingGrantee.name,
        granteeEmail: existingGrantee.email,
        batch: existingGrantee.batch,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing grantee:', error);
    return NextResponse.json(
      { error: 'Failed to remove grantee' },
      { status: 500 }
    );
  }
}
