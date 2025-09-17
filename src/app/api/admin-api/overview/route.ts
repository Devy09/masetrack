import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('auth-session')

    if (!session?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = JSON.parse(session.value)
    const isAdmin = user.role === 'admin' || user.role === 'personnel'

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [
      totalUsers,
      recentUsers,
      totalSubmissions,
      pendingSubmissions,
      enrollmentCount,
      gradesCount,
      firstSemCount,
      secondSemCount,
      recentSubmissions
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          batch: true,
          image: true,
          createdAt: true
        }
      }),
      prisma.certificateSubmission.count(),
      prisma.certificateSubmission.count({ where: { status: 'pending' } }),
      prisma.certificateSubmission.count({ where: { title: 'ENROLLMENT' as any } }),
      prisma.certificateSubmission.count({ where: { title: 'GRADES' as any } }),
      prisma.certificateSubmission.count({ where: { semester: 'FIRST' as any } }),
      prisma.certificateSubmission.count({ where: { semester: 'SECOND' as any } }),
      prisma.certificateSubmission.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          files: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              batch: true,
              image: true
            }
          }
        }
      })
    ])

    const mapTitle = (t: string) => (t === 'ENROLLMENT' ? 'Certificate of Enrollment' : 'Certificate of Grades')
    const mapSemester = (s: string) => (s === 'FIRST' ? 'first' : 'second')

    const recentSubmissionsMapped = recentSubmissions.map((s) => ({
      id: s.id,
      title: mapTitle(s.title as unknown as string),
      semester: mapSemester(s.semester as unknown as string),
      description: s.description,
      status: s.status,
      isActive: s.isActive,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      user: s.user,
      files: s.files
    }))

    const overview = {
      success: true,
      metrics: {
        users: { total: totalUsers },
        submissions: {
          total: totalSubmissions,
          pending: pendingSubmissions,
          byTitle: {
            enrollment: enrollmentCount,
            grades: gradesCount
          },
          bySemester: {
            first: firstSemCount,
            second: secondSemCount
          }
        }
      },
      recent: {
        users: recentUsers,
        submissions: recentSubmissionsMapped
      }
    }

    return NextResponse.json(overview)
  } catch (error) {
    console.error('Admin overview error:', error)
    return NextResponse.json({ error: 'Failed to load overview' }, { status: 500 })
  }
}


