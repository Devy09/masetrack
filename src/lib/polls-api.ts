// API utility functions for polls

export interface Poll {
  id: string
  question: string
  description?: string
  isActive: boolean
  createdAt: Date
  createdBy?: {
    id: string
    name: string
    image: string
  }
  totalVotes: number
  options: Array<{
    id: string
    text: string
    votes: number
  }>
}

export interface CreatePollData {
  question: string
  description?: string
  options: string[]
}

export interface VoteData {
  optionId: string
}

// Fetch all polls
export async function fetchPolls(): Promise<Poll[]> {
  const response = await fetch('/api/polls')
  if (!response.ok) {
    throw new Error('Failed to fetch polls')
  }
  return response.json()
}

// Fetch a specific poll
export async function fetchPoll(id: string): Promise<Poll> {
  const response = await fetch(`/api/polls/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch poll')
  }
  return response.json()
}

// Create a new poll
export async function createPoll(data: CreatePollData): Promise<Poll> {
  const response = await fetch('/api/polls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create poll')
  }
  
  return response.json()
}

// Vote on a poll
export async function voteOnPoll(pollId: string, data: VoteData): Promise<{
  message: string
  poll: Poll
  userVote: {
    optionId: string
    optionText: string
  }
}> {
  const response = await fetch(`/api/polls/${pollId}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to vote')
  }
  
  return response.json()
}

// Check if user has voted on a poll
export async function getUserVote(pollId: string): Promise<{
  hasVoted: boolean
  optionId?: string
  optionText?: string
  votedAt?: Date
}> {
  const response = await fetch(`/api/polls/${pollId}/vote`)
  if (!response.ok) {
    throw new Error('Failed to fetch user vote')
  }
  return response.json()
}

// Update a poll
export async function updatePoll(pollId: string, data: Partial<CreatePollData & { isActive: boolean }>): Promise<Poll> {
  const response = await fetch(`/api/polls/${pollId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update poll')
  }
  
  return response.json()
}

// Delete a poll
export async function deletePoll(pollId: string): Promise<void> {
  const response = await fetch(`/api/polls/${pollId}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete poll')
  }
}

