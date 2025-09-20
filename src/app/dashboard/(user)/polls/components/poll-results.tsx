"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Trophy, Users } from "lucide-react"
import type { Poll } from "./poll-dashboard"

interface PollResultsProps {
  poll: Poll
  onBack: () => void
}

export function PollResults({ poll, onBack }: PollResultsProps) {
  const sortedOptions = [...poll.options].sort((a, b) => b.votes - a.votes)
  const winningOption = sortedOptions[0]

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
          <CardDescription className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {poll.totalVotes} total votes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {sortedOptions.map((option, index) => {
              const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0
              const isWinner = option.id === winningOption.id && poll.totalVotes > 0

              return (
                <div key={option.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{option.text}</span>
                      {isWinner && <Trophy className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{option.votes} votes</span>
                      <span>({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-3" />
                </div>
              )
            })}
          </div>

          {poll.totalVotes > 0 && (
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Leading Option</p>
                    <p className="text-sm text-muted-foreground">
                      "{winningOption.text}" with {winningOption.votes} votes (
                      {((winningOption.votes / poll.totalVotes) * 100).toFixed(1)}%)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {poll.totalVotes === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No votes yet. Be the first to vote!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
