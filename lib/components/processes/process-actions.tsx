import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { MessageSquare, Calendar, FileText, DollarSign, AlertTriangle, CheckCircle } from "lucide-react"

interface ProcessActionsProps {
  processId: string
}

export function ProcessActions({ processId }: ProcessActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" className="w-full justify-start bg-transparent">
          <MessageSquare className="mr-2 h-4 w-4" />
          Comunicar Cliente
        </Button>

        <Button variant="outline" className="w-full justify-start bg-transparent">
          <Calendar className="mr-2 h-4 w-4" />
          Agendar Compromisso
        </Button>

        <Button variant="outline" className="w-full justify-start bg-transparent">
          <FileText className="mr-2 h-4 w-4" />
          Adicionar Documento
        </Button>

        <Button variant="outline" className="w-full justify-start bg-transparent">
          <DollarSign className="mr-2 h-4 w-4" />
          Atualizar Valor
        </Button>

        <Button variant="outline" className="w-full justify-start bg-transparent">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Marcar como Urgente
        </Button>

        <Button className="w-full justify-start">
          <CheckCircle className="mr-2 h-4 w-4" />
          Finalizar Processo
        </Button>
      </CardContent>
    </Card>
  )
}
