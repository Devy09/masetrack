"use client"

import { useState } from "react"
import { Clock, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Activity {
  id: number
  date: string // Format: YYYY-MM-DD
  title: string
  time: string
  category: "meeting" | "deadline" | "event"
  color: string
}

interface ActivityCardProps {
  activity: Activity
  onDelete: (activityId: number) => void
}

export function ActivityCard({ activity, onDelete }: ActivityCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const categoryLabels = {
    meeting: "Meeting",
    deadline: "Deadline",
    event: "Event",
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(activity.id)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting activity:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card className="p-4 hover:shadow-lg transition-all backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-foreground">{activity.title}</h4>
              <Badge variant="secondary" className="text-xs">
                {categoryLabels[activity.category]}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{activity.time}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`${activity.color} h-3 w-3 rounded-full`} />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Activity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{activity.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
