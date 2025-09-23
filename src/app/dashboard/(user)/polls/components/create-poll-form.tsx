"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, X, Sparkles, Vote } from "lucide-react"
import { Poll } from "../types"

interface CreatePollFormProps {
  onCreatePoll: (poll: Omit<Poll, "id" | "createdAt">) => void
  onCancel: () => void
}

export default function CreatePollForm({ onCreatePoll, onCancel }: CreatePollFormProps) {
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [isActive, setIsActive] = useState(true)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!question.trim() || options.some(opt => !opt.trim())) {
      return
    }

    const poll: Omit<Poll, "id" | "createdAt"> = {
      question: question.trim(),
      options: options
        .filter(opt => opt.trim())
        .map((text, index) => ({
          id: `opt-${index}`,
          text: text.trim(),
          votes: 0,
        })),
      totalVotes: 0,
      isActive,
    }

    onCreatePoll(poll)
  }

  const isValid = question.trim() && options.filter(opt => opt.trim()).length >= 2

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button
        variant="outline"
        onClick={onCancel}
        className="bg-card hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:text-white transition-all duration-300 group border-primary/20"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-[-2px] transition-transform duration-300" />
        Back to Dashboard
      </Button>

      <Card className="bg-card shadow border-0">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-primary to-accent shadow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl lg:text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Create New Poll
          </CardTitle>
          <p className="text-muted-foreground">Design an engaging poll to gather opinions from your community</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Input */}
            <div className="space-y-2">
              <Label htmlFor="question" className="text-sm font-medium">
                Poll Question
              </Label>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What would you like to ask?"
                className="bg-card border-border/50 focus:border-primary transition-all duration-300"
                required
              />
            </div>

            {/* Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Poll Options</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  disabled={options.length >= 6}
                  className="bg-card hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:text-white transition-all duration-300 group border-primary/20"
                >
                  <Plus className="w-4 h-4 mr-1 group-hover:rotate-90 transition-transform duration-300" />
                  Add Option
                </Button>
              </div>
              
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex-1">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="bg-card border-border/50 focus:border-primary transition-all duration-300"
                        required
                      />
                    </div>
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(index)}
                        className="px-3 hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Status Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border/50">
              <div>
                <h3 className="font-medium">Poll Status</h3>
                <p className="text-sm text-muted-foreground">
                  {isActive ? "Poll will be active immediately" : "Poll will be created as draft"}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsActive(!isActive)}
                className={`transition-all duration-300 ${
                  isActive 
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow" 
                    : "bg-card border-border/50"
                }`}
              >
                {isActive ? "Active" : "Draft"}
              </Button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isValid}
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-accent text-white shadow hover:shadow-lg transition-all duration-300 transform hover:scale-105 group disabled:opacity-50 disabled:hover:scale-100"
            >
              <Vote className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Create Poll
              <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}