import { ProcessService } from '../../../services/processes/process-service';
import { Process, CreateProcessDTO } from '../types';

/**
 * Use Case: Criar novo processo
 */
export class CreateProcessUseCase {
  constructor(private processService: ProcessService) {}

  async execute(process: CreateProcessDTO): Promise<Process> {
    return this.processService.create(process);
  }
}
