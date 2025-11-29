"use client"

import { useCallback, useEffect, useState } from "react"
import { Activity, Calendar, Filter, RefreshCw, Search, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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

type ActivityLog = {
  id: number
  action: string
  entityType: string | null
  entityId: number | null
  description: string
  metadata: string | null
  userId: number
  createdAt: string
  user: {
    id: number
    name: string
    email: string
    role: string
    image: string | null
  }
}

type ActivityLogsResponse = {
  logs: ActivityLog[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: {
    actions: string[]
    entityTypes: string[]
  }
}

const DEFAULT_FILTERS = {
  actions: [],
  entityTypes: [],
}

const ACTION_COLORS: Record<string, string> = {
  certificate_submitted: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  certificate_approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  certificate_rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  certificate_updated: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  grantee_added: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  grantee_updated: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  user_login: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  user_updated: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  poll_created: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  poll_voted: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  deadline_created: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  deadline_updated: "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300",
}

function formatAction(action: string): string {
  return action
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function getActionColor(action: string): string {
  return ACTION_COLORS[action] || "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
}

export default function ActivityLogsPage() {
  const [data, setData] = useState<ActivityLogsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [actionFilter, setActionFilter] = useState<string>("")
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")

  const loadActivityLogs = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams({
          page: page.toString(),
          limit: "50",
        })

        if (actionFilter) {
          params.append("action", actionFilter)
        }

        if (entityTypeFilter) {
          params.append("entityType", entityTypeFilter)
        }

        const response = await fetch(`/api/admin-api/activity-logs?${params.toString()}`, {
          cache: "no-store",
          signal,
        })

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}))
          throw new Error(errorBody.error || "Failed to load activity logs")
        }

        const responseData: ActivityLogsResponse = await response.json()
        // Ensure filters always have default values
        setData({
          ...responseData,
          filters: {
            actions: responseData.filters?.actions || [],
            entityTypes: responseData.filters?.entityTypes || [],
          },
        })
      } catch (err) {
        if ((err as Error).name === "AbortError") return
        console.error("Activity logs fetch failed:", err)
        setError(err instanceof Error ? err.message : "Failed to load activity logs")
      } finally {
        setLoading(false)
      }
    },
    [page, actionFilter, entityTypeFilter]
  )

  useEffect(() => {
    const controller = new AbortController()
    loadActivityLogs(controller.signal)
    return () => controller.abort()
  }, [loadActivityLogs])

  const filteredLogs = data?.logs.filter((log) => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      log.description.toLowerCase().includes(search) ||
      log.user.name.toLowerCase().includes(search) ||
      log.user.email.toLowerCase().includes(search) ||
      log.action.toLowerCase().includes(search)
    )
  })

  const handleFilterChange = (filterType: "action" | "entityType", value: string) => {
    // Treat "all" as clearing the filter
    const filterValue = value === "all" ? "" : value
    if (filterType === "action") {
      setActionFilter(filterValue)
      setPage(1)
    } else {
      setEntityTypeFilter(filterValue)
      setPage(1)
    }
  }

  const handleClearFilters = () => {
    setActionFilter("")
    setEntityTypeFilter("")
    setSearchTerm("")
    setPage(1)
  }

  return (
    <div className="space-y-8 p-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-500">System</p>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Activity Logs</h1>
          <p className="text-sm text-muted-foreground">
            Track all system activities, user actions, and important events across the platform.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadActivityLogs()}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </section>

      {error && (
        <Card className="border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">Unable to load activity logs</p>
              <p className="text-sm">{error}</p>
            </div>
            <Button variant="outline" onClick={() => loadActivityLogs()} disabled={loading}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select 
              value={actionFilter || "all"} 
              onValueChange={(value) => handleFilterChange("action", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                {data?.filters?.actions && data.filters.actions.length > 0 ? (
                  data.filters.actions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {formatAction(action)}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-actions" disabled>
                    No actions available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <Select
              value={entityTypeFilter || "all"}
              onValueChange={(value) => handleFilterChange("entityType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All entities</SelectItem>
                {data?.filters?.entityTypes && data.filters.entityTypes.length > 0 ? (
                  data.filters.entityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-entities" disabled>
                    No entities available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {(actionFilter || entityTypeFilter || searchTerm) && (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity History
          </CardTitle>
          {data && (
            <Badge variant="secondary">
              {data.pagination.total} total {data.pagination.total === 1 ? "log" : "logs"}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : !filteredLogs || filteredLogs.length === 0 ? (
            <div className="py-12 text-center">
              <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold text-foreground">No activity logs found</p>
              <p className="text-sm text-muted-foreground mt-2">
                {searchTerm || actionFilter || entityTypeFilter
                  ? "Try adjusting your filters to see more results."
                  : "Activity logs will appear here as users interact with the system."}
              </p>
            </div>
          ) : (
            <>
              <div className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px] min-w-[180px]">User</TableHead>
                      <TableHead className="w-[150px] min-w-[130px]">Action</TableHead>
                      <TableHead className="min-w-[300px]">Description</TableHead>
                      <TableHead className="w-[180px] min-w-[150px]">Entity</TableHead>
                      <TableHead className="w-[150px] min-w-[130px] whitespace-nowrap">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="w-[200px] min-w-[180px]">
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarImage
                                src={log.user.image || "/most-logo.png"}
                                alt={log.user.name}
                              />
                              <AvatarFallback>
                                {log.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                              <span className="font-medium text-sm truncate">{log.user.name}</span>
                              <span className="text-xs text-muted-foreground truncate">{log.user.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="w-[150px] min-w-[130px]">
                          <Badge className={`${getActionColor(log.action)} whitespace-nowrap`} variant="secondary">
                            {formatAction(log.action)}
                          </Badge>
                        </TableCell>
                        <TableCell className="min-w-[300px]">
                          <p className="text-sm break-words">{log.description}</p>
                        </TableCell>
                        <TableCell className="w-[180px] min-w-[150px]">
                          {log.entityType ? (
                            <div className="flex flex-col gap-1">
                              <Badge variant="outline" className="w-fit whitespace-nowrap">
                                {log.entityType}
                              </Badge>
                              {log.entityId && (
                                <span className="text-xs text-muted-foreground">ID: {log.entityId}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="w-[150px] min-w-[130px] whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <span>{formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {data && data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Page {data.pagination.page} of {data.pagination.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1 || loading}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                      disabled={page === data.pagination.totalPages || loading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
