import { ProcessService } from '../../../services/processes/process-service';
import { Process, UpdateProcessDTO } from '../types';

export class UpdateProcessUseCase {
  constructor(private processService: ProcessService) {}

  async execute(id: number, processData: UpdateProcessDTO): Promise<Process> {
    return this.processService.update(id, processData);
  }
}