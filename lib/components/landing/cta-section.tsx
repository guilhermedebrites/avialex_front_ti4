import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CtaSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-accent p-12 md:p-20">
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground md:text-5xl mb-6 text-balance">
              Pronto para Recuperar seus Direitos?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 text-balance">
              Cadastre seu caso agora e nossa equipe entrará em contato em até 24 horas. Sem custos antecipados, sem
              burocracia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="h-14 px-8">
                <Link href="/register">
                  Cadastrar Caso Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-14 px-8 bg-transparent text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10"
              >
                <Link href="/login">Acessar Sistema</Link>
              </Button>
            </div>
          </div>

          {/* Background Decoration */}
          <div className="absolute inset-0 bg-grid-white/10" />
        </div>
      </div>
    </section>
  )
}
