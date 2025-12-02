import { Suspense } from 'react'
import { DashboardLayout } from "@/lib/components/dashboard/dashboard-layout"
import ReviewsClient from './reviews-client'

export default function ReviewsPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-6">Carregando avaliações...</div>}>
        <ReviewsClient />
      </Suspense>
    </DashboardLayout>
  )
}
