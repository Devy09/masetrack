"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import type { Activity } from "@/app/dashboard/(admin-dashboard)/calendar-management/page"

interface NewActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddActivity: (activity: Omit<Activity, "id">) => void
  defaultDate: string | null // Format: YYYY-MM-DD
}

export function NewActivityDialog({ 
  open, 
  onOpenChange, 
  onAddActivity, 
  defaultDate
}: NewActivityDialogProps) {
  const [title, setTitle] = useState("")
  const getDefaultDate = () => {
    if (defaultDate) return defaultDate
    // Default to today's date in YYYY-MM-DD format
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  const [date, setDate] = useState(getDefaultDate)
  const [time, setTime] = useState("")
  const [category, setCategory] = useState<"meeting" | "event" | "deadline">("meeting")

  // Update date when defaultDate changes (when dialog opens with a selected date)
  useEffect(() => {
    if (open && defaultDate) {
      setDate(defaultDate)
    } else if (open && !defaultDate) {
      setDate(getDefaultDate())
    }
  }, [open, defaultDate])

  const categoryColors = {
    meeting: "bg-blue-500",
    event: "bg-green-500",
    deadline: "bg-red-500",
  }

  // Generate time options (every 30 minutes from 6:00 AM to 11:30 PM)
  const timeOptions = (() => {
    const times: string[] = []
    
    // AM hours: 6:00 AM to 11:30 AM
    for (let hour = 6; hour <= 11; hour++) {
      times.push(`${hour}:00 AM`)
      times.push(`${hour}:30 AM`)
    }
    
    // PM hours: 12:00 PM to 11:30 PM
    times.push("12:00 PM")
    times.push("12:30 PM")
    for (let hour = 1; hour <= 11; hour++) {
      times.push(`${hour}:00 PM`)
      times.push(`${hour}:30 PM`)
    }
    
    // Add "All Day" option for deadlines
    times.push("All Day")
    return times
  })()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !date || !time) {
      alert("Please fill in all fields")
      return
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) {
      alert("Please enter a valid date")
      return
    }

    // Validate that the date is valid
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) {
      alert("Please enter a valid date")
      return
    }

    onAddActivity({
      date,
      title,
      time,
      category,
      color: categoryColors[category],
    })

    // Reset form
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    setTitle("")
    setDate(`${year}-${month}-${day}`)
    setTime("")
    setCategory("meeting")
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">New Activity</h2>
          <button onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Activity Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter activity title"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Time</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Select time</option>
                {timeOptions.map((timeOption) => (
                  <option key={timeOption} value={timeOption}>
                    {timeOption}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as "meeting" | "event" | "deadline")}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
            >
              <option value="meeting">Meeting</option>
              <option value="event">Event</option>
              <option value="deadline">Deadline</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Activity
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
