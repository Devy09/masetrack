import prisma from "@/lib/prisma"

type ActivityLogInput = {
  action: string
  entityType?: string | null
  entityId?: number | null
  description: string
  metadata?: Record<string, any> | null
  userId: number
}

/**
 * Log an activity to the activity log system
 * @param input - Activity log data
 * @returns The created activity log entry
 */
export async function logActivity(input: ActivityLogInput) {
  try {
    const activityLog = await prisma.activityLog.create({
      data: {
        action: input.action,
        entityType: input.entityType || null,
        entityId: input.entityId || null,
        description: input.description,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
        userId: input.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    return activityLog
  } catch (error) {
    // Don't throw errors for activity logging - it shouldn't break the main flow
    console.error("Failed to log activity:", error)
    return null
  }
}

/**
 * Common activity log actions
 */
export const ActivityActions = {
  // Certificate actions
  CERTIFICATE_SUBMITTED: "certificate_submitted",
  CERTIFICATE_APPROVED: "certificate_approved",
  CERTIFICATE_REJECTED: "certificate_rejected",
  CERTIFICATE_UPDATED: "certificate_updated",
  CERTIFICATE_REMARK_ADDED: "certificate_remark_added",

  // Grantee actions
  GRANTEE_ADDED: "grantee_added",
  GRANTEE_UPDATED: "grantee_updated",
  GRANTEE_DELETED: "grantee_deleted",

  // User actions
  USER_LOGIN: "user_login",
  USER_LOGOUT: "user_logout",
  USER_UPDATED: "user_updated",
  USER_PASSWORD_CHANGED: "user_password_changed",
  USER_PROFILE_UPDATED: "user_profile_updated",

  // Poll actions
  POLL_CREATED: "poll_created",
  POLL_UPDATED: "poll_updated",
  POLL_DELETED: "poll_deleted",
  POLL_VOTED: "poll_voted",

  // Deadline actions
  DEADLINE_CREATED: "deadline_created",
  DEADLINE_UPDATED: "deadline_updated",
  DEADLINE_DELETED: "deadline_deleted",
  DEADLINE_COMPLETED: "deadline_completed",
} as const

/**
 * Common entity types
 */
export const EntityTypes = {
  CERTIFICATE_SUBMISSION: "CertificateSubmission",
  GRANTEE: "Grantee",
  USER: "User",
  POLL: "Poll",
  DEADLINE: "Deadline",
} as const

