"use client"

import { Card, CardContent } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { CalendarDays, Clock, DownloadCloud } from "lucide-react"
import { useDashboardFilter } from "@/lib/contexts/dashboard-filter-context"
import { session } from "@/lib/networking/session"
import { useState } from "react"
import { useUserPermissions } from "@/lib/hooks/use-user-permissions"

export function DashboardHeader() {
  const { filters } = useDashboardFilter()
  const { canAccessDashboard } = useUserPermissions()
  const [isExporting, setIsExporting] = useState(false)
  const currentDate = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handleExport = async () => {
    if (!canAccessDashboard) return
    setIsExporting(true)

    try {
      const params = new URLSearchParams()
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)

  // Use explicit backend URL if provided; default to production Render URL
  const base = process.env.NEXT_PUBLIC_API_URL || 'https://avialex-ti4.onrender.com'
      const url = `${base}/process/dashboard/export${params.toString() ? `?${params.toString()}` : ''}`

      const token = session.getAccessToken()

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'text/csv',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Erro ${res.status}`)
      }

      const blob = await res.blob()
      const href = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const date = new Date().toISOString().slice(0,10)
      a.download = `dashboard-export-${date}.csv`
      a.href = href
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(href)
    } catch (err: any) {
      console.error('Erro ao exportar dashboard:', err)
      // Optionally show toast (use project toast hook) — keeping simple for now
      alert(err?.message || 'Erro ao exportar')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Painel de Controle</h2>
            <p className="text-muted-foreground mt-1">
              Acompanhe o desempenho dos processos jurídicos contra companhias aéreas
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CalendarDays className="mr-2 h-4 w-4" />
              {currentDate}
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Atualizado agora
            </div>
            {/* Export button - shown only if user can access dashboard */}
            {canAccessDashboard && (
              <Button onClick={handleExport} disabled={isExporting} className="ml-4">
                <DownloadCloud className="mr-2 h-4 w-4" />
                {isExporting ? 'Exportando...' : 'Exportar CSV'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
