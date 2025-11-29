"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle, Calendar, Download, GraduationCap, BookOpen, ClockAlert, FileBadge, FileUser } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Certificate {
  id: string
  name: string
  course: string
  createdDate: string
  deadline: string
  type: "enrollment" | "grades"
  semester: string
  batch: string
  isActive: boolean
}

interface DashboardSubmissionsProps {
  certificates: Certificate[]
  typeFilter: string
  semesterFilter: string
  deadlineFilter: string
  onTypeFilterChange: (value: string) => void
  onSemesterFilterChange: (value: string) => void
  onDeadlineFilterChange: (value: string) => void
}

export function DashboardSubmissions({
  certificates,
  typeFilter,
  semesterFilter,
  deadlineFilter,
  onTypeFilterChange,
  onSemesterFilterChange,
  onDeadlineFilterChange,
}: DashboardSubmissionsProps) {
  const filteredCertificates = certificates.filter((cert) => {
    return (
      (typeFilter === "" || cert.type === typeFilter) &&
      (semesterFilter === "" || cert.semester === semesterFilter) &&
      (deadlineFilter === "" || cert.deadline === deadlineFilter)
    )
  })

  const getCertificateTypeIcon = (type: string) => {
    return type === "enrollment" ? (
      <FileUser className="h-5 w-5 text-blue-600" />
    ) : (
      <FileBadge className="h-5 w-5 text-purple-600" />
    )
  }

  const getCertificateTypeBadge = (type: string) => {
    const variants = {
      enrollment: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      grades: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    }

    return (
      <Badge variant="secondary" className={variants[type as keyof typeof variants]}>
        {type === "enrollment" ? "Enrollment" : "Grades"}
      </Badge>
    )
  }

  return (
    <Card className="m-6">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-foreground">Schedule Deadline</CardTitle>
            <CardDescription>Create deadline for submission of certificates</CardDescription>
          </div>
          <div>
            <Button className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white">
              <Calendar className="h-4 w-4" />
              Schedule Deadline
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Input
            type="text"
            placeholder="Search certificates..."
            className="px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <select
            value={deadlineFilter}
            onChange={(e) => onDeadlineFilterChange(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Deadlines</option>
            <option value="2025-01-20">2025-01-20</option>
            <option value="2024-01-25">2024-01-25</option>
            <option value="2023-01-30">2023-01-30</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Types</option>
            <option value="enrollment">Enrollment</option>
            <option value="grades">Grades</option>
          </select>
          <select
            value={semesterFilter}
            onChange={(e) => onSemesterFilterChange(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Semesters</option>
            <option value="first">1st Semester</option>
            <option value="second">2nd Semester</option>
          </select>
          <select
            value={semesterFilter}
            onChange={(e) => onSemesterFilterChange(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Batch</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2022-2023">2022-2023</option>
            <option value="2021-2022">2021-2022</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredCertificates.map((cert) => (
            <div
              key={cert.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                  {getCertificateTypeIcon(cert.type)}
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-foreground">{cert.name}</h4>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Created: {new Date(cert.createdDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockAlert className="h-3 w-3" />
                      <span>Deadline: {new Date(cert.deadline).toLocaleDateString()}</span>
                    </div>
                    <span>•</span>
                    <span>{cert.semester}</span>
                    <span>•</span>
                    <span>Batch: {cert.batch}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {getCertificateTypeBadge(cert.type)}
                <Badge variant={cert.isActive ? "default" : "secondary"}>{cert.isActive ? "Active" : "Inactive"}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
