"use client"

import { Calendar } from "lucide-react"
import { BackgroundSettings, type BackgroundSettings as BackgroundSettingsType } from "./background-settings"

interface CalendarHeaderProps {
  background: BackgroundSettingsType
  onBackgroundChange: (background: BackgroundSettingsType) => void
}

export function CalendarHeader({ background, onBackgroundChange }: CalendarHeaderProps) {
  return (
    <header className="border-b border-white/20 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary p-2">
              <Calendar className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Activities Calendar</h1>
              <p className="text-sm text-muted-foreground">Manage and view all your upcoming events</p>
            </div>
          </div>
          <BackgroundSettings background={background} onBackgroundChange={onBackgroundChange} />
        </div>
      </div>
    </header>
  )
}
