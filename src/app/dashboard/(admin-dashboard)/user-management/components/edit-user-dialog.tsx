"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Users, Shield, Activity, Mail, Edit } from "lucide-react"

type User = {
  id: number
  name: string
  role: string
  email: string
  status: string
  batch: string
  password: string
  phoneNumber?: string
  address?: string
  createdAt: Date
  updatedAt: Date
}

interface EditUserDialogProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (userData: Partial<User>) => void
}

export function EditUserDialog({ user, open, onOpenChange, onSave }: EditUserDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
    batch: "",
    phoneNumber: "",
    address: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        batch: user.batch,
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSave(formData)
    setIsLoading(false)
    onOpenChange(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user information</DialogDescription>
        </DialogHeader>

        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="px-0 pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg">
                <Edit className="w-5 h-5 text-white" />
              </div>
              Edit User
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Update the user information below. Changes will be saved immediately.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* NAME & BATCH ROW */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="edit-name" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-600" />
                    Full Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter full name"
                    required
                    disabled={isLoading}
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="edit-batch" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-600" />
                    Batch
                  </Label>
                  <Input
                    id="edit-batch"
                    value={formData.batch}
                    onChange={(e) => handleInputChange("batch", e.target.value)}
                    placeholder="Enter batch number"
                    required
                    disabled={isLoading}
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="space-y-3">
                <Label htmlFor="edit-email" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Mail className="w-4 h-6 text-teal-600" />
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
                  className="h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                />
              </div>

              {/* ROLE & STATUS ROW */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="edit-role" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-teal-600" />
                    Role
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange("role", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-11 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 bg-gray-50/50 focus:bg-white">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin" className="focus:bg-teal-50 focus:text-teal-900">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                          <span className="font-medium">Admin</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="personnel" className="focus:bg-teal-50 focus:text-teal-900">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
                          <span className="font-medium">Monitoring Personnel</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="user" className="focus:bg-teal-50 focus:text-teal-900">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                          <span className="font-medium">User</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="edit-status" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-600" />
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange("status", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-11 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 bg-gray-50/50 focus:bg-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active" className="focus:bg-teal-50 focus:text-teal-900">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                          <span className="font-medium">Active</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="inactive" className="focus:bg-teal-50 focus:text-teal-900">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 bg-gray-500 rounded-full"></div>
                          <span className="font-medium">Inactive</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="suspended" className="focus:bg-teal-50 focus:text-teal-900">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                          <span className="font-medium">Suspended</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* PHONE NUMBER & ADDRESS ROW */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="edit-phoneNumber" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-teal-600" />
                    Phone Number
                  </Label>
                  <Input
                    id="edit-phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    placeholder="Enter phone number"
                    disabled={isLoading}
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="edit-address" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-600" />
                    Address
                  </Label>
                  <Input
                    id="edit-address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Enter address"
                    disabled={isLoading}
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* User Info Card */}
              <div className="bg-blue-50/50 border border-teal-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">User Information</h4>
                    <p className="text-sm text-gray-600">Additional details about this user</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">User ID:</span>
                    <span className="ml-2 font-medium text-gray-900">#{user.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
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
                      Updating User...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Update User
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
