import { ApiClient } from '../../networking/api-client';
import { 
  SignInRequestDTO, 
  SignUpRequestDTO, 
  RefreshTokenRequestDTO,
  AuthResponseDTO,
  UserResponseDTO 
} from '../../domain/auth/types';

/**
 * Serviço de autenticação
 * Baseado no AuthController do backend
 */
export class AuthService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * POST /auth/signin
   * Realiza login do usuário
   */
  async signIn(request: SignInRequestDTO): Promise<AuthResponseDTO> {
    return this.apiClient.post<AuthResponseDTO>('/auth/signin', request);
  }

  /**
   * POST /auth/signup
   * Registra novo usuário
   */
  async signUp(request: SignUpRequestDTO): Promise<UserResponseDTO> {
    return this.apiClient.post<UserResponseDTO>('/auth/signup', request);
  }

  /**
   * POST /auth/signout
   * Logout do usuário (sem revogar token)
   */
  async signOut(): Promise<void> {
    return this.apiClient.post<void>('/auth/signout', undefined, { isAuthorized: true });
  }

  /**
   * POST /auth/refresh
   * Atualiza o access token usando refresh token
   */
  async refresh(request: RefreshTokenRequestDTO): Promise<AuthResponseDTO> {
    return this.apiClient.post<AuthResponseDTO>('/auth/refresh', request);
  }

  /**
   * POST /auth/signout/revoke
   * Logout com revogação de tokens
   */
  async signOutRevoke(request: RefreshTokenRequestDTO): Promise<void> {
    return this.apiClient.post<void>('/auth/signout/revoke', request, { isAuthorized: true });
  }

  /**
   * POST /auth/me
   * Obtém informações do usuário autenticado via JWT
   */
  async me(): Promise<Record<string, unknown>> {
    return this.apiClient.post<Record<string, unknown>>('/auth/me', undefined, { isAuthorized: true });
  }

  /**
   * GET /user/{id}
   * Obtém dados completos do usuário por ID
   */
  async getUserById(id: number): Promise<any> {
    return this.apiClient.get(`/user/${id}`, { isAuthorized: true });
  }
}
