'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { DashboardRequestParams } from '../domain/processes/types';

interface DashboardFilterContextType {
  filters: DashboardRequestParams;
  setFilters: (filters: DashboardRequestParams) => void;
  updateFilters: (startDate: string | undefined, endDate: string | undefined) => void;
}

const DashboardFilterContext = createContext<DashboardFilterContextType | undefined>(undefined);

interface DashboardFilterProviderProps {
  children: ReactNode;
}

export function DashboardFilterProvider({ children }: DashboardFilterProviderProps) {
  const [filters, setFilters] = useState<DashboardRequestParams>({});

  const updateFilters = (startDate: string | undefined, endDate: string | undefined) => {
    // Remove undefined values para não enviar params vazios ao backend
    const newFilters: DashboardRequestParams = {};

    if (startDate) {
      newFilters.startDate = startDate;
    }

    if (endDate) {
      newFilters.endDate = endDate;
    }

    console.log('Filtros atualizados:', newFilters);
    setFilters(newFilters);
  };

  return (
    <DashboardFilterContext.Provider value={{ filters, setFilters, updateFilters }}>
      {children}
    </DashboardFilterContext.Provider>
  );
}

export function useDashboardFilter() {
  const context = useContext(DashboardFilterContext);

  if (context === undefined) {
    throw new Error('useDashboardFilter deve ser usado dentro de um DashboardFilterProvider');
  }

  return context;
}
