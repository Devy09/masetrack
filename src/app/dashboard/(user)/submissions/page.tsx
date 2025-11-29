"use client"

import { useEffect, useState } from "react"
import { DashboardSubmissions } from "./components/main-content"

interface Certificate {
  id: string
  name: string
  submittedDate: string
  status: "pending" | "approved" | "rejected"
  type: "enrollment" | "grades"
  semester: "first" | "second"
  batch: string
  isActive: boolean
  files: { fileName: string; fileUrl: string; fileSize: number; fileType: string }[]
  remarks?: { id: number; content: string; createdAt: string; author?: { id: number; name: string; email: string } }[]
  mpTags?: string[]
  user?: {
    id: number
    name: string
    email: string
    role: string
    batch: string
  }
}

export default function Page() {
  const [statusFilter, setStatusFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [semesterFilter, setSemesterFilter] = useState("")
  const [yearFilter, setYearFilter] = useState("")
  const [batchFilter, setBatchFilter] = useState("")
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await fetch('/api/certificates')
        if (!res.ok) throw new Error('Failed to load certificates')
        const data = await res.json()
        const mapped: Certificate[] = (data.items || []).map((item: any) => ({
          id: String(item.id),
          name: item.title,
          submittedDate: item.createdAt,
          status: item.status,
          type: item.title === 'Certificate of Enrollment' ? 'enrollment' : 'grades',
          semester: item.semester,
          batch: item.user?.batch || "",
          isActive: item.isActive,
          files: item.files || [],
          remarks: item.remarks || [],
          mpTags: item.mpTags || [],
          user: item.user,
        }))
        setCertificates(mapped)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchCertificates()
  }, [])

  return (
    <DashboardSubmissions 
      certificates={certificates}
      statusFilter={statusFilter}
      typeFilter={typeFilter}
      semesterFilter={semesterFilter}
      yearFilter={yearFilter}
      batchFilter={batchFilter}
      onStatusFilterChange={setStatusFilter}
      onTypeFilterChange={setTypeFilter}
      onSemesterFilterChange={setSemesterFilter}
      onYearFilterChange={setYearFilter}
      onBatchFilterChange={setBatchFilter}
      onSwitchToUpload={() => {}}
    />
  )
}
