import { useCallback, useState, useEffect } from 'react';
import { Process } from '@/lib/domain/processes/types';
import { getPortalService } from '@/lib/services/processes/portal-service';
import { useToast } from '@/lib/hooks/use-toast';

export interface UseProcessPortalProps {
  initialId?: string;
}

export interface UseProcessPortalReturn {
  process: Process | null;
  isLoading: boolean;
  error: Error | null;
  actions: {
    searchProcess: (input: string) => Promise<void>;
    clearProcess: () => void;
  };
}

export function useProcessPortal({ initialId }: UseProcessPortalProps = {}): UseProcessPortalReturn {
  // State
  const [process, setProcess] = useState<Process | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { toast } = useToast();

  // Load process by ID or Process Number
  const searchProcess = useCallback(async (input: string) => {
    setIsLoading(true);
    setError(null);
    setProcess(null);

    try {
      const service = getPortalService();

      // Tenta converter para número
      const processNumber = parseInt(input, 10);

      let foundProcess: Process;

      // Se for um número válido, busca por número do processo primeiro
      if (!isNaN(processNumber)) {
        try {
          // Tenta buscar por número do processo (rota pública)
          foundProcess = await service.getProcessByNumber(processNumber);
        } catch (err) {
          // Se falhar, tenta buscar por ID (requer autenticação)
          try {
            foundProcess = await service.getProcessById(processNumber);
          } catch (idErr) {
            throw err; // Lança o erro original se ambos falharem
          }
        }
      } else {
        // Se não for número, tenta buscar por ID como string
        foundProcess = await service.getProcessById(input);
      }

      setProcess(foundProcess);
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: "Processo não encontrado",
        description: "Não foi possível encontrar um processo com este ID ou número.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Clear current process
  const clearProcess = useCallback(() => {
    setProcess(null);
    setError(null);
  }, []);

  // Load initial process if ID provided
  useEffect(() => {
    if (initialId) {
      searchProcess(initialId);
    }
  }, [initialId, searchProcess]);

  return {
    process,
    isLoading,
    error,
    actions: {
      searchProcess,
      clearProcess
    }
  };
}
