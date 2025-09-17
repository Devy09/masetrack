"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Calendar, Shield, Phone, MapPin, Upload } from "lucide-react"
import { EditProfileDialog } from "./edit-profile-dialog"
import { toast } from "sonner"

export function Profile() {
  const { user, loading, refreshUser } = useAuth()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

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

      {/* Academic Progress */}
      <Card className="m-6">
        <CardHeader>
          <CardTitle className="text-foreground">Academic Progress</CardTitle>
          <CardDescription>Your certification journey and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Enrollment Certificates</span>
              <span className="text-sm font-medium text-foreground">2 of 4 completed</span>
            </div>
            <Progress value={50} className="h-2" />

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Grade Certificates</span>
              <span className="text-sm font-medium text-foreground">1 of 8 completed</span>
            </div>
            <Progress value={12.5} className="h-2" />

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Active Certificates</span>
              <span className="text-sm font-medium text-foreground">3 of 4 active</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <EditProfileDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
      />
    </div>
  )
}
