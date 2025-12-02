'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UsersHeader } from "@/lib/components/users/users-header"
import { UsersTable } from "@/lib/components/users/users-table"
import { UsersFilters } from "@/lib/components/users/users-filters"
import { useState } from "react"
import { UserType } from "@/lib/networking/session"
import { DashboardLayout } from "@/lib/components/dashboard/dashboard-layout"
import { useUserPermissions } from "@/lib/hooks/use-user-permissions"

export default function UsersPage() {
  const { canAccessUsersPage, isLoading } = useUserPermissions();
  const router = useRouter();
  const [filters, setFilters] = useState<{ name?: string; email?: string; cpf?: string; type?: UserType }>({});

  useEffect(() => {
    if (!isLoading && !canAccessUsersPage) {
      // Redireciona para dashboard se não tem permissão
      router.push("/dashboard");
    }
  }, [canAccessUsersPage, isLoading, router]);

  // Mostra loading enquanto verifica permissões
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-2 text-muted-foreground">Verificando permissões...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Se não tem permissão, não renderiza nada (já redirecionou)
  if (!canAccessUsersPage) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <UsersHeader />
        <UsersFilters onFiltersChange={setFilters} />
        <UsersTable filters={filters} />
      </div>
    </DashboardLayout>
  )
}
