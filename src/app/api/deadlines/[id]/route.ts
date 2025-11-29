import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

// PATCH /api/deadlines/[id] - Update a deadline
export async function PATCH(
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

    const body = await request.json()
    const { title, description, dueDate, priority, status } = body

    // Check if deadline exists and belongs to user
    const existingDeadline = await prisma.deadline.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingDeadline) {
      return NextResponse.json(
        { error: "Deadline not found" },
        { status: 404 }
      )
    }

    if (existingDeadline.userId !== parseInt(user.id)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Validate priority if provided
    if (priority) {
      const validPriorities = ["low", "medium", "high"]
      if (!validPriorities.includes(priority)) {
        return NextResponse.json(
          { error: "Priority must be low, medium, or high" },
          { status: 400 }
        )
      }
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ["pending", "completed"]
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: "Status must be pending or completed" },
          { status: 400 }
        )
      }
    }

    // Build update data
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description || null
    if (dueDate !== undefined) updateData.dueDate = new Date(dueDate)
    if (priority !== undefined) updateData.priority = priority
    if (status !== undefined) updateData.status = status

    const deadline = await prisma.deadline.update({
      where: { id: parseInt(id) },
      data: updateData
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

    return NextResponse.json(transformedDeadline)
  } catch (error) {
    console.error("Error updating deadline:", error)
    return NextResponse.json(
      { error: "Failed to update deadline" },
      { status: 500 }
    )
  }
}

// DELETE /api/deadlines/[id] - Delete a deadline
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

    // Check if deadline exists and belongs to user
    const existingDeadline = await prisma.deadline.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingDeadline) {
      return NextResponse.json(
        { error: "Deadline not found" },
        { status: 404 }
      )
    }

    if (existingDeadline.userId !== parseInt(user.id)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    await prisma.deadline.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: "Deadline deleted successfully" })
  } catch (error) {
    console.error("Error deleting deadline:", error)
    return NextResponse.json(
      { error: "Failed to delete deadline" },
      { status: 500 }
    )
  }
}

