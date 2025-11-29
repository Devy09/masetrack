"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Plus, Trash2, AlertCircle, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface Deadline {
  id: string
  title: string
  description: string
  dueDate: string
  priority: "low" | "medium" | "high"
  status: "pending" | "completed"
  createdAt: string
}

export default function DeadlineReminder() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium" as "low" | "medium" | "high",
  })

  // Load deadlines from API on mount
  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const response = await fetch("/api/deadlines")
        if (!response.ok) {
          throw new Error("Failed to fetch deadlines")
        }
        const data = await response.json()
        setDeadlines(data)
      } catch (error) {
        console.error("Failed to load deadlines:", error)
        toast.error("Failed to load deadlines")
      }
    }
    fetchDeadlines()
  }, [])

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
    })
    setEditingDeadline(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.dueDate) {
      toast.error("Please fill in all required fields.")
      return
    }

    try {
      if (editingDeadline) {
        // Update existing deadline
        const response = await fetch(`/api/deadlines/${editingDeadline.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error("Failed to update deadline")
        }

        const updatedDeadline = await response.json()
        setDeadlines((prev) =>
          prev.map((deadline) => (deadline.id === editingDeadline.id ? updatedDeadline : deadline)),
        )
        toast.success("Deadline updated successfully!")
      } else {
        // Create new deadline
        const response = await fetch("/api/deadlines", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error("Failed to create deadline")
        }

        const newDeadline = await response.json()
        setDeadlines((prev) => [...prev, newDeadline])
        toast.success("Deadline created successfully!")
      }

      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving deadline:", error)
      toast.error("Failed to save deadline. Please try again.")
    }
  }

  const handleEdit = (deadline: Deadline) => {
    setEditingDeadline(deadline)
    setFormData({
      title: deadline.title,
      description: deadline.description,
      dueDate: deadline.dueDate,
      priority: deadline.priority,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/deadlines/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete deadline")
      }

      setDeadlines((prev) => prev.filter((deadline) => deadline.id !== id))
      toast.success("Deadline removed successfully.")
    } catch (error) {
      console.error("Error deleting deadline:", error)
      toast.error("Failed to delete deadline. Please try again.")
    }
  }

  const toggleStatus = async (id: string) => {
    try {
      const deadline = deadlines.find((d) => d.id === id)
      if (!deadline) return

      const newStatus = deadline.status === "pending" ? "completed" : "pending"

      const response = await fetch(`/api/deadlines/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update deadline status")
      }

      const updatedDeadline = await response.json()
      setDeadlines((prev) =>
        prev.map((d) => (d.id === id ? updatedDeadline : d)),
      )
      toast.success(`Deadline marked as ${newStatus}!`)
    } catch (error) {
      console.error("Error updating deadline status:", error)
      toast.error("Failed to update deadline status. Please try again.")
    }
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "completed"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
  }

  const sortedDeadlines = [...deadlines].sort((a, b) => {
    // Completed items go to bottom
    if (a.status !== b.status) {
      return a.status === "completed" ? 1 : -1
    }
    // Sort by due date
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Deadline Reminders</h1>
          <p className="text-muted-foreground mt-1">
            Stay on top of your important deadlines and never miss a due date.
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
              resetForm()
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white"
              onClick={() => setEditingDeadline(null)}
            >
              <Plus className="h-4 w-4" />
              Schedule Deadline
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingDeadline ? "Edit Deadline" : "Schedule Deadline"}</DialogTitle>
              <DialogDescription>
                {editingDeadline
                  ? "Update the details of your existing deadline."
                  : "Add a new deadline to stay on track."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Submit enrollment documents"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Add any extra details that will help you remember."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due date & time</Label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: "low" | "medium" | "high") =>
                    setFormData((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="flex justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setIsDialogOpen(false)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white">
                  {editingDeadline ? "Update Deadline" : "Create Deadline"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg">
        <Card className="bg-gradient-to-tr from-teal-100 to-teal-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deadlines</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deadlines.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-tr from-teal-100 to-teal-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deadlines.filter((d) => d.status === "pending").length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-tr from-teal-100 to-teal-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deadlines.filter((d) => d.status === "completed").length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-tr from-teal-100 to-teal-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deadlines.filter((d) => d.status === "pending" && getDaysUntilDue(d.dueDate) < 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deadlines List */}
      <div className="space-y-4">
        {sortedDeadlines.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No deadlines yet</h3>
            </CardContent>
          </Card>
        ) : (
          sortedDeadlines.map((deadline) => {
            const daysUntil = getDaysUntilDue(deadline.dueDate)
            const isOverdue = daysUntil < 0 && deadline.status === "pending"
            const isDueSoon = daysUntil <= 3 && daysUntil >= 0 && deadline.status === "pending"

            return (
              <Card
                key={deadline.id}
                className={`transition-all hover:shadow-md ${
                  isOverdue
                    ? "border-red-200 dark:border-red-800"
                    : isDueSoon
                      ? "border-yellow-200 dark:border-yellow-800"
                      : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle
                          className={`text-lg ${
                            deadline.status === "completed" ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {deadline.title}
                        </CardTitle>
                        <Badge className={getPriorityColor(deadline.priority)}>{deadline.priority}</Badge>
                        <Badge className={getStatusColor(deadline.status)}>{deadline.status}</Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(deadline.dueDate).toLocaleDateString()} at{" "}
                          {new Date(deadline.dueDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>

                        <div
                          className={`flex items-center gap-1 ${
                            isOverdue
                              ? "text-red-600 dark:text-red-400"
                              : isDueSoon
                                ? "text-yellow-600 dark:text-yellow-400"
                                : ""
                          }`}
                        >
                          <Clock className="h-4 w-4" />
                          {isOverdue
                            ? `${Math.abs(daysUntil)} days overdue`
                            : daysUntil === 0
                              ? "Due today"
                              : daysUntil === 1
                                ? "Due tomorrow"
                                : `${daysUntil} days remaining`}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => toggleStatus(deadline.id)}>
                        {deadline.status === "pending" ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Mark Complete
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 mr-1" />
                            Mark Pending
                          </>
                        )}
                      </Button>

                      <Button variant="outline" size="sm" onClick={() => handleEdit(deadline)}>
                        Edit
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(deadline.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {deadline.description && (
                  <CardContent>
                    <CardDescription className="text-sm">{deadline.description}</CardDescription>
                  </CardContent>
                )}
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
