"use client"

import { Input } from "@/lib/components/ui/input"
import { Button } from "@/lib/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select"
import { Search, X } from "lucide-react"
import { useState, useEffect } from "react"
import { UserType } from "@/lib/networking/session"

interface UsersFiltersProps {
  onFiltersChange?: (filters: { name?: string; email?: string; cpf?: string; type?: UserType }) => void
}

export function UsersFilters({ onFiltersChange }: UsersFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  // Auto-filter quando os valores mudam
  useEffect(() => {
    const filters: any = {}

    if (searchTerm.trim()) {
      // Se o termo parece ser um email
      if (searchTerm.includes('@')) {
        filters.email = searchTerm.trim()
      }
      // Se o termo parece ser um CPF (números e pontos/traços)
      else if (/^[\d\.\-\/]+$/.test(searchTerm.trim())) {
        filters.cpf = searchTerm.trim()
      }
      // Senão, busca por nome
      else {
        filters.name = searchTerm.trim()
      }
    }

    if (typeFilter !== "all") {
      filters.type = typeFilter as UserType
    }

    onFiltersChange?.(filters)
  }, [searchTerm, typeFilter, onFiltersChange])

  const clearFilters = () => {
    setSearchTerm("")
    setTypeFilter("all")
  }

  return (
    <div className="flex items-center space-x-4 bg-card p-4 rounded-lg border border-border">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, email ou CPF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={typeFilter} onValueChange={setTypeFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Tipo de Usuário" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os Tipos</SelectItem>
          <SelectItem value={UserType.CLIENT}>Cliente</SelectItem>
          <SelectItem value={UserType.MARKETING}>Marketing</SelectItem>
          <SelectItem value={UserType.LAWYER}>Advogado</SelectItem>
          <SelectItem value={UserType.MANAGER}>Gerente</SelectItem>
        </SelectContent>
      </Select>

      {(searchTerm || typeFilter !== "all") && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="mr-2 h-4 w-4" />
          Limpar
        </Button>
      )}
    </div>
  )
}