'use client'

import { UserForm } from "@/lib/components/users/user-form"
import { DashboardLayout } from "@/lib/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserPermissions } from "@/lib/hooks/use-user-permissions"

export default function NewUserPage() {
  const { canCreateUser } = useUserPermissions()
  const router = useRouter()

  useEffect(() => {
    if (!canCreateUser) {
      router.push("/dashboard/users")
    }
  }, [canCreateUser, router])

  if (!canCreateUser) {
    return null
  }

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
          <h1 className="text-3xl font-bold text-foreground">Novo Usuário</h1>
          <p className="text-muted-foreground mt-1">Cadastre um novo usuário no sistema</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
