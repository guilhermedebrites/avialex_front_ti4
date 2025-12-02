"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Scale, Users, DollarSign, FileText, Loader2 } from "lucide-react"
import { useDashboard } from "@/lib/hooks/use-dashboard"

export function DashboardStats() {
  const { data, isLoading, error } = useDashboard()

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
              <div className="text-2xl font-bold text-foreground">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Erro ao carregar estatísticas do dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const stats = [
    {
      title: "Processos Ativos",
      value: data.activeProcess.toString(),
      icon: Scale,
      description: "em andamento",
    },
    {
      title: "Clientes Ativos",
      value: data.activeClients.toString(),
      icon: Users,
      description: "total de clientes",
    },
    {
      title: "Valor Recuperado",
      value: formatCurrency(data.recoveredValue),
      icon: DollarSign,
      description: "montante recuperado",
    },
    {
      title: "Taxa de Sucesso",
      value: `${data.SuccessFee.toFixed(0)}%`,
      icon: FileText,
      description: "processos ganhos",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
