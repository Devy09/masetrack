"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Trash2, Shield, ShieldCheck, Users } from "lucide-react"

type User = {
  id: number
  name: string
  role: string
  email: string
  status: string
  batch: string
  password: string
  createdAt: Date
  updatedAt: Date
}

interface DeleteUserDialogProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (userId: number) => void
}

export function DeleteUserDialog({ user, open, onOpenChange, onConfirm }: DeleteUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    if (!user) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onConfirm(user.id)
    setIsLoading(false)
    onOpenChange(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 font-medium">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
            Active
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200 font-medium">
            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1.5"></div>
            Inactive
          </Badge>
        )
      case "suspended":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200 font-medium">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></div>
            Suspended
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <ShieldCheck className="h-4 w-4 text-red-500" />
      case "personnel":
        return <Shield className="h-4 w-4 text-orange-500" />
      case "user":
        return <Users className="h-4 w-4 text-green-500" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  if (!user) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-bold text-gray-900">Delete User Account</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 mt-1">
                This action cannot be undone
              </AlertDialogDescription>
            </div>
          </div>

          {/* User Preview Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-12 h-12 border-2 border-gray-200">
                <AvatarImage src={`/most-logo.png?height=48&width=48`} />
                <AvatarFallback className="bg-gradient-to-br from-red-100 to-red-200 text-red-700 font-semibold">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
                <div className="flex items-center gap-2 mt-1">
                  {getRoleIcon(user.role)}
                  <span className="text-sm font-medium text-gray-700 capitalize">{user.role}</span>
                  <span className="text-gray-400">•</span>
                  {getStatusBadge(user.status)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm pt-3 border-t border-gray-200">
              <div>
                <span className="text-gray-500">Batch:</span>
                <span className="ml-2 font-medium text-gray-900">{user.batch}</span>
              </div>
              <div>
                <span className="text-gray-500">User ID:</span>
                <span className="ml-2 font-medium text-gray-900">#{user.id}</span>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 mb-1">Warning</h4>
                <p className="text-sm text-red-700">
                  Deleting this user will permanently remove their account and all associated data. This action cannot
                  be undone and the user will lose access to the system immediately.
                </p>
              </div>
            </div>
          </div>

          <AlertDialogDescription className="text-gray-600 text-center mt-4">
            Are you absolutely sure you want to delete <strong>{user.name}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-3 pt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 h-11 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 h-11 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Deleting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete User
              </div>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
