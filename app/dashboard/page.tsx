"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/lib/components/dashboard/dashboard-header"
import { DashboardStats } from "@/lib/components/dashboard/dashboard-stats"
import { ProcessChart } from "@/lib/components/dashboard/process-chart"
import { QuickActions } from "@/lib/components/dashboard/quick-actions"
import { DashboardLayout } from "@/lib/components/dashboard/dashboard-layout"
import { DashboardDateFilter } from "@/lib/components/dashboard/dashboard-date-filter"
import { DashboardFilterProvider, useDashboardFilter } from "@/lib/contexts/dashboard-filter-context"
import { useUserPermissions } from "@/lib/hooks/use-user-permissions"

function DashboardContent() {
  const { updateFilters } = useDashboardFilter()
  const { canAccessDashboard } = useUserPermissions()
  const router = useRouter()

  useEffect(() => {
    if (!canAccessDashboard) {
      router.push('/portal')
    }
  }, [canAccessDashboard, router])

  if (!canAccessDashboard) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader />

        <DashboardDateFilter onFilterChange={updateFilters} />

        <DashboardStats />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ProcessChart />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function DashboardPage() {
  return (
    <DashboardFilterProvider>
      <DashboardContent />
    </DashboardFilterProvider>
  )
}
