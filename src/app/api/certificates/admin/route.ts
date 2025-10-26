import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { sendCertificateApprovalEmail, sendCertificateRejectionEmail } from '@/lib/email'

// GET all certificates for admin review
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const session = cookieStore.get('auth-session')
    
    if (!session?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const user = JSON.parse(session.value)
    
    // Check if user is admin/personnel
    if (user.role !== 'admin' && user.role !== 'personnel') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    // Get all certificates with user information
    const submissions = await prisma.certificateSubmission.findMany({
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
            status: true
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
    console.error('Error fetching certificates for admin:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    )
  }
}

// UPDATE certificate status (approve/reject)
export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const session = cookieStore.get('auth-session')
    
    if (!session?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const user = JSON.parse(session.value)
    
    // Check if user is admin/personnel
    if (user.role !== 'admin' && user.role !== 'personnel') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    const body = await request.json()
    const { certificateId, status, isActive, remark } = body
    
    if (!certificateId) {
      return NextResponse.json({ 
        error: 'Certificate ID is required' 
      }, { status: 400 })
    }
    
    // If status is provided, validate it
    if (status && !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status. Must be pending, approved, or rejected' 
      }, { status: 400 })
    }
    
    // Build update data object
    const updateData: any = {}
    if (status !== undefined) {
      updateData.status = status
    }
    if (isActive !== undefined) {
      updateData.isActive = isActive
    }
    
    // Update submission
    const certificate = await prisma.certificateSubmission.update({
      where: {
        id: certificateId
      },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            batch: true
          }
        },
        files: true,
        remarks: {
          include: {
            author: { select: { id: true, name: true, email: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    // Optionally create a remark if provided and status was changed
    if (remark && typeof remark === 'string' && remark.trim().length > 0) {
      await prisma.certificateRemark.create({
        data: {
          submissionId: certificateId,
          authorId: Number(user.id),
          authorRole: user.role,
          content: remark.trim()
        }
      })
    }

    // Send email notification if status was changed to approved or rejected
    if (status === 'approved' || status === 'rejected') {
      console.log('Status changed to:', status, '- attempting to send email')
      try {
        const mapTitle = (t: string) => (t === 'ENROLLMENT' ? 'Certificate of Enrollment' : 'Certificate of Grades')
        const mapSemester = (s: string) => {
          if (s === 'FIRST') return 'First Semester'
          if (s === 'SECOND') return 'Second Semester'
          return 'First Semester' // default fallback
        }

        const emailData = {
          userName: certificate.user.name,
          userEmail: certificate.user.email,
          certificateTitle: mapTitle(certificate.title as unknown as string),
          semester: mapSemester(certificate.semester as unknown as string),
          submissionDate: certificate.createdAt.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          remark: remark && typeof remark === 'string' && remark.trim().length > 0 ? remark.trim() : undefined
        }

        if (status === 'approved') {
          console.log('Sending approval email...')
          const emailResult = await sendCertificateApprovalEmail({
            ...emailData,
            approvedBy: user.name
          })
          console.log('Email result:', emailResult)
        } else if (status === 'rejected') {
          console.log('Sending rejection email...')
          const emailResult = await sendCertificateRejectionEmail({
            ...emailData,
            rejectedBy: user.name
          })
          console.log('Email result:', emailResult)
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError)
        // Don't fail the entire request if email fails
      }
    }
    
    return NextResponse.json({
      success: true,
      certificate,
      message: `Certificate ${status} successfully`
    })
    
  } catch (error) {
    console.error('Error updating certificate:', error)
    return NextResponse.json(
      { error: 'Failed to update certificate' },
      { status: 500 }
    )
  }
}

