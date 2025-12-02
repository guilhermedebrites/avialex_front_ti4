import { AuthService } from '../../../services/auth/auth-service';
import { SignUpRequestDTO, UserResponseDTO } from '../types';

/**
 * Use Case: Registrar novo usuário
 */
export class SignUpUseCase {
  constructor(private authService: AuthService) {}

  async execute(request: SignUpRequestDTO): Promise<UserResponseDTO> {
    // Registra o usuário
    const user = await this.authService.signUp(request);
    
    return user;
  }
}
