export interface Poll {
    id: string
    question: string
    description?: string
    options: Array<{
      id: string
      text: string
      votes: number
    }>
    totalVotes: number
    isActive: boolean
    createdAt: Date
    createdBy?: {
      id: string
      name: string
      image: string
    }
  }