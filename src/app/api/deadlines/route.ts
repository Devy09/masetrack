import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

// GET /api/deadlines - Get all deadlines for the current user
export async function GET() {
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

    const deadlines = await prisma.deadline.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        dueDate: 'asc'
      }
    })

    // Transform the data to match frontend expectations
    const transformedDeadlines = deadlines.map(deadline => ({
      id: deadline.id.toString(),
      title: deadline.title,
      description: deadline.description || "",
      dueDate: deadline.dueDate.toISOString(),
      priority: deadline.priority as "low" | "medium" | "high",
      status: deadline.status as "pending" | "completed",
      createdAt: deadline.createdAt.toISOString(),
      createdBy: {
        id: deadline.user?.id?.toString() ?? "",
        name: deadline.user?.name ?? "Unknown",
        role: deadline.user?.role ?? "user",
      },
    }))

    return NextResponse.json(transformedDeadlines)
  } catch (error) {
    console.error("Error fetching deadlines:", error)
    return NextResponse.json(
      { error: "Failed to fetch deadlines" },
      { status: 500 }
    )
  }
}

// POST /api/deadlines - Create a new deadline
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
    const { title, description, dueDate, priority } = body

    if (!title || !dueDate) {
      return NextResponse.json(
        { error: "Title and due date are required" },
        { status: 400 }
      )
    }

    // Validate priority
    const validPriorities = ["low", "medium", "high"]
    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: "Priority must be low, medium, or high" },
        { status: 400 }
      )
    }

    const deadline = await prisma.deadline.create({
      data: {
        title,
        description: description || null,
        dueDate: new Date(dueDate),
        priority: priority || "medium",
        status: "pending",
        userId: parseInt(user.id),
      }
    })

    // Transform the response
    const transformedDeadline = {
      id: deadline.id.toString(),
      title: deadline.title,
      description: deadline.description || "",
      dueDate: deadline.dueDate.toISOString(),
      priority: deadline.priority as "low" | "medium" | "high",
      status: deadline.status as "pending" | "completed",
      createdAt: deadline.createdAt.toISOString(),
    }

    return NextResponse.json(transformedDeadline, { status: 201 })
  } catch (error) {
    console.error("Error creating deadline:", error)
    return NextResponse.json(
      { error: "Failed to create deadline" },
      { status: 500 }
    )
  }
}

