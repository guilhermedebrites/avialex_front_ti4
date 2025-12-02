import { ApiClient } from '../../networking/api-client';
import { Process, CreateProcessDTO, UpdateProcessDTO, ProcessStatus, DashboardResponseDTO, DashboardRequestParams } from '../../domain/processes/types';

/**
 * Serviço de processos
 * Baseado no ProcessController do backend
 */
export class ProcessService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * POST /process
   * Cria novo processo (ADMIN)
   */
  async create(process: CreateProcessDTO): Promise<Process> {
    return this.apiClient.post<Process>('/process', process, { isAuthorized: true });
  }

  /**
   * PUT /process/{id}
   * Atualiza processo (ADMIN)
   */
  async update(id: number, process: UpdateProcessDTO): Promise<Process> {
    return this.apiClient.put<Process>(`/process/${id}`, process, { isAuthorized: true });
  }

  /**
   * GET /process/user/name/{name}
   * Busca processos por nome do usuário (USER, ADMIN)
   */
  async getByUserName(name: string): Promise<Process[]> {
    return this.apiClient.get<Process[]>(`/process/user/name/${name}`, { isAuthorized: true });
  }

  /**
   * GET /process/user/cpf/{cpf}
   * Busca processos por CPF do usuário (USER, ADMIN)
   */
  async getByUserCpf(cpf: string): Promise<Process[]> {
    return this.apiClient.get<Process[]>(`/process/user/cpf/${cpf}`, { isAuthorized: true });
  }

  /**
   * GET /process/{id}
   * Busca processo por ID (USER, ADMIN)
   */
  async getById(id: number): Promise<Process> {
    return this.apiClient.get<Process>(`/process/${id}`, { isAuthorized: true });
  }

  /**
   * PATCH /process/{id}/status
   * Atualiza status do processo (ADMIN)
   */
  async updateStatus(id: number, status: ProcessStatus): Promise<Process> {
    return this.apiClient.patch<Process>(`/process/${id}/status`, status, { isAuthorized: true });
  }

  /**
   * GET /process
   * Lista todos os processos (USER, ADMIN)
   */
  async listProcesses(): Promise<Process[]> {
    return this.apiClient.get<Process[]>('/process', { isAuthorized: true });
  }

  /**
   * DELETE /process/{id}
   * Deleta um processo (ADMIN)
   */
  async delete(id: number): Promise<void> {
    return this.apiClient.delete<void>(`/process/${id}`, { isAuthorized: true });
  }

  /**
   * GET /process/dashboard
   * Busca dados do dashboard com filtros opcionais de data (USER, ADMIN)
   */
  async getDashboard(params?: DashboardRequestParams): Promise<DashboardResponseDTO> {
    const queryParams = new URLSearchParams();

    if (params?.startDate) {
      queryParams.append('startDate', params.startDate);
    }

    if (params?.endDate) {
      queryParams.append('endDate', params.endDate);
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/process/dashboard?${queryString}` : '/process/dashboard';

    return this.apiClient.get<DashboardResponseDTO>(url, { isAuthorized: true });
  }

  /**
   * GET /process/number/{processNumber}
   * Busca processo por número (PÚBLICO - sem autenticação)
   */
  async getByProcessNumber(processNumber: number): Promise<Process> {
    return this.apiClient.get<Process>(`/process/number/${processNumber}`, { isAuthorized: false });
  }
}
