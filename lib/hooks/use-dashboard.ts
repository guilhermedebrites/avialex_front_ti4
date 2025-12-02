'use client';

import { useState, useEffect } from 'react';
import { ApiClient } from '../networking/api-client';
import { Session } from '../networking/session';
import { ProcessService } from '../services/processes/process-service';
import { GetDashboardUseCase } from '../domain/processes/use-cases';
import { DashboardResponseDTO } from '../domain/processes/types';
import { useDashboardFilter } from '../contexts/dashboard-filter-context';

export function useDashboard() {
  const [data, setData] = useState<DashboardResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { filters } = useDashboardFilter();

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('Buscando dashboard com filtros:', filters);

        const apiBaseURL = process.env.NEXT_PUBLIC_API_URL || 'https://avialex-ti4.onrender.com';
        const apiClient = new ApiClient({ baseURL: apiBaseURL });
        const session = Session.getInstance();
        const accessToken = session.getAccessToken();

        if (accessToken) {
          apiClient.setAccessToken(accessToken);
        }

        const processService = new ProcessService(apiClient);
        const getDashboardUseCase = new GetDashboardUseCase(processService);

        const dashboardData = await getDashboardUseCase.execute(filters);
        console.log('Dashboard data recebida:', dashboardData);
        setData(dashboardData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [filters.startDate, filters.endDate]);

  return { data, isLoading, error };
}
