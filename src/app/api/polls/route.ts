import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

// GET /api/polls - Get all polls
export async function GET() {
  try {
    const polls = await prisma.poll.findMany({
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to match frontend expectations
    const transformedPolls = polls.map(poll => ({
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
    }))

    return NextResponse.json(transformedPolls)
  } catch (error) {
    console.error("Error fetching polls:", error)
    return NextResponse.json(
      { error: "Failed to fetch polls" },
      { status: 500 }
    )
  }
}

// POST /api/polls - Create a new poll
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { question, description, options } = body

    if (!question || !options || options.length < 2) {
      return NextResponse.json(
        { error: "Question and at least 2 options are required" },
        { status: 400 }
      )
    }

    const poll = await prisma.poll.create({
      data: {
        question,
        description,
        createdById: parseInt(user.id),
        options: {
          create: options.map((option: string) => ({
            text: option
          }))
        }
      },
      include: {
        options: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    // Transform the response
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
      totalVotes: 0,
      options: poll.options.map(option => ({
        id: option.id.toString(),
        text: option.text,
        votes: 0
      }))
    }

    return NextResponse.json(transformedPoll, { status: 201 })
  } catch (error) {
    console.error("Error creating poll:", error)
    return NextResponse.json(
      { error: "Failed to create poll" },
      { status: 500 }
    )
  }
}

