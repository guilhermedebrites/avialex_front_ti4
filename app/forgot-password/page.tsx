'use client';

import { ForgotPasswordForm } from "@/lib/components/auth/forgot-password-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useRedirectIfAuthenticated } from "@/lib/hooks/use-redirect-if-authenticated"
import { AuthHeader } from "@/lib/components/auth/auth-header"

export default function ForgotPasswordPage() {
  const { isLoading } = useRedirectIfAuthenticated();

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AuthHeader />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-2 text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">A</span>
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Recuperar Senha</h1>
              <p className="text-muted-foreground">Digite seu email para receber instruções de recuperação</p>
            </div>
          </div>

          {/* Form Card */}
          <Card className="border-border">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Esqueceu sua senha?</CardTitle>
              <CardDescription className="text-center">Enviaremos um link de recuperação para seu email</CardDescription>
            </CardHeader>
            <CardContent>
              <ForgotPasswordForm />
            </CardContent>
          </Card>

          {/* Back to Login */}
          <div className="text-center">
            <Link href="/login" className="inline-flex items-center text-sm text-primary hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
