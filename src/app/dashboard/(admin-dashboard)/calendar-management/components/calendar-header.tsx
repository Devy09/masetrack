"use client"

import { Calendar } from "lucide-react"

export function CalendarHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary p-2">
            <Calendar className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Activities Calendar</h1>
            <p className="text-sm text-muted-foreground">Manage and view all your upcoming events</p>
          </div>
        </div>
      </div>
    </header>
  )
}
