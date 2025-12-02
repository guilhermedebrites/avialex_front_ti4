"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/lib/components/ui/dialog"
import { useState, useEffect } from "react"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select"
import { ApiClient } from "@/lib/networking/api-client"
import { Session, UserType } from "@/lib/networking/session"
import { UserService } from "@/lib/services/users/user-service"
import { UpdateUserUseCase } from "@/lib/domain/users/use-cases/update-user.use-case"
import { User, UpdateUserDTO } from "@/lib/domain/users/types"
import { useToast } from "@/lib/hooks/use-toast"

interface EditUserModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onUpdated: () => void
}

export function EditUserModal({ user, isOpen, onClose, onUpdated }: EditUserModalProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState<UpdateUserDTO>({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    rg: "",
    address: "",
    type: UserType.CLIENT
  })


  // Preenche o formulário quando o usuário muda
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        cpf: user.cpf,
        rg: user.rg,
        address: user.address,
        type: user.type
      })
    }
  }, [user])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsUpdating(true)
    try {
      // Inicializar serviços
      const apiClient = new ApiClient({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://avialex-ti4.onrender.com' })
      const session = Session.getInstance()
      apiClient.setAccessToken(session.getAccessToken())
      const userService = new UserService(apiClient)
      const updateUserUseCase = new UpdateUserUseCase(userService)

      await updateUserUseCase.execute(user.id, formData)
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso"
      })
      onUpdated()
      onClose()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar usuário",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar usuário</DialogTitle>
          <DialogDescription>
            Edite as informações do usuário {user?.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de Usuário */}
          <div className="space-y-2">
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

          {/* Informações Básicas */}
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

          {/* Endereço */}
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

          {/* Botões */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isUpdating}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}