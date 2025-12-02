import { ProcessDetails } from "@/lib/components/processes/process-details"
import { ProcessTimeline } from "@/lib/components/processes/process-timeline"
import { ProcessDocuments } from "@/lib/components/processes/process-documents"
import { ProcessActions } from "@/lib/components/processes/process-actions"
import { DashboardLayout } from "@/lib/components/dashboard/dashboard-layout"
import { Button } from "@/lib/components/ui/button"
import { ArrowLeft, Edit, MessageSquare, FileText } from "lucide-react"
import Link from "next/link"

export default function ProcessDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/processes">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Processo {params.id}</h1>
              <p className="text-muted-foreground mt-1">Cancelamento de Voo - LATAM Airlines</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              Comunicar Cliente
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Gerar Relatório
            </Button>
            <Button size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <ProcessDetails processId={params.id} />
            <ProcessTimeline processId={params.id} />
          </div>
          <div className="space-y-6">
            <ProcessActions processId={params.id} />
            <ProcessDocuments processId={params.id} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
