"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, MoreHorizontal, Trash2, Users, Shield, ShieldCheck, UserCog2, UserRoundX, UserX } from "lucide-react"
import { EditUserDialog } from "./edit-user-dialog"
import { DeleteUserDialog } from "./delete-user-dialog"

type User = {
  id: number
  name: string
  role: string
  email: string
  status: string
  batch: string
  password: string
  image?: string
  phoneNumber?: string
  address?: string
  createdAt: Date
  updatedAt: Date
}

interface UsersTableProps {
  users: User[]
  onUserUpdate?: (user: User, updatedData: Partial<User>) => void
  onUserDelete?: (userId: number) => void
}

export function UsersTable({ users, onUserUpdate, onUserDelete }: UsersTableProps) {
  const [editUser, setEditUser] = useState<User | null>(null)
  const [deleteUser, setDeleteUser] = useState<User | null>(null)

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

  const handleEditUser = (user: User) => {
    setEditUser(user)
  }

  const handleDeleteUser = (user: User) => {
    setDeleteUser(user)
  }

  const handleSaveEdit = (updatedData: Partial<User>) => {
    if (editUser && onUserUpdate) {
      onUserUpdate(editUser, updatedData)
    }
    setEditUser(null)
  }

  const handleConfirmDelete = (userId: number) => {
    if (onUserDelete) {
      onUserDelete(userId)
    }
    setDeleteUser(null)
  }

  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-gray-50/50">
              <TableHead className="font-semibold text-gray-900">User</TableHead>
              <TableHead className="font-semibold text-gray-900">Role</TableHead>
              <TableHead className="font-semibold text-gray-900">Status</TableHead>
              <TableHead className="font-semibold text-gray-900">Batch</TableHead>
              <TableHead className="font-semibold text-gray-900">Phone</TableHead>
              <TableHead className="font-semibold text-gray-900">Address</TableHead>
              <TableHead className="font-semibold text-gray-900">Created</TableHead>
              <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <Users className="w-12 h-12 text-gray-300" />
                  <div>
                    <p className="text-gray-500 font-medium">No users found</p>
                    <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-gray-50/50">
              <TableHead className="font-semibold text-gray-900">User</TableHead>
              <TableHead className="font-semibold text-gray-900">Role</TableHead>
              <TableHead className="font-semibold text-gray-900">Status</TableHead>
              <TableHead className="font-semibold text-gray-900">Batch</TableHead>
              <TableHead className="font-semibold text-gray-900">Phone</TableHead>
              <TableHead className="font-semibold text-gray-900">Address</TableHead>
              <TableHead className="font-semibold text-gray-900">Created</TableHead>
              <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2 border-gray-100">
                      <AvatarImage 
                        src={user.image || `/api/avatar?name=${encodeURIComponent(user.name)}`} 
                        alt={user.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-teal-100 to-teal-200 text-teal-700 font-semibold">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getRoleIcon(user.role)}
                    <span className="font-medium text-gray-700">
                      {user.role === 'personnel' ? 'Member of Parliament' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-medium">
                    {user.batch}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">
                  {user.phoneNumber || '-'}
                </TableCell>
                <TableCell className="text-gray-600">
                  {user.address || '-'}
                </TableCell>
                <TableCell className="text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100 cursor-pointer">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel className="font-semibold">Actions</DropdownMenuLabel>
                      <DropdownMenuItem className="cursor-pointer font-semibold text-blue-400" onClick={() => handleEditUser(user)}>
                        <UserCog2 className="mr-2 h-4 w-4 text-blue-400" />
                          Edit User
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 cursor-pointer focus:text-red-600"
                        onClick={() => handleDeleteUser(user)}
                      >
                        <UserRoundX className="mr-2 h-4 w-4 text-red-600" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Dialog */}
      <EditUserDialog
        user={editUser}
        open={!!editUser}
        onOpenChange={(open) => !open && setEditUser(null)}
        onSave={handleSaveEdit}
      />

      {/* Delete User Dialog */}
      <DeleteUserDialog
        user={deleteUser}
        open={!!deleteUser}
        onOpenChange={(open) => !open && setDeleteUser(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
