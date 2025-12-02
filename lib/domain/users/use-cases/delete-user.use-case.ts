import { UserService } from '../../../services/users/user-service';

/**
 * Use Case: Deletar usuário
 */
export class DeleteUserUseCase {
  constructor(private userService: UserService) {}

  async execute(id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }
}