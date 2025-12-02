import { TrendingUp, Users, Award, DollarSign } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "5.000+",
    label: "Clientes Atendidos",
  },
  {
    icon: Award,
    value: "98%",
    label: "Taxa de Sucesso",
  },
  {
    icon: DollarSign,
    value: "R$ 15M+",
    label: "Recuperados",
  },
  {
    icon: TrendingUp,
    value: "4.8/5",
    label: "Avaliação Média",
  },
]

export function StatsSection() {
  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
