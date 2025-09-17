"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserX, ShieldCheck } from "lucide-react"

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

interface StatsCardsProps {
  users: User[]
}

export function StatsCards({ users }: StatsCardsProps) {
  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.status.toLowerCase() === "active").length
  const suspendedUsers = users.filter((u) => u.status.toLowerCase() === "suspended").length
  const adminUsers = users.filter((u) => u.role.toLowerCase() === "admin").length

  return (
    <div className="grid gap-6 md:grid-cols-4">
      <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/90">Total Users</CardTitle>
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Users className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{totalUsers}</div>
          <p className="text-xs text-white/80 mt-1">All registered users</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/90">Active Users</CardTitle>
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <UserCheck className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{activeUsers}</div>
          <p className="text-xs text-white/80 mt-1">Currently active</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/90">Suspended</CardTitle>
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <UserX className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{suspendedUsers}</div>
          <p className="text-xs text-white/80 mt-1">Suspended accounts</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/90">Admins</CardTitle>
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{adminUsers}</div>
          <p className="text-xs text-white/80 mt-1">Administrator accounts</p>
        </CardContent>
      </Card>
    </div>
  )
}
