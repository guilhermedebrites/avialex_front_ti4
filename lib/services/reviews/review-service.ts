import { ApiClient } from '../../networking/api-client';
import {
  ReviewRequestDTO,
  ReviewResponseDTO,
  PageResponse
} from '../../domain/reviews/types';

/**
 * Serviço de Reviews
 * Baseado no ReviewController do backend
 */
export class ReviewService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * POST /review
   * Cria uma nova avaliação
   * @requires AUTH - Roles: USER, ADMIN
   */
  async create(request: ReviewRequestDTO): Promise<ReviewResponseDTO> {
    return this.apiClient.post<ReviewResponseDTO>('/review', request, { isAuthorized: true });
  }

  /**
   * PUT /review
   * Atualiza uma avaliação existente
   * @requires AUTH - Roles: USER, ADMIN
   */
  async update(request: ReviewRequestDTO): Promise<ReviewResponseDTO> {
    return this.apiClient.put<ReviewResponseDTO>('/review', request, { isAuthorized: true });
  }

  /**
   * DELETE /review
   * Remove uma avaliação
   * @requires AUTH - Role: STAFF
   */
  async delete(request: ReviewRequestDTO): Promise<ReviewResponseDTO> {
    return this.apiClient.delete<ReviewResponseDTO>('/review', request, { isAuthorized: true });
  }

  /**
   * GET /review/all
   * Obtém todas as avaliações com paginação
   * @requires AUTH - Roles: USER, ADMIN
   * @param page - Número da página (default: 0)
   * @param size - Tamanho da página (default: 10)
   * @param sort - Campo de ordenação (default: createdAt)
   * @param direction - Direção da ordenação (default: DESC)
   */
  async getAll(
    page: number = 0,
    size: number = 10,
    sort: string = 'createdAt',
    direction: 'ASC' | 'DESC' = 'DESC'
  ): Promise<PageResponse<ReviewResponseDTO>> {
    return this.apiClient.get<PageResponse<ReviewResponseDTO>>('/review/all', {
      isAuthorized: true,
      params: { page, size, sort: `${sort},${direction}` }
    });
  }

  /**
   * GET /review/user/{userId}
   * Obtém todas as avaliações de um usuário específico
   * @requires AUTH - Roles: USER, ADMIN
   */
  async getByUserId(userId: number): Promise<ReviewResponseDTO[]> {
    return this.apiClient.get<ReviewResponseDTO[]>(`/review/user/${userId}`, {
      isAuthorized: true
    });
  }

  /**
   * GET /review/{id}
   * Obtém uma avaliação por ID
   * @requires AUTH - Roles: USER, ADMIN
   */
  async getById(id: number): Promise<ReviewResponseDTO> {
    return this.apiClient.get<ReviewResponseDTO>(`/review/${id}`, {
      isAuthorized: true
    });
  }
}
