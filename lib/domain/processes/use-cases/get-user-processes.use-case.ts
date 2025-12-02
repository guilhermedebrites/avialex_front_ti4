import { ProcessService } from '../../../services/processes/process-service';
import { Process } from '../types';

/**
 * Use Case: Buscar processos de um usuário
 */
export class GetUserProcessesUseCase {
  constructor(private processService: ProcessService) {}

  async executeByName(name: string): Promise<Process[]> {
    return this.processService.getByUserName(name);
  }

  async executeByCpf(cpf: string): Promise<Process[]> {
    return this.processService.getByUserCpf(cpf);
  }
}
