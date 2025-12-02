import { ApiClient } from '../../networking/api-client';
import { User, CreateUserDTO, UpdateUserDTO, SearchUsersParams, ListUsersParams } from '../../domain/users/types';

/**
 * Serviço de usuários
 * Baseado no UserController do backend
 */
export class UserService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * GET /user
   * Lista usuários com filtros (ADMIN, STAFF)
   */
  async listUsers(params?: ListUsersParams): Promise<User[]> {
    return this.apiClient.get<User[]>('/user', { 
      params: params as any,
      isAuthorized: true 
    });
  }

  /**
   * GET /user/{id}
   * Busca usuário por ID (USER, STAFF, ADMIN)
   */
  async findById(id: number): Promise<User> {
    return this.apiClient.get<User>(`/user/${id}`, { isAuthorized: true });
  }

  /**
   * POST /user
   * Cria novo usuário (ADMIN)
   */
  async createUser(user: CreateUserDTO): Promise<User> {
    return this.apiClient.post<User>('/user', user, { isAuthorized: true });
  }

  /**
   * PUT /user/{id}
   * Atualiza usuário (STAFF, ADMIN)
   */
  async updateUser(id: number, user: UpdateUserDTO): Promise<User> {
    return this.apiClient.put<User>(`/user/${id}`, user, { isAuthorized: true });
  }

  /**
   * DELETE /user/{id}
   * Deleta usuário (ADMIN)
   */
  async deleteUser(id: number): Promise<void> {
    return this.apiClient.delete<void>(`/user/${id}`, { isAuthorized: true });
  }

  /**
   * GET /user/search
   * Busca usuários com múltiplos filtros
   */
  async searchUsers(params: SearchUsersParams): Promise<User[]> {
    return this.apiClient.get<User[]>('/user/search', { 
      params: params as any,
      isAuthorized: true 
    });
  }

  /**
   * GET /user/profile
   * Acessa perfil do usuário (USER, ADMIN)
   */
  async getUserProfile(): Promise<string> {
    return this.apiClient.get<string>('/user/profile', { isAuthorized: true });
  }
}
