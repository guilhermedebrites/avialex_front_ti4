import { AuthService } from '../../../services/auth/auth-service';
import { Session } from '../../../networking/session';
import { ApiClient } from '../../../networking/api-client';
import { SignInRequestDTO, AuthResponseDTO } from '../types';

/**
 * Use Case: Realizar login do usuário
 */
export class SignInUseCase {
  constructor(
    private authService: AuthService,
    private session: Session,
    private apiClient: ApiClient
  ) {}

  async execute(request: SignInRequestDTO): Promise<AuthResponseDTO> {
    // 1. Faz a requisição de login
    const authResponse = await this.authService.signIn(request);

    // 2. Salva os tokens na sessão
    this.session.saveTokens({
      accessToken: authResponse.accessToken,
      refreshToken: authResponse.refreshToken,
      expiresIn: authResponse.expiresIn,
    });

    // 3. Configura o token no apiClient para próximas requisições
    this.apiClient.setAccessToken(authResponse.accessToken);

    // 4. Busca os dados do usuário usando o token
    const userClaims = await this.authService.me();
    const userId = Number(userClaims.sub) || 0;

    // 5. Busca os dados completos do usuário
    const userData = await this.authService.getUserById(userId);

    // 6. Salva os dados do usuário na sessão
    this.session.saveUserSession({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      type: userData.type,
      cpf: userData.cpf,
      phone: userData.phone,
      address: userData.address,
      rg: userData.rg,
    });

    return authResponse;
  }
}
