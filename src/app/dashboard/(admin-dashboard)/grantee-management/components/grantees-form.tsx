"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Student } from "./grantees-management"

interface User {
  id: number
  name: string
  email: string
  image?: string
  phoneNumber?: string
  address?: string
  status: string
  batch: string
}

interface StudentFormProps {
  student: Student | null
  onSubmit: (data: Omit<Student, "id" | "createdAt" | "updatedAt"> & { userId?: number }) => void
  onCancel: () => void
}

export function StudentForm({ student, onSubmit, onCancel }: StudentFormProps) {
  const [availableUsers, setAvailableUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<Omit<Student, "id" | "createdAt" | "updatedAt">>({
    name: "",
    email: "",
    batch: "",
    phoneNumber: "",
    address: "",
    status: "active",
    image: "",
  })

  // Fetch available users for enrollment
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin-api/users-for-grantees')
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await response.json()
      setAvailableUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (student) {
      setFormData(student)
      const matchingUser = availableUsers.find((u) => u.email === student.email)
      setSelectedUser(matchingUser || null)
    }
  }, [student, availableUsers])

  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value
    const user = availableUsers.find((u) => u.id === Number(userId))
    if (user) {
      setSelectedUser(user)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!student && !selectedUser) {
      alert("Please select a user to enroll as a grantee")
      return
    }
    
    // For new grantees, use the selected user's data directly
    if (!student && selectedUser) {
      if (!selectedUser.id) {
        alert("Error: No user selected or user ID is missing")
        return
      }
      
      const submitData = {
        userId: selectedUser.id,
        batch: selectedUser.batch,
        phoneNumber: selectedUser.phoneNumber,
        address: selectedUser.address,
        status: selectedUser.status || 'active',
      }
      
      console.log('Submitting with data:', submitData)
      onSubmit(submitData)
    } else {
      // For editing existing grantees, use form data
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
        {student ? "Edit Grantee" : "Enroll Grantee"}
      </h2>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Loading users...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-4">
          <p className="text-red-600 dark:text-red-400 text-sm mb-2">{error}</p>
          <button
            type="button"
            onClick={fetchUsers}
            className="px-3 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left: User Selection */}
        <div className="space-y-4">
          {!student && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Select User to Enroll
              </label>
              <select
                value={selectedUser?.id || ""}
                onChange={handleUserSelect}
                required
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select a user --</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Right: Selected User Details Display */}
        {selectedUser && (
          <div className="p-4 sm:p-6 rounded-lg bg-teal-300 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
            <div className="flex flex-col items-center mb-4">
              {selectedUser.image && (
                <img
                  src={selectedUser.image || "/placeholder.svg"}
                  alt={selectedUser.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mb-4"
                />
              )}
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white text-center">
                {selectedUser.name}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">{selectedUser.email}</p>
            </div>
            
            {/* Show existing user details */}
            <div className="space-y-2 text-sm">
              <div className="text-center mb-3">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">These details will be imported as grantee information:</p>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">Batch:</span>
                <span className="font-medium text-neutral-900 dark:text-white">{selectedUser.batch || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">Status:</span>
                <span className="font-medium text-neutral-900 dark:text-white capitalize">{selectedUser.status || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">Phone:</span>
                <span className="font-medium text-neutral-900 dark:text-white">{selectedUser.phoneNumber || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">Address:</span>
                <span className="font-medium text-neutral-900 dark:text-white text-right max-w-[150px] truncate">{selectedUser.address || 'Not set'}</span>
              </div>
            </div>
          </div>
        )}
      </div>


      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="submit"
          disabled={!student && !selectedUser}
          className="flex-1 px-4 py-2 rounded-lg font-semibold bg-teal-500 hover:bg-teal-600 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white transition-colors"
        >
          {student ? "Update Grantee" : "Enroll Grantee"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 rounded-lg font-semibold bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
