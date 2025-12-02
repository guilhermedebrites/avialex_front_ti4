import { AuthHeader } from "@/components/auth/auth-header"
import { RegisterForm } from "@/lib/components/auth/register-form"
import { Scale } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-background">
            <AuthHeader />
            <div className="flex items-center justify-center h-[calc(100vh-4rem)] p-4">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">Criar Conta</h1>
                        <p className="text-muted-foreground">Preencha seus dados para criar sua conta na Avialex</p>
                    </div>

                    <RegisterForm />

                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Já possui uma conta?{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Fazer login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}