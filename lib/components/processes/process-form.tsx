"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select"
import { Separator } from "@/lib/components/ui/separator"
import { useRouter } from "next/navigation"
import { ApiClient } from "@/lib/networking/api-client"
import { Session } from "@/lib/networking/session"
import { ProcessService } from "@/lib/services/processes/process-service"
import { CreateProcessUseCase } from "@/lib/domain/processes/use-cases/create-process.use-case"
import { ProcessStatus, CreateProcessDTO } from "@/lib/domain/processes/types"
import { useToast } from "@/lib/hooks/use-toast"
import { User } from "@/lib/domain/users/types"

const getStatusLabel = (status: ProcessStatus) => {
  switch (status) {
    case ProcessStatus.CREATED:
      return "Criado"
    case ProcessStatus.IN_PROGRESS:
      return "Em Andamento"
    case ProcessStatus.COMPLETED:
      return "Concluído"
    default:
      return status
  }
}

export function ProcessForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    clientId: "",
    name: "",
    processNumber: "",
    status: ProcessStatus.CREATED,
    involvedParties: "",
  })

  // Carregar usuários
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const apiClient = new ApiClient({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://avialex-ti4.onrender.com' })
        const session = Session.getInstance()
        apiClient.setAccessToken(session.getAccessToken())

        const usersList = await apiClient.get<User[]>('/user', { isAuthorized: true })
        setUsers(usersList)
      } catch (error: any) {
        toast({
          title: "Erro",
          description: "Erro ao carregar usuários",
          variant: "destructive"
        })
      } finally {
        setLoadingUsers(false)
      }
    }

    loadUsers()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.clientId || !formData.name || !formData.processNumber) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      const apiClient = new ApiClient({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://avialex-ti4.onrender.com' })
      const session = Session.getInstance()
      apiClient.setAccessToken(session.getAccessToken())
      const processService = new ProcessService(apiClient)
      const createProcessUseCase = new CreateProcessUseCase(processService)

      const processData: CreateProcessDTO = {
        clientId: {
          id: parseInt(formData.clientId)
        },
        name: formData.name.trim(),
        processNumber: parseInt(formData.processNumber),
        status: formData.status,
        involvedParties: formData.involvedParties
          .split(",")
          .map(party => party.trim())
          .filter(party => party.length > 0)
      }

      await createProcessUseCase.execute(processData)

      toast({
        title: "Sucesso",
        description: "Processo criado com sucesso"
      })

      router.push("/dashboard/processes")
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar processo",
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="clientId">Cliente *</Label>
          <Select
            value={formData.clientId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, clientId: value }))}
            disabled={loadingUsers}
          >
            <SelectTrigger>
              <SelectValue placeholder={loadingUsers ? "Carregando..." : "Selecione o cliente"} />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.name} - {user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as ProcessStatus }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ProcessStatus.CREATED}>
                {getStatusLabel(ProcessStatus.CREATED)}
              </SelectItem>
              <SelectItem value={ProcessStatus.IN_PROGRESS}>
                {getStatusLabel(ProcessStatus.IN_PROGRESS)}
              </SelectItem>
              <SelectItem value={ProcessStatus.COMPLETED}>
                {getStatusLabel(ProcessStatus.COMPLETED)}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Nome do Processo *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Ex: Cancelamento de Voo Internacional"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="processNumber">Número do Processo *</Label>
          <Input
            id="processNumber"
            name="processNumber"
            type="number"
            value={formData.processNumber}
            onChange={handleInputChange}
            placeholder="Ex: 123456"
            required
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Partes Envolvidas</h3>
        <div className="space-y-2">
          <Label htmlFor="involvedParties">Partes Envolvidas</Label>
          <Input
            id="involvedParties"
            name="involvedParties"
            value={formData.involvedParties}
            onChange={handleInputChange}
            placeholder="Ex: LATAM Airlines, João Silva (separadas por vírgula)"
          />
          <p className="text-xs text-muted-foreground">
            Separe múltiplas partes com vírgula
          </p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Criando Processo..." : "Criar Processo"}
        </Button>
      </div>
    </form>
  )
}
