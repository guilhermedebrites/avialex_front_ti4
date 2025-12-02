"use client"

import { useState } from "react"
import { ProcessesHeader } from "@/lib/components/processes/processes-header"
import { ProcessesTable } from "@/lib/components/processes/processes-table"
import { ProcessesFilters } from "@/lib/components/processes/processes-filters"
import { ProcessesStats } from "@/lib/components/processes/processes-stats"
import { DashboardLayout } from "@/lib/components/dashboard/dashboard-layout"

interface ProcessFilters {
  name?: string
  clientName?: string
  clientCpf?: string
  status?: string
  processNumber?: string
}

export default function ProcessesPage() {
  const [filters, setFilters] = useState<ProcessFilters>({})

  const handleFiltersChange = (newFilters: ProcessFilters) => {
    setFilters(newFilters)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ProcessesHeader />
        <ProcessesStats />
        <ProcessesFilters onFiltersChange={handleFiltersChange} />
        <ProcessesTable filters={filters} />
      </div>
    </DashboardLayout>
  )
}
