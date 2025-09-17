"use client"

import { useState, useTransition, useEffect, useActionState } from "react"
import { addUser } from "@/lib/actions/user.actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Plus, Download, RefreshCw, Users, Trash2, UserPlus2 } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

// Import our separated components
import { AddUserForm } from "./add-user-form"
import { StatsCards } from "./stats-cards"
import { UsersTable } from "./users-table"
import { FiltersSection } from "./filters-section"
import { Pagination } from "./pagination"
import { LoadingSkeleton } from "./loading-skeleton"

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

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [state, formAction] = useActionState(addUser, { message: null })
  const [isPending, startTransition] = useTransition()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const itemsPerPage = 10

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin-api/user-management")
        if (response.ok) {
          const data = await response.json()
          setUsers(data)
        } else {
          console.error("Failed to fetch users")
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUsers()
  }, [state])

  useEffect(() => {
    if (state?.message === "User created successfully") {
      const timer = setTimeout(() => {
        setIsAddUserOpen(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [state])

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.name}`.toLowerCase()
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter
    const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const hasActiveFilters = searchTerm !== "" || roleFilter !== "all" || statusFilter !== "all"

  const handleClearFilters = () => {
    setSearchTerm("")
    setRoleFilter("all")
    setStatusFilter("all")
    setCurrentPage(1)
  }

  const handleUserUpdate = async (user: User, updatedData: Partial<User>) => {
    try {
      const response = await fetch('/api/admin-api/user-management', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          ...updatedData
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update user');
      }

      const updatedUser = await response.json();
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(u => u.id === user.id ? { ...u, ...updatedUser } : u)
      );
      
      // Show success message
      toast.success('Success!', {
        description: "User updated successfully",
        position: "top-center"
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update user');
    }
  }

  const handleDeleteClick = (userId: number) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleUserDelete = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    
    try {
      const response = await fetch('/api/admin-api/user-management', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userToDelete }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }

      // Update local state
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete));
      
      // Show success message
      toast.success('Success', {
        description: 'User has been deleted successfully',
        position: "top-center"
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete user');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  }

  const refreshData = () => {
    startTransition(async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/admin-api/user-management")
        if (response.ok) {
          const data = await response.json()
          setUsers(data)
        }
      } catch (error) {
        console.error("Error refreshing data:", error)
        toast.error("Error refreshing data")
      } finally {
        setIsLoading(false)
      }
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 p-6">
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage your organization's users and permissions</p>
          </div>
          <Button
            onClick={refreshData}
            variant="outline"
            size="sm"
            disabled={isPending}
            className="flex items-center gap-2 bg-gradient-to-br from-teal-400 to-teal-700 text-white"
          >
            <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <StatsCards users={users} />

        {/* Main Content */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-white rounded-t-lg border-b border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-600" />
                  Users Directory
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  A comprehensive list of all users in your organization
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-200">
                      <UserPlus2 className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader className="sr-only">
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>Create a new user account</DialogDescription>
                    </DialogHeader>
                    <AddUserForm onClose={() => setIsAddUserOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Filters */}
            <FiltersSection
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onClearFilters={handleClearFilters}
              hasActiveFilters={hasActiveFilters}
            />

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium text-gray-900">{paginatedUsers.length}</span> of{" "}
                <span className="font-medium text-gray-900">{filteredUsers.length}</span> users
              </p>
            </div>

            {/* Users Table */}
            <UsersTable users={paginatedUsers} onUserUpdate={handleUserUpdate} onUserDelete={handleDeleteClick} />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredUsers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </CardContent>
        </Card>
      </div>

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <AlertDialogTitle className="text-lg">Delete User</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base">
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleUserDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
