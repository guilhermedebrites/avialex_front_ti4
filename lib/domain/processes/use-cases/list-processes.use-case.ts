import { ProcessService } from '../../../services/processes/process-service';
import { Process } from '../types';

export class ListProcessesUseCase {
  constructor(private processService: ProcessService) {}

  async execute(): Promise<Process[]> {
    return this.processService.listProcesses();
  }
}