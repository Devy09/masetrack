"use client"

import { useState } from "react"
import { DashboardSubmissions } from "./components/main-content"

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

export default function Page() {
  const [typeFilter, setTypeFilter] = useState("")
  const [semesterFilter, setSemesterFilter] = useState("")
  const [deadlineFilter, setDeadlineFilter] = useState("")

  const certificates: Certificate[] = [
    {
      id: "1",
      name: "Certificate of Enrollment",
      course: "Computer Science Program",
      createdDate: "2024-01-15",
      deadline: "2024-01-20",
      type: "enrollment",
      semester: "First Semester",
      batch: "2024-2025",
      isActive: true,
    },
    {
      id: "2",
      name: "Certificate of Grades",
      course: "Data Structures and Algorithms",
      createdDate: "2024-01-20",
      deadline: "2024-01-25",
      type: "grades",
      semester: "First Semester",
      batch: "2024-2025",
      isActive: true,
    },
    {
      id: "3",
      name: "Certificate of Enrollment",
      course: "Advanced Mathematics",
      createdDate: "2024-01-10",
      deadline: "2024-01-15",
      type: "enrollment",
      semester: "Second Semester",
      batch: "2024-2025",
      isActive: true,
    },
    {
      id: "4",
      name: "Certificate of Grades",
      course: "Software Engineering",
      createdDate: "2024-01-25",
      deadline: "2024-01-30",
      type: "grades",
      semester: "Second Semester",
      batch: "2024-2025",
      isActive: false,
    },
  ]

  return (
    <DashboardSubmissions 
      certificates={certificates}
      typeFilter={typeFilter}
      semesterFilter={semesterFilter}
      deadlineFilter={deadlineFilter}
      onTypeFilterChange={setTypeFilter}
      onSemesterFilterChange={setSemesterFilter}
      onDeadlineFilterChange={setDeadlineFilter}
    />
  )
}
