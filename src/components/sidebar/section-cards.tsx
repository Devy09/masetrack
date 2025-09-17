import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Metrics = {
  users: { total: number }
  submissions: {
    total: number
    pending: number
    byTitle: { enrollment: number; grades: number }
    bySemester: { first: number; second: number }
  }
}

export function SectionCards({ metrics }: { metrics?: Metrics }) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 xl:grid-cols-4 lg:px-6">
      <Card className="w-full bg-gradient-to-t from-teal-500 to-white dark:to-zinc-900">
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {metrics?.users.total ?? 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="mr-1" />
              +0%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium">
            Users in system <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Current total users</div>
        </CardFooter>
      </Card>

      <Card className="w-full bg-gradient-to-t from-teal-500 to-white dark:to-zinc-900">
        <CardHeader>
          <CardDescription>Total Submissions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {metrics?.submissions.total ?? 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="mr-1" />
              +0%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium">
            All time submissions <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Across all users</div>
        </CardFooter>
      </Card>

      <Card className="w-full bg-gradient-to-t from-teal-500 to-white dark:to-zinc-900">
        <CardHeader>
          <CardDescription>Pending Submissions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {metrics?.submissions.pending ?? 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown className="mr-1" />
              0 pending
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium">
            Awaiting review <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">Needs action</div>
        </CardFooter>
      </Card>

      <Card className="w-full bg-gradient-to-t from-teal-500 to-white dark:to-zinc-900">
        <CardHeader>
          <CardDescription>By Title</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {metrics ? `${metrics.submissions.byTitle.enrollment}/${metrics.submissions.byTitle.grades}` : '0/0'}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="mr-1" />
              ENR/GRD
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium">
            Enrollment vs Grades <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Submission split</div>
        </CardFooter>
      </Card>
    </div>
  )
}
