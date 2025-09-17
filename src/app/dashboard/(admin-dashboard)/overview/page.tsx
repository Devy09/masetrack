import { ChartAreaInteractive } from '@/components/sidebar/chart-area-interactive'
import { SectionCards } from '@/components/sidebar/section-cards'

export const dynamic = 'force-dynamic'

type OverviewResponse = {
  success: boolean
  metrics: {
    users: { total: number }
    submissions: {
      total: number
      pending: number
      byTitle: { enrollment: number; grades: number }
      bySemester: { first: number; second: number }
    }
  }
  recent: {
    users: Array<{ id: number; name: string | null; email: string; role: string; batch: string | null; image: string | null; status?: string; createdAt: string }>
    submissions: Array<{
      id: number
      title: string
      semester: string
      description: string | null
      status: string
      isActive: boolean
      createdAt: string
      updatedAt: string
      user: { id: number; name: string | null; email: string; role: string; batch: string | null; image: string | null }
      files: Array<{ id: number; fileName: string; fileUrl: string }>
    }>
  }
}

export default async function Page() {
  let data: OverviewResponse | null = null
  let errorMessage: string | null = null
  try {
    const res = await fetch('/api/admin-api/overview', { cache: 'no-store' })
    if (!res.ok) {
      errorMessage = `Failed to load overview (${res.status})`
    } else {
      data = (await res.json()) as OverviewResponse
    }
  } catch (err) {
    errorMessage = 'Failed to connect to overview API'
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards metrics={data?.metrics} />
        <div className="grid grid-cols-1 gap-6 m-6">
          <div className="bg-card rounded-lg border p-6 w-full">
            <ChartAreaInteractive />
          </div>
        </div>
      </div>
    </div>
  )
}
