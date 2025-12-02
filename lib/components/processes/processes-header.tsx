import { Button } from "@/lib/components/ui/button"
import { Plus, Download, FileText } from "lucide-react"
import Link from "next/link"

export function ProcessesHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Processos Jurídicos</h1>
        <p className="text-muted-foreground mt-1">Gerencie todos os processos contra companhias aéreas</p>
      </div>
      <div className="flex items-center space-x-2">
        <Link href="/dashboard/processes/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Processo
          </Button>
        </Link>
      </div>
    </div>
  )
}
