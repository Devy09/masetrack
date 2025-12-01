"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, CheckCircle2, Users } from "lucide-react"
import type { Activity } from "@/app/dashboard/(admin-dashboard)/calendar-management/page"

interface ActivitySidebarProps {
  activeFilters: string[]
  onFiltersChange: (filters: string[]) => void
  onNewActivityClick: () => void
  activities: Activity[]
}

export function ActivitySidebar({
  activeFilters,
  onFiltersChange,
  onNewActivityClick,
  activities,
}: ActivitySidebarProps) {
  const getActivitiesForCategory = (category: string) => {
    return activities.filter((a) => a.category === category)
  }

  const getTodaysActivities = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const todayStr = `${year}-${month}-${day}`
    return activities.filter((a) => a.date === todayStr)
  }

  const categories = [
    {
      id: "meeting",
      label: "Meetings",
      icon: Users,
      count: getActivitiesForCategory("meeting").length,
      color: "bg-blue-500",
    },
    {
      id: "event",
      label: "Events",
      icon: Calendar,
      count: getActivitiesForCategory("event").length,
      color: "bg-green-500",
    },
    {
      id: "deadline",
      label: "Deadlines",
      icon: CheckCircle2,
      count: getActivitiesForCategory("deadline").length,
      color: "bg-red-500",
    },
  ]

  const toggleFilter = (id: string) => {
    onFiltersChange(activeFilters.includes(id) ? activeFilters.filter((f) => f !== id) : [...activeFilters, id])
  }

  const todaysActivities = getTodaysActivities()
  const totalToday = todaysActivities.length
  const completedToday = 0
  const pendingToday = totalToday

  return (
    <div className="space-y-4">
      {/* <Card className="p-4 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20 shadow-xl">
        <Button className="w-full gap-2" onClick={onNewActivityClick}>
          <Plus className="h-4 w-4" />
          New Activity
        </Button>
      </Card> */}

      <Card className="p-4 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20 shadow-xl">
        <h3 className="mb-4 font-semibold text-foreground">Categories</h3>
        <div className="space-y-3">
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = activeFilters.includes(category.id)
            return (
              <button
                key={category.id}
                onClick={() => toggleFilter(category.id)}
                className={`w-full rounded-lg p-3 text-left transition-colors backdrop-blur-sm ${
                  isActive 
                    ? "bg-primary/20 border border-primary/50 backdrop-blur-md" 
                    : "border border-white/30 bg-white/40 dark:bg-gray-900/40 hover:bg-white/60 dark:hover:bg-gray-900/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">{category.label}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </div>
              </button>
            )
          })}
        </div>
      </Card>

      <Card className="p-4 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20 shadow-xl">
        <h3 className="mb-4 font-semibold text-foreground">Today's Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Activities</span>
            <span className="font-semibold">{totalToday}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Completed</span>
            <span className="font-semibold text-green-500">{completedToday}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Pending</span>
            <span className="font-semibold text-yellow-500">{pendingToday}</span>
          </div>
        </div>
      </Card>

      <Card className="p-4 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20 shadow-xl">
        <h3 className="mb-3 font-semibold text-foreground">Upcoming</h3>
        <div className="space-y-2">
          {todaysActivities.length > 0 ? (
            todaysActivities.map((activity) => (
              <div key={activity.id} className="rounded-lg backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-white/20 p-3">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-xs text-muted-foreground">Today at {activity.time}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No activities today</p>
          )}
        </div>
      </Card>
    </div>
  )
}
