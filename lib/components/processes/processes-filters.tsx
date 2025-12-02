"use client"

import { Input } from "@/lib/components/ui/input"
import { Button } from "@/lib/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select"
import { Search, X } from "lucide-react"
import { useState, useEffect } from "react"
import { ProcessStatus } from "@/lib/domain/processes/types"

interface ProcessFilters {
  name?: string
  clientName?: string
  clientCpf?: string
  status?: ProcessStatus
  processNumber?: string
}

interface ProcessFiltersProps {
  onFiltersChange?: (filters: ProcessFilters) => void
}

const getStatusLabel = (status: ProcessStatus) => {
  switch (status) {
    case ProcessStatus.CREATED:
      return "Criado"
    case ProcessStatus.IN_PROGRESS:
      return "Em Andamento"
    case ProcessStatus.COMPLETED:
      return "Concluído"
    default:
      return status
  }
}

export function ProcessesFilters({ onFiltersChange }: ProcessFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const filters: ProcessFilters = {}

    // Filtro inteligente de busca
    if (searchTerm.trim()) {
      const term = searchTerm.trim()

      // Se contém apenas números, busca por número do processo
      if (/^\d+$/.test(term)) {
        filters.processNumber = term
      }
      // Se contém formato de CPF (números com pontos/traços), busca por CPF
      else if (/^[\d\.\-\/]+$/.test(term)) {
        filters.clientCpf = term
      }
      // Caso contrário, busca por nome do processo ou cliente
      else {
        filters.name = term
        filters.clientName = term
      }
    }

    // Filtro de status
    if (statusFilter !== "all") {
      filters.status = statusFilter as ProcessStatus
    }

    onFiltersChange?.(filters)
  }, [searchTerm, statusFilter])

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
  }

  return (
    <div className="flex items-center space-x-4 bg-card p-4 rounded-lg border border-border">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, cliente, CPF ou número do processo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos Status</SelectItem>
          <SelectItem value={ProcessStatus.CREATED}>
            {getStatusLabel(ProcessStatus.CREATED)}
          </SelectItem>
          <SelectItem value={ProcessStatus.IN_PROGRESS}>
            {getStatusLabel(ProcessStatus.IN_PROGRESS)}
          </SelectItem>
          <SelectItem value={ProcessStatus.COMPLETED}>
            {getStatusLabel(ProcessStatus.COMPLETED)}
          </SelectItem>
        </SelectContent>
      </Select>

      <Button variant="ghost" size="sm" onClick={clearFilters}>
        <X className="mr-2 h-4 w-4" />
        Limpar
      </Button>
    </div>
  )
}
