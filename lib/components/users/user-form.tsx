"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select"
import { Separator } from "@/lib/components/ui/separator"
import { useRouter } from "next/navigation"
import { useToast } from "@/lib/hooks/use-toast"
import { ApiClient } from "@/lib/networking/api-client"
import { Session, UserType } from "@/lib/networking/session"
import { UserService } from "@/lib/services/users/user-service"
import { CreateUserUseCase } from "@/lib/domain/users/use-cases/create-user.use-case"
import { CreateUserDTO } from "@/lib/domain/users/types"
import { useUserPermissions } from "@/lib/hooks/use-user-permissions"

export function UserForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { canCreateUser } = useUserPermissions()

  const [formData, setFormData] = useState<CreateUserDTO>({
    name: "",
    email: "",
    phone: "",
    password: "",
    cpf: "",
    rg: "",
    address: "",
    type: UserType.CLIENT
  })


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!canCreateUser) {
      toast({
        title: "Erro",
        description: "Você não tem permissão para criar usuários",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      // Inicializar serviços
      const apiClient = new ApiClient({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://avialex-ti4.onrender.com' })
      const session = Session.getInstance()
      apiClient.setAccessToken(session.getAccessToken())
      const userService = new UserService(apiClient)
      const createUserUseCase = new CreateUserUseCase(userService)

      await createUserUseCase.execute(formData)
      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso"
      })
      router.push("/dashboard/users")
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar usuário",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'type' ? value as UserType : value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Type */}
      <div className="space-y-3">
        <Label>Tipo de Usuário</Label>
        <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de usuário" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UserType.CLIENT}>Cliente</SelectItem>
            <SelectItem value={UserType.MARKETING}>Marketing</SelectItem>
            <SelectItem value={UserType.LAWYER}>Advogado</SelectItem>
            <SelectItem value={UserType.MANAGER}>Gerente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Basic Information */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Digite o nome completo"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="email@exemplo.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="(11) 99999-9999"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Digite a senha"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={handleInputChange}
            placeholder="000.000.000-00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rg">RG</Label>
          <Input
            id="rg"
            name="rg"
            value={formData.rg}
            onChange={handleInputChange}
            placeholder="00.000.000-0"
            required
          />
        </div>
      </div>

      <Separator />

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Endereço</h3>
        <div className="space-y-2">
          <Label htmlFor="address">Endereço Completo</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Rua, número, complemento, cidade, estado"
            required
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading || !canCreateUser}>
          {isLoading ? "Salvando..." : "Salvar Usuário"}
        </Button>
      </div>
    </form>
  )
}
