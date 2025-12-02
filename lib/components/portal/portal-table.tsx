'use client';

import { Card } from '@/lib/components/ui/card';
import { Button } from '@/lib/components/ui/button';
import { Skeleton } from '@/lib/components/ui/skeleton';

interface PortalTableProps {
  events: Array<any>;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore: () => void;
}

export function PortalTable({ events, isLoading, hasMore, onLoadMore }: PortalTableProps) {
  if (events.length === 0 && !isLoading) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        Nenhum evento encontrado
      </Card>
    );
  }

  return (
    <Card>
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="border-b">
              <th className="h-12 px-4 text-left align-middle font-medium">Data</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Tipo</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Autor</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Descrição</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b">
                <td className="p-4">
                  {new Date(event.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="p-4">{event.type}</td>
                <td className="p-4">{event.author}</td>
                <td className="p-4">{event.message}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Loading more indicator */}
        {isLoading && (
          <div className="p-4">
            <Skeleton className="h-20 w-full" />
          </div>
        )}

        {/* Load more button */}
        {hasMore && !isLoading && (
          <div className="p-4 text-center">
            <Button onClick={onLoadMore} variant="outline">
              Carregar mais
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}