"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/lib/components/ui/dialog"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select"
import { Checkbox } from "@/lib/components/ui/checkbox"
import { useState, useEffect } from "react"
import { ApiClient } from "@/lib/networking/api-client"
import { Session } from "@/lib/networking/session"
import { ProcessService } from "@/lib/services/processes/process-service"
import { UpdateProcessUseCase } from "@/lib/domain/processes/use-cases/update-process.use-case"
import { Process, ProcessStatus, UpdateProcessDTO } from "@/lib/domain/processes/types"
import { useToast } from "@/lib/hooks/use-toast"

interface EditProcessModalProps {
  process: Process | null
  isOpen: boolean
  onClose: () => void
  onUpdated: () => void
}

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

export function EditProcessModal({ process: processData, isOpen, onClose, onUpdated }: EditProcessModalProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    processNumber: "",
    status: ProcessStatus.CREATED,
    involvedParties: "",
    recoveredValue: "",
    won: false
  })
  const { toast } = useToast()


  // Preenche o formulário quando o processo muda
  useEffect(() => {
    if (processData) {
      setFormData({
        name: processData.name,
        processNumber: processData.processNumber.toString(),
        status: processData.status,
        involvedParties: processData.involvedParties.join(", "),
        recoveredValue: processData.recoveredValue !== undefined && processData.recoveredValue !== null ? processData.recoveredValue.toString() : "",
        won: !!processData.won
      })
    }
  }, [processData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!processData) return

    setIsUpdating(true)
    try {
      // Inicializar serviços
      const apiClient = new ApiClient({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://avialex-ti4.onrender.com' })
      const session = Session.getInstance()
      apiClient.setAccessToken(session.getAccessToken())
      const processService = new ProcessService(apiClient)
      const updateProcessUseCase = new UpdateProcessUseCase(processService)

      const updateData: UpdateProcessDTO = {
        name: formData.name.trim(),
        processNumber: parseInt(formData.processNumber),
        status: formData.status,
        involvedParties: formData.involvedParties
          .split(",")
          .map(party => party.trim())
          .filter(party => party.length > 0)
      }

      // Include completion details when the process is completed
      if (formData.status === ProcessStatus.COMPLETED) {
        const recovered = formData.recoveredValue ? parseFloat(String(formData.recoveredValue).replace(',', '.')) : undefined
        ;(updateData as any).recoveredValue = recovered
        ;(updateData as any).won = Boolean(formData.won)
      }

      await updateProcessUseCase.execute(processData.id, updateData)

      toast({
        title: "Sucesso",
        description: "Processo atualizado com sucesso"
      })
      onUpdated()
      onClose()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar processo",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleInputChange = (field: string, value: string | ProcessStatus | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Processo</DialogTitle>
          <DialogDescription>
            Atualize as informações do processo {processData?.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Processo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Nome do processo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="processNumber">Número do Processo</Label>
            <Input
              id="processNumber"
              type="number"
              value={formData.processNumber}
              onChange={(e) => handleInputChange("processNumber", e.target.value)}
              placeholder="Número do processo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value as ProcessStatus)}
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
            <Label htmlFor="involvedParties">Partes Envolvidas</Label>
            <Input
              id="involvedParties"
              value={formData.involvedParties}
              onChange={(e) => handleInputChange("involvedParties", e.target.value)}
              placeholder="Partes envolvidas (separadas por vírgula)"
            />
            <p className="text-xs text-muted-foreground">
              Separe múltiplas partes com vírgula
            </p>
          </div>

          {formData.status === ProcessStatus.COMPLETED && (
            <div className="space-y-2">
              <Label htmlFor="recoveredValue">Valor Recuperado</Label>
              <Input
                id="recoveredValue"
                type="number"
                step="0.01"
                value={formData.recoveredValue}
                onChange={(e) => handleInputChange("recoveredValue", e.target.value)}
                placeholder="Valor recuperado"
              />

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.won}
                  onCheckedChange={(checked) => handleInputChange("won", !!checked)}
                />
                <Label>Ganhou</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUpdating}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Atualizando..." : "Atualizar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}