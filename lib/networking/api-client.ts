// ==================== API HELPERS ====================

export interface ApiError {
  message: string;
  status: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

// ==================== TYPES ====================

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestConfig {
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean>;
  isAuthorized?: boolean;
}

interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;
  private accessToken: string | null = null;
  private refreshTokenCallback: (() => Promise<void>) | null = null;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 30000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  /**
   * Define o token de acesso para autenticação
   */
  setAccessToken(token: string | null): void {
    this.accessToken = token;
  }

  /**
   * Define o callback para refresh de token
   */
  setRefreshTokenCallback(callback: (() => Promise<void>) | null): void {
    this.refreshTokenCallback = callback;
  }

  /**
   * Obtém o token de acesso atual
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Realiza uma requisição HTTP
   */
  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    config?: RequestConfig
  ): Promise<T> {
    const makeRequest = async (): Promise<Response> => {
      const url = this.buildURL(endpoint, config?.params);
      const headers = this.buildHeaders(config?.headers, config?.isAuthorized);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      try {
        const response = await fetch(url, {
          method,
          headers,
          body: config?.body ? JSON.stringify(config.body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        
        throw error;
      }
    };

    let response = await makeRequest();

    // Se for erro 401 e temos callback de refresh, tenta fazer refresh
    if (!response.ok && response.status === 401 && this.refreshTokenCallback && config?.isAuthorized) {
      try {
        await this.refreshTokenCallback();
        // Tenta a requisição novamente com o novo token
        response = await makeRequest();
      } catch (refreshError) {
        // Se o refresh falhar, continua com o erro original
      }
    }

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    // Se não houver conteúdo, retorna null (comum para DELETE)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return null as T;
    }

    const data = await response.json();
    return data;
  }

  /**
   * Constrói a URL completa com parâmetros de query
   */
  private buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(endpoint, this.baseURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Constrói os headers da requisição
   */
  private buildHeaders(customHeaders?: Record<string, string>, isAuthorized?: boolean): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...customHeaders };

    // Adiciona token de autorização apenas se isAuthorized for true e token disponível
    if (isAuthorized && this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  /**
   * Trata erros da resposta
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = `HTTP Error ${response.status}`;

    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } else {
        errorMessage = await response.text() || errorMessage;
      }
    } catch {
      // Se falhar ao ler o erro, usa a mensagem padrão
    }

    const error = new Error(errorMessage) as Error & { status: number };
    error.status = response.status;
    throw error;
  }

  /**
   * GET request
   * @param endpoint - Endpoint da API
   * @param config - Configurações da requisição (params, headers, isAuthorized)
   * @example
   * // Sem autenticação
   * client.get('/public/data')
   * 
   * // Com autenticação
   * client.get('/user/profile', { isAuthorized: true })
   */
  get<T>(endpoint: string, config?: Omit<RequestConfig, 'body'>): Promise<T> {
    return this.request<T>('GET', endpoint, config);
  }

  /**
   * POST request
   * @param endpoint - Endpoint da API
   * @param body - Corpo da requisição
   * @param config - Configurações da requisição (params, headers, isAuthorized)
   * @example
   * // Login (sem autenticação)
   * client.post('/auth/signin', { email, password })
   * 
   * // Criar recurso (com autenticação)
   * client.post('/process', data, { isAuthorized: true })
   */
  post<T>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'body'>): Promise<T> {
    return this.request<T>('POST', endpoint, { ...config, body });
  }

  /**
   * PUT request
   * @param endpoint - Endpoint da API
   * @param body - Corpo da requisição
   * @param config - Configurações da requisição (params, headers, isAuthorized)
   */
  put<T>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'body'>): Promise<T> {
    return this.request<T>('PUT', endpoint, { ...config, body });
  }

  /**
   * PATCH request
   * @param endpoint - Endpoint da API
   * @param body - Corpo da requisição
   * @param config - Configurações da requisição (params, headers, isAuthorized)
   */
  patch<T>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'body'>): Promise<T> {
    return this.request<T>('PATCH', endpoint, { ...config, body });
  }

  /**
   * DELETE request
   * @param endpoint - Endpoint da API
   * @param body - Corpo da requisição (opcional)
   * @param config - Configurações da requisição (params, headers, isAuthorized)
   */
  delete<T>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'body'>): Promise<T> {
    return this.request<T>('DELETE', endpoint, { ...config, body });
  }
}

// ==================== INSTÂNCIA GLOBAL ====================

/**
 * Instância global do ApiClient para uso em contextos sem autenticação
 * Como landing page e outros componentes públicos
 */
export const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://avialex-ti4.onrender.com',
});
