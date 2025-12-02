'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ApiClient } from '../networking/api-client';
import { Session, UserType } from '../networking/session';
import { AuthService } from '../services/auth/auth-service';
import { 
  SignInUseCase, 
  SignUpUseCase, 
  SignOutUseCase, 
  RefreshTokenUseCase 
} from '../domain/auth';
import { SignInRequestDTO, SignUpRequestDTO } from '../domain/auth/types';

// ==================== TYPES ====================

interface UserSession {
  id: number;
  name: string;
  email: string;
  type: UserType;
  cpf?: string;
  phone?: string;
  address?: string;
  rg?: string;
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: SignInRequestDTO) => Promise<void>;
  signUp: (data: SignUpRequestDTO) => Promise<void>;
  signOut: (revokeToken?: boolean) => Promise<void>;
  refreshToken: () => Promise<void>;
}

// ==================== CONTEXT ====================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==================== PROVIDER ====================

interface AuthProviderProps {
  children: ReactNode;
  apiBaseURL?: string;
}

export function AuthProvider({ children, apiBaseURL = 'https://avialex-ti4.onrender.com' }: AuthProviderProps) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inicializar serviços
  const apiClient = new ApiClient({ baseURL: apiBaseURL });
  const session = Session.getInstance();
  const authService = new AuthService(apiClient);

  // Inicializar serviços adicionais
  import('@/lib/services/processes/portal-service').then(({ initializePortalService }) => {
    initializePortalService(apiClient);
  });
  
  const signInUseCase = new SignInUseCase(authService, session, apiClient);
  const signUpUseCase = new SignUpUseCase(authService);
  const signOutUseCase = new SignOutUseCase(authService, session);
  const refreshTokenUseCase = new RefreshTokenUseCase(authService, session);

  // Configura callback de refresh no ApiClient
  apiClient.setRefreshTokenCallback(async () => {
    try {
      await refreshTokenUseCase.execute();
      const newToken = session.getAccessToken();
      if (newToken) {
        apiClient.setAccessToken(newToken);
      }
    } catch (error) {
      console.error('Erro no callback de refresh:', error);
      session.clearSession();
      setUser(null);
    }
  });

  // Carregar sessão do usuário ao montar
  useEffect(() => {
    const loadSession = async () => {
      try {
        const userSession = session.getUserSession();
        const accessToken = session.getAccessToken();

        if (userSession && accessToken) {
          // Define o token no cliente API
          apiClient.setAccessToken(accessToken);

          // Verifica se o token está expirado
          if (session.isTokenExpired()) {
            try {
              // Tenta fazer refresh
              await refreshTokenUseCase.execute();
              const newToken = session.getAccessToken();
              if (newToken) {
                apiClient.setAccessToken(newToken);
              } else {
                throw new Error('Falha ao obter novo token');
              }
            } catch (error) {
              console.error('Erro ao fazer refresh do token:', error);
              session.clearSession();
              setIsLoading(false);
              return;
            }
          }

          // Busca dados completos do usuário
          try {
            const userData = await authService.getUserById(userSession.id);
            const updatedUserSession = {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              type: userData.type,
              cpf: userData.cpf,
              phone: userData.phone,
              address: userData.address,
              rg: userData.rg,
            };
            
            // Atualiza a sessão com dados completos
            session.saveUserSession(updatedUserSession);
            setUser(updatedUserSession);
          } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
            setUser(userSession);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
        session.clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  // ==================== ACTIONS ====================

  const signIn = async (credentials: SignInRequestDTO) => {
    setIsLoading(true);
    try {
      await signInUseCase.execute(credentials);
      
      const userSession = session.getUserSession();
      const accessToken = session.getAccessToken();
      
      if (userSession && accessToken) {
        apiClient.setAccessToken(accessToken);
        setUser(userSession);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: SignUpRequestDTO) => {
    setIsLoading(true);
    try {
      await signUpUseCase.execute(data);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (revokeToken: boolean = false) => {
    setIsLoading(true);
    try {
      await signOutUseCase.execute(revokeToken);
      apiClient.setAccessToken(null);
      setUser(null);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      await refreshTokenUseCase.execute();
      const newToken = session.getAccessToken();
      if (newToken) {
        apiClient.setAccessToken(newToken);
      }
    } catch (error) {
      // Se falhar o refresh, faz logout
      await signOut();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ==================== HOOK ====================

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}
