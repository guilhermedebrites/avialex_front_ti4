/**
 * Tipos e DTOs para processos
 * Baseado no ProcessController do backend
 */

import { User } from '../users/types';

// ==================== ENUMS ====================

export enum ProcessStatus {
  CREATED = 'CREATED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

// ==================== ENTITIES ====================

export interface Process {
  id: number;
  clientId: User;
  name: string;
  involvedParties: string[];
  processNumber: number;
  status: ProcessStatus;
  creationDate: string;
  lastModifiedDate: string;
  recoveredValue?: number;
  won?: boolean | null;
}

// ==================== REQUEST DTOs ====================

export interface CreateProcessDTO {
  clientId: {
    id: number;
  };
  name: string;
  involvedParties: string[];
  processNumber: number;
  status: ProcessStatus;
  recoveredValue?: number;
  won?: boolean | null;
}

export interface UpdateProcessDTO {
  clientId?: {
    id: number;
  };
  name?: string;
  involvedParties?: string[];
  processNumber?: number;
  status?: ProcessStatus;
  recoveredValue?: number;
  won?: boolean | null;
}

// ==================== DASHBOARD DTOs ====================

export interface MonthlyStatDTO {
  month: string;
  wonProcesses: number;
  lostProcesses: number;
}

export interface DashboardResponseDTO {
  activeProcess: number;
  activeClients: number;
  recoveredValue: number;
  SuccessFee: number;
  monthlyStats: MonthlyStatDTO[];
  totalProcesses: number;
}

export interface DashboardRequestParams {
  startDate?: string; // YYYY-MM-DD format
  endDate?: string;   // YYYY-MM-DD format
}
