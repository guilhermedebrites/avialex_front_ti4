import { useAuthPermissions } from './use-auth-permissions';

/**
 * Hook para verificar permissões específicas de processos
 * Baseado no ProcessController do backend
 */
export function useProcessPermissions() {
  const { user, isManager, isLawyer, isMarketing, isClient } = useAuthPermissions();

  // Mapeamento baseado no backend:
  // MANAGER = ADMIN
  // LAWYER, MARKETING, CLIENT = USER

  const canCreateProcess = isManager; // hasRole('ADMIN')
  const canUpdateProcess = isManager; // hasRole('ADMIN')
  const canUpdateProcessStatus = isManager; // hasRole('ADMIN')
  const canViewProcess = isManager || isLawyer || isMarketing || isClient; // hasAnyRole('USER','ADMIN')
  const canSearchProcessByUserName = isManager || isLawyer || isMarketing || isClient; // hasAnyRole('USER','ADMIN')
  const canSearchProcessByUserCpf = isManager || isLawyer || isMarketing || isClient; // hasAnyRole('USER','ADMIN')

  // Para acessar a página de processos, precisa pelo menos conseguir visualizar processos
  const canAccessProcessesPage = canViewProcess;

  return {
    // Permissões específicas
    canCreateProcess,
    canUpdateProcess,
    canUpdateProcessStatus,
    canViewProcess,
    canSearchProcessByUserName,
    canSearchProcessByUserCpf,
    // Acesso geral à página
    canAccessProcessesPage,
  };
}