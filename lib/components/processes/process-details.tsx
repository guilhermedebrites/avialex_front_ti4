import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Badge } from "@/lib/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/lib/components/ui/avatar"
import { Separator } from "@/lib/components/ui/separator"
import { CalendarDays, Plane, MapPin, DollarSign, User, Scale } from "lucide-react"

interface ProcessDetailsProps {
  processId: string
}

export function ProcessDetails({ processId }: ProcessDetailsProps) {
  // Mock data - in real app, fetch based on processId
  const processData = {
    id: processId,
    client: {
      name: "Maria Silva Santos",
      email: "maria.silva@email.com",
      phone: "(11) 99999-9999",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lawyer: {
      name: "Dr. Carlos Mendes",
      email: "carlos.mendes@avialex.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    airline: "LATAM Airlines",
    type: "Cancelamento de Voo",
    status: "Em Andamento",
    priority: "Alta",
    flight: {
      number: "LA3090",
      date: "15/01/2024",
      origin: "São Paulo (GRU)",
      destination: "Rio de Janeiro (GIG)",
    },
    value: "R$ 5.000,00",
    createdDate: "15/01/2024",
    description:
      "Voo cancelado sem aviso prévio adequado, causando prejuízos ao cliente incluindo hospedagem adicional e compromissos perdidos.",
    progress: 65,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Detalhes do Processo
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-100 text-blue-800">{processData.status}</Badge>
            <Badge className="bg-red-100 text-red-800">{processData.priority}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Client and Lawyer Info */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h4 className="font-medium flex items-center">
              <User className="mr-2 h-4 w-4" />
              Cliente
            </h4>
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={processData.client.avatar || "/placeholder.svg"} alt={processData.client.name} />
                <AvatarFallback>MS</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{processData.client.name}</div>
                <div className="text-sm text-muted-foreground">{processData.client.email}</div>
                <div className="text-sm text-muted-foreground">{processData.client.phone}</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium flex items-center">
              <Scale className="mr-2 h-4 w-4" />
              Advogado Responsável
            </h4>
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={processData.lawyer.avatar || "/placeholder.svg"} alt={processData.lawyer.name} />
                <AvatarFallback>CM</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{processData.lawyer.name}</div>
                <div className="text-sm text-muted-foreground">{processData.lawyer.email}</div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Flight Information */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center">
            <Plane className="mr-2 h-4 w-4" />
            Informações do Voo
          </h4>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-sm text-muted-foreground">Companhia</div>
              <div className="font-medium">{processData.airline}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Número do Voo</div>
              <div className="font-medium">{processData.flight.number}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Data</div>
              <div className="font-medium">{processData.flight.date}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Rota</div>
              <div className="font-medium flex items-center">
                <MapPin className="mr-1 h-3 w-3" />
                {processData.flight.origin} → {processData.flight.destination}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Process Information */}
        <div className="space-y-3">
          <h4 className="font-medium">Informações do Processo</h4>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-sm text-muted-foreground">Tipo</div>
              <div className="font-medium">{processData.type}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground flex items-center">
                <DollarSign className="mr-1 h-3 w-3" />
                Valor Estimado
              </div>
              <div className="font-medium">{processData.value}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground flex items-center">
                <CalendarDays className="mr-1 h-3 w-3" />
                Data de Criação
              </div>
              <div className="font-medium">{processData.createdDate}</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Progress */}
        <div className="space-y-3">
          <h4 className="font-medium">Progresso do Processo</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span>{processData.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${processData.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Description */}
        <div className="space-y-3">
          <h4 className="font-medium">Descrição do Caso</h4>
          <p className="text-muted-foreground leading-relaxed">{processData.description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
