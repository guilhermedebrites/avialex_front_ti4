'use client';

import { Process } from '@/lib/domain/processes/types';
import { Card } from '@/lib/components/ui/card';
import { Badge } from '@/lib/components/ui/badge';
import { translateProcessStatus, getProcessStatusStyle } from '@/lib/utils/process-utils';
import { cn } from '@/lib/utils';

interface PortalSummaryProps {
  process: Process;
}

export function PortalSummary({ process }: PortalSummaryProps) {
  const statusStyle = getProcessStatusStyle(process.status);

  return (
    <Card className="p-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <div className="text-sm text-muted-foreground">Número do Processo</div>
          <div className="text-lg font-semibold">{process.processNumber}</div>
        </div>
        
        <div>
          <div className="text-sm text-muted-foreground">Status</div>
          <Badge className={cn(statusStyle.bgColor, statusStyle.color)}>
            {statusStyle.label}
          </Badge>
        </div>

        <div>
          <div className="text-sm text-muted-foreground">Data de Abertura</div>
          <div className="text-lg font-semibold">
            {new Date(process.creationDate).toLocaleDateString('pt-BR')}
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="text-sm text-muted-foreground">Nome</div>
          <div className="text-lg">{process.name}</div>
        </div>
      </div>
    </Card>
  );
}