'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProcessPortal } from '@/lib/hooks/use-process-portal';
import { PortalForm } from '@/lib/components/portal/portal-form';
import { PortalSummary } from '@/lib/components/portal/portal-summary';
import { PageHeader } from '@/lib/components/ui/page-header';
import { Card } from '@/lib/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/lib/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

function PortalContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id');

  const {
    process,
    isLoading,
    error,
    actions
  } = useProcessPortal({
    initialId: initialId || undefined
  });

  // Helper to show appropriate state
  const renderContent = () => {
    // Error state
    if (error) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertTitle>Erro ao carregar processo</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      );
    }

    // Empty state (no search yet)
    if (!process && !isLoading) {
      return (
        <Card className="p-8 text-center text-muted-foreground">
          Digite o ID ou número do processo para visualizar seu resumo e histórico
        </Card>
      );
    }

    // Success state
    if (process) {
      return (
        <div className="space-y-6">
          <PortalSummary process={process} />
        </div>
      );
    }

    // Loading state
    return (
      <div className="space-y-6 animate-pulse">
        <Card className="h-40" />
        <Card className="h-96" />
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <PortalForm
        onSearch={actions.searchProcess}
        isLoading={isLoading}
      />

      {renderContent()}
    </div>
  );
}

export default function PortalPage() {
  return (
    <Suspense>
      <PortalContent />
    </Suspense>
  );
}