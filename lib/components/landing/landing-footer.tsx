import Link from "next/link"
import { Scale, Mail, Phone, MapPin } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Scale className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Avialex</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Especialistas em direito aeronáutico. Defendendo seus direitos contra companhias aéreas desde 2015.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Serviços</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#servicos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Voo Cancelado
                </Link>
              </li>
              <li>
                <Link href="#servicos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Atraso de Voo
                </Link>
              </li>
              <li>
                <Link href="#servicos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Bagagem Extraviada
                </Link>
              </li>
              <li>
                <Link href="#servicos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Overbooking
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Empresa</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="#depoimentos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Depoimentos
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                  Área do Cliente
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">contato@avialex.com.br</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">(11) 3000-0000</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">
                  Av. Paulista, 1000
                  <br />
                  São Paulo - SP
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Avialex. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
