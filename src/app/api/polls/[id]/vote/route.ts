import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params
    const pollId = parseInt(id)
    const body = await request.json()
    const { optionId } = body

    if (!optionId) {
      return NextResponse.json(
        { error: "Option ID is required" },
        { status: 400 }
      )
    }

    const userId = parseInt(user.id)

    // Check if poll exists and is active
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: {
          where: { id: parseInt(optionId) }
        }
      }
    })

    if (!poll) {
      return NextResponse.json(
        { error: "Poll not found" },
        { status: 404 }
      )
    }

    if (!poll.isActive) {
      return NextResponse.json(
        { error: "Poll is not active" },
        { status: 400 }
      )
    }

    if (poll.options.length === 0) {
      return NextResponse.json(
        { error: "Invalid option" },
        { status: 400 }
      )
    }

    // Check if user has already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        pollId_userId: {
          pollId,
          userId
        }
      }
    })

    if (existingVote) {
      return NextResponse.json(
        { error: "You have already voted on this poll" },
        { status: 400 }
      )
    }

    // Create the vote
    const vote = await prisma.vote.create({
      data: {
        pollId,
        optionId: parseInt(optionId),
        userId
      },
      include: {
        option: true,
        poll: {
          include: {
            options: {
              include: {
                _count: {
                  select: { votes: true }
                }
              }
            },
            _count: {
              select: { votes: true }
            }
          }
        }
      }
    })

    // Return updated poll data
    const updatedPoll = {
      id: vote.poll.id.toString(),
      question: vote.poll.question,
      description: vote.poll.description,
      isActive: vote.poll.isActive,
      createdAt: vote.poll.createdAt,
      totalVotes: vote.poll._count.votes,
      options: vote.poll.options.map(option => ({
        id: option.id.toString(),
        text: option.text,
        votes: option._count.votes
      }))
    }

    return NextResponse.json({
      message: "Vote recorded successfully",
      poll: updatedPoll,
      userVote: {
        optionId: vote.optionId.toString(),
        optionText: vote.option.text
      }
    })
  } catch (error) {
    console.error("Error voting on poll:", error)
    return NextResponse.json(
      { error: "Failed to record vote" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params
    const pollId = parseInt(id)
    const user = JSON.parse(sessionCookie.value)
    const userId = parseInt(user.id)

    const vote = await prisma.vote.findUnique({
      where: {
        pollId_userId: {
          pollId,
          userId
        }
      },
      include: {
        option: true
      }
    })

    if (!vote) {
      return NextResponse.json({ hasVoted: false })
    }

    return NextResponse.json({
      hasVoted: true,
      optionId: vote.optionId.toString(),
      optionText: vote.option.text,
      votedAt: vote.createdAt
    })
  } catch (error) {
    console.error("Error fetching user vote:", error)
    return NextResponse.json(
      { error: "Failed to fetch vote" },
      { status: 500 }
    )
  }
}
