import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const session = cookieStore.get('auth-session')
    
    if (!session?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const user = JSON.parse(session.value)
    
    // Parse request body
    const body = await request.json()
    const { title, semester, description, files } = body

    // Enforce allowed certificate titles
    const allowedTitles = [
      'Certificate of Enrollment',
      'Certificate of Grades',
    ] as const

    if (!allowedTitles.includes(title)) {
      return NextResponse.json({
        error: 'Invalid certificate title. Must be "Certificate of Enrollment" or "Certificate of Grades"',
      }, { status: 400 })
    }

    // Validate semester
    const allowedSemesters = ['first', 'second'] as const
    if (!semester || !allowedSemesters.includes(semester)) {
      return NextResponse.json({
        error: 'Invalid semester. Must be "first" or "second"',
      }, { status: 400 })
    }
    
    if (!title || !files || files.length === 0) {
      return NextResponse.json({ 
        error: 'Title and files are required' 
      }, { status: 400 })
    }
    
    // Map human-readable title to enum value
    const titleEnum = title === 'Certificate of Enrollment' ? 'ENROLLMENT' : 'GRADES'
    const semesterEnum = semester === 'first' ? 'FIRST' : 'SECOND'

    // Create one submission with many files
    const submission = await prisma.certificateSubmission.create({
      data: {
        title: titleEnum as any,
        semester: semesterEnum as any,
        description: description || null,
        status: 'pending',
        isActive: true,
        userId: Number(user.id),
        files: {
          create: files.map((file: any) => ({
            fileName: file.fileName,
            fileUrl: file.fileUrl,
            fileSize: file.fileSize,
            fileType: file.fileType,
          }))
        }
      },
      include: { files: true }
    })

    return NextResponse.json({
      success: true,
      submission,
      message: `Submission created with ${submission.files.length} file(s)`
    })
    
  } catch (error) {
    console.error('Certificate submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit certificates' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const session = cookieStore.get('auth-session')
    
    if (!session?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const user = JSON.parse(session.value)
  
    const isAdmin = user.role === 'admin' || user.role === 'personnel'
    const submissions = await prisma.certificateSubmission.findMany({
      where: isAdmin ? undefined : {
        userId: Number(user.id),
      },
      orderBy: {
        createdAt: 'desc'
      },
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

    const mapTitle = (t: string) => (t === 'ENROLLMENT' ? 'Certificate of Enrollment' : 'Certificate of Grades')
    const mapSemester = (s: string) => {
      if (s === 'FIRST') return 'first'
      if (s === 'SECOND') return 'second'
      return 'first' // default fallback
    }

    const submissionsMapped = submissions.map((s) => ({
      id: s.id,
      title: mapTitle(s.title as unknown as string),
      semester: mapSemester(s.semester as unknown as string),
      description: s.description,
      status: s.status,
      isActive: s.isActive,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      user: s.user,
      files: s.files,
      type: 'submission'
    }))

    const items = submissionsMapped

    return NextResponse.json({ success: true, items })
    
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    )
  }
}

