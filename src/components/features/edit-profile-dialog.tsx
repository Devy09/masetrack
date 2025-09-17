"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Calendar, Phone, MapPin, Edit, User } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const { user, refreshUser } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    batch: "",
    phoneNumber: "",
    address: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        batch: user.batch || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update profile')
      }

      const updatedUser = await response.json()
      
      // Small delay to ensure session is updated
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Refresh user data in context
      await refreshUser()
      
      toast.success('Profile updated successfully!', {
        position: "top-center"
      })
      
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information</DialogDescription>
        </DialogHeader>

        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="px-0 pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg">
                <Edit className="w-5 h-5 text-white" />
              </div>
              Edit Profile
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Update your personal information below. Changes will be saved immediately.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* NAME */}
              <div className="space-y-3">
                <Label htmlFor="edit-name" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-600" />
                  Full Name
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter full name"
                  required
                  disabled={isLoading}
                  className="h-11 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                />
              </div>

              {/* EMAIL */}
              <div className="space-y-3">
                <Label htmlFor="edit-email" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-teal-600" />
                  Email Address
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                  required
                  disabled={isLoading}
                  className="h-11 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                />
              </div>

              {/* BATCH */}
              <div className="space-y-3">
                <Label htmlFor="edit-batch" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  Batch
                </Label>
                <Input
                  id="edit-batch"
                  value={formData.batch}
                  onChange={(e) => handleInputChange("batch", e.target.value)}
                  placeholder="Enter batch number"
                  disabled={isLoading}
                  className="h-11 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                />
              </div>

              {/* PHONE NUMBER */}
              <div className="space-y-3">
                <Label htmlFor="edit-phoneNumber" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-teal-600" />
                  Phone Number
                </Label>
                <Input
                  id="edit-phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  placeholder="Enter phone number"
                  disabled={isLoading}
                  className="h-11 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                />
              </div>

              {/* ADDRESS */}
              <div className="space-y-3">
                <Label htmlFor="edit-address" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  Address
                </Label>
                <Input
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter address"
                  disabled={isLoading}
                  className="h-11 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                  className="order-2 sm:order-1 h-11 px-6 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="order-1 sm:order-2 h-11 px-6 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Updating Profile...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Update Profile
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
