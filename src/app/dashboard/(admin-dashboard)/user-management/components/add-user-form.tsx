"use client"

import { useEffect } from "react"
import { useFormStatus } from "react-dom"
import { useActionState } from "react"
import { addUser } from "@/lib/actions/user.actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Users, Shield, Activity, Mail, Lock, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"

interface AddUserFormProps {
  onClose: () => void
}

export function AddUserForm({ onClose }: AddUserFormProps) {
  const { pending } = useFormStatus()
  const [formState, formAction] = useActionState(addUser, { message: null })

  useEffect(() => {
    if (formState?.message === "User created successfully") {
      toast.success("User created successfully", {
        position: "top-center",
      })
      const timer = setTimeout(() => {
        onClose()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [formState, onClose])

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="px-0 pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            Add New User
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            Create a new user account with the required information below.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0">
          <form action={formAction} className="space-y-6 mr-6 ml-2">
            {/* NAME & BATCH ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-600" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter full name"
                  required
                  disabled={pending}
                  className="h-11 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                />
                {formState?.errors?.name && (
                  <p className="text-sm text-red-500 flex items-center gap-2 bg-red-50 p-2 rounded-md">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    {formState.errors.name[0]}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="batch" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-600" />
                  Batch
                </Label>
                <Input
                  id="batch"
                  name="batch"
                  placeholder="Enter batch number"
                  required
                  disabled={pending}
                  className="h-11 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                />
                {formState?.errors?.batch && (
                  <p className="text-sm text-red-500 flex items-center gap-2 bg-red-50 p-2 rounded-md">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    {formState.errors.batch[0]}
                  </p>
                )}
              </div>
            </div>

            {/* EMAIL */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-600" />
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                required
                disabled={pending}
                className="h-11 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 bg-gray-50/50 focus:bg-white"
              />
              {formState?.errors?.email ? (
                <p className="text-sm text-red-500 flex items-center gap-2 bg-red-50 p-2 rounded-md">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {formState.errors.email[0]}
                </p>
              ) : formState?.message && formState.message === "User created successfully" ? (
                <p className="text-sm text-teal-700 flex items-center gap-2 bg-teal-50 p-2 rounded-md">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                  {formState.message}
                </p>
              ) : formState?.message ? (
                <p className="text-sm text-red-500 flex items-center gap-2 bg-red-50 p-2 rounded-md">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {formState.message}
                </p>
              ) : null}
            </div>

            {/* ROLE & STATUS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="role" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-teal-600" />
                  Role
                </Label>
                <Select name="role" disabled={pending}>
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
                        <span className="font-medium">Member of Parliament</span>
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
                {formState?.errors?.role && (
                  <p className="text-sm text-red-500 flex items-center gap-2 bg-red-50 p-2 rounded-md">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    {formState.errors.role[0]}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="status" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600" />
                  Status
                </Label>
                <Select name="status" disabled={pending}>
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
                {formState?.errors?.status && (
                  <p className="text-sm text-red-500 flex items-center gap-2 bg-red-50 p-2 rounded-md">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    {formState.errors.status[0]}
                  </p>
                )}
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Lock className="w-4 h-4 text-teal-600" />
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter secure password (min. 6 characters)"
                required
                disabled={pending}
                className="h-11 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 bg-gray-50/50 focus:bg-white"
              />
              {formState?.errors?.password && (
                <p className="text-sm text-red-500 flex items-center gap-2 bg-red-50 p-2 rounded-md">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {formState.errors.password[0]}
                </p>
              )}
            </div>

            {/* PHONE NUMBER & ADDRESS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-teal-600" />
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  disabled={pending}
                  className="h-11 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                />
                {formState?.errors?.phoneNumber && (
                  <p className="text-sm text-red-500 flex items-center gap-2 bg-red-50 p-2 rounded-md">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    {formState.errors.phoneNumber[0]}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="address" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-600" />
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Enter address"
                  disabled={pending}
                  className="h-11 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                />
                {formState?.errors?.address && (
                  <p className="text-sm text-red-500 flex items-center gap-2 bg-red-50 p-2 rounded-md">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    {formState.errors.address[0]}
                  </p>
                )}
              </div>
            </div>

            {/* IMAGE */}
            <div className="space-y-3">
              <Label htmlFor="image" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-teal-600" />
                Profile Image (Optional)
              </Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                disabled={pending}
                className="h-12 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 bg-gray-50/50 focus:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              />
              <p className="text-xs text-gray-500">Recommended size: 200x200px, Max size: 2MB</p>
              {formState?.errors?.image && (
                <p className="text-sm text-red-500 flex items-center gap-2 bg-red-50 p-2 rounded-md">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {formState.errors.image[0]}
                </p>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={pending}
                className="order-2 sm:order-1 h-11 px-6 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={pending}
                className="order-1 sm:order-2 h-11 px-6 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Adding User...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Add User
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
