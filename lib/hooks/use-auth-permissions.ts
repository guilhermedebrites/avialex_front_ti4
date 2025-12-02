import { useAuth } from '../contexts/auth-context';
import { UserType } from '../networking/session';

/**
 * Hook para verificar permissões do usuário autenticado
 */
export function useAuthPermissions() {
  const { user, isAuthenticated } = useAuth();

  const isManager = user?.type === UserType.MANAGER;
  const isLawyer = user?.type === UserType.LAWYER;
  const isMarketing = user?.type === UserType.MARKETING;
  const isClient = user?.type === UserType.CLIENT;

  const hasAdminPermissions = isManager;
  const isStaff = isManager || isLawyer || isMarketing;

  return {
    user,
    isAuthenticated,
    isManager,
    isLawyer,
    isMarketing,
    isClient,
    hasAdminPermissions,
    isStaff,
  };
}
