import { Button } from "@/lib/components/ui/button"
import { Plus, Download } from "lucide-react"
import Link from "next/link"

export function EmployeesHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestão de Funcionários</h1>
        <p className="text-muted-foreground mt-1">Gerencie a equipe da Avialex</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Relatório
        </Button>
        <Link href="/employees/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Funcionário
          </Button>
        </Link>
      </div>
    </div>
  )
}
