import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/auth-context';
import { UserType } from '../networking/session';

/**
 * Hook para proteger rotas que requerem autenticação
 * @param requiredTypes - Tipos de usuário permitidos (opcional)
 * @param redirectTo - Rota para redirecionar se não autorizado (padrão: /login)
 */
export function useRequireAuth(requiredTypes?: UserType[], redirectTo: string = '/login') {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Se não está autenticado, redireciona para login
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // Se há tipos requeridos e o usuário não tem o tipo correto
      if (requiredTypes && requiredTypes.length > 0 && user) {
        if (!requiredTypes.includes(user.type)) {
          router.push('/dashboard'); // Redireciona para dashboard se não tem permissão
        }
      }
    }
  }, [isAuthenticated, isLoading, user, requiredTypes, redirectTo, router]);

  return { isAuthenticated, user, isLoading };
}
