"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ActivityCard } from "./activity-card"
import type { Activity } from "../page"

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

interface CalendarGridProps {
  activeFilters: string[]
  selectedDate: string | null // Format: YYYY-MM-DD
  onDateSelect: (date: string) => void // Format: YYYY-MM-DD
  activities: Activity[]
  onDeleteActivity: (activityId: number) => void
  onActivityClick?: (activity: Activity) => void
}

export function CalendarGrid({ activeFilters, selectedDate, onDateSelect, activities, onDeleteActivity, onActivityClick }: CalendarGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const days = []

  // Previous month's days
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ date: daysInPrevMonth - i, isCurrentMonth: false })
  }

  // Current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ date: i, isCurrentMonth: true })
  }

  // Next month's days
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push({ date: i, isCurrentMonth: false })
  }

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const getActivitiesForDate = (day: number) => {
    // Format the date as YYYY-MM-DD for comparison
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return activities.filter(
      (activity) => activity.date === dateStr && activeFilters.includes(activity.category)
    )
  }

  const formatDateString = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            {MONTHS[month]} {year}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={goToPrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="mb-4 grid grid-cols-7 gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="text-center font-semibold text-muted-foreground text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const activities_for_day = day.isCurrentMonth ? getActivitiesForDate(day.date) : []
            const dateStr = day.isCurrentMonth ? formatDateString(day.date) : null
            const isSelected = selectedDate === dateStr && day.isCurrentMonth
            const today = new Date()
            const isToday =
              day.isCurrentMonth &&
              day.date === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear()

            return (
              <div
                key={index}
                onClick={() => day.isCurrentMonth && dateStr && onDateSelect(dateStr)}
                className={`min-h-24 rounded-lg border p-2 transition-colors cursor-pointer backdrop-blur-sm ${
                  !day.isCurrentMonth
                    ? "bg-white/20 dark:bg-gray-900/20 border-white/20"
                    : isSelected
                      ? "bg-primary/80 border-primary backdrop-blur-md"
                      : isToday
                        ? "border-primary bg-white/60 dark:bg-gray-900/60 border-white/30"
                        : "border-white/30 bg-white/50 dark:bg-gray-900/50 hover:bg-white/70 dark:hover:bg-gray-900/70"
                }`}
              >
                <div
                  className={`mb-1 text-sm font-semibold ${
                    !day.isCurrentMonth
                      ? "text-muted-foreground"
                      : isSelected
                        ? "text-primary-foreground"
                        : isToday
                          ? "text-primary"
                          : "text-foreground"
                  }`}
                >
                  {day.date}
                </div>
                {activities_for_day.length > 0 && (
                  <div className="space-y-1">
                    {activities_for_day.slice(0, 2).map((activity) => (
                      <div
                        key={activity.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          onActivityClick?.(activity)
                        }}
                        className={`${activity.color} rounded px-1.5 py-0.5 text-xs font-medium text-white truncate cursor-pointer hover:opacity-80 transition-opacity`}
                        title={`Click to view details: ${activity.title}`}
                      >
                        {activity.title}
                      </div>
                    ))}
                    {activities_for_day.length > 2 && (
                      <div 
                        onClick={(e) => {
                          e.stopPropagation()
                          if (activities_for_day.length > 2 && onActivityClick) {
                            onActivityClick(activities_for_day[2])
                          }
                        }}
                        className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                        title="Click to view details"
                      >
                        +{activities_for_day.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Selected date activities */}
      {selectedDate && (() => {
        const [selectedYear, selectedMonth, selectedDay] = selectedDate.split('-').map(Number)
        const selectedDateActivities = activities.filter(
          (activity) => activity.date === selectedDate && activeFilters.includes(activity.category)
        )
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">
              Activities for {MONTHS[selectedMonth - 1]} {selectedDay}, {selectedYear}
            </h3>
            <div className="space-y-2">
              {selectedDateActivities.length > 0 ? (
                selectedDateActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} onDelete={onDeleteActivity} />
                ))
              ) : (
                <Card className="p-6 text-center backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20 shadow-xl">
                  <p className="text-muted-foreground">No activities scheduled for this day</p>
                </Card>
              )}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
