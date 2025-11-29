import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

// GET /api/calendar-activities - Get all calendar activities
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

    const activities = await prisma.calendarActivity.findMany({
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
        date: 'asc'
      }
    })

    // Transform the data to match frontend expectations
    const transformedActivities = activities.map(activity => {
      // Format date as YYYY-MM-DD
      const dateStr = activity.date.toISOString().split('T')[0]
      
      return {
        id: activity.id,
        date: dateStr,
        title: activity.title,
        time: activity.time,
        category: activity.category as "meeting" | "event" | "deadline",
        color: activity.color,
        createdAt: activity.createdAt.toISOString(),
        createdBy: {
          id: activity.user?.id?.toString() ?? "",
          name: activity.user?.name ?? "Unknown",
          role: activity.user?.role ?? "user",
        },
      }
    })

    return NextResponse.json(transformedActivities)
  } catch (error) {
    console.error("Error fetching calendar activities:", error)
    return NextResponse.json(
      { error: "Failed to fetch calendar activities" },
      { status: 500 }
    )
  }
}

// POST /api/calendar-activities - Create a new calendar activity
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
    const { title, date, time, category, color } = body

    if (!title || !date || !time || !category) {
      return NextResponse.json(
        { error: "Title, date, time, and category are required" },
        { status: 400 }
      )
    }

    // Validate category
    const validCategories = ["meeting", "event", "deadline"]
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: "Category must be meeting, event, or deadline" },
        { status: 400 }
      )
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: "Invalid date format. Expected YYYY-MM-DD" },
        { status: 400 }
      )
    }

    // Determine color if not provided
    const categoryColors = {
      meeting: "bg-blue-500",
      event: "bg-green-500",
      deadline: "bg-red-500",
    }
    const activityColor = color || categoryColors[category as keyof typeof categoryColors]

    // Convert date string to DateTime
    const activityDate = new Date(date)

    const activity = await prisma.calendarActivity.create({
      data: {
        title,
        date: activityDate,
        time,
        category,
        color: activityColor,
        userId: parseInt(user.id),
      }
    })

    // Transform the response
    const dateStr = activity.date.toISOString().split('T')[0]
    const transformedActivity = {
      id: activity.id,
      date: dateStr,
      title: activity.title,
      time: activity.time,
      category: activity.category as "meeting" | "event" | "deadline",
      color: activity.color,
      createdAt: activity.createdAt.toISOString(),
    }

    return NextResponse.json(transformedActivity, { status: 201 })
  } catch (error) {
    console.error("Error creating calendar activity:", error)
    return NextResponse.json(
      { error: "Failed to create calendar activity" },
      { status: 500 }
    )
  }
}

