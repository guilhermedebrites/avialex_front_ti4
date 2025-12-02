import { AuthService } from '../../../services/auth/auth-service';
import { Session } from '../../../networking/session';
import { AuthResponseDTO } from '../types';

/**
 * Use Case: Atualizar access token
 */
export class RefreshTokenUseCase {
  constructor(
    private authService: AuthService,
    private session: Session
  ) {}

  async execute(): Promise<AuthResponseDTO | null> {
    const refreshToken = this.session.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('Refresh token não encontrado');
    }

    try {
      // Solicita novo access token
      const authResponse = await this.authService.refresh({ refreshToken });

      // Atualiza apenas o access token (refresh token permanece o mesmo)
      this.session.updateAccessToken(
        authResponse.accessToken,
        authResponse.expiresIn
      );

      return authResponse;
    } catch (error) {
      // Se falhar, limpa a sessão (token expirado ou inválido)
      this.session.clearSession();
      throw error;
    }
  }
}
