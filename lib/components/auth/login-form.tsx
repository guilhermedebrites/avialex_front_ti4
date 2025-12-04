"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Separator } from "@/lib/components/ui/separator"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Chrome } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts"
import { useToast } from "@/lib/hooks/use-toast"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const router = useRouter()
  const { signIn, isLoading } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await signIn({
        email: formData.email,
        password: formData.password,
      })

      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o dashboard...",
      })

      // Redirect to dashboard after successful login
      router.push("/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: error instanceof Error ? error.message : "Email ou senha incorretos. Tente novamente.",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleGoogleSignIn = () => {
    const apiBaseURL = process.env.NEXT_PUBLIC_API_URL || "https://avialex-ti4.onrender.com"
    window.location.href = `${apiBaseURL}/auth/oauth2/google`
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleInputChange}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            value={formData.password}
            onChange={handleInputChange}
            className="pl-10 pr-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            id="remember"
            type="checkbox"
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <Label htmlFor="remember" className="text-sm">
            Lembrar de mim
          </Label>
        </div>
        <Link href="/forgot-password" className="text-sm text-primary hover:underline">
          Esqueceu a senha?
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>

      <Separator />

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        <Chrome className="mr-2 h-4 w-4" />
        Entrar com Google
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Não tem uma conta?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Entre em contato conosco
        </Link>
      </div>
    </form>
  )
}
