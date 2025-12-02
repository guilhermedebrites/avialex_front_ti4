import { UserService } from '../../../services/users/user-service';
import { User, CreateUserDTO } from '../types';

/**
 * Use Case: Criar novo usuário
 */
export class CreateUserUseCase {
  constructor(private userService: UserService) {}

  async execute(user: CreateUserDTO): Promise<User> {
    return this.userService.createUser(user);
  }
}
