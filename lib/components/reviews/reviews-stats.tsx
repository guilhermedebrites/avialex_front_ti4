"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Star, ThumbsUp, MessageSquare, Award } from "lucide-react"
import { ReviewService } from "@/lib/services/reviews/review-service"
import { ReviewResponseDTO } from "@/lib/domain/reviews/types"
import { Session, UserType } from "@/lib/networking/session"
import { ApiClient } from "@/lib/networking/api-client"

interface StatItem {
  title: string
  value: string
  icon: React.ElementType
  color: string
  bgColor: string
  suffix?: string
}

export interface ReviewsStatsRef {
  reload: () => void
}

export const ReviewsStats = forwardRef<ReviewsStatsRef>((props, ref) => {
  const [stats, setStats] = useState<StatItem[]>([])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const session = Session.getInstance()
    const userType = session.getUserType()

    // Esconder para clientes
    if (userType === UserType.CLIENT) {
      setIsVisible(false)
      return
    }

    loadStats()
  }, [])

  // Expõe o método reload via ref
  useImperativeHandle(ref, () => ({
    reload: () => {
      loadStats()
    }
  }))

  const loadStats = async () => {
    try {
      const apiClient = new ApiClient({
        baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://avialex-ti4.onrender.com/api'
      })
      const session = Session.getInstance()
      const token = session.getAccessToken()
      const userId = session.getUserId()

      if (!userId || !token) {
        console.log('Usuário não autenticado, mostrando estatísticas vazias')
        setStats(getEmptyStats())
        return
      }

      // Configura o token no ApiClient
      apiClient.setAccessToken(token)

      const reviewService = new ReviewService(apiClient)

      // Busca todas as reviews (todos os usuários têm role USER)
      let reviews: ReviewResponseDTO[] = []

      try {
        const pageResponse = await reviewService.getAll(0, 1000)
        reviews = pageResponse.content || []
      } catch (error: any) {
        console.error('Erro ao buscar reviews:', error)
        // Fallback: tenta buscar apenas as reviews do usuário
        try {
          reviews = await reviewService.getByUserId(userId)
          console.log('Carregando estatísticas baseadas nas reviews do usuário')
        } catch (fallbackError) {
          console.error('Erro ao buscar reviews do usuário:', fallbackError)
          setStats(getEmptyStats())
          return
        }
      }

      if (!reviews || reviews.length === 0) {
        setStats(getEmptyStats())
        return
      }

      const calculatedStats = calculateStats(reviews)
      setStats(calculatedStats)
    } catch (error) {
      console.error('Error loading stats:', error)
      setStats(getEmptyStats())
    }
  }

  const calculateStats = (reviews: ReviewResponseDTO[]): StatItem[] => {
    const totalReviews = reviews.length
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : "0.0"

    // Contar avaliações por estrela
    const fiveStarReviews = reviews.filter(r => r.rating === 5).length
    const fiveStarPercentage = totalReviews > 0 ? Math.round((fiveStarReviews / totalReviews) * 100) : 0

    // Satisfação geral (4+ estrelas)
    const satisfiedReviews = reviews.filter(r => r.rating >= 4).length
    const satisfactionPercentage = totalReviews > 0 ? Math.round((satisfiedReviews / totalReviews) * 100) : 0

    return [
      {
        title: "Avaliação Média",
        value: averageRating,
        icon: Star,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        suffix: "/5.0",
      },
      {
        title: "Total de Avaliações",
        value: totalReviews.toString(),
        icon: MessageSquare,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      {
        title: "Satisfação Geral",
        value: `${satisfactionPercentage}%`,
        icon: ThumbsUp,
        color: "text-green-600",
        bgColor: "bg-green-100",
      },
      {
        title: "5 Estrelas",
        value: `${fiveStarPercentage}%`,
        icon: Award,
        color: "text-emerald-600",
        bgColor: "bg-emerald-100",
      },
    ]
  }

  const getEmptyStats = (): StatItem[] => {
    return [
      {
        title: "Avaliação Média",
        value: "0.0",
        icon: Star,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        suffix: "/5.0",
      },
      {
        title: "Total de Avaliações",
        value: "0",
        icon: MessageSquare,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      {
        title: "Satisfação Geral",
        value: "0%",
        icon: ThumbsUp,
        color: "text-green-600",
        bgColor: "bg-green-100",
      },
      {
        title: "5 Estrelas",
        value: "0%",
        icon: Award,
        color: "text-emerald-600",
        bgColor: "bg-emerald-100",
      },
    ]
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stat.value}
              {stat.suffix && <span className="text-sm text-muted-foreground">{stat.suffix}</span>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
})

ReviewsStats.displayName = 'ReviewsStats'
