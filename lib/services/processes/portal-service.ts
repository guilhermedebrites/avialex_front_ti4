import { ApiClient } from '@/lib/networking/api-client';
import { Process, ProcessStatus } from '@/lib/domain/processes/types';

export class PortalService {
  constructor(private api: ApiClient) {}

  /**
   * Busca um processo pelo ID
   */
  async getProcessById(id: string | number): Promise<Process> {
    return this.api.get(`/process/${id}`, { isAuthorized: true });
  }

  /**
   * Busca um processo pelo número do processo
   * PÚBLICO - não requer autenticação
   */
  async getProcessByNumber(processNumber: number): Promise<Process> {
    return this.api.get(`/process/number/${processNumber}`, { isAuthorized: false });
  }

  /**
   * Busca um processo por ID ou número do processo
   * Usa a rota /process/search com query params
   */
  async searchProcess(params: { id?: number; processNumber?: number }): Promise<Process> {
    const queryParams = new URLSearchParams();

    if (params.id !== undefined) {
      queryParams.append('id', params.id.toString());
    }

    if (params.processNumber !== undefined) {
      queryParams.append('processNumber', params.processNumber.toString());
    }

    const queryString = queryParams.toString();
    return this.api.get(`/process/search?${queryString}`, { isAuthorized: true });
  }
}



let _apiClient: ApiClient;

/**
 * Initialize the portal service with the API client from auth context
 */
export function initializePortalService(apiClient: ApiClient) {
  _apiClient = apiClient;
}

export function getPortalService(): PortalService {
  if (!_apiClient) {
    throw new Error('Portal service not initialized. Call initializePortalService first.');
  }
  return new PortalService(_apiClient);
}