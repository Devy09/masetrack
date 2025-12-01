"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar as CalendarIcon } from "lucide-react"
import type { Activity } from "../page"

interface ActivityDetailsDialogProps {
  activity: Activity | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const categoryLabels = {
  meeting: "Meeting",
  deadline: "Deadline",
  event: "Event",
}

export function ActivityDetailsDialog({ activity, open, onOpenChange }: ActivityDetailsDialogProps) {
  if (!activity) return null

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`${activity.color} h-4 w-4 rounded-full`} />
            {activity.title}
          </DialogTitle>
          <DialogDescription>Activity Details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{categoryLabels[activity.category]}</Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium text-foreground">{formatDate(activity.date)}</span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Time:</span>
              <span className="font-medium text-foreground">{activity.time}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

