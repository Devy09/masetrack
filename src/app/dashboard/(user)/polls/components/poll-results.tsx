"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, BarChart3, Users, Trophy, TrendingUp } from "lucide-react"
import { Poll } from "../types"

interface PollResultsProps {
  poll: Poll
  onBack: () => void
}

export default function PollResults({ poll, onBack }: PollResultsProps) {
  const sortedOptions = [...poll.options].sort((a, b) => b.votes - a.votes)
  const winnerOption = sortedOptions[0]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
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
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl lg:text-3xl bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">
            Poll Results
          </CardTitle>
          <p className="text-xl text-muted-foreground">{poll.question}</p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{poll.totalVotes} total votes</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>Created {poll.createdAt.toLocaleDateString()}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Winner Card */}
          {winnerOption && (
            <Card className="bg-gradient-to-r from-primary to-accent shadow border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-white">
                  <Trophy className="w-6 h-6 animate-bounce" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">Winner</h3>
                    <p className="text-lg">{winnerOption.text}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{winnerOption.votes}</div>
                    <div className="text-sm opacity-90">
                      {Math.round((winnerOption.votes / poll.totalVotes) * 100)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Detailed Results
            </h3>
            
            <div className="space-y-4">
              {sortedOptions.map((option, index) => {
                const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0
                const isWinner = option.id === winnerOption?.id
                
                return (
                  <Card 
                    key={option.id} 
                    className={`bg-card border-0 transition-all duration-300 ${
                      isWinner ? "shadow" : "shadow hover:shadow-lg"
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              isWinner 
                                ? "bg-gradient-to-r from-primary to-accent text-white shadow" 
                                : "bg-muted text-muted-foreground"
                            }`}>
                              {index + 1}
                            </div>
                            <span className="font-medium text-lg">{option.text}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                              {option.votes}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {percentage.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Progress 
                            value={percentage} 
                            className="h-3 bg-muted/50"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>0</span>
                            <span>{poll.totalVotes}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}