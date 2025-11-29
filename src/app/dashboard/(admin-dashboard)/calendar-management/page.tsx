"use client"

import { useState, useEffect } from "react"
import { CalendarHeader } from "./components/calendar-header"
import { CalendarGrid } from "./components/calendar-grid"
import { ActivitySidebar } from "./components/activity-sidebar"
import { NewActivityDialog } from "./components/new-activity-dialog"
import { toast } from "sonner"

export interface Activity {
  id: number
  date: string // Format: YYYY-MM-DD
  title: string
  time: string
  category: "meeting" | "event" | "deadline"
  color: string
}

export default function CalendarPage() {
  const [activeFilters, setActiveFilters] = useState<string[]>(["meeting", "event", "deadline"])
  const [selectedDate, setSelectedDate] = useState<string | null>(null) // Format: YYYY-MM-DD
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch activities from API
  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/calendar-activities", {
        cache: "no-store",
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        throw new Error(errorBody.error || "Failed to load activities")
      }

      const data: Activity[] = await response.json()
      setActivities(data)
    } catch (err) {
      console.error("Failed to load activities:", err)
      setError(err instanceof Error ? err.message : "Failed to load activities")
      toast.error("Failed to load calendar activities")
    } finally {
      setLoading(false)
    }
  }

  const handleAddActivity = async (activity: Omit<Activity, "id">) => {
    try {
      const response = await fetch("/api/calendar-activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activity),
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        throw new Error(errorBody.error || "Failed to create activity")
      }

      const newActivity: Activity = await response.json()
      setActivities((prev) => [...prev, newActivity])
      setIsDialogOpen(false)
      toast.success("Activity created successfully!")
    } catch (err) {
      console.error("Failed to create activity:", err)
      toast.error(err instanceof Error ? err.message : "Failed to create activity")
    }
  }

  const handleDeleteActivity = async (activityId: number) => {
    try {
      const response = await fetch(`/api/calendar-activities/${activityId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        throw new Error(errorBody.error || "Failed to delete activity")
      }

      setActivities((prev) => prev.filter((activity) => activity.id !== activityId))
      toast.success("Activity deleted successfully!")
    } catch (err) {
      console.error("Failed to delete activity:", err)
      toast.error(err instanceof Error ? err.message : "Failed to delete activity")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <CalendarHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading calendar activities...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <CalendarHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <button
                onClick={loadActivities}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Retry
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <CalendarHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <ActivitySidebar
            activeFilters={activeFilters}
            onFiltersChange={setActiveFilters}
            onNewActivityClick={() => setIsDialogOpen(true)}
            activities={activities}
          />
          <div className="lg:col-span-3">
            <CalendarGrid
              activeFilters={activeFilters}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              activities={activities}
              onDeleteActivity={handleDeleteActivity}
            />
          </div>
        </div>
      </main>

      <NewActivityDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddActivity={handleAddActivity}
        defaultDate={selectedDate}
      />
    </div>
  )
}
