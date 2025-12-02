import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Maria Silva",
    role: "Cliente",
    content:
      "Meu voo foi cancelado e eu não sabia que tinha direito a indenização. A Avialex cuidou de tudo e recebi R$ 8.000. Recomendo!",
    rating: 5,
    image: "/professional-woman-smiling.png",
  },
  {
    name: "João Santos",
    role: "Cliente",
    content:
      "Processo rápido e transparente. Fui atualizado em cada etapa e recebi minha indenização em 6 meses. Excelente serviço!",
    rating: 5,
    image: "/professional-man-smiling.png",
  },
  {
    name: "Ana Costa",
    role: "Cliente",
    content:
      "Minha bagagem foi extraviada em uma viagem internacional. A Avialex conseguiu uma indenização justa. Muito profissionais!",
    rating: 5,
    image: "/professional-woman-happy.jpg",
  },
]

export function TestimonialsSection() {
  return (
    <section id="depoimentos" className="bg-muted/50 py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl mb-4 text-balance">
            O que Nossos Clientes Dizem
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Milhares de clientes satisfeitos com nossos serviços
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6">
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="mb-6 text-muted-foreground">{testimonial.content}</p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
