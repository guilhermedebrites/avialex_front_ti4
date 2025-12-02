import { AuthService } from '../../../services/auth/auth-service';
import { Session } from '../../../networking/session';

/**
 * Use Case: Realizar logout do usuário
 */
export class SignOutUseCase {
  constructor(
    private authService: AuthService,
    private session: Session
  ) {}

  async execute(revokeToken: boolean = false): Promise<void> {
    try {
      if (revokeToken) {
        // Logout com revogação de token no servidor
        const refreshToken = this.session.getRefreshToken();
        if (refreshToken) {
          await this.authService.signOutRevoke({ refreshToken });
        }
      } else {
        // Logout simples (sem revogar token)
        await this.authService.signOut();
      }
    } catch (error) {
      console.error('Erro ao fazer logout no servidor:', error);
      // Continua com logout local mesmo se houver erro no servidor
    } finally {
      // Sempre limpa a sessão local
      this.session.clearSession();
    }
  }
}
