import { ProcessService } from '../../../services/processes/process-service';

export class DeleteProcessUseCase {
  constructor(private processService: ProcessService) {}

  async execute(id: number): Promise<void> {
    return this.processService.delete(id);
  }
}
