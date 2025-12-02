"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/lib/components/ui/alert-dialog"
import { Process } from "@/lib/domain/processes/types"
import { useToast } from "@/lib/hooks/use-toast"
import { useState } from "react"
import { ApiClient } from "@/lib/networking/api-client"
import { Session } from "@/lib/networking/session"
import { ProcessService } from "@/lib/services/processes/process-service"
import { DeleteProcessUseCase } from "@/lib/domain/processes/use-cases/delete-process.use-case"

interface DeleteProcessModalProps {
  process: Process | null
  isOpen: boolean
  onClose: () => void
  onDeleted: (deletedProcessId?: number) => void
}

export function DeleteProcessModal({ process: processData, isOpen, onClose, onDeleted }: DeleteProcessModalProps) {
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!processData) return

    setIsDeleting(true)
    try {
      // Inicializar serviços
      const apiClient = new ApiClient({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://avialex-ti4.onrender.com' })
      const session = Session.getInstance()
      apiClient.setAccessToken(session.getAccessToken())
      const processService = new ProcessService(apiClient)
      const deleteProcessUseCase = new DeleteProcessUseCase(processService)

      await deleteProcessUseCase.execute(processData.id)

      toast({
        title: "Sucesso",
        description: "Processo excluído com sucesso"
      })
      onDeleted(processData.id)
      onClose()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir processo",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir processo</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o processo <strong>{processData?.name}</strong>?
            <br />
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}