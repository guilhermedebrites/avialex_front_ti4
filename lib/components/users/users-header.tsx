'use client';

import { Button } from "@/lib/components/ui/button"
import { Plus, Download, Upload } from "lucide-react"
import Link from "next/link"
import { useUserPermissions } from "@/lib/hooks/use-user-permissions"

export function UsersHeader() {
  const { canCreateUser } = useUserPermissions();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestão de Usuários</h1>
        <p className="text-muted-foreground mt-1">Gerencie os usuários do sistema Avialex</p>
      </div>
      <div className="flex items-center space-x-2">
        {canCreateUser && (
          <Link href="/dashboard/users/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
