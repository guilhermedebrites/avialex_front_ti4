"use client"

import { DashboardLayout } from "@/lib/components/dashboard/dashboard-layout"
import { SettingsHeader } from "@/lib/components/settings/settings-header"
import { SettingsTabs } from "@/lib/components/settings/settings-tabs"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SettingsHeader />
        <SettingsTabs />
      </div>
    </DashboardLayout>
  )
}
