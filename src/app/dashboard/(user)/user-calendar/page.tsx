"use client"

import { useState, useEffect } from "react"
import { CalendarHeader } from "./components/calendar-header"
import { CalendarGrid } from "./components/calendar-grid"
import { ActivitySidebar } from "./components/activity-sidebar"
import { NewActivityDialog } from "./components/new-activity-dialog"
import { ActivityDetailsDialog } from "./components/activity-details-dialog"
import { BackgroundSettings, type BackgroundSettings as BackgroundSettingsType } from "./components/background-settings"
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
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [background, setBackground] = useState<BackgroundSettingsType>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("calendar-background")
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          // Invalid JSON, use default
        }
      }
    }
    return { type: "solid", value: "hsl(var(--background))" }
  })

  // Fetch activities from API
  useEffect(() => {
    loadActivities()
  }, [])

  // Save background to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("calendar-background", JSON.stringify(background))
    }
  }, [background])

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

  const getBackgroundStyle = () => {
    if (background.type === "solid") {
      return { backgroundColor: background.value }
    } else if (background.type === "gradient") {
      return { background: background.value }
    } else if (background.type === "image" && background.value) {
      return {
        backgroundImage: `url(${background.value})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    }
    return {}
  }

  if (loading) {
    return (
      <div className="min-h-screen relative" style={getBackgroundStyle()}>
        <CalendarHeader background={background} onBackgroundChange={setBackground} />
        <main className="container mx-auto px-4 py-8 relative z-0">
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
      <div className="min-h-screen relative" style={getBackgroundStyle()}>
        <CalendarHeader background={background} onBackgroundChange={setBackground} />
        <main className="container mx-auto px-4 py-8 relative z-0">
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
    <div className="min-h-screen relative" style={getBackgroundStyle()}>
      <CalendarHeader background={background} onBackgroundChange={setBackground} />
      <main className="container mx-auto px-4 py-8 relative z-0">
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
              onActivityClick={(activity) => {
                setSelectedActivity(activity)
                setIsDetailsDialogOpen(true)
              }}
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

      <ActivityDetailsDialog
        activity={selectedActivity}
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      />
    </div>
  )
}
