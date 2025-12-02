import { Card } from "@/components/ui/card"
import { Plane, Clock, Luggage, Users, FileText, Shield } from "lucide-react"

const services = [
  {
    icon: Plane,
    title: "Voo Cancelado",
    description: "Indenização de até R$ 10.000 por voo cancelado sem aviso prévio adequado.",
  },
  {
    icon: Clock,
    title: "Atraso de Voo",
    description: "Compensação por atrasos superiores a 4 horas, incluindo assistência material.",
  },
  {
    icon: Luggage,
    title: "Bagagem Extraviada",
    description: "Recuperação de valores por bagagem perdida, danificada ou atrasada.",
  },
  {
    icon: Users,
    title: "Overbooking",
    description: "Direitos garantidos quando você é impedido de embarcar por excesso de reservas.",
  },
  {
    icon: FileText,
    title: "Reembolso de Passagem",
    description: "Recuperação de valores pagos em passagens não utilizadas.",
  },
  {
    icon: Shield,
    title: "Danos Morais",
    description: "Indenização por transtornos e prejuízos causados pela companhia aérea.",
  },
]

export function ServicesSection() {
  return (
    <section id="servicos" className="py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl mb-4 text-balance">
            Casos que Atendemos
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Especialistas em todos os tipos de problemas com companhias aéreas
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <service.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
