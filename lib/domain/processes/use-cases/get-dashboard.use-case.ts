import { ProcessService } from '../../../services/processes/process-service';
import { DashboardResponseDTO, DashboardRequestParams } from '../types';

/**
 * Use Case: Buscar dados do dashboard
 */
export class GetDashboardUseCase {
  constructor(private processService: ProcessService) {}

  async execute(params?: DashboardRequestParams): Promise<DashboardResponseDTO> {
    return this.processService.getDashboard(params);
  }
}
