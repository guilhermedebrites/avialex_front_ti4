"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Calendar, RefreshCcw } from "lucide-react"

interface DashboardDateFilterProps {
  onFilterChange: (startDate: string | undefined, endDate: string | undefined) => void
}

export function DashboardDateFilter({ onFilterChange }: DashboardDateFilterProps) {
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  const handleApplyFilter = () => {
    // Só aplica filtro se AMBAS as datas estiverem preenchidas
    if (startDate && endDate) {
      onFilterChange(startDate, endDate)
    }
  }

  const handleReset = () => {
    setStartDate("")
    setEndDate("")
    onFilterChange(undefined, undefined)
  }

  // Valida se ambas as datas estão preenchidas para habilitar o botão
  const canApplyFilter = startDate !== "" && endDate !== ""

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Filtro de Período
            </CardTitle>
            <CardDescription>
              Selecione ambas as datas para filtrar (padrão: mês passado)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="startDate">Data Inicial *</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate || undefined}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">Data Final *</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || undefined}
            />
          </div>

          <div className="space-y-2 flex flex-col justify-end">
            <div className="flex gap-2">
              <Button
                onClick={handleApplyFilter}
                className="flex-1"
                disabled={!canApplyFilter}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Aplicar Filtro
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                size="icon"
                title="Resetar filtro"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
