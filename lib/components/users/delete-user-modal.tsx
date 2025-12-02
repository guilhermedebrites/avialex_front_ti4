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
import { useState } from "react"
import { ApiClient } from "@/lib/networking/api-client"
import { Session } from "@/lib/networking/session"
import { UserService } from "@/lib/services/users/user-service"
import { DeleteUserUseCase } from "@/lib/domain/users/use-cases/delete-user.use-case"
import { User } from "@/lib/domain/users/types"
import { useToast } from "@/lib/hooks/use-toast"

interface DeleteUserModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onDeleted: (deletedUserId?: number) => void
}

export function DeleteUserModal({ user, isOpen, onClose, onDeleted }: DeleteUserModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()


  const handleDelete = async () => {
    if (!user) return

    setIsDeleting(true)
    try {
      // Inicializar serviços
      const apiClient = new ApiClient({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://avialex-ti4.onrender.com' })
      const session = Session.getInstance()
      apiClient.setAccessToken(session.getAccessToken())
      const userService = new UserService(apiClient)
      const deleteUserUseCase = new DeleteUserUseCase(userService)

      await deleteUserUseCase.execute(user.id)
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso"
      })
      onDeleted(user.id)
      onClose()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir usuário",
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
          <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o usuário <strong>{user?.name}</strong>?
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