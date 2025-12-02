import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Badge } from "@/lib/components/ui/badge"
import { CheckCircle, Clock, FileText, MessageSquare, Calendar, AlertCircle } from "lucide-react"

interface ProcessTimelineProps {
  processId: string
}

const timelineEvents = [
  {
    id: 1,
    type: "created",
    title: "Processo Criado",
    description: "Processo iniciado com base no cancelamento do voo LA3090",
    date: "15/01/2024 09:30",
    user: "Dr. Carlos Mendes",
    status: "completed",
    icon: CheckCircle,
  },
  {
    id: 2,
    type: "document",
    title: "Documentos Anexados",
    description: "Bilhete aéreo e comprovante de hospedagem adicional anexados",
    date: "15/01/2024 14:20",
    user: "Pedro Silva",
    status: "completed",
    icon: FileText,
  },
  {
    id: 3,
    type: "communication",
    title: "Contato com a Companhia",
    description: "Primeira tentativa de acordo extrajudicial enviada à LATAM",
    date: "16/01/2024 10:15",
    user: "Dr. Carlos Mendes",
    status: "completed",
    icon: MessageSquare,
  },
  {
    id: 4,
    type: "response",
    title: "Resposta da Companhia",
    description: "LATAM respondeu negando responsabilidade - prosseguir com ação judicial",
    date: "18/01/2024 16:45",
    user: "Sistema",
    status: "completed",
    icon: AlertCircle,
  },
  {
    id: 5,
    type: "filing",
    title: "Petição Inicial Protocolada",
    description: "Ação judicial protocolada no Juizado Especial Cível",
    date: "20/01/2024 11:30",
    user: "Dr. Carlos Mendes",
    status: "in-progress",
    icon: Clock,
  },
  {
    id: 6,
    type: "hearing",
    title: "Audiência Agendada",
    description: "Audiência de conciliação marcada para 15/02/2024",
    date: "Agendado para 15/02/2024",
    user: "Tribunal",
    status: "pending",
    icon: Calendar,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "in-progress":
      return "bg-blue-100 text-blue-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "completed":
      return "Concluído"
    case "in-progress":
      return "Em Andamento"
    case "pending":
      return "Pendente"
    default:
      return status
  }
}

export function ProcessTimeline({ processId }: ProcessTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline do Processo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="flex space-x-4">
              <div className="flex flex-col items-center">
                <div
                  className={`p-2 rounded-full ${event.status === "completed" ? "bg-green-100" : event.status === "in-progress" ? "bg-blue-100" : "bg-yellow-100"}`}
                >
                  <event.icon
                    className={`h-4 w-4 ${event.status === "completed" ? "text-green-600" : event.status === "in-progress" ? "text-blue-600" : "text-yellow-600"}`}
                  />
                </div>
                {index < timelineEvents.length - 1 && <div className="w-px h-12 bg-border mt-2"></div>}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{event.title}</h4>
                  <Badge className={getStatusColor(event.status)}>{getStatusLabel(event.status)}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{event.description}</p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>{event.date}</span>
                  <span>•</span>
                  <span>{event.user}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
