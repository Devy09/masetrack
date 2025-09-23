"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import PollVoting from "./components/poll-voting"
import PollResults from "./components/poll-results"
import CreatePollForm from "./components/create-poll-form"
import { Plus, BarChart3, Vote, Users, TrendingUp, Sparkles, Loader2 } from "lucide-react"
import { Poll } from "./types"
import { fetchPolls, createPoll, voteOnPoll, getUserVote, type Poll as ApiPoll } from "@/lib/polls-api"
import { toast } from "sonner"
import Loading from "@/app/loading"

export default function DashboardPage() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null)
  const [view, setView] = useState<"dashboard" | "vote" | "results" | "create">("dashboard")
  const [userVotes, setUserVotes] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load polls on component mount
  useEffect(() => {
    loadPolls()
  }, [])

  const loadPolls = async () => {
    try {
      setLoading(true)
      const apiPolls = await fetchPolls()
      
      // Transform API polls to match frontend interface
      const transformedPolls: Poll[] = apiPolls.map(apiPoll => ({
        id: apiPoll.id,
        question: apiPoll.question,
        description: apiPoll.description,
        options: apiPoll.options,
        totalVotes: apiPoll.totalVotes,
        isActive: apiPoll.isActive,
        createdAt: new Date(apiPoll.createdAt),
        createdBy: apiPoll.createdBy
      }))
      
      setPolls(transformedPolls)
      
      // Load user votes for each poll
      const votes: Record<string, string> = {}
      for (const poll of apiPolls) {
        try {
          const userVote = await getUserVote(poll.id)
          if (userVote.hasVoted && userVote.optionId) {
            votes[poll.id] = userVote.optionId
          }
        } catch (error) {
          console.error(`Failed to load vote for poll ${poll.id}:`, error)
        }
      }
      setUserVotes(votes)
      
    } catch (error) {
      console.error("Failed to load polls:", error)
      setError("Failed to load polls")
      toast.error("Failed to load polls")
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (pollId: string, optionId: string) => {
    try {
      const result = await voteOnPoll(pollId, { optionId })
      
      // Update local state
      setUserVotes((prev) => ({ ...prev, [pollId]: optionId }))
      setPolls((prev) =>
        prev.map((poll) => {
          if (poll.id === pollId) {
            return {
              ...poll,
              options: result.poll.options,
              totalVotes: result.poll.totalVotes,
            }
          }
          return poll
        }),
      )
      
      toast.success("Vote recorded successfully!")
    } catch (error) {
      console.error("Failed to vote:", error)
      toast.error(error instanceof Error ? error.message : "Failed to vote")
    }
  }

  const handleCreatePoll = async (newPoll: Omit<Poll, "id" | "createdAt">) => {
    try {
      const createdPoll = await createPoll({
        question: newPoll.question,
        description: newPoll.description,
        options: newPoll.options.map(option => option.text)
      })
      
      // Transform and add to local state
      const transformedPoll: Poll = {
        id: createdPoll.id,
        question: createdPoll.question,
        description: createdPoll.description,
        options: createdPoll.options,
        totalVotes: createdPoll.totalVotes,
        isActive: createdPoll.isActive,
        createdAt: new Date(createdPoll.createdAt),
        createdBy: createdPoll.createdBy
      }
      
      setPolls((prev) => [transformedPoll, ...prev])
      setView("dashboard")
      toast.success("Poll created successfully!")
    } catch (error) {
      console.error("Failed to create poll:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create poll")
    }
  }

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-card p-8 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-primary to-accent shadow-xl">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Poll Dashboard
                </h1>
                <p className="text-lg text-muted-foreground">Create and manage interactive polls with real-time analytics</p>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => setView("create")} 
            size="lg"
            className="bg-gradient-to-r from-primary to-accent text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
          >
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Create New Poll
            <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card shadow hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Polls</CardTitle>
            <div className="p-2 rounded-lg bg-accent/20">
              <BarChart3 className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              {polls.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Active community
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card shadow hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Polls</CardTitle>
            <div className="p-2 rounded-lg bg-accent/20">
              <Vote className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              {polls.filter((p) => p.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Vote className="w-3 h-3" />
              Ready for votes
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card shadow hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Votes</CardTitle>
            <div className="p-2 rounded-lg bg-secondary/20">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {polls.reduce((sum, poll) => sum + poll.totalVotes, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Engagement strong
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Polls Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Recent Polls
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent"></div>
        </div>
        
        <div className="grid gap-6">
          {polls.map((poll, index) => (
            <Card 
              key={poll.id} 
              className="bg-card shadow hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border-1 group overflow-hidden relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-pulse"></div>
              </div>
              
              <CardHeader className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-balance group-hover:text-primary transition-colors duration-300">
                      {poll.question}
                    </CardTitle>
                    <CardDescription className="mt-2 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {poll.totalVotes} votes
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 className="w-4 h-4" />
                        {poll.options.length} options
                      </span>
                      <span>Created {poll.createdAt.toLocaleDateString()}</span>
                    </CardDescription>
                    {poll.createdBy && (
                      <div className="mt-3 flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={poll.createdBy.image} alt={poll.createdBy.name} />
                          <AvatarFallback className="text-xs">
                            {poll.createdBy.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                          by {poll.createdBy.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={poll.isActive ? "default" : "secondary"}
                      className={poll.isActive ? "bg-gradient-to-r from-primary to-accent text-white shadow-md" : ""}
                    >
                      {poll.isActive ? "Active" : "Closed"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPoll(poll)
                      setView("vote")
                    }}
                    disabled={!!userVotes[poll.id]}
                    className="flex-1 sm:flex-none bg-card hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:text-white transition-all duration-300 group border-primary/20"
                  >
                    <Vote className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                    {userVotes[poll.id] ? "Voted" : "Cast Vote"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPoll(poll)
                      setView("results")
                    }}
                    className="flex-1 sm:flex-none bg-card hover:bg-accent hover:text-white transition-all duration-300 group border-accent/20"
                  >
                    <BarChart3 className="w-4 h-4 mr-2 group-hover:animate-pulse" />
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

  // Loading state
  if (loading) {
    return <Loading />
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={loadPolls} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {view === "dashboard" && renderDashboard()}
        {view === "vote" && selectedPoll && (
          <div>
            <PollVoting
              poll={selectedPoll}
              onVote={handleVote}
              onBack={() => setView("dashboard")}
              hasVoted={!!userVotes[selectedPoll.id]}
              userVote={userVotes[selectedPoll.id]}
            />
          </div>
        )}
        {view === "results" && selectedPoll && (
          <div>
            <PollResults poll={selectedPoll} onBack={() => setView("dashboard")} />
          </div>
        )}
        {view === "create" && (
          <div>
            <CreatePollForm onCreatePoll={handleCreatePoll} onCancel={() => setView("dashboard")} />
          </div>
        )}
      </div>
    </div>
  )
}