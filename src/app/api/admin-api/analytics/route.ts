import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

import prisma from "@/lib/prisma"

type SessionUser = {
  id: string | number
  role: string
}

type CertificateCounts = {
  total: number
  pending: number
  approved: number
  rejected: number
}

type MonthlySubmission = {
  month: string
  submitted: number
}

type ProgramSummary = {
  program: string
  grantees: number
  completion: number
  pending: number
}

const MONTHS_TO_SHOW = 6

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("auth-session")

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    let currentUser: SessionUser
    try {
      currentUser = JSON.parse(sessionCookie.value)
    } catch (error) {
      console.error("Failed to parse session cookie:", error)
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const personnelIdParam = searchParams.get("personnelId")

    const scopedPersonnelId =
      currentUser.role === "personnel"
        ? Number(currentUser.id)
        : personnelIdParam
        ? Number(personnelIdParam)
        : undefined

    const granteeWhere = scopedPersonnelId ? { addedById: scopedPersonnelId } : {}

    const grantees = await prisma.grantee.findMany({
      where: granteeWhere,
      select: { userId: true, batch: true },
    })

    const granteeCount = grantees.length
    const userIds = grantees.map((grantee) => grantee.userId)

    let submissions:
      | Array<{ userId: number; status: string; createdAt: Date }>
      | undefined

    if (userIds.length > 0) {
      submissions = await prisma.certificateSubmission.findMany({
        where: { userId: { in: userIds } },
        select: { userId: true, status: true, createdAt: true },
      })
    } else {
      submissions = []
    }

    const certificateCounts = summarizeCertificates(submissions)
    const monthlySubmissions = summarizeMonthlySubmissions(submissions)
    const programSummaries = summarizePrograms(grantees, submissions)
    const insights = buildInsights({
      granteeCount,
      certificateCounts,
      monthlySubmissions,
      programSummaries,
    })

    return NextResponse.json({
      granteeCount,
      certificateCounts,
      monthlySubmissions,
      programSummaries,
      insights,
    })
  } catch (error) {
    console.error("Error generating analytics payload:", error)
    return NextResponse.json(
      { error: "Failed to load analytics data" },
      { status: 500 }
    )
  }
}

function summarizeCertificates(
  submissions: Array<{ status: string }>
): CertificateCounts {
  return submissions.reduce<CertificateCounts>(
    (acc, submission) => {
      switch (submission.status) {
        case "pending":
          acc.pending += 1
          break
        case "approved":
          acc.approved += 1
          break
        case "rejected":
          acc.rejected += 1
          break
        default:
          break
      }
      acc.total += 1
      return acc
    },
    { total: 0, pending: 0, approved: 0, rejected: 0 }
  )
}

function summarizeMonthlySubmissions(
  submissions: Array<{ createdAt: Date }>
): MonthlySubmission[] {
  const buckets = buildMonthBuckets()
  const keyMap = new Map<string, number>()

  buckets.forEach((bucket, index) => {
    keyMap.set(bucket.key, index)
  })

  submissions.forEach((submission) => {
    const createdAt = new Date(submission.createdAt)
    const key = buildMonthKey(createdAt)
    const bucketIndex = keyMap.get(key)
    if (bucketIndex !== undefined) {
      buckets[bucketIndex].submitted += 1
    }
  })

  return buckets.map(({ key, ...rest }) => rest)
}

function buildMonthBuckets() {
  const now = new Date()
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const buckets: Array<{ key: string; month: string; submitted: number }> = []

  for (let offset = MONTHS_TO_SHOW - 1; offset >= 0; offset--) {
    const date = new Date(currentMonth)
    date.setMonth(currentMonth.getMonth() - offset)
    buckets.push({
      key: buildMonthKey(date),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      submitted: 0,
    })
  }

  return buckets
}

function buildMonthKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}`
}

function summarizePrograms(
  grantees: Array<{ userId: number; batch: string | null }>,
  submissions: Array<{ userId: number; status: string }>
): ProgramSummary[] {
  if (grantees.length === 0) {
    return []
  }

  const userToBatch = new Map<number, string>()
  const programMap = new Map<
    string,
    { grantees: number; pending: number; approved: number; total: number }
  >()

  grantees.forEach((grantee) => {
    const program = grantee.batch || "Unassigned"
    userToBatch.set(grantee.userId, program)
    if (!programMap.has(program)) {
      programMap.set(program, { grantees: 0, pending: 0, approved: 0, total: 0 })
    }
    const stats = programMap.get(program)!
    stats.grantees += 1
  })

  submissions.forEach((submission) => {
    const program = userToBatch.get(submission.userId)
    if (!program) return
    const stats = programMap.get(program)
    if (!stats) return

    stats.total += 1
    if (submission.status === "pending") {
      stats.pending += 1
    } else if (submission.status === "approved") {
      stats.approved += 1
    }
  })

  return Array.from(programMap.entries())
    .map(([program, stats]) => ({
      program,
      grantees: stats.grantees,
      completion: stats.total
        ? Math.round((stats.approved / stats.total) * 100)
        : 0,
      pending: stats.pending,
    }))
    .sort((a, b) => b.grantees - a.grantees)
    .slice(0, 5)
}

function buildInsights({
  granteeCount,
  certificateCounts,
  monthlySubmissions,
  programSummaries,
}: {
  granteeCount: number
  certificateCounts: CertificateCounts
  monthlySubmissions: MonthlySubmission[]
  programSummaries: ProgramSummary[]
}) {
  const insights: Array<{ title: string; detail: string }> = []

  if (certificateCounts.pending > 0) {
    insights.push({
      title: `${certificateCounts.pending} certificate${
        certificateCounts.pending === 1 ? "" : "s"
      } awaiting review`,
      detail: "Reach out to grantees to complete missing requirements.",
    })
  }

  if (certificateCounts.approved > 0) {
    insights.push({
      title: `${certificateCounts.approved} approval${
        certificateCounts.approved === 1 ? "" : "s"
      } cleared this cycle`,
      detail: "Make sure payouts are coordinated with finance this week.",
    })
  }

  if (monthlySubmissions.length >= 2) {
    const latest = monthlySubmissions[monthlySubmissions.length - 1]
    const previous = monthlySubmissions[monthlySubmissions.length - 2]
    if (latest.submitted > previous.submitted) {
      insights.push({
        title: "Submission volume trending upward",
        detail: `${latest.submitted} files submitted in ${latest.month}, ${latest.submitted - previous.submitted} more than last month.`,
      })
    } else if (latest.submitted < previous.submitted) {
      insights.push({
        title: "Submissions slowed down",
        detail: `Only ${latest.submitted} files logged in ${latest.month}. Send reminders to advisors.`,
      })
    }
  }

  if (granteeCount === 0) {
    insights.push({
      title: "No grantees assigned yet",
      detail: "Once assignments are added, analytics will populate instantly.",
    })
  } else if (programSummaries[0]) {
    insights.push({
      title: `${programSummaries[0].program} leads in submissions`,
      detail: `${programSummaries[0].grantees} grantees with a ${programSummaries[0].completion}% completion rate.`,
    })
  }

  // Ensure at least three items for the UI.
  while (insights.length < 3) {
    insights.push({
      title: "Stay close to your grantees",
      detail: "Schedule quick check-ins to keep certificates moving forward.",
    })
  }

  return insights.slice(0, 3)
}

