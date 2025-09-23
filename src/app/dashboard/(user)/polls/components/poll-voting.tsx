"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Vote, Users, CheckCircle } from "lucide-react"
import { Poll } from "../types"

interface PollVotingProps {
  poll: Poll
  onVote: (pollId: string, optionId: string) => void
  onBack: () => void
  hasVoted: boolean
  userVote?: string
}

export default function PollVoting({ poll, onVote, onBack, hasVoted, userVote }: PollVotingProps) {
  const [selectedOption, setSelectedOption] = useState<string>("")

  const handleSubmitVote = () => {
    if (selectedOption) {
      onVote(poll.id, selectedOption)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button
        variant="outline"
        onClick={onBack}
        className="bg-card hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:text-white transition-all duration-300 group border-primary/20"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-[-2px] transition-transform duration-300" />
        Back to Dashboard
      </Button>

      <Card className="bg-card shadow border-0">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-primary to-accent shadow">
              <Vote className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl lg:text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {poll.question}
          </CardTitle>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{poll.totalVotes} people have voted</span>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {hasVoted ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-primary p-4 rounded-lg bg-primary/10 border border-primary/20">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Thank you for voting!</span>
              </div>
              
              <div className="space-y-3">
                {poll.options.map((option) => (
                  <div
                    key={option.id}
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      userVote === option.id
                        ? "bg-gradient-to-r from-primary to-accent text-white shadow"
                        : "bg-card border-border/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.text}</span>
                      {userVote === option.id && (
                        <CheckCircle className="w-5 h-5 animate-pulse" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                <div className="space-y-3">
                  {poll.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-3">
                      <RadioGroupItem
                        value={option.id}
                        id={option.id}
                        className="border-primary/50 text-primary"
                      />
                      <Label
                        htmlFor={option.id}
                        className="flex-1 p-4 rounded-lg bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow"
                      >
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              <Button
                onClick={handleSubmitVote}
                disabled={!selectedOption}
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-accent text-white shadow hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
              >
                <Vote className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Submit Vote
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}