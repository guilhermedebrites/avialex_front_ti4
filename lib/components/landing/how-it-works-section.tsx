import { FileText, Search, Gavel, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: FileText,
    title: "1. Cadastre seu Caso",
    description: "Preencha um formulário simples com as informações do seu voo e o problema enfrentado.",
  },
  {
    icon: Search,
    title: "2. Análise Gratuita",
    description: "Nossa equipe analisa seu caso sem custo e verifica a viabilidade da ação.",
  },
  {
    icon: Gavel,
    title: "3. Processo Judicial",
    description: "Cuidamos de toda a parte jurídica. Você não precisa se preocupar com nada.",
  },
  {
    icon: CheckCircle,
    title: "4. Receba sua Indenização",
    description: "Você só paga quando ganhar. Nossa taxa é descontada do valor recuperado.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl mb-4 text-balance">
            Como Funciona
          </h2>
          <p className="text-lg text-muted-foreground text-balance">Processo simples e transparente do início ao fim</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <step.icon className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-16 hidden h-full w-0.5 bg-border lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
