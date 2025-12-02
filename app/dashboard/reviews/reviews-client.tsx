"use client"

import { useRef, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ReviewsHeader } from "@/lib/components/reviews/reviews-header"
import { ReviewsStats, ReviewsStatsRef } from "@/lib/components/reviews/reviews-stats"
import { ReviewsList, ReviewsListRef } from "@/lib/components/reviews/reviews-list"
import { CreateReviewDialog } from "@/lib/components/reviews/create-review-dialog"

export default function ReviewsClient() {
  const searchParams = useSearchParams()
  const reviewsListRef = useRef<ReviewsListRef>(null)
  const reviewsStatsRef = useRef<ReviewsStatsRef>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Abre o modal se houver o parâmetro ?create=true na URL
  useEffect(() => {
    if (searchParams.get("create") === "true") {
      setDialogOpen(true)
    }
  }, [searchParams])

  const handleReviewCreated = () => {
    // Recarregar a lista de reviews e estatísticas quando uma nova for criada
    reviewsListRef.current?.reload()
    reviewsStatsRef.current?.reload()
  }

  return (
    <>
      <div className="space-y-6">
        <ReviewsHeader onReviewCreated={handleReviewCreated} />
        <ReviewsStats ref={reviewsStatsRef} />
        <ReviewsList ref={reviewsListRef} />
      </div>

      {/* Modal de criar avaliação controlado pela URL */}
      <CreateReviewDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onReviewCreated={handleReviewCreated}
      />
    </>
  )
}
