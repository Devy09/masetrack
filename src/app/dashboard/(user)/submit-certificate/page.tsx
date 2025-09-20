"use client"

import UploadDialog from "./components/upload-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FolderOpen, FileText, Clock, CheckCircle, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"

interface SubmissionItem {
  id: number
  title: string
  description: string | null
  status: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  files: { fileName: string; fileUrl: string; fileSize: number; fileType: string }[]
}

export default function Page() {
  const [items, setItems] = useState<SubmissionItem[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SubmissionItem | null>(null)
  const [selectedFileIndex, setSelectedFileIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/certificates')
      if (response.ok) {
        const data = await response.json()
        setItems((data.items || []) as SubmissionItem[])
      }
    } catch (error) {
      console.error('Error fetching certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCertificates()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const totalFiles = items.reduce((sum, it) => sum + (it.files?.length || 0), 0)
  const totalSize = items.reduce((sum, it) => sum + (it.files?.reduce((s, f) => s + f.fileSize, 0) || 0), 0)
  const lastUpload = items.length > 0 ? items[0].createdAt : null

  const openPreview = (item: SubmissionItem) => {
    setSelectedItem(item)
    setSelectedFileIndex(0)
    setPreviewOpen(true)
  }

  const renderPreview = () => {
    if (!selectedItem || !selectedItem.files || selectedItem.files.length === 0) return null
    const file = selectedItem.files[selectedFileIndex]
    const type = file.fileType || ""

    if (type.startsWith("image/")) {
      return (
        <img src={file.fileUrl} alt={file.fileName} className="w-full h-auto max-h-[70vh] object-contain rounded" />
      )
    }
    if (type.includes("pdf")) {
      return (
        <iframe
          src={`${file.fileUrl}#toolbar=1&navpanes=0&scrollbar=1`}
          className="w-full h-[70vh] rounded border"
        />
      )
    }
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Preview not available for this file type.</p>
        <a href={file.fileUrl} target="_blank" rel="noreferrer" className="underline text-primary">
          Open/Download {file.fileName}
        </a>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Document Upload</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upload and manage your certificates and documents securely
            </p>
            <div className="flex justify-center">
              <UploadDialog onSuccess={fetchCertificates} />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Files */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl">Recent Submissions</CardTitle>
                <CardDescription>Your recently submitted certificates</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-sm">Loading certificates...</p>
                  </div>
                ) : items.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <FolderOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No certificates yet</p>
                    <p className="text-sm">Submit your first certificate to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.slice(0, 5).map((submission) => (
                      <div
                        key={submission.id}
                        className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/40"
                        onClick={() => openPreview(submission)}
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(submission.status)}
                          <div>
                            <p className="font-medium">{submission.title}</p>
                            {submission.files && submission.files.length > 0 && (
                              <p className="text-sm text-muted-foreground">
                                {submission.files[0].fileName}
                                {submission.files.length > 1 && ` +${submission.files.length - 1} more`}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(submission.status)}
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    ))}
                    {items.length > 5 && (
                      <p className="text-sm text-muted-foreground text-center">
                        And {items.length - 5} more certificates...
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats or Additional Info */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
                <CardDescription>Your upload summary</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Certificates</span>
                  <span className="font-semibold">{totalFiles}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Storage Used</span>
                  <span className="font-semibold">{formatFileSize(totalSize)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Submission</span>
                  <span className="font-semibold">
                    {lastUpload ? formatDistanceToNow(new Date(lastUpload), { addSuffix: true }) : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pending Review</span>
                  <span className="font-semibold">
                    {items.filter((c: any) => c.status === 'pending').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Approved</span>
                  <span className="font-semibold text-green-600">
                    {items.filter((c: any) => c.status === 'approved').length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="w-[98vw] sm:max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
          <DialogHeader>
            <DialogTitle>
              {selectedItem?.title}
              {selectedItem?.files && selectedItem.files.length > 1 && (
                <span className="text-sm text-muted-foreground"> — {selectedItem.files[selectedFileIndex]?.fileName}</span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-4">
              {renderPreview()}
            </div>
            <div className="md:col-span-1 space-y-2">
              <p className="text-sm font-medium">Files</p>
              <div className="space-y-1 max-h-[60vh] overflow-auto pr-1">
                {selectedItem?.files?.map((f, idx) => (
                  <button
                    key={f.fileUrl}
                    className={`w-full text-left px-3 py-2 rounded border ${idx === selectedFileIndex ? 'bg-muted' : 'bg-background hover:bg-muted/50'}`}
                    onClick={() => setSelectedFileIndex(idx)}
                  >
                    <p className="text-sm truncate">{f.fileName}</p>
                    <p className="text-xs text-muted-foreground truncate">{(f.fileType || '').split('/')[1] || f.fileType}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
