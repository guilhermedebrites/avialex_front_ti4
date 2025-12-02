"use client"

import { useState } from "react"
import { Button } from "@/lib/components/ui/button"
import { Send } from "lucide-react"
import { CreateReviewDialog } from "./create-review-dialog"

interface ReviewsHeaderProps {
  onReviewCreated?: () => void
}

export function ReviewsHeader({ onReviewCreated }: ReviewsHeaderProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sistema de Avaliações</h1>
          <p className="text-muted-foreground mt-1">Acompanhe a satisfação dos clientes e feedback da plataforma</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setDialogOpen(true)}>
            <Send className="mr-2 h-4 w-4" />
            Escrever Avaliação
          </Button>
        </div>
      </div>

      <CreateReviewDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onReviewCreated={onReviewCreated}
      />
    </>
  )
}
