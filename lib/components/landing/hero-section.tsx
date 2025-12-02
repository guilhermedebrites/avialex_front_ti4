"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowRight, AlertCircle, Loader2, X } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiClient } from "@/lib/networking/api-client"
import { ProcessService } from "@/lib/services/processes/process-service"
import { Process } from "@/lib/domain/processes/types"
import { getProcessStatusStyle } from "@/lib/utils/process-utils"
import { cn } from "@/lib/utils"

export function HeroSection() {
  const [processNumber, setProcessNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [foundProcess, setFoundProcess] = useState<Process | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    const input = processNumber.trim()
    if (!input) {
      setError("Por favor, digite o número do processo")
      return
    }

    setIsLoading(true)
    setError(null)
    setFoundProcess(null)

    try {
      console.log('Buscando processo:', input)

      // Tenta converter para número
      const processNumberInt = parseInt(input, 10)

      if (isNaN(processNumberInt)) {
        setError("Por favor, digite um número válido")
        return
      }

      // Busca por número do processo (rota pública)
      const processService = new ProcessService(apiClient)
      const process = await processService.getByProcessNumber(processNumberInt)
      console.log('Processo encontrado:', process)

      setFoundProcess(process)
    } catch (err: any) {
      console.error('Erro ao buscar processo:', err)
      if (err.message?.includes("404") || err.message?.includes("not found")) {
        setError("Processo não encontrado. Verifique o número e tente novamente.")
      } else {
        setError(`Erro ao buscar processo: ${err.message}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearSearch = () => {
    setFoundProcess(null)
    setProcessNumber("")
    setError(null)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 py-20 md:py-32">
      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/50 px-4 py-2 text-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground">Especialistas em Direito Aeronáutico</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl text-balance">
            Seus Direitos em{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Voos Cancelados
            </span>
          </h1>

          <p className="mb-12 text-lg text-muted-foreground md:text-xl text-balance max-w-2xl mx-auto">
            Recupere até R$ 10.000 por voo cancelado, atrasado ou com overbooking. Sem custos antecipados, você só paga
            se ganhar.
          </p>

          {/* Search Process Field */}
          <div className="mb-8 mx-auto max-w-2xl">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Digite o número do seu processo"
                  value={processNumber}
                  onChange={(e) => {
                    setProcessNumber(e.target.value)
                    setError(null)
                  }}
                  className="h-14 pl-11 text-base bg-background"
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    Buscar Processo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {!foundProcess && (
              <p className="mt-3 text-sm text-muted-foreground">
                Já tem cadastro?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Acesse o sistema
                </Link>
              </p>
            )}
          </div>

          {/* Process Result Card */}
          {foundProcess && (
            <div className="mb-8 mx-auto max-w-3xl">
              <Card className="p-6 text-left">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Processo Encontrado</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSearch}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Número do Processo</div>
                    <div className="text-lg font-semibold">{foundProcess.processNumber}</div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <Badge className={cn(
                      getProcessStatusStyle(foundProcess.status).bgColor,
                      getProcessStatusStyle(foundProcess.status).color
                    )}>
                      {getProcessStatusStyle(foundProcess.status).label}
                    </Badge>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Data de Abertura</div>
                    <div className="text-lg font-semibold">
                      {new Date(foundProcess.creationDate).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  <div className="md:col-span-3">
                    <div className="text-sm text-muted-foreground">Nome</div>
                    <div className="text-lg">{foundProcess.name}</div>
                  </div>

                  {foundProcess.involvedParties && foundProcess.involvedParties.length > 0 && (
                    <div className="md:col-span-3">
                      <div className="text-sm text-muted-foreground">Partes Envolvidas</div>
                      <div className="text-base">
                        {foundProcess.involvedParties.join(', ')}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <Button onClick={handleClearSearch} variant="outline">
                    Nova Busca
                  </Button>
                  <Link href="/login">
                    <Button>
                      Acessar Sistema Completo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          )}

          {/* Hero Image */}
          <div className="relative mx-auto mt-16 max-w-5xl">
            <div className="aspect-video overflow-hidden rounded-xl border bg-muted shadow-2xl">
              <img
                src="/modern-legal-office-with-airplane-in-background.jpg"
                alt="Avialex - Escritório Jurídico"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Floating Cards */}
            <div className="absolute left-4 top-1/4 hidden xl:block">
              <div className="rounded-lg border bg-background p-4 shadow-lg">
                <p className="text-sm font-medium">✓ 98% de Sucesso</p>
              </div>
            </div>
            <div className="absolute right-4 top-1/3 hidden xl:block">
              <div className="rounded-lg border bg-background p-4 shadow-lg">
                <p className="text-sm font-medium">✓ +5.000 Casos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>
    </section>
  )
}
