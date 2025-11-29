import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

// GET /api/calendar-activities/[id] - Get a specific calendar activity
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
    const activityId = parseInt(id)
    
    const activity = await prisma.calendarActivity.findUnique({
      where: { id: activityId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      }
    })

    if (!activity) {
      return NextResponse.json(
        { error: "Calendar activity not found" },
        { status: 404 }
      )
    }

    const dateStr = activity.date.toISOString().split('T')[0]
    const transformedActivity = {
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

    return NextResponse.json(transformedActivity)
  } catch (error) {
    console.error("Error fetching calendar activity:", error)
    return NextResponse.json(
      { error: "Failed to fetch calendar activity" },
      { status: 500 }
    )
  }
}

// PUT /api/calendar-activities/[id] - Update a calendar activity
export async function PUT(
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
    const activityId = parseInt(id)
    
    const body = await request.json()
    const { title, date, time, category, color } = body

    // Check if activity exists
    const existingActivity = await prisma.calendarActivity.findUnique({
      where: { id: activityId }
    })

    if (!existingActivity) {
      return NextResponse.json(
        { error: "Calendar activity not found" },
        { status: 404 }
      )
    }

    // Check if user owns this activity (optional: you might want to allow admins to edit any)
    if (existingActivity.userId !== parseInt(user.id)) {
      return NextResponse.json(
        { error: "Unauthorized to edit this activity" },
        { status: 403 }
      )
    }

    // Validate category if provided
    if (category) {
      const validCategories = ["meeting", "event", "deadline"]
      if (!validCategories.includes(category)) {
        return NextResponse.json(
          { error: "Category must be meeting, event, or deadline" },
          { status: 400 }
        )
      }
    }

    // Validate date format if provided
    if (date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(date)) {
        return NextResponse.json(
          { error: "Invalid date format. Expected YYYY-MM-DD" },
          { status: 400 }
        )
      }
    }

    // Determine color if category changed
    let activityColor = color || existingActivity.color
    if (category && !color) {
      const categoryColors = {
        meeting: "bg-blue-500",
        event: "bg-green-500",
        deadline: "bg-red-500",
      }
      activityColor = categoryColors[category as keyof typeof categoryColors]
    }

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (date !== undefined) updateData.date = new Date(date)
    if (time !== undefined) updateData.time = time
    if (category !== undefined) updateData.category = category
    if (activityColor !== undefined) updateData.color = activityColor

    const activity = await prisma.calendarActivity.update({
      where: { id: activityId },
      data: updateData
    })

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

    return NextResponse.json(transformedActivity)
  } catch (error) {
    console.error("Error updating calendar activity:", error)
    return NextResponse.json(
      { error: "Failed to update calendar activity" },
      { status: 500 }
    )
  }
}

// DELETE /api/calendar-activities/[id] - Delete a calendar activity
export async function DELETE(
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
    const activityId = parseInt(id)
    
    // Check if activity exists
    const existingActivity = await prisma.calendarActivity.findUnique({
      where: { id: activityId }
    })

    if (!existingActivity) {
      return NextResponse.json(
        { error: "Calendar activity not found" },
        { status: 404 }
      )
    }

    // Check if user owns this activity (optional: you might want to allow admins to delete any)
    if (existingActivity.userId !== parseInt(user.id)) {
      return NextResponse.json(
        { error: "Unauthorized to delete this activity" },
        { status: 403 }
      )
    }

    await prisma.calendarActivity.delete({
      where: { id: activityId }
    })

    return NextResponse.json({ message: "Calendar activity deleted successfully" })
  } catch (error) {
    console.error("Error deleting calendar activity:", error)
    return NextResponse.json(
      { error: "Failed to delete calendar activity" },
      { status: 500 }
    )
  }
}

