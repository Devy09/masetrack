"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, File, FileText, Video, Music, Archive, X, Check, AlertCircle, ImageIcon } from "lucide-react"
import { useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface FileItem {
  id: string
  file: File
  progress: number
  status: "uploading" | "completed" | "error"
  preview?: string
  uploadedData?: {
    fileName: string
    fileUrl: string
    fileSize: number
    fileType: string
  }
}

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return ImageIcon
  if (type.startsWith("video/")) return Video
  if (type.startsWith("audio/")) return Music
  if (type.includes("pdf") || type.includes("document") || type.includes("text")) return FileText
  if (type.includes("zip") || type.includes("rar")) return Archive
  return File
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

interface DocumentUploaderProps {
  onSuccess?: () => void
}

export default function DocumentUploader({ onSuccess }: DocumentUploaderProps) {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [semester, setSemester] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (fileItem: FileItem) => {
    try {
      const formData = new FormData()
      formData.append('files', fileItem.file)
      
      const response = await fetch('/api/certificates/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      
      const result = await response.json()
      
      if (result.success && result.files.length > 0) {
        const uploadedFile = result.files[0]
        setFiles((prev) => 
          prev.map((f) => 
            f.id === fileItem.id 
              ? { 
                  ...f, 
                  progress: 100, 
                  status: "completed",
                  uploadedData: uploadedFile
                } 
              : f
          )
        )
      } else {
        throw new Error('No file data returned')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setFiles((prev) => 
        prev.map((f) => 
          f.id === fileItem.id 
            ? { ...f, status: "error" as const } 
            : f
        )
      )
      toast.error(`Failed to upload ${fileItem.file.name}`)
    }
  }

  const handleFiles = useCallback((newFiles: FileList) => {
    const fileArray = Array.from(newFiles).map((file) => {
      const fileItem: FileItem = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        progress: 0,
        status: "uploading",
      }

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setFiles((prev) =>
            prev.map((f) => (f.id === fileItem.id ? { ...f, preview: e.target?.result as string } : f)),
          )
        }
        reader.readAsDataURL(file)
      }

      return fileItem
    })

    setFiles((prev) => [...prev, ...fileArray])

    // Start real upload for each file
    fileArray.forEach((fileItem) => {
      uploadFile(fileItem)
    })
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const droppedFiles = e.dataTransfer.files
      if (droppedFiles.length > 0) {
        handleFiles(droppedFiles)
      }
    },
    [handleFiles],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      handleFiles(selectedFiles)
    }
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const completedFiles = files.filter((f) => f.status === "completed").length
  const totalFiles = files.length

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please select a certificate type")
      return
    }
    if (!semester.trim()) {
      toast.error("Please select a semester")
      return
    }

    if (completedFiles === 0) {
      toast.error("Please upload at least one file")
      return
    }

    setIsSubmitting(true)

    try {
      const uploadedFiles = files
        .filter(f => f.status === "completed" && f.uploadedData)
        .map(f => f.uploadedData!)

      const response = await fetch('/api/certificates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          semester: semester,
          description: description.trim() || null,
          files: uploadedFiles
        })
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      const result = await response.json()

      if (result.success) {
        toast.success(result.message)
        // Reset form
        setFiles([])
        setTitle("")
        setDescription("")
        setSemester("")
        // Call success callback
        onSuccess?.()
      } else {
        throw new Error(result.error || 'Submission failed')
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Failed to submit certificates. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Submit Certificate</h1>
        <p className="text-muted-foreground">Upload your certificate documents for review</p>
      </div>

      {/* Certificate Details Form */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Certificate Type *</Label>
              <Select value={title} onValueChange={setTitle}>
                <SelectTrigger id="title" className="w-full">
                  <SelectValue placeholder="Select certificate type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Certificate of Enrollment">Certificate of Enrollment</SelectItem>
                  <SelectItem value="Certificate of Grades">Certificate of Grades</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semester *</Label>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger id="semester" className="w-full">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first">First Semester</SelectItem>
                  <SelectItem value="second">Second Semester</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50",
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleFileSelect}
      >
        <CardContent className="flex flex-col items-center justify-center py-12 px-6">
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <div className="text-center space-y-2">
            <p className="text-lg font-medium">Drop files here or click to upload</p>
            <p className="text-sm text-muted-foreground">Support for PDF, DOC, DOCX, TXT, images, and more</p>
          </div>
          <Button variant="outline" className="mt-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" type="button">
            Browse Files
          </Button>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.zip,.rar"
      />

      {/* Upload Progress Summary */}
      {totalFiles > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Upload Progress ({completedFiles}/{totalFiles})
              </span>
              <span className="text-sm text-muted-foreground">{Math.round((completedFiles / totalFiles) * 100)}%</span>
            </div>
            <Progress value={(completedFiles / totalFiles) * 100} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Uploaded Files</h3>
          <div className="space-y-2">
            {files.map((fileItem) => {
              const FileIcon = getFileIcon(fileItem.file.type)

              return (
                <Card key={fileItem.id} className="p-4">
                  <div className="flex items-center gap-4">
                    {/* File Icon/Preview */}
                    <div className="flex-shrink-0">
                      {fileItem.preview ? (
                        <img
                          src={fileItem.preview || "/placeholder.svg"}
                          alt={fileItem.file.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                          <FileIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{fileItem.file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(fileItem.file.size)}</p>

                      {/* Progress Bar */}
                      {fileItem.status === "uploading" && (
                        <div className="mt-2">
                          <Progress value={fileItem.progress} className="h-1" />
                          <p className="text-xs text-muted-foreground mt-1">{fileItem.progress}% uploaded</p>
                        </div>
                      )}
                    </div>

                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {fileItem.status === "completed" && (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                      )}
                      {fileItem.status === "error" && (
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        </div>
                      )}
                      {fileItem.status === "uploading" && (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Upload className="h-4 w-4 text-blue-600 animate-pulse" />
                        </div>
                      )}
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(fileItem.id)
                      }}
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Submit Button */}
      {completedFiles > 0 && (
        <div className="flex justify-end">
          <Button 
            size="lg" 
            className="px-8"
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim()}
          >
            {isSubmitting ? "Submitting..." : `Submit Certificate (${completedFiles})`}
          </Button>
        </div>
      )}
    </div>
  )
}
