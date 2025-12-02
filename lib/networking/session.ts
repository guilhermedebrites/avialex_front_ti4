import Cookies from 'js-cookie';

// ==================== TYPES ====================

export enum UserType {
  CLIENT = 'CLIENT',
  MANAGER = 'MANAGER',
  LAWYER = 'LAWYER',
  MARKETING = 'MARKETING'
}

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

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

const ACCESS_TOKEN_KEY = 'avialex_access_token';
const REFRESH_TOKEN_KEY = 'avialex_refresh_token';
const USER_SESSION_KEY = 'avialex_user_session';
const TOKEN_EXPIRY_KEY = 'avialex_token_expiry';

export class Session {
  private static instance: Session;
  private userSession: UserSession | null = null;

  private constructor() {
    // Carrega a sessão do usuário do localStorage ao inicializar
    this.loadUserSession();
  }

  /**
   * Singleton pattern - garante uma única instância da sessão
   */
  static getInstance(): Session {
    if (!Session.instance) {
      Session.instance = new Session();
    }
    return Session.instance;
  }

  /**
   * Salva os tokens de autenticação em cookies seguros
   */
  saveTokens(tokens: TokenData): void {
    if (typeof window === 'undefined') return;

    // Configurações de segurança para cookies
    const cookieOptions: Cookies.CookieAttributes = {
      secure: process.env.NODE_ENV === 'production', // HTTPS apenas em produção
      sameSite: 'strict',
      expires: new Date(Date.now() + tokens.expiresIn * 1000), // Expira junto com o token
    };

    // Salva tokens em cookies
    Cookies.set(ACCESS_TOKEN_KEY, tokens.accessToken, cookieOptions);
    Cookies.set(REFRESH_TOKEN_KEY, tokens.refreshToken, {
      ...cookieOptions,
      expires: 7, // Refresh token expira em 7 dias
    });

    // Salva timestamp de expiração
    const expiryTime = Date.now() + tokens.expiresIn * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  /**
   * Obtém o access token dos cookies
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return Cookies.get(ACCESS_TOKEN_KEY) || null;
  }

  /**
   * Obtém o refresh token dos cookies
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return Cookies.get(REFRESH_TOKEN_KEY) || null;
  }

  /**
   * Verifica se o token está expirado
   */
  isTokenExpired(): boolean {
    if (typeof window === 'undefined') return true;
    
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return true;

    // Adiciona buffer de 60s para refresh antes da expiração real
    return Date.now() >= parseInt(expiry, 10) - 60000;
  }

  /**
   * Salva os dados da sessão do usuário
   */
  saveUserSession(user: UserSession): void {
    if (typeof window === 'undefined') return;

    this.userSession = user;
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
  }

  /**
   * Carrega os dados da sessão do usuário do localStorage
   */
  private loadUserSession(): void {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(USER_SESSION_KEY);
    if (stored) {
      try {
        this.userSession = JSON.parse(stored);
      } catch (error) {
        console.error('Erro ao carregar sessão do usuário:', error);
        this.userSession = null;
      }
    }
  }

  /**
   * Obtém os dados do usuário da sessão
   */
  getUserSession(): UserSession | null {
    return this.userSession;
  }

  /**
   * Obtém o ID do usuário
   */
  getUserId(): number | null {
    return this.userSession?.id || null;
  }

  /**
   * Obtém o tipo/role do usuário
   */
  getUserType(): UserType | null {
    return this.userSession?.type || null;
  }

  /**
   * Verifica se o usuário é gerente (manager)
   */
  isManager(): boolean {
    return this.userSession?.type === UserType.MANAGER;
  }

  /**
   * Verifica se o usuário é advogado (lawyer)
   */
  isLawyer(): boolean {
    return this.userSession?.type === UserType.LAWYER;
  }

  /**
   * Verifica se o usuário é do marketing
   */
  isMarketing(): boolean {
    return this.userSession?.type === UserType.MARKETING;
  }

  /**
   * Verifica se o usuário é cliente
   */
  isClient(): boolean {
    return this.userSession?.type === UserType.CLIENT;
  }

  /**
   * Verifica se o usuário tem permissões administrativas (Manager)
   */
  hasAdminPermissions(): boolean {
    return this.userSession?.type === UserType.MANAGER;
  }

  /**
   * Verifica se o usuário é staff (Manager, Lawyer ou Marketing)
   */
  isStaff(): boolean {
    return this.userSession?.type === UserType.MANAGER 
      || this.userSession?.type === UserType.LAWYER 
      || this.userSession?.type === UserType.MARKETING;
  }

  /**
   * Verifica se existe uma sessão ativa
   */
  isAuthenticated(): boolean {
    return !!(this.getAccessToken() && this.userSession);
  }

  /**
   * Limpa toda a sessão (logout)
   */
  clearSession(): void {
    if (typeof window === 'undefined') return;

    // Remove cookies
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);

    // Remove dados do localStorage
    localStorage.removeItem(USER_SESSION_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);

    // Limpa a sessão em memória
    this.userSession = null;
  }

  /**
   * Atualiza apenas o access token (útil para refresh)
   */
  updateAccessToken(accessToken: string, expiresIn: number): void {
    if (typeof window === 'undefined') return;

    const cookieOptions: Cookies.CookieAttributes = {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(Date.now() + expiresIn * 1000),
    };

    Cookies.set(ACCESS_TOKEN_KEY, accessToken, cookieOptions);

    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  /**
   * Obtém todos os dados da sessão
   */
  getSessionData() {
    return {
      user: this.userSession,
      accessToken: this.getAccessToken(),
      refreshToken: this.getRefreshToken(),
      isAuthenticated: this.isAuthenticated(),
      isExpired: this.isTokenExpired(),
    };
  }
}

// Exporta instância singleton
export const session = Session.getInstance();
