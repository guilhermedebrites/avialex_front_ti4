"use client"

import { Input } from "@/lib/components/ui/input"
import { Button } from "@/lib/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select"
import { Search, Filter, X } from "lucide-react"
import { useState } from "react"

export function EmployeesFilters() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")

  const clearFilters = () => {
    setSearchTerm("")
    setDepartmentFilter("all")
    setRoleFilter("all")
  }

  return (
    <div className="flex items-center space-x-4 bg-card p-4 rounded-lg border border-border">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, email ou cargo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Departamento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos Departamentos</SelectItem>
          <SelectItem value="legal">Jurídico</SelectItem>
          <SelectItem value="admin">Administrativo</SelectItem>
          <SelectItem value="finance">Financeiro</SelectItem>
          <SelectItem value="marketing">Marketing</SelectItem>
        </SelectContent>
      </Select>

      <Select value={roleFilter} onValueChange={setRoleFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Cargo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os Cargos</SelectItem>
          <SelectItem value="lawyer">Advogado</SelectItem>
          <SelectItem value="paralegal">Paralegal</SelectItem>
          <SelectItem value="admin">Administrativo</SelectItem>
          <SelectItem value="manager">Gerente</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="sm">
        <Filter className="mr-2 h-4 w-4" />
        Filtros
      </Button>

      <Button variant="ghost" size="sm" onClick={clearFilters}>
        <X className="mr-2 h-4 w-4" />
        Limpar
      </Button>
    </div>
  )
}
