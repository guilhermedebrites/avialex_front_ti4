import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Plus, Users, Star } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    title: "Novo Processo",
    description: "Iniciar um novo processo jurídico",
    icon: Plus,
    href: "/dashboard/processes/new",
    variant: "default" as const,
  },
  {
    title: "Adicionar Cliente",
    description: "Cadastrar novo cliente",
    icon: Users,
    href: "/dashboard/users/new",
    variant: "outline" as const,
  },
  {
    title: "Escrever Avaliação",
    description: "Avaliar atendimento recebido",
    icon: Star,
    href: "/dashboard/reviews?create=true",
    variant: "outline" as const,
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <Link key={action.title} href={action.href}>
            <Button variant={action.variant} className="w-full justify-start h-auto p-4">
              <action.icon className="mr-3 h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
