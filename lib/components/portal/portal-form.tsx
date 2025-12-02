'use client';

import { useState } from 'react';
import { Button } from '@/lib/components/ui/button';
import { Card } from '@/lib/components/ui/card';
import { Input } from '@/lib/components/ui/input';
import { Search } from 'lucide-react';

interface PortalFormProps {
  onSearch: (id: string) => void;
  isLoading?: boolean;
}

export function PortalForm({ onSearch, isLoading }: PortalFormProps) {
  const [processId, setProcessId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (processId.trim()) {
      onSearch(processId.trim());
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Digite o ID ou número do processo"
            value={processId}
            onChange={(e) => setProcessId(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={!processId.trim() || isLoading}>
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Você pode buscar por ID do processo ou pelo número do processo
        </p>
      </form>
    </Card>
  );
}