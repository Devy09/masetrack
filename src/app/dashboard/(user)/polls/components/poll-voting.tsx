"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check } from "lucide-react"
import type { Poll } from "./poll-dashboard"

interface PollVotingProps {
  poll: Poll
  onVote: (pollId: string, optionId: string) => void
  onBack: () => void
  hasVoted: boolean
  userVote?: string
}

export function PollVoting({ poll, onVote, onBack, hasVoted, userVote }: PollVotingProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitVote = async () => {
    if (!selectedOption) return

    setIsSubmitting(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    onVote(poll.id, selectedOption)
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <Badge variant={poll.isActive ? "default" : "secondary"}>{poll.isActive ? "Active Poll" : "Closed Poll"}</Badge>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-balance">{poll.question}</CardTitle>
          <CardDescription>{poll.totalVotes} votes • Select one option below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasVoted ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Check className="w-5 h-5" />
                <span className="font-medium">Thank you for voting!</span>
              </div>
              {poll.options.map((option) => (
                <div
                  key={option.id}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    option.id === userVote ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.text}</span>
                    {option.id === userVote && <Badge variant="default">Your Vote</Badge>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {poll.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-colors hover:border-primary/50 ${
                    selectedOption === option.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:bg-accent/5"
                  }`}
                  disabled={!poll.isActive}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.text}</span>
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        selectedOption === option.id ? "border-primary bg-primary" : "border-muted-foreground"
                      }`}
                    >
                      {selectedOption === option.id && (
                        <div className="w-full h-full rounded-full bg-primary-foreground scale-50" />
                      )}
                    </div>
                  </div>
                </button>
              ))}

              <div className="pt-4">
                <Button
                  onClick={handleSubmitVote}
                  disabled={!selectedOption || isSubmitting || !poll.isActive}
                  className="w-full"
                >
                  {isSubmitting ? "Submitting..." : "Submit Vote"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
