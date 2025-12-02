"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/lib/components/ui/button"
import { ScrollArea } from "@/lib/components/ui/scroll-area"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  MessageSquare,
  Star,
  History,
  Settings,
  X,
  Scale,
  Search,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUserPermissions } from "@/lib/hooks/use-user-permissions"
import { useAuthPermissions } from "@/lib/hooks/use-auth-permissions"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { canAccessUsersPage, canAccessDashboard } = useUserPermissions()
  const { isClient } = useAuthPermissions()

  // Separar itens por perfil para melhor organização
  // Clientes não têm acesso ao dashboard principal
  const clientNavigation = [
    { name: "Meus Processos", href: "/portal", icon: Search },
    { name: "Avaliações", href: "/dashboard/reviews", icon: Star },
  ];

  const staffNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Processos Jurídicos", href: "/dashboard/processes", icon: Scale },
    { name: "Portal de Processos", href: "/portal", icon: Search },
    ...(canAccessUsersPage ? [{ name: "Usuários", href: "/dashboard/users", icon: Users }] : []),
    { name: "Avaliações", href: "/dashboard/reviews", icon: Star },
    // { name: "Comunicações", href: "/dashboard/communications", icon: MessageSquare },
    // { name: "Histórico", href: "/dashboard/history", icon: History },
    // { name: "Relatórios", href: "/dashboard/reports", icon: FileText },
  ];

  // Usar navegação apropriada baseado no perfil
  const navigation = isClient ? clientNavigation : staffNavigation;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">A</span>
              </div>
              <span className="text-xl font-bold text-foreground">Avialex</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {navigation.map((item) => {
                // Para dashboard, só ativa na rota exata
                const isActive = item.href === '/dashboard'
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    )}
                    onClick={onClose}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">© 2024 Avialex</div>
          </div>
        </div>
      </div>
    </>
  )
}
