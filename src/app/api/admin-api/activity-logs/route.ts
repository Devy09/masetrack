import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

import prisma from "@/lib/prisma"

type ActivityLogResponse = {
  id: number
  action: string
  entityType: string | null
  entityId: number | null
  description: string
  metadata: string | null
  userId: number
  createdAt: Date
  user: {
    id: number
    name: string
    email: string
    role: string
    image: string | null
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("auth-session")

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    let currentUser: { id: string | number; role: string }
    try {
      currentUser = JSON.parse(sessionCookie.value)
    } catch (error) {
      console.error("Failed to parse session cookie:", error)
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    // Only admin and personnel can view activity logs
    if (currentUser.role !== "admin" && currentUser.role !== "personnel") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const action = searchParams.get("action")
    const entityType = searchParams.get("entityType")
    const userId = searchParams.get("userId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (action) {
      where.action = action
    }

    if (entityType) {
      where.entityType = entityType
    }

    if (userId) {
      where.userId = parseInt(userId)
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
      }
    }

    // Fetch activity logs with pagination
    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              image: true,
            },
          },
        },
      }),
      prisma.activityLog.count({ where }),
    ])

    // Get unique actions and entity types for filters
    // Use groupBy for better distinct results
    const [actionGroups, entityTypeGroups] = await Promise.all([
      prisma.activityLog.groupBy({
        by: ["action"],
        _count: {
          action: true,
        },
        orderBy: {
          action: "asc",
        },
      }),
      prisma.activityLog.groupBy({
        by: ["entityType"],
        where: {
          entityType: { not: null },
        },
        _count: {
          entityType: true,
        },
        orderBy: {
          entityType: "asc",
        },
      }),
    ])

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      filters: {
        actions: actionGroups.map((a) => a.action),
        entityTypes: entityTypeGroups
          .map((e) => e.entityType)
          .filter((e): e is string => e !== null),
      },
    })
  } catch (error) {
    console.error("Error fetching activity logs:", error)
    return NextResponse.json(
      { error: "Failed to load activity logs" },
      { status: 500 }
    )
  }
}

