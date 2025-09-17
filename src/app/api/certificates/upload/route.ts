import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const session = cookieStore.get('auth-session')
    
    if (!session?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const user = JSON.parse(session.value)
    
    // Parse the form data
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }
    
    const uploadedFiles = []
    
    for (const file of files) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'video/mp4',
        'audio/mpeg',
        'application/zip',
        'application/x-rar-compressed'
      ]
      
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ 
          error: `File type ${file.type} not allowed` 
        }, { status: 400 })
      }
      
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        return NextResponse.json({ 
          error: `File ${file.name} is too large. Maximum size is 10MB` 
        }, { status: 400 })
      }
      
      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads')
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }
      
      // Generate unique filename
      const timestamp = Date.now()
      const fileExtension = file.name.split('.').pop()
      const uniqueFileName = `${timestamp}-${user.id}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      
      // Save file to disk
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filePath = join(uploadsDir, uniqueFileName)
      
      await writeFile(filePath, buffer)
      
      // Store file information
      uploadedFiles.push({
        fileName: file.name,
        fileUrl: `/uploads/${uniqueFileName}`,
        fileSize: file.size,
        fileType: file.type,
        originalName: file.name
      })
    }
    
    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `${uploadedFiles.length} file(s) uploaded successfully`
    })
    
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    )
  }
}

