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

  // Load deadlines from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("deadlines")
      if (saved) {
        setDeadlines(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Failed to load deadlines from localStorage:", error)
    }
  }, [])

  // Save deadlines to localStorage whenever deadlines change
  useEffect(() => {
    try {
      localStorage.setItem("deadlines", JSON.stringify(deadlines))
    } catch (error) {
      console.error("Failed to save deadlines to localStorage:", error)
    }
  }, [deadlines])

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
    })
    setEditingDeadline(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.dueDate) {
      toast.error("Please fill in all required fields.")
      return
    }

    if (editingDeadline) {
      // Update existing deadline
      setDeadlines((prev) =>
        prev.map((deadline) => (deadline.id === editingDeadline.id ? { ...deadline, ...formData } : deadline)),
      )
      toast.success("Deadline updated successfully!")
    } else {
      // Create new deadline
      const newDeadline: Deadline = {
        id: Date.now().toString(),
        ...formData,
        status: "pending",
        createdAt: new Date().toISOString(),
      }
      setDeadlines((prev) => [...prev, newDeadline])
      toast.success("Deadline created successfully!")
    }

    resetForm()
    setIsDialogOpen(false)
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

  const handleDelete = (id: string) => {
    setDeadlines((prev) => prev.filter((deadline) => deadline.id !== id))
    toast.success("Deadline removed successfully.")
  }

  const toggleStatus = (id: string) => {
    setDeadlines((prev) =>
      prev.map((deadline) => {
        if (deadline.id === id) {
          const newStatus = deadline.status === "pending" ? "completed" : "pending"
          toast.success(`Deadline marked as ${newStatus}!`)
          return { ...deadline, status: newStatus }
        }
        return deadline
      }),
    )
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Deadline
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingDeadline ? "Edit Deadline" : "Create New Deadline"}</DialogTitle>
              <DialogDescription>
                {editingDeadline
                  ? "Update your deadline details below."
                  : "Add a new deadline to keep track of important due dates."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter deadline title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Add any additional details..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingDeadline ? "Update" : "Create"} Deadline</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deadlines</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deadlines.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deadlines.filter((d) => d.status === "pending").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deadlines.filter((d) => d.status === "completed").length}</div>
          </CardContent>
        </Card>

        <Card>
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
              <p className="text-muted-foreground text-center mb-4">
                Create your first deadline to start tracking important due dates.
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Deadline
              </Button>
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
