'use client';

import { Card } from '@/lib/components/ui/card';
import { Button } from '@/lib/components/ui/button';
import { Skeleton } from '@/lib/components/ui/skeleton';

interface PortalTimelineProps {
  events: Array<any>;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore: () => void;
}

export function PortalTimeline({ events, isLoading, hasMore, onLoadMore }: PortalTimelineProps) {
  if (events.length === 0 && !isLoading) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        Nenhum evento encontrado
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-8">
        {events.map((event) => (
          <div key={event.id} className="flex gap-4">
            {/* Timeline indicator */}
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="w-0.5 h-full bg-border" />
            </div>

            {/* Event content */}
            <div className="flex-1 pb-8">
              <div className="text-sm text-muted-foreground">
                {new Date(event.createdAt).toLocaleDateString('pt-BR')}
              </div>
              <div className="text-sm font-medium mt-1">
                {event.type}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {event.author && `por ${event.author}`}
              </div>
              <div className="mt-2">
                {event.message}
              </div>
            </div>
          </div>
        ))}

        {/* Loading more indicator */}
        {isLoading && <Skeleton className="h-20 w-full" />}

        {/* Load more button */}
        {hasMore && !isLoading && (
          <div className="text-center">
            <Button onClick={onLoadMore} variant="outline">
              Carregar mais
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}