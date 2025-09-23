import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

// GET /api/polls/[id] - Get a specific poll
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pollId = parseInt(params.id)
    
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: {
          include: {
            _count: {
              select: { votes: true }
            }
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: { votes: true }
        }
      }
    })

    if (!poll) {
      return NextResponse.json(
        { error: "Poll not found" },
        { status: 404 }
      )
    }

    // Transform the data
    const transformedPoll = {
      id: poll.id.toString(),
      question: poll.question,
      description: poll.description,
      isActive: poll.isActive,
      createdAt: poll.createdAt,
      createdBy: {
        id: poll.createdBy.id.toString(),
        name: poll.createdBy.name,
        image: poll.createdBy.image || '/most-logo.png'
      },
      totalVotes: poll._count.votes,
      options: poll.options.map(option => ({
        id: option.id.toString(),
        text: option.text,
        votes: option._count.votes
      }))
    }

    return NextResponse.json(transformedPoll)
  } catch (error) {
    console.error("Error fetching poll:", error)
    return NextResponse.json(
      { error: "Failed to fetch poll" },
      { status: 500 }
    )
  }
}

// PUT /api/polls/[id] - Update a poll
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('auth-session')
    if (!sessionCookie?.value) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    const user = JSON.parse(sessionCookie.value)

    const pollId = parseInt(params.id)
    const body = await request.json()
    const { question, description, isActive } = body

    // Check if poll exists and user is the creator
    const existingPoll = await prisma.poll.findUnique({
      where: { id: pollId },
      select: { createdById: true }
    })

    if (!existingPoll) {
      return NextResponse.json(
        { error: "Poll not found" },
        { status: 404 }
      )
    }

    if (existingPoll.createdById !== parseInt(user.id)) {
      return NextResponse.json(
        { error: "Forbidden - You can only update your own polls" },
        { status: 403 }
      )
    }

    const updatedPoll = await prisma.poll.update({
      where: { id: pollId },
      data: {
        question,
        description,
        isActive
      },
      include: {
        options: {
          include: {
            _count: {
              select: { votes: true }
            }
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: { votes: true }
        }
      }
    })

    // Transform the response
    const transformedPoll = {
      id: updatedPoll.id.toString(),
      question: updatedPoll.question,
      description: updatedPoll.description,
      isActive: updatedPoll.isActive,
      createdAt: updatedPoll.createdAt,
      createdBy: {
        id: updatedPoll.createdBy.id.toString(),
        name: updatedPoll.createdBy.name,
        image: updatedPoll.createdBy.image || '/most-logo.png'
      },
      totalVotes: updatedPoll._count.votes,
      options: updatedPoll.options.map(option => ({
        id: option.id.toString(),
        text: option.text,
        votes: option._count.votes
      }))
    }

    return NextResponse.json(transformedPoll)
  } catch (error) {
    console.error("Error updating poll:", error)
    return NextResponse.json(
      { error: "Failed to update poll" },
      { status: 500 }
    )
  }
}

// DELETE /api/polls/[id] - Delete a poll
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('auth-session')
    if (!sessionCookie?.value) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    const user = JSON.parse(sessionCookie.value)

    const pollId = parseInt(params.id)

    // Check if poll exists and user is the creator
    const existingPoll = await prisma.poll.findUnique({
      where: { id: pollId },
      select: { createdById: true }
    })

    if (!existingPoll) {
      return NextResponse.json(
        { error: "Poll not found" },
        { status: 404 }
      )
    }

    if (existingPoll.createdById !== parseInt(user.id)) {
      return NextResponse.json(
        { error: "Forbidden - You can only delete your own polls" },
        { status: 403 }
      )
    }

    await prisma.poll.delete({
      where: { id: pollId }
    })

    return NextResponse.json({ message: "Poll deleted successfully" })
  } catch (error) {
    console.error("Error deleting poll:", error)
    return NextResponse.json(
      { error: "Failed to delete poll" },
      { status: 500 }
    )
  }
}

