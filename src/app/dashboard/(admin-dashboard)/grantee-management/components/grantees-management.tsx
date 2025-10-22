"use client"

import { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useOutsideClick } from "@/hooks/use-outside-click"
import { StudentForm } from "./grantees-form"
import { CloseIcon } from "./close-icon"

export interface Student {
  id: number
  name: string
  email: string
  batch: string
  phoneNumber?: string
  address?: string
  status: string
  image?: string
  addedBy?: {
    id: number
    name: string
    email: string
  }
  createdAt: Date
  updatedAt: Date
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [active, setActive] = useState<Student | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()

  // Fetch grantees from API
  const fetchGrantees = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin-api/grantees')
      if (!response.ok) {
        throw new Error('Failed to fetch grantees')
      }
      const data = await response.json()
      setStudents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching grantees:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGrantees()
  }, [])

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.batch.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null)
        setIsFormOpen(false)
      }
    }

    if (active || isFormOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [active, isFormOpen])

  useOutsideClick(ref, () => {
    setActive(null)
    setIsFormOpen(false)
  })

  const handleAddStudent = async (formData: Omit<Student, "id" | "createdAt" | "updatedAt"> & { userId?: number }) => {
    try {
      const response = await fetch('/api/admin-api/grantees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to add grantee')
      }

      const newStudent = await response.json()
      setStudents([newStudent, ...students])
      setIsFormOpen(false)
    } catch (err) {
      console.error('Error adding grantee:', err)
      alert('Failed to add grantee. Please try again.')
    }
  }

  const handleUpdateStudent = async (formData: Omit<Student, "id" | "createdAt" | "updatedAt">) => {
    if (!editingStudent) return

    try {
      const response = await fetch('/api/admin-api/grantees', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingStudent.id,
          ...formData,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update grantee')
      }

      const updatedStudent = await response.json()
      setStudents(students.map((s) => (s.id === editingStudent.id ? updatedStudent : s)))
      setEditingStudent(null)
      setIsFormOpen(false)
      setActive(null)
    } catch (err) {
      console.error('Error updating grantee:', err)
      alert('Failed to update grantee. Please try again.')
    }
  }

  const handleDeleteStudent = async (id: number) => {
    try {
      const response = await fetch('/api/admin-api/grantees', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete grantee')
      }

      setStudents(students.filter((s) => s.id !== id))
      setActive(null)
    } catch (err) {
      console.error('Error deleting grantee:', err)
      alert('Failed to delete grantee. Please try again.')
    }
  }

  const handleEditClick = (student: Student) => {
    setEditingStudent(student)
    setIsFormOpen(true)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <p className="text-neutral-600 dark:text-neutral-400">Loading grantees...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchGrantees}
            className="px-4 py-2 rounded-lg font-semibold bg-teal-500 hover:bg-teal-600 text-white transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name, email, or batch..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => {
            setEditingStudent(null)
            setIsFormOpen(true)
          }}
          className="px-6 py-2 rounded-lg font-semibold bg-teal-500 hover:bg-teal-600 text-white transition-colors"
        >
          + Add Grantee
        </button>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.button
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex absolute top-4 right-4 lg:hidden items-center justify-center bg-white dark:bg-neutral-800 rounded-full h-8 w-8 shadow-lg z-10"
              onClick={() => {
                setIsFormOpen(false)
                setEditingStudent(null)
              }}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              ref={ref}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-neutral-900 rounded-xl lg:rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="max-h-[90vh] overflow-y-auto">
                <StudentForm
                  student={editingStudent}
                  onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}
                  onCancel={() => {
                    setIsFormOpen(false)
                    setEditingStudent(null)
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-600 dark:text-neutral-400">
              {searchTerm ? "No grantees found matching your search." : "No grantees yet. Add one to get started!"}
            </p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <motion.div
              key={student.id}
              onClick={() => setActive(student)}
              className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer transition-colors border border-neutral-200 dark:border-neutral-700"
            >
              <div className="flex gap-4 flex-col md:flex-row w-full md:w-auto">
                <img
                  src={student.image || "/placeholder.svg"}
                  alt={student.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 dark:text-white">{student.name}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {student.batch} • {student.email}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                    Phone: <span className="font-semibold">{student.phoneNumber || 'N/A'}</span>
                  </p>
                  {student.addedBy && (
                    <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">
                      Added by: <span className="font-semibold">{student.addedBy.name}</span>
                    </p>
                  )}
                </div>
              </div>
              <button className="px-4 py-2 text-sm rounded-full font-semibold bg-gray-100 hover:bg-blue-500 hover:text-white text-black dark:bg-neutral-700 dark:text-white dark:hover:bg-blue-500 mt-4 md:mt-0 transition-colors">
                View Details
              </button>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              ref={ref}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src={active.image || "/placeholder.svg"}
                alt={active.name}
                className="w-full h-80 object-cover object-center"
              />

              <div className="flex-1 overflow-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{active.name}</h2>
                      <p className="text-neutral-600 dark:text-neutral-400">{active.batch}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        active.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {active.status}
                    </span>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-neutral-600 dark:text-neutral-400 text-xs uppercase tracking-wide">Email</p>
                        <p className="text-neutral-900 dark:text-white font-medium">{active.email}</p>
                      </div>
                      <div>
                        <p className="text-neutral-600 dark:text-neutral-400 text-xs uppercase tracking-wide">Phone</p>
                        <p className="text-neutral-900 dark:text-white font-medium">{active.phoneNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-neutral-600 dark:text-neutral-400 text-xs uppercase tracking-wide">Batch</p>
                        <p className="text-neutral-900 dark:text-white font-medium">{active.batch}</p>
                      </div>
                      <div>
                        <p className="text-neutral-600 dark:text-neutral-400 text-xs uppercase tracking-wide">Status</p>
                        <p className="text-neutral-900 dark:text-white font-medium capitalize">{active.status}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-neutral-600 dark:text-neutral-400 text-xs uppercase tracking-wide">
                          Address
                        </p>
                        <p className="text-neutral-900 dark:text-white font-medium">{active.address || 'N/A'}</p>
                      </div>
                      {active.addedBy && (
                        <div className="col-span-2">
                          <p className="text-neutral-600 dark:text-neutral-400 text-xs uppercase tracking-wide">Added by Personnel</p>
                          <p className="text-neutral-900 dark:text-white font-medium">{active.addedBy.name}</p>
                          <p className="text-neutral-500 dark:text-neutral-400 text-xs">{active.addedBy.email}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                    <button
                      onClick={() => handleEditClick(active)}
                      className="flex-1 px-4 py-2 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(active.id)}
                      className="flex-1 px-4 py-2 rounded-lg font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

