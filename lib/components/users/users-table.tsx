"use client"

import { useState, useEffect, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/lib/components/ui/table"
import { Badge } from "@/lib/components/ui/badge"
import { Button } from "@/lib/components/ui/button"
import { Avatar, AvatarFallback } from "@/lib/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Phone, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/lib/components/ui/card"
import { useUserPermissions } from "@/lib/hooks/use-user-permissions"
import { ApiClient } from "@/lib/networking/api-client"
import { Session, UserType } from "@/lib/networking/session"
import { UserService } from "@/lib/services/users/user-service"
import { ListUsersUseCase } from "@/lib/domain/users/use-cases/list-users.use-case"
import { User, ListUsersParams } from "@/lib/domain/users/types"
import { useToast } from "@/lib/hooks/use-toast"
import { DeleteUserModal } from "./delete-user-modal"
import { EditUserModal } from "./edit-user-modal"

interface UsersTableProps {
  filters?: ListUsersParams
}

const getTypeLabel = (type: UserType) => {
  switch (type) {
    case UserType.CLIENT:
      return "Cliente"
    case UserType.MANAGER:
      return "Gerente"
    case UserType.LAWYER:
      return "Advogado"
    case UserType.MARKETING:
      return "Marketing"
    default:
      return type
  }
}

const getTypeColor = (type: UserType) => {
  switch (type) {
    case UserType.CLIENT:
      return "bg-blue-100 text-blue-800"
    case UserType.MANAGER:
      return "bg-purple-100 text-purple-800"
    case UserType.LAWYER:
      return "bg-green-100 text-green-800"
    case UserType.MARKETING:
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function UsersTable({ filters }: UsersTableProps) {
  const { canUpdateUser, canDeleteUser, canListUsers } = useUserPermissions()
  const { toast } = useToast()

  const [allUsers, setAllUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Estados dos modais
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Carrega todos os usuários uma vez
  useEffect(() => {
    const loadUsers = async () => {
      if (!canListUsers) {
        setIsLoading(false)
        return
      }

      try {
        // Inicializar serviços
        const apiClient = new ApiClient({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://avialex-ti4.onrender.com' })
        const session = Session.getInstance()
        apiClient.setAccessToken(session.getAccessToken())
        const userService = new UserService(apiClient)
        const listUsersUseCase = new ListUsersUseCase(userService)

        const usersList = await listUsersUseCase.execute()
        setAllUsers(usersList)
      } catch (error: any) {
        toast({
          title: "Erro",
          description: error.message || "Erro ao carregar usuários",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [canListUsers])

  // Aplicar filtros simples sem useMemo
  let filteredUsers = allUsers

  if (filters && Object.keys(filters).length > 0) {
    if (filters.name) {
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(filters.name!.toLowerCase())
      )
    }
    if (filters.email) {
      filteredUsers = filteredUsers.filter(user =>
        user.email.toLowerCase().includes(filters.email!.toLowerCase())
      )
    }
    if (filters.cpf) {
      filteredUsers = filteredUsers.filter(user =>
        user.cpf.includes(filters.cpf!)
      )
    }
    if (filters.type) {
      filteredUsers = filteredUsers.filter(user => user.type === filters.type)
    }
  }

  // Funções dos modais
  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const handleUserUpdated = useCallback(async () => {
    // Recarrega a lista de usuários
    if (!canListUsers) return

    try {
      // Inicializar serviços
      const apiClient = new ApiClient({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://avialex-ti4.onrender.com' })
      const session = Session.getInstance()
      apiClient.setAccessToken(session.getAccessToken())
      const userService = new UserService(apiClient)
      const listUsersUseCase = new ListUsersUseCase(userService)

      const usersList = await listUsersUseCase.execute()
      setAllUsers(usersList)
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao carregar usuários",
        variant: "destructive"
      })
    }
  }, [canListUsers, toast])

  const handleUserDeleted = useCallback(async (deletedUserId?: number) => {
    // Se temos o ID do usuário deletado, remove otimisticamente da lista
    if (deletedUserId) {
      setAllUsers(prev => prev.filter(user => user.id !== deletedUserId))
    }

    // Também recarrega a lista para garantir sincronização
    if (!canListUsers) return

    try {
      // Inicializar serviços
      const apiClient = new ApiClient({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://avialex-ti4.onrender.com' })
      const session = Session.getInstance()
      apiClient.setAccessToken(session.getAccessToken())
      const userService = new UserService(apiClient)
      const listUsersUseCase = new ListUsersUseCase(userService)

      const usersList = await listUsersUseCase.execute()
      setAllUsers(usersList)
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao carregar usuários",
        variant: "destructive"
      })
    }
  }, [canListUsers, toast])


  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando usuários...</p>
        </CardContent>
      </Card>
    )
  }

  if (!canListUsers) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Você não tem permissão para visualizar usuários.</p>
        </CardContent>
      </Card>
    )
  }

  if (filteredUsers.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Nenhum usuário encontrado.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Usuário</TableHead>
                <TableHead className="text-center">Contato</TableHead>
                <TableHead className="text-center">CPF</TableHead>
                <TableHead className="text-center">RG</TableHead>
                <TableHead className="text-center">Tipo</TableHead>
                <TableHead className="text-center">Endereço</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {(() => {
                            const nameParts = user.name.trim().split(" ").filter(part => part.length > 0);
                            if (nameParts.length >= 2) {
                              return nameParts[0][0] + nameParts[nameParts.length - 1][0];
                            }
                            return nameParts[0]?.[0] || "?";
                          })()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center text-sm">
                        <Phone className="mr-1 h-3 w-3" />
                        {user.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-center">{user.cpf}</TableCell>
                  <TableCell className="font-mono text-center">{user.rg}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={getTypeColor(user.type)}>{getTypeLabel(user.type)}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-center">{user.address}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        {canUpdateUser && (
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        )}
                        {canDeleteUser && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleDeleteUser(user)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </>
                        )}
                        {!canUpdateUser && !canDeleteUser && (
                          <>
                            <DropdownMenuItem disabled className="text-gray-400">
                              <Edit className="mr-2 h-4 w-4" />
                              Editar (sem permissão)
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled className="text-gray-400">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir (sem permissão)
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modais */}
      <DeleteUserModal
        user={selectedUser}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleted={handleUserDeleted}
      />
      <EditUserModal
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdated={handleUserUpdated}
      />
    </>
  )
}