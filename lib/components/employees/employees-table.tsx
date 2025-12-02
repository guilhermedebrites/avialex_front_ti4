"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/lib/components/ui/table"
import { Badge } from "@/lib/components/ui/badge"
import { Button } from "@/lib/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/lib/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, Phone, Mail, Shield } from "lucide-react"
import { Card, CardContent } from "@/lib/components/ui/card"

const employees = [
  {
    id: "1",
    name: "Dr. Carlos Mendes",
    email: "carlos.mendes@avialex.com",
    phone: "(11) 99999-1111",
    role: "Advogado Sênior",
    department: "Jurídico",
    permissions: "admin",
    status: "active",
    processes: 15,
    joinDate: "01/01/2023",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    name: "Dra. Ana Rodrigues",
    email: "ana.rodrigues@avialex.com",
    phone: "(11) 99999-2222",
    role: "Advogada",
    department: "Jurídico",
    permissions: "lawyer",
    status: "active",
    processes: 12,
    joinDate: "15/03/2023",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    name: "Pedro Silva",
    email: "pedro.silva@avialex.com",
    phone: "(11) 99999-3333",
    role: "Paralegal",
    department: "Jurídico",
    permissions: "paralegal",
    status: "active",
    processes: 8,
    joinDate: "10/06/2023",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "4",
    name: "Maria Santos",
    email: "maria.santos@avialex.com",
    phone: "(11) 99999-4444",
    role: "Assistente Administrativo",
    department: "Administrativo",
    permissions: "admin_assistant",
    status: "active",
    processes: 0,
    joinDate: "20/08/2023",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800"
    case "inactive":
      return "bg-red-100 text-red-800"
    case "vacation":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getPermissionColor = (permission: string) => {
  switch (permission) {
    case "admin":
      return "bg-purple-100 text-purple-800"
    case "lawyer":
      return "bg-blue-100 text-blue-800"
    case "paralegal":
      return "bg-green-100 text-green-800"
    case "admin_assistant":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getPermissionLabel = (permission: string) => {
  switch (permission) {
    case "admin":
      return "Administrador"
    case "lawyer":
      return "Advogado"
    case "paralegal":
      return "Paralegal"
    case "admin_assistant":
      return "Assistente"
    default:
      return permission
  }
}

export function EmployeesTable() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Funcionário</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Permissões</TableHead>
              <TableHead>Processos</TableHead>
              <TableHead>Data Admissão</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                      <AvatarFallback>
                        {employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-muted-foreground">{employee.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Phone className="mr-1 h-3 w-3" />
                      {employee.phone}
                    </div>
                    <div className="flex items-center text-sm">
                      <Mail className="mr-1 h-3 w-3" />
                      {employee.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>
                  <Badge className={getPermissionColor(employee.permissions)}>
                    <Shield className="mr-1 h-3 w-3" />
                    {getPermissionLabel(employee.permissions)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">{employee.processes}</TableCell>
                <TableCell>{employee.joinDate}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Desativar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
