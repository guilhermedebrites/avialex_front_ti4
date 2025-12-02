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
import { MoreHorizontal, Edit, Trash2, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/lib/components/ui/card"
import { useProcessPermissions } from "@/lib/hooks/use-process-permissions"
import { ApiClient } from "@/lib/networking/api-client"
import { Session } from "@/lib/networking/session"
import { ProcessService } from "@/lib/services/processes/process-service"
import { ListProcessesUseCase } from "@/lib/domain/processes/use-cases/list-processes.use-case"
import { Process, ProcessStatus } from "@/lib/domain/processes/types"
import { useToast } from "@/lib/hooks/use-toast"
import { DeleteProcessModal } from "./delete-process-modal"
import { EditProcessModal } from "./edit-process-modal"

interface ProcessesTableProps {
  filters?: any
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

const getStatusColor = (status: ProcessStatus) => {
  switch (status) {
    case ProcessStatus.CREATED:
      return "bg-blue-100 text-blue-800"
    case ProcessStatus.IN_PROGRESS:
      return "bg-yellow-100 text-yellow-800"
    case ProcessStatus.COMPLETED:
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function ProcessesTable({ filters }: ProcessesTableProps) {
  const { canViewProcess, canUpdateProcess, canCreateProcess } = useProcessPermissions()
  const { toast } = useToast()

  const [allProcesses, setAllProcesses] = useState<Process[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Estados dos modais
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Carrega todos os processos uma vez
  useEffect(() => {
    const loadProcesses = async () => {
      if (!canViewProcess) {
        setIsLoading(false)
        return
      }

      try {
        // Inicializar serviços
        const apiClient = new ApiClient({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://avialex-ti4.onrender.com' })
        const session = Session.getInstance()
        apiClient.setAccessToken(session.getAccessToken())
        const processService = new ProcessService(apiClient)
        const listProcessesUseCase = new ListProcessesUseCase(processService)

        const processesList = await listProcessesUseCase.execute()
        setAllProcesses(processesList)
      } catch (error: any) {
        toast({
          title: "Erro",
          description: error.message || "Erro ao carregar processos",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProcesses()
  }, [canViewProcess])

  // Aplicar filtros com lógica OR para busca de texto e AND para status
  let filteredProcesses = allProcesses

  if (filters && Object.keys(filters).length > 0) {
    // Filtro de busca de texto (OR entre nome do processo e nome do cliente)
    if (filters.name || filters.clientName) {
      filteredProcesses = filteredProcesses.filter(p => {
        const matchName = filters.name ?
          p.name.toLowerCase().includes(filters.name.toLowerCase()) : false
        const matchClientName = filters.clientName ?
          p.clientId?.name?.toLowerCase().includes(filters.clientName.toLowerCase()) : false
        return matchName || matchClientName
      })
    }

    // Filtro de CPF
    if (filters.clientCpf) {
      filteredProcesses = filteredProcesses.filter(p =>
        p.clientId?.cpf?.includes(filters.clientCpf)
      )
    }

    // Filtro de número do processo
    if (filters.processNumber) {
      filteredProcesses = filteredProcesses.filter(p =>
        p.processNumber.toString().includes(filters.processNumber)
      )
    }

    // Filtro de status
    if (filters.status) {
      filteredProcesses = filteredProcesses.filter(p => p.status === filters.status)
    }
  }

  // Funções dos modais
  const handleEditProcess = (process: Process) => {
    setSelectedProcess(process)
    setIsEditModalOpen(true)
  }

  const handleDeleteProcess = (process: Process) => {
    setSelectedProcess(process)
    setIsDeleteModalOpen(true)
  }

  const handleProcessUpdated = useCallback(async () => {
    // Recarrega a lista de processos
    if (!canViewProcess) return

    try {
      // Inicializar serviços
      const apiClient = new ApiClient({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://avialex-ti4.onrender.com' })
      const session = Session.getInstance()
      apiClient.setAccessToken(session.getAccessToken())
      const processService = new ProcessService(apiClient)
      const listProcessesUseCase = new ListProcessesUseCase(processService)

      const processesList = await listProcessesUseCase.execute()
      setAllProcesses(processesList)
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao carregar processos",
        variant: "destructive"
      })
    }
  }, [canViewProcess, toast])

  const handleProcessDeleted = useCallback(async (deletedProcessId?: number) => {
    // Se temos o ID do processo deletado, remove otimisticamente da lista
    if (deletedProcessId) {
      setAllProcesses(prev => prev.filter(p => p.id !== deletedProcessId))
    }

    // Também recarrega a lista para garantir sincronização
    if (!canViewProcess) return

    try {
      // Inicializar serviços
      const apiClient = new ApiClient({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://avialex-ti4.onrender.com' })
      const session = Session.getInstance()
      apiClient.setAccessToken(session.getAccessToken())
      const processService = new ProcessService(apiClient)
      const listProcessesUseCase = new ListProcessesUseCase(processService)

      const processesList = await listProcessesUseCase.execute()
      setAllProcesses(processesList)
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao carregar processos",
        variant: "destructive"
      })
    }
  }, [canViewProcess, toast])


  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando processos...</p>
        </CardContent>
      </Card>
    )
  }

  if (!canViewProcess) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Você não tem permissão para visualizar processos.</p>
        </CardContent>
      </Card>
    )
  }

  if (filteredProcesses.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Nenhum processo encontrado.</p>
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
                <TableHead>Processo</TableHead>
                <TableHead className="text-center">Cliente</TableHead>
                <TableHead className="text-center">Número</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Partes Envolvidas</TableHead>
                <TableHead className="text-center">Data de Criação</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProcesses.map((processItem) => (
                <TableRow key={processItem.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-medium">{processItem.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <div>
                        <div className="font-medium">{processItem.clientId?.name || "N/A"}</div>
                        <div className="text-sm text-muted-foreground">{processItem.clientId?.email || ""}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-center">{processItem.processNumber}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={getStatusColor(processItem.status)}>{getStatusLabel(processItem.status)}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="max-w-xs truncate">
                      {processItem.involvedParties.length > 0 ? processItem.involvedParties.join(", ") : "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {new Date(processItem.creationDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        {canUpdateProcess && (
                          <DropdownMenuItem onClick={() => handleEditProcess(processItem)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        )}
                        {canUpdateProcess && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleDeleteProcess(processItem)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </>
                        )}
                        {!canUpdateProcess && (
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
      <DeleteProcessModal
        process={selectedProcess}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleted={handleProcessDeleted}
      />
      <EditProcessModal
        process={selectedProcess}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdated={handleProcessUpdated}
      />
    </>
  )
}
