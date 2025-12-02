"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useDashboard } from "@/lib/hooks/use-dashboard"
import { Loader2 } from "lucide-react"
import { useTheme } from "next-themes"

export function ProcessChart() {
  const { data, isLoading, error } = useDashboard()
  const { theme, systemTheme } = useTheme()

  // Determina o tema atual (considerando sistema)
  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = currentTheme === 'dark'

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Processos por Mês</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (error || !data || !data.monthlyStats || data.monthlyStats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Processos por Mês</CardTitle>
          <CardDescription>Sem dados disponíveis</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">
            {error ? "Erro ao carregar dados do gráfico" : "Nenhum dado disponível para exibição"}
          </p>
        </CardContent>
      </Card>
    )
  }

  // Transforma os dados do backend para o formato do gráfico
  const chartData = data.monthlyStats.map((stat) => ({
    month: stat.month,
    ganhos: stat.wonProcesses,
    perdidos: stat.lostProcesses,
    total: stat.wonProcesses + stat.lostProcesses,
  }))

  // Cores que funcionam bem no dark e light mode
  const colors = {
    ganhos: isDark ? "#22c55e" : "#16a34a", // green-500 / green-600
    perdidos: isDark ? "#ef4444" : "#dc2626", // red-500 / red-600
    total: isDark ? "#3b82f6" : "#2563eb", // blue-500 / blue-600
    grid: isDark ? "#374151" : "#e5e7eb", // gray-700 / gray-200
    text: isDark ? "#9ca3af" : "#6b7280", // gray-400 / gray-500
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processos por Mês</CardTitle>
        <CardDescription>Comparativo entre processos ganhos e perdidos por período</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis
              dataKey="month"
              stroke={colors.text}
              tick={{ fill: colors.text }}
            />
            <YAxis
              stroke={colors.text}
              tick={{ fill: colors.text }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                border: `1px solid ${colors.grid}`,
                borderRadius: '6px',
                color: isDark ? '#f3f4f6' : '#111827',
              }}
              labelStyle={{
                color: isDark ? '#f3f4f6' : '#111827',
              }}
            />
            <Legend
              wrapperStyle={{
                color: colors.text,
              }}
            />
            <Bar
              dataKey="ganhos"
              fill={colors.ganhos}
              name="Processos Ganhos"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="perdidos"
              fill={colors.perdidos}
              name="Processos Perdidos"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
