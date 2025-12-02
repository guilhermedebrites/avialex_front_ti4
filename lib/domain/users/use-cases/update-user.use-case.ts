import { UserService } from '../../../services/users/user-service';
import { User, UpdateUserDTO } from '../types';

/**
 * Use Case: Atualizar usuário
 */
export class UpdateUserUseCase {
  constructor(private userService: UserService) {}

  async execute(id: number, user: UpdateUserDTO): Promise<User> {
    return this.userService.updateUser(id, user);
  }
}