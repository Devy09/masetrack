"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PollVoting } from "./poll-voting"
import { PollResults } from "./poll-results"
import { CreatePollForm } from "./create-poll-form"
import { Plus, BarChart3, Vote, Users } from "lucide-react"

export interface Poll {
  id: string
  question: string
  options: Array<{
    id: string
    text: string
    votes: number
  }>
  totalVotes: number
  isActive: boolean
  createdAt: Date
}

const samplePolls: Poll[] = [
  {
    id: "1",
    question: "What's your favorite programming language?",
    options: [
      { id: "1a", text: "JavaScript", votes: 45 },
      { id: "1b", text: "Python", votes: 32 },
      { id: "1c", text: "TypeScript", votes: 28 },
      { id: "1d", text: "Go", votes: 15 },
    ],
    totalVotes: 120,
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    question: "Which framework do you prefer for React development?",
    options: [
      { id: "2a", text: "Next.js", votes: 67 },
      { id: "2b", text: "Vite", votes: 23 },
      { id: "2c", text: "Create React App", votes: 12 },
      { id: "2d", text: "Remix", votes: 8 },
    ],
    totalVotes: 110,
    isActive: true,
    createdAt: new Date("2024-01-10"),
  },
]

export function PollDashboard() {
  const [polls, setPolls] = useState<Poll[]>(samplePolls)
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null)
  const [view, setView] = useState<"dashboard" | "vote" | "results" | "create">("dashboard")
  const [userVotes, setUserVotes] = useState<Record<string, string>>({})

  const handleVote = (pollId: string, optionId: string) => {
    setUserVotes((prev) => ({ ...prev, [pollId]: optionId }))
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id === pollId) {
          return {
            ...poll,
            options: poll.options.map((option) => ({
              ...option,
              votes: option.id === optionId ? option.votes + 1 : option.votes,
            })),
            totalVotes: poll.totalVotes + 1,
          }
        }
        return poll
      }),
    )
  }

  const handleCreatePoll = (newPoll: Omit<Poll, "id" | "createdAt">) => {
    const poll: Poll = {
      ...newPoll,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setPolls((prev) => [poll, ...prev])
    setView("dashboard")
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">Poll Dashboard</h1>
          <p className="text-muted-foreground">Create and manage your polls</p>
        </div>
        <Button onClick={() => setView("create")} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Create Poll
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Polls</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{polls.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Polls</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{polls.filter((p) => p.isActive).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{polls.reduce((sum, poll) => sum + poll.totalVotes, 0)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Polls</h2>
        <div className="grid gap-4">
          {polls.map((poll) => (
            <Card key={poll.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-balance">{poll.question}</CardTitle>
                    <CardDescription>
                      {poll.totalVotes} votes • Created {poll.createdAt.toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={poll.isActive ? "default" : "secondary"}>
                      {poll.isActive ? "Active" : "Closed"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPoll(poll)
                      setView("vote")
                    }}
                    disabled={!!userVotes[poll.id]}
                    className="w-full sm:w-auto"
                  >
                    {userVotes[poll.id] ? "Voted" : "Vote"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPoll(poll)
                      setView("results")
                    }}
                    className="w-full sm:w-auto"
                  >
                    View Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {view === "dashboard" && renderDashboard()}
      {view === "vote" && selectedPoll && (
        <PollVoting
          poll={selectedPoll}
          onVote={handleVote}
          onBack={() => setView("dashboard")}
          hasVoted={!!userVotes[selectedPoll.id]}
          userVote={userVotes[selectedPoll.id]}
        />
      )}
      {view === "results" && selectedPoll && <PollResults poll={selectedPoll} onBack={() => setView("dashboard")} />}
      {view === "create" && <CreatePollForm onCreatePoll={handleCreatePoll} onCancel={() => setView("dashboard")} />}
    </div>
  )
}
