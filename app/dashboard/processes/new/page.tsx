'use client'

import { ProcessForm } from "@/lib/components/processes/process-form"
import { DashboardLayout } from "@/lib/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NewProcessPage() {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-foreground">Novo Processo Jurídico</h1>
          <p className="text-muted-foreground mt-1">Cadastre um novo processo contra companhia aérea</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Processo</CardTitle>
          </CardHeader>
          <CardContent>
            <ProcessForm />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
