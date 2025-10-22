"use client"

import { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useOutsideClick } from "@/hooks/use-outside-click"
import { CloseIcon } from "../../grantee-management/components/close-icon"

export interface MP {
  id: number
  name: string
  email: string
  phoneNumber?: string
  address?: string
  district?: string
  party?: string
  image?: string
  status: string
  grantees: {
    id: number
    name: string
    email: string
    batch: string
    status: string
    image?: string
  }[]
  createdAt: Date
  updatedAt: Date
}

export default function MPManagement() {
  const [mps, setMps] = useState<MP[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [active, setActive] = useState<MP | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()

  // Fetch MPs from API
  const fetchMPs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin-api/mps')
      if (!response.ok) {
        throw new Error('Failed to fetch MPs')
      }
      const data = await response.json()
      setMps(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching MPs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMPs()
  }, [])

  const filteredMPs = mps.filter(
    (mp) =>
      mp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mp.district && mp.district.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (mp.party && mp.party.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null)
      }
    }

    if (active) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [active])

  useOutsideClick(ref, () => {
    setActive(null)
  })

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <p className="text-neutral-600 dark:text-neutral-400">Loading MPs...</p>
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
            onClick={fetchMPs}
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Member of Parliament Management</h1>
        <p className="text-neutral-600 dark:text-neutral-400">Manage MPs and their assigned grantees</p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name, email, district, or party..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          onClick={() => {
            // TODO: Add MP functionality
            alert('Add MP functionality coming soon!')
          }}
          className="px-6 py-2 rounded-lg font-semibold bg-teal-500 hover:bg-teal-600 text-white transition-colors"
        >
          + Add MP
        </button>
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
                      <p className="text-neutral-600 dark:text-neutral-400">{active.district || 'No district'}</p>
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
                        <p className="text-neutral-600 dark:text-neutral-400 text-xs uppercase tracking-wide">District</p>
                        <p className="text-neutral-900 dark:text-white font-medium">{active.district || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-neutral-600 dark:text-neutral-400 text-xs uppercase tracking-wide">Party</p>
                        <p className="text-neutral-900 dark:text-white font-medium">{active.party || 'N/A'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-neutral-600 dark:text-neutral-400 text-xs uppercase tracking-wide">Address</p>
                        <p className="text-neutral-900 dark:text-white font-medium">{active.address || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Grantees Section */}
                  <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                      Assigned Grantees ({active.grantees.length})
                    </h3>
                    {active.grantees.length === 0 ? (
                      <p className="text-neutral-600 dark:text-neutral-400 text-center py-4">
                        No grantees assigned to this MP yet.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {active.grantees.map((grantee) => (
                          <div key={grantee.id} className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
                            <img
                              src={grantee.image || "/placeholder.svg"}
                              alt={grantee.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-neutral-900 dark:text-white">{grantee.name}</p>
                              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {grantee.batch} • {grantee.email}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                grantee.status === "active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }`}
                            >
                              {grantee.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <div className="space-y-3">
        {filteredMPs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-600 dark:text-neutral-400">
              {searchTerm ? "No MPs found matching your search." : "No MPs yet. Add one to get started!"}
            </p>
          </div>
        ) : (
          filteredMPs.map((mp) => (
            <motion.div
              key={mp.id}
              onClick={() => setActive(mp)}
              className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer transition-colors border border-neutral-200 dark:border-neutral-700"
            >
              <div className="flex gap-4 flex-col md:flex-row w-full md:w-auto">
                <img
                  src={mp.image || "/placeholder.svg"}
                  alt={mp.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 dark:text-white">{mp.name}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {mp.district || 'No district'} • {mp.email}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                    Party: <span className="font-semibold">{mp.party || 'N/A'}</span>
                  </p>
                  <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">
                    Grantees: <span className="font-semibold">{mp.grantees.length}</span>
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 text-sm rounded-full font-semibold bg-gray-100 hover:bg-teal-500 hover:text-white text-black dark:bg-neutral-700 dark:text-white dark:hover:bg-teal-500 mt-4 md:mt-0 transition-colors">
                View Details
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
