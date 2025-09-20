"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle, Calendar, Download, GraduationCap, BookOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

interface Certificate {
  id: string
  name: string
  submittedDate: string
  status: "pending" | "approved" | "rejected"
  type: "enrollment" | "grades"
  semester: "first" | "second"
  batch: string
  isActive: boolean
  files: { fileName: string; fileUrl: string; fileSize: number; fileType: string }[]
  remarks?: { id: number; content: string; createdAt: string; author?: { id: number; name: string; email: string } }[]
  mpTags?: string[]
  user?: {
    id: number
    name: string
    email: string
    batch: string
  }
}

interface DashboardSubmissionsProps {
  certificates: Certificate[]
  statusFilter: string
  typeFilter: string
  semesterFilter: string
  onStatusFilterChange: (value: string) => void
  onTypeFilterChange: (value: string) => void
  onSemesterFilterChange: (value: string) => void
  onSwitchToUpload: () => void
}

export function DashboardSubmissions({
  certificates,
  statusFilter,
  typeFilter,
  semesterFilter,
  onStatusFilterChange,
  onTypeFilterChange,
  onSemesterFilterChange,
  onSwitchToUpload,
}: DashboardSubmissionsProps) {
  const { user } = useAuth()
  const canModerate = user?.role === 'admin' || user?.role === 'personnel'
  const [previewOpen, setPreviewOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<Certificate | null>(null)
  const [selectedFileIndex, setSelectedFileIndex] = React.useState(0)
  const [remarkText, setRemarkText] = React.useState("")
  const [mpFilter, setMpFilter] = React.useState<string>("")

  const filteredCertificates = certificates.filter((cert) => {
    return (
      (statusFilter === "" || cert.status === statusFilter) &&
      (typeFilter === "" || cert.type === typeFilter) &&
      (semesterFilter === "" || cert.semester === semesterFilter) &&
      (mpFilter === "" || (cert.mpTags || []).includes(mpFilter))
    )
  })
  const openPreview = (item: Certificate) => {
    setSelectedItem(item)
    setSelectedFileIndex(0)
    setPreviewOpen(true)
  }

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/certificates/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificateId: Number(id), status, remark: remarkText.trim() || undefined })
      })
      if (!res.ok) throw new Error('Failed to update status')
      toast.success(`Submission ${status}`)
      setRemarkText("")
      window.location.reload()
    } catch (e) {
      console.error(e)
      toast.error('Action failed')
    }
  }

  const toggleActive = async (id: string, current: boolean) => {
    try {
      const res = await fetch('/api/certificates/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificateId: Number(id), isActive: !current })
      })
      if (!res.ok) throw new Error('Failed to toggle active')
      toast.success(`Marked ${!current ? 'active' : 'inactive'}`)
      window.location.reload()
    } catch (e) {
      console.error(e)
      toast.error('Action failed')
    }
  }

  const renderPreview = () => {
    if (!selectedItem || !selectedItem.files || selectedItem.files.length === 0) return null
    const file = selectedItem.files[selectedFileIndex]
    const type = file.fileType || ""
    if (type.startsWith("image/")) {
      return <img src={file.fileUrl} alt={file.fileName} className="w-full h-auto max-h-[70vh] object-contain rounded" />
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: "bg-green-100 text-green-800 hover:bg-green-100",
      pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      rejected: "bg-red-100 text-red-800 hover:bg-red-100",
    }

    return (
      <Badge variant="secondary" className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getCertificateTypeIcon = (type: string) => {
    return type === "enrollment" ? (
      <BookOpen className="h-5 w-5 text-blue-600" />
    ) : (
      <GraduationCap className="h-5 w-5 text-purple-600" />
    )
  }

  const getCertificateTypeBadge = (type: string) => {
    const variants = {
      enrollment: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      grades: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    }

    return (
      <Badge variant="secondary" className={variants[type as keyof typeof variants]}>
        {type === "enrollment" ? "Enrollment" : "Grades"}
      </Badge>
    )
  }

  const getSemesterDisplay = (semester: string) => {
    return semester === "first" ? "First Semester" : "Second Semester"
  }

  return (
    <>
    <Card className="m-6">
      <CardHeader>
        <CardTitle className="text-foreground">Submission History</CardTitle>
        <CardDescription>View all your certificate submissions and their current status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Input
            type="text"
            placeholder="Search certificates..."
            className="px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Types</option>
            <option value="enrollment">Enrollment</option>
            <option value="grades">Grades</option>
          </select>
          <select
            value={semesterFilter}
            onChange={(e) => onSemesterFilterChange(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Semesters</option>
            <option value="first">1st Semester</option>
            <option value="second">2nd Semester</option>
          </select>
          <select
            value={mpFilter}
            onChange={(e) => setMpFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All MPs</option>
            {Array.from(new Set(certificates.flatMap(c => c.mpTags || []))).map((mp) => (
              <option key={mp} value={mp}>{mp}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {filteredCertificates.map((cert) => (
            <div
              key={cert.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => openPreview(cert)}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                  {getCertificateTypeIcon(cert.type)}
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-foreground">{cert.name}</h4>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Submitted: {new Date(cert.submittedDate).toLocaleDateString()}</span>
                    </div>
                    <span>•</span>
                    <span>{getSemesterDisplay(cert.semester)}</span>
                    <span>•</span>
                    <span>Batch: {cert.batch}</span>
                  {(cert.mpTags && cert.mpTags.length > 0) && (
                    <>
                      <span>•</span>
                      <span>MPs: {cert.mpTags.join(', ')}</span>
                    </>
                  )}
                    {canModerate && cert.user && (
                      <>
                        <span>•</span>
                        <span>By: {cert.user.name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {getCertificateTypeBadge(cert.type)}
                <Badge variant={cert.isActive ? "default" : "secondary"}>{cert.isActive ? "Active" : "Inactive"}</Badge>
                {getStatusBadge(cert.status)}
                {getStatusIcon(cert.status)}
                {cert.status === "rejected" && (
                  <Button size="sm" variant="outline" onClick={onSwitchToUpload}>
                    Resubmit
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Preview Dialog */}
    <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
      <DialogContent className="w-[98vw] sm:max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
        <DialogHeader>
          <DialogTitle>
            {selectedItem?.name}
            {selectedItem?.files && selectedItem.files.length > 1 && (
              <span className="text-sm text-muted-foreground"> — {selectedItem?.files?.[selectedFileIndex]?.fileName}</span>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-4 space-y-4">
            {canModerate && selectedItem?.user && (
              <div className="flex items-center justify-between p-3 rounded-md border bg-gradient-to-r from-teal-100 to-teal-400">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={(selectedItem.user as any).image || ''} alt={selectedItem.user.name} />
                    <AvatarFallback>{selectedItem.user.name?.slice(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="leading-tight">
                    <p className="text-sm font-medium text-foreground">{selectedItem.user.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedItem.user.email}</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {selectedItem.user.batch && <span>Batch: {selectedItem.user.batch}</span>}
                </div>
              </div>
            )}
            {renderPreview()}
            {canModerate && selectedItem && (
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="bg-gray-500 text-white" onClick={() => toggleActive(selectedItem.id, selectedItem.isActive)}>
                  {selectedItem.isActive ? 'Set Inactive' : 'Set Active'}
                </Button>
              </div>
            )}
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
            {/* Remarks Section */}
            <div className="pt-4 space-y-2">
              <p className="text-sm font-medium">Remarks</p>
              <div className="space-y-2 max-h-[30vh] overflow-auto">
                {(selectedItem?.remarks || []).length === 0 && (
                  <p className="text-xs text-muted-foreground">No remarks yet.</p>
                )}
                {(selectedItem?.remarks || []).map((r) => (
                  <div key={r.id} className="p-2 rounded border">
                    <p className="text-xs text-muted-foreground mb-1">{new Date(r.createdAt).toLocaleString()} — {r.author?.name || 'Unknown'}</p>
                    <p className="text-sm whitespace-pre-wrap">{r.content}</p>
                  </div>
                ))}
              </div>
              {canModerate && (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a remark for the student (optional)"
                    value={remarkText}
                    onChange={(e) => setRemarkText(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="bg-green-500 text-white flex-1" onClick={() => selectedItem && updateStatus(selectedItem.id, 'approved')}>Approve</Button>
                    <Button size="sm" variant="outline" className="bg-red-500 text-white flex-1" onClick={() => selectedItem && updateStatus(selectedItem.id, 'rejected')}>Reject</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
