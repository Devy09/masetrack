"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Mail, Calendar, Shield, Phone, MapPin, Upload, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { EditProfileDialog } from "@/components/features/edit-profile-dialog"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface SubmissionStats {
  totalSubmissions: number
  pendingSubmissions: number
  approvedSubmissions: number
  rejectedSubmissions: number
  totalFiles: number
  totalSize: number
  lastSubmission: string | null
}

interface SubmissionItem {
  id: number
  title: string
  semester: string
  description: string | null
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  files: Array<{
    fileName: string
    fileUrl: string
    fileSize: number
    fileType: string
  }>
}

export default function Page() {
  const { user, loading, refreshUser } = useAuth()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [stats, setStats] = useState<SubmissionStats>({
    totalSubmissions: 0,
    pendingSubmissions: 0,
    approvedSubmissions: 0,
    rejectedSubmissions: 0,
    totalFiles: 0,
    totalSize: 0,
    lastSubmission: null
  })
  const [statsLoading, setStatsLoading] = useState(true)
  const [recentSubmissions, setRecentSubmissions] = useState<SubmissionItem[]>([])
  const [submissionsLoading, setSubmissionsLoading] = useState(true)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SubmissionItem | null>(null)
  const [selectedFileIndex, setSelectedFileIndex] = useState(0)

  // Fetch user statistics and recent submissions
  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/certificates')
      if (!response.ok) {
        throw new Error('Failed to fetch statistics')
      }
      
      const data = await response.json()
      const submissions = data.items || []
      
      // Calculate statistics
      const totalSubmissions = submissions.length
      const pendingSubmissions = submissions.filter((s: any) => s.status === 'pending').length
      const approvedSubmissions = submissions.filter((s: any) => s.status === 'approved').length
      const rejectedSubmissions = submissions.filter((s: any) => s.status === 'rejected').length
      
      const totalFiles = submissions.reduce((sum: number, s: any) => sum + (s.files?.length || 0), 0)
      const totalSize = submissions.reduce((sum: number, s: any) => 
        sum + (s.files?.reduce((fileSum: number, f: any) => fileSum + (f.fileSize || 0), 0) || 0), 0
      )
      
      const lastSubmission = submissions.length > 0 ? submissions[0].createdAt : null
      
      setStats({
        totalSubmissions,
        pendingSubmissions,
        approvedSubmissions,
        rejectedSubmissions,
        totalFiles,
        totalSize,
        lastSubmission
      })

      // Set recent submissions (limit to 5 most recent)
      setRecentSubmissions(submissions.slice(0, 5))
    } catch (error) {
      console.error('Error fetching user stats:', error)
    } finally {
      setStatsLoading(false)
      setSubmissionsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchUserStats()
    }
  }, [user])

  // Format file size helper
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Open preview dialog
  const openPreview = (item: SubmissionItem) => {
    setSelectedItem(item)
    setSelectedFileIndex(0)
    setPreviewOpen(true)
  }

  // Render preview content
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <Card className="m-6">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Generate initials from name
  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Get role display name
  const getRoleDisplayName = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'Administrator'
      case 'personnel':
        return 'Academic Personnel'
      case 'student':
        return 'Student'
      default:
        return role.charAt(0).toUpperCase() + role.slice(1)
    }
  }

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to upload image')
      }

      const { url } = await response.json()

      // Update user profile with new image
      const updateResponse = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: url }),
      })

      if (!updateResponse.ok) {
        const error = await updateResponse.json()
        throw new Error(error.error || 'Failed to update profile')
      }

      // Small delay to ensure session is updated
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Refresh user data
      await refreshUser()

      toast.success('Profile photo updated successfully!', {
        position: "top-center"
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setIsUploading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  return (
    <div className="space-y-6">
      <Card className="m-6 bg-gradient-to-tr from-teal-100 to-teal-400">
        <CardHeader>
          <CardTitle className="text-foreground">User Profile</CardTitle>
          <CardDescription>Manage your personal information and academic details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-foreground">
                {user.name || "Unknown User"}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {getRoleDisplayName(user.role)}
                </Badge>
              </div>
              <div className="relative inline-block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                />
                <Button 
                  size="sm" 
                  variant="outline" 
                  disabled={isUploading}
                  className="relative"
                >
                  {isUploading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                      Uploading...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Change Photo
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Batch
              </label>
              <p className="text-muted-foreground">{user.batch || "Not specified"}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </label>
              <p className="text-muted-foreground">{user.phoneNumber || "Not provided"}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </label>
              <p className="text-muted-foreground">{user.address || "Not provided"}</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setIsEditDialogOpen(true)}
            >
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats and Submissions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 m-6">
        {/* Recent Submissions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">
                Recent Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {submissionsLoading ? (
              <div className="text-center py-16 text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm">Loading certificates...</p>
              </div>
            ) : recentSubmissions.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No certificates yet</p>
                <p className="text-sm">Submit your first certificate to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/40 transition-colors cursor-pointer"
                    onClick={() => openPreview(submission)}
                  >
                    <div className="flex items-center gap-3">
                      {submission.status === 'approved' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : submission.status === 'rejected' ? (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-600" />
                      )}
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
                      <Badge 
                        variant={
                          submission.status === 'approved' ? 'default' :
                          submission.status === 'pending' ? 'secondary' : 'destructive'
                        }
                        className={
                          submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                          submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {submission.status === 'approved' ? 'Approved' :
                         submission.status === 'pending' ? 'Pending' : 'Rejected'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))}
                {recentSubmissions.length >= 5 && (
                  <p className="text-sm text-muted-foreground text-center">
                    And {stats.totalSubmissions - 5} more certificates...
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
            <CardDescription>Your upload summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {statsLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Certificates</span>
                  <span className="font-semibold">{stats.totalFiles}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Storage Used</span>
                  <span className="font-semibold">{formatFileSize(stats.totalSize)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Submission</span>
                  <span className="font-semibold">
                    {stats.lastSubmission 
                      ? formatDistanceToNow(new Date(stats.lastSubmission), { addSuffix: true })
                      : "-"
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pending Review</span>
                  <span className="font-semibold">{stats.pendingSubmissions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Approved</span>
                  <span className="font-semibold text-green-600">{stats.approvedSubmissions}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
      />

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
