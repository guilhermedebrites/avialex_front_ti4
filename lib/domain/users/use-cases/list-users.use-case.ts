import { UserService } from '../../../services/users/user-service';
import { User, ListUsersParams } from '../types';

/**
 * Use Case: Listar usuários com filtros
 */
export class ListUsersUseCase {
  constructor(private userService: UserService) {}

  async execute(params?: ListUsersParams): Promise<User[]> {
    return this.userService.listUsers(params);
  }
}
