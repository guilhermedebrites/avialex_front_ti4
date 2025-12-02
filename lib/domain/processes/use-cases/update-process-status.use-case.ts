import { ProcessService } from '../../../services/processes/process-service';
import { Process, ProcessStatus } from '../types';

export class UpdateProcessStatusUseCase {
  constructor(private processService: ProcessService) {}

  async execute(id: number, status: ProcessStatus): Promise<Process> {
    return this.processService.updateStatus(id, status);
  }
}