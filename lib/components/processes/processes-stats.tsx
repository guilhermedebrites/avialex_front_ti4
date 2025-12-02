"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Scale, Clock, CheckCircle, Loader2 } from "lucide-react"
import { ApiClient } from "@/lib/networking/api-client"
import { Session } from "@/lib/networking/session"
import { ProcessService } from "@/lib/services/processes/process-service"
import { ListProcessesUseCase } from "@/lib/domain/processes/use-cases/list-processes.use-case"
import { Process, ProcessStatus } from "@/lib/domain/processes/types"
import { useProcessPermissions } from "@/lib/hooks/use-process-permissions"

export function ProcessesStats() {
  const { canViewProcess } = useProcessPermissions()
  const [processes, setProcesses] = useState<Process[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProcesses = async () => {
      if (!canViewProcess) {
        setIsLoading(false)
        return
      }

      try {
        const apiClient = new ApiClient({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://avialex-ti4.onrender.com' })
        const session = Session.getInstance()
        apiClient.setAccessToken(session.getAccessToken())
        const processService = new ProcessService(apiClient)
        const listProcessesUseCase = new ListProcessesUseCase(processService)

        const processesList = await listProcessesUseCase.execute()
        setProcesses(processesList)
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProcesses()
  }, [canViewProcess])

  // Calcular estatísticas
  const totalProcesses = processes.length
  const createdCount = processes.filter(p => p.status === ProcessStatus.CREATED).length
  const inProgressCount = processes.filter(p => p.status === ProcessStatus.IN_PROGRESS).length
  const completedCount = processes.filter(p => p.status === ProcessStatus.COMPLETED).length

  const stats = [
    {
      title: "Total de Processos",
      value: totalProcesses.toString(),
      icon: Scale,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Criados",
      value: createdCount.toString(),
      icon: Scale,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
    {
      title: "Em Andamento",
      value: inProgressCount.toString(),
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Concluídos",
      value: completedCount.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Carregando...</CardTitle>
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">-</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
