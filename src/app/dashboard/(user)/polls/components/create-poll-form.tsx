"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Plus, X } from "lucide-react"
import type { Poll } from "./poll-dashboard"

interface CreatePollFormProps {
  onCreatePoll: (poll: Omit<Poll, "id" | "createdAt">) => void
  onCancel: () => void
}

export function CreatePollForm({ onCreatePoll, onCancel }: CreatePollFormProps) {
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [isActive, setIsActive] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""])
    }
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!question.trim() || options.some((opt) => !opt.trim())) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newPoll: Omit<Poll, "id" | "createdAt"> = {
      question: question.trim(),
      options: options.map((text, index) => ({
        id: `opt_${index}`,
        text: text.trim(),
        votes: 0,
      })),
      totalVotes: 0,
      isActive,
    }

    onCreatePoll(newPoll)
    setIsSubmitting(false)
  }

  const isValid = question.trim() && options.every((opt) => opt.trim()) && options.length >= 2

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Poll</CardTitle>
          <CardDescription>Create an engaging poll to gather opinions from your audience</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="question">Poll Question</Label>
              <Textarea
                id="question"
                placeholder="What would you like to ask?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[80px] resize-none"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">{question.length}/200 characters</p>
            </div>

            <div className="space-y-4">
              <Label>Poll Options</Label>
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      maxLength={100}
                    />
                  </div>
                  {options.length > 2 && (
                    <Button type="button" variant="outline" size="icon" onClick={() => removeOption(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}

              {options.length < 6 && (
                <Button type="button" variant="outline" onClick={addOption} className="w-full bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="active-toggle">Poll Status</Label>
                <p className="text-sm text-muted-foreground">
                  {isActive ? "Poll will be active immediately" : "Poll will be created as draft"}
                </p>
              </div>
              <Switch id="active-toggle" checked={isActive} onCheckedChange={setIsActive} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto bg-transparent">
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid || isSubmitting} className="w-full sm:flex-1">
                {isSubmitting ? "Creating..." : "Create Poll"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
