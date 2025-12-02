import { useAuthPermissions } from './use-auth-permissions';

/**
 * Hook para verificar permissões específicas de usuários
 * Baseado no UserController do backend
 */
export function useUserPermissions() {
  const { user, isManager, isLawyer, isMarketing, isClient } = useAuthPermissions();

  // Mapeamento baseado no backend:
  // MANAGER = ADMIN + STAFF
  // LAWYER = STAFF  
  // MARKETING = STAFF
  // CLIENT = USER

  const canListUsers = isManager || isLawyer || isMarketing; // hasAnyRole('ADMIN','STAFF')
  const canViewUser = isManager || isLawyer || isMarketing || isClient; // hasAnyRole('USER','STAFF','ADMIN')
  const canCreateUser = isManager; // hasRole('ADMIN')
  const canUpdateUser = isManager || isLawyer || isMarketing; // hasAnyRole('STAFF','ADMIN')
  const canDeleteUser = isManager; // hasRole('ADMIN')
  const canSearchUsers = true; // Sem @PreAuthorize - endpoint público
  const canAccessAdminOnly = isManager; // hasRole('ADMIN')
  const canAccessProfile = isManager || isClient; // hasAnyRole('USER', 'ADMIN')

  // Para acessar a página de usuários, precisa pelo menos conseguir listar usuários
  // CLIENT pode ver seus próprios dados, mas não deve acessar a página de gerenciamento de usuários
  const canAccessUsersPage = canListUsers || canCreateUser || canUpdateUser || canDeleteUser;

  // Portal de Processos é acessível para todos os usuários autenticados
  // Clientes podem ver seus processos, Staff pode consultar qualquer processo
  const canAccessPortal = true;

  // Dashboard é acessível apenas para ADMIN (MANAGER) e LAWYER
  // Clientes não podem acessar o dashboard principal
  const canAccessDashboard = isManager || isLawyer;

  return {
    user,
    // Permissões específicas
    canListUsers,
    canViewUser,
    canCreateUser,
    canUpdateUser,
    canDeleteUser,
    canSearchUsers,
    canAccessAdminOnly,
    canAccessProfile,
    // Acesso geral às páginas
    canAccessUsersPage,
    canAccessPortal,
    canAccessDashboard,
  };
}
