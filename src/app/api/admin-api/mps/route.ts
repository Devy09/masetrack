import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all MPs
export async function GET() {
  try {
    const mps = await prisma.mP.findMany({
      include: {
        grantees: {
          select: {
            id: true,
            name: true,
            email: true,
            batch: true,
            status: true,
            image: true,
          }
        }
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(mps);
  } catch (error) {
    console.error('Error fetching MPs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch MPs' },
      { status: 500 }
    );
  }
}

// POST - Add new MP
export async function POST(request: Request) {
  try {
    const { name, email, phoneNumber, address, district, party, image, status = 'active' } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if MP with email already exists
    const existingMP = await prisma.mP.findUnique({
      where: { email },
    });

    if (existingMP) {
      return NextResponse.json(
        { error: 'MP with this email already exists' },
        { status: 409 }
      );
    }

    const newMP = await prisma.mP.create({
      data: {
        name,
        email,
        phoneNumber,
        address,
        district,
        party,
        image,
        status,
      },
      include: {
        grantees: {
          select: {
            id: true,
            name: true,
            email: true,
            batch: true,
            status: true,
            image: true,
          }
        }
      },
    });

    return NextResponse.json(newMP);
  } catch (error) {
    console.error('Error creating MP:', error);
    return NextResponse.json(
      { error: 'Failed to create MP' },
      { status: 500 }
    );
  }
}

// PATCH - Update MP
export async function PATCH(request: Request) {
  try {
    const { id, name, email, phoneNumber, address, district, party, image, status } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'MP ID is required' },
        { status: 400 }
      );
    }

    // Check if MP exists
    const existingMP = await prisma.mP.findUnique({
      where: { id: Number(id) },
    });

    if (!existingMP) {
      return NextResponse.json(
        { error: 'MP not found' },
        { status: 404 }
      );
    }

    // Check if email is being changed and if it conflicts
    if (email && email !== existingMP.email) {
      const emailConflict = await prisma.mP.findUnique({
        where: { email },
      });

      if (emailConflict) {
        return NextResponse.json(
          { error: 'MP with this email already exists' },
          { status: 409 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (address !== undefined) updateData.address = address;
    if (district !== undefined) updateData.district = district;
    if (party !== undefined) updateData.party = party;
    if (image !== undefined) updateData.image = image;
    if (status !== undefined) updateData.status = status;

    const updatedMP = await prisma.mP.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        grantees: {
          select: {
            id: true,
            name: true,
            email: true,
            batch: true,
            status: true,
            image: true,
          }
        }
      },
    });

    return NextResponse.json(updatedMP);
  } catch (error) {
    console.error('Error updating MP:', error);
    return NextResponse.json(
      { error: 'Failed to update MP' },
      { status: 500 }
    );
  }
}

// DELETE - Remove MP
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'MP ID is required' },
        { status: 400 }
      );
    }

    const existingMP = await prisma.mP.findUnique({
      where: { id: Number(id) },
      include: {
        grantees: true
      }
    });

    if (!existingMP) {
      return NextResponse.json(
        { error: 'MP not found' },
        { status: 404 }
      );
    }

    // Check if MP has grantees
    if (existingMP.grantees.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete MP with assigned grantees. Please reassign grantees first.' },
        { status: 400 }
      );
    }

    await prisma.mP.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting MP:', error);
    return NextResponse.json(
      { error: 'Failed to delete MP' },
      { status: 500 }
    );
  }
}
