"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ArrowUpRight, ClipboardCheck, Download, Filter, FileText, Users, type LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type AnalyticsResponse = {
  granteeCount: number
  certificateCounts: {
    total: number
    pending: number
    approved: number
    rejected: number
  }
  monthlySubmissions: Array<{ month: string; submitted: number }>
  programSummaries: Array<{
    program: string
    grantees: number
    completion: number
    pending: number
  }>
  insights: Array<{ title: string; detail: string }>
}

type MetricCard = {
  label: string
  value: string
  change: string
  positive: boolean
  icon: LucideIcon
}

const certificateChartConfig = {
  submitted: {
    label: "Certificates submitted",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const granteeChartConfig = {
  grantees: {
    label: "Assigned grantees",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const DEFAULT_INSIGHTS = [
  {
    title: "Review your pending files",
    detail: "Follow up with scholars so certificates move to approval faster.",
  },
  {
    title: "Share timelines early",
    detail: "Remind everyone about cut-off dates for next month’s submissions.",
  },
  {
    title: "Celebrate approvals",
    detail: "Highlight cleared certificates to keep your cohort motivated.",
  },
] as const

const EMPTY_COUNTS = { total: 0, pending: 0, approved: 0, rejected: 0 } as const

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAnalytics = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/admin-api/analytics", {
        cache: "no-store",
        signal,
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        throw new Error(errorBody.error || "Failed to load analytics data")
      }

      const data: AnalyticsResponse = await response.json()
      setAnalytics(data)
    } catch (err) {
      if ((err as Error).name === "AbortError") return
      console.error("Analytics fetch failed:", err)
      setError(err instanceof Error ? err.message : "Failed to load analytics data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    loadAnalytics(controller.signal)
    return () => controller.abort()
  }, [loadAnalytics])

  const fallbackChartData = useMemo(() => generatePlaceholderMonths(), [])
  const chartData = analytics?.monthlySubmissions ?? fallbackChartData
  const certificateCounts = analytics?.certificateCounts ?? EMPTY_COUNTS
  const programData = analytics?.programSummaries ?? []
  const insights = analytics?.insights ?? DEFAULT_INSIGHTS

  const metricCards = useMemo<MetricCard[]>(() => {
    return [
      {
        label: "Assigned grantees",
        value: analytics ? analytics.granteeCount.toString() : "—",
        change: analytics
          ? `${analytics.granteeCount === 1 ? "grantee" : "grantees"} currently on your roster`
          : "Syncing assignments",
        positive: true,
        icon: Users,
      },
      {
        label: "Pending certificates",
        value: analytics ? certificateCounts.pending.toString() : "—",
        change: analytics ? "Waiting for your review" : "Checking pipeline",
        positive: certificateCounts.pending === 0,
        icon: Filter,
      },
      {
        label: "Approved certificates",
        value: analytics ? certificateCounts.approved.toString() : "—",
        change: analytics ? "Cleared for release" : "Processing approvals",
        positive: true,
        icon: ClipboardCheck,
      },
      {
        label: "Total certificates",
        value: analytics ? certificateCounts.total.toString() : "—",
        change: analytics ? "Across all statuses" : "Aggregating activity",
        positive: true,
        icon: FileText,
      },
    ]
  }, [analytics, certificateCounts])

  const pipelineItems = useMemo(() => {
    const total = certificateCounts.total || 1
    return [
      {
        label: "Pending review",
        value: certificateCounts.pending,
        status: "Awaiting validation",
      },
      {
        label: "Approved",
        value: certificateCounts.approved,
        status: "Cleared for payout",
      },
      {
        label: "Rejected",
        value: certificateCounts.rejected,
        status: "Needs resubmission",
      },
    ].map((item) => ({
      ...item,
      percent: certificateCounts.total ? Math.round((item.value / total) * 100) : 0,
    }))
  }, [certificateCounts])

  return (
    <div className="space-y-8 p-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-500">My dashboard</p>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Keep track of your assigned grantees, certificate pipeline, and the actions that need your attention today.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select defaultValue="last-30">
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="last-7">Last 7 days</SelectItem>
              <SelectItem value="last-30">Last 30 days</SelectItem>
              <SelectItem value="last-quarter">Last quarter</SelectItem>
              <SelectItem value="year-to-date">Year to date</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
          </div>
        </div>
      </section>

      {error && (
        <Card className="border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">Unable to load analytics</p>
              <p className="text-sm">{error}</p>
            </div>
            <Button variant="outline" onClick={() => loadAnalytics()} disabled={loading}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric) => (
          <Card
            key={metric.label}
            className="border border-neutral-200/70 shadow-sm dark:border-neutral-800"
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {metric.label}
                </p>
                {loading ? (
                  <Skeleton className="mt-1 h-8 w-20" />
                ) : (
                  <CardTitle className="text-3xl font-bold">{metric.value}</CardTitle>
                )}
              </div>
              <div className="rounded-lg bg-teal-500/10 p-2 text-teal-600">
                <metric.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {loading ? (
                <Skeleton className="h-4 w-28" />
              ) : (
                <span
                  className={`mr-2 inline-flex items-center font-semibold ${
                    metric.positive ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {metric.change}
                  <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                </span>
              )}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Certificate submissions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Monthly submissions from your assigned grantees.
              </p>
            </div>
            <Badge variant="secondary" className="w-fit">
              {loading ? "Syncing…" : "Live data"}
            </Badge>
          </CardHeader>
          <CardContent>
            {chartData.every((item) => item.submitted === 0) && !loading ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                No certificate submissions recorded for this period.
              </div>
            ) : (
              <ChartContainer config={certificateChartConfig} className="h-72 w-full bg-teal-500/10 p-2 rounded-lg">
                <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Area
                    type="monotone"
                    dataKey="submitted"
                    stroke="var(--color-submitted)"
                    fill="var(--color-submitted)"
                    fillOpacity={0.3}
                    strokeWidth={3}
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certificate pipeline</CardTitle>
            <p className="text-sm text-muted-foreground">Status of all files assigned to you.</p>
          </CardHeader>
          <CardContent className="space-y-5">
            {pipelineItems.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <p className="font-medium text-foreground">{item.label}</p>
                  <span className="text-muted-foreground">{loading ? "…" : item.value}</span>
                </div>
                <Progress value={item.percent} className="h-2" />
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {item.status}
                </p>
              </div>
            ))}
            {!loading && certificateCounts.total === 0 && (
              <p className="text-xs text-muted-foreground">
                No certificates submitted yet. Encourage your grantees to upload their files.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Program health</CardTitle>
            <p className="text-sm text-muted-foreground">
              Track how each batch is doing across your campus partners.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {programData.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                No program insights yet. Once grantees submit certificates, you’ll see their batches here.
              </div>
            ) : (
              <>
                <ChartContainer config={granteeChartConfig} className="h-60 w-full">
                  <BarChart data={programData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="program"
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => value.split(" ")[0]}
                    />
                    <ChartTooltip
                      cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                      content={<ChartTooltipContent />}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="grantees" radius={[8, 8, 0, 0]} fill="var(--color-grantees)" />
                  </BarChart>
                </ChartContainer>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Batch</TableHead>
                        <TableHead className="text-right">Active grantees</TableHead>
                        <TableHead className="text-right">Completion rate</TableHead>
                        <TableHead className="text-right">Pending certs</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {programData.map((program) => (
                        <TableRow key={program.program}>
                          <TableCell className="font-medium">{program.program}</TableCell>
                          <TableCell className="text-right">{program.grantees}</TableCell>
                          <TableCell className="text-right">{program.completion}%</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={program.pending > 2 ? "destructive" : "outline"}
                              className="gap-1"
                            >
                              {program.pending}
                              <ArrowUpRight className="h-3 w-3" />
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Action items</CardTitle>
            <p className="text-sm text-muted-foreground">
              Quick highlights that need your follow-up.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {insights.map((insight) => (
              <div key={insight.title} className="rounded-lg border border-dashed p-4">
                <p className="font-semibold text-foreground">{insight.title}</p>
                <p className="text-sm text-muted-foreground">{insight.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function generatePlaceholderMonths(count = 6) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const buckets: Array<{ month: string; submitted: number }> = []

  for (let offset = count - 1; offset >= 0; offset--) {
    const date = new Date(startOfMonth)
    date.setMonth(startOfMonth.getMonth() - offset)
    buckets.push({
      month: date.toLocaleDateString("en-US", { month: "short" }),
      submitted: 0,
    })
  }

  return buckets
}