import { ProcessStatus } from '@/lib/domain/processes/types';

type StatusStyle = {
  label: string;
  color: string;
  bgColor: string;
};

const STATUS_STYLES: Record<ProcessStatus, StatusStyle> = {
  [ProcessStatus.CREATED]: {
    label: 'Criado',
    color: 'text-blue-800',
    bgColor: 'bg-blue-100'
  },
  [ProcessStatus.IN_PROGRESS]: {
    label: 'Em Andamento',
    color: 'text-yellow-800',
    bgColor: 'bg-yellow-100'
  },
  [ProcessStatus.COMPLETED]: {
    label: 'Concluído',
    color: 'text-green-800',
    bgColor: 'bg-green-100'
  }
};

export const translateProcessStatus = (status: ProcessStatus): string => {
  return STATUS_STYLES[status]?.label || status;
};

export const getProcessStatusStyle = (status: ProcessStatus): StatusStyle => {
  return STATUS_STYLES[status] || {
    label: status,
    color: 'text-gray-800',
    bgColor: 'bg-gray-100'
  };
};