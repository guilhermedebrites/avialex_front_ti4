"use client"

import { Card, CardContent } from "@/lib/components/ui/card"
import { Badge } from "@/lib/components/ui/badge"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select"
import { Avatar, AvatarFallback } from "@/lib/components/ui/avatar"
import { Star, Search, Loader2, Trash2 } from "lucide-react"
import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { ReviewService } from "@/lib/services/reviews/review-service"
import { ApiClient } from "@/lib/networking/api-client"
import { ReviewResponseDTO, ReviewType } from "@/lib/domain/reviews/types"
import { Session } from "@/lib/networking/session"
import { useToast } from "@/lib/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/lib/components/ui/alert-dialog"

const getReviewTypeLabel = (type: ReviewType): string => {
  const labels: Record<ReviewType, string> = {
    [ReviewType.COMMUNICATION]: "Comunicação",
    [ReviewType.SERVICE]: "Atendimento",
    [ReviewType.PROCESS]: "Processo"
  };
  return labels[type] || type;
};

const getRatingColor = (rating: number) => {
  if (rating >= 4) return "text-green-600"
  if (rating >= 3) return "text-yellow-600"
  return "text-red-600"
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export interface ReviewsListRef {
  reload: () => void;
}

export const ReviewsList = forwardRef<ReviewsListRef>((_, ref) => {
  const [reviews, setReviews] = useState<ReviewResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState<ReviewResponseDTO | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  // Verificar se o usuário é manager
  const session = Session.getInstance()
  const isManager = session.isManager()

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obter sessão do usuário
      const session = Session.getInstance();
      const token = session.getAccessToken();

      if (!token) {
        setError('Você precisa estar autenticado para ver as avaliações.');
        return;
      }

      const apiClient = new ApiClient({
        baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://avialex-ti4.onrender.com'
      });

      apiClient.setAccessToken(token);

      const reviewService = new ReviewService(apiClient);
      const response = await reviewService.getAll(0, 100); // Carregar todas as reviews

      setReviews(response.content);
    } catch (err) {
      console.error('Erro ao carregar reviews:', err);
      setError('Erro ao carregar avaliações. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Expor o método reload através da ref
  useImperativeHandle(ref, () => ({
    reload: loadReviews
  }));

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDeleteClick = (review: ReviewResponseDTO) => {
    setReviewToDelete(review)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return

    try {
      setIsDeleting(true)

      const token = session.getAccessToken()
      const userId = session.getUserId()

      console.log("Token:", token ? "presente" : "ausente")
      console.log("UserId:", userId)
      console.log("Review to delete:", reviewToDelete)

      if (!token || !userId) {
        toast({
          title: "Erro",
          description: "Você precisa estar autenticado.",
          variant: "destructive",
        })
        return
      }

      const apiClient = new ApiClient({
        baseURL: process.env.NEXT_PUBLIC_API_URL || "https://avialex-ti4.onrender.com",
      })

      apiClient.setAccessToken(token)

      const reviewService = new ReviewService(apiClient)

      const deletePayload = {
        id: reviewToDelete.id,
        userId: userId,
        rating: reviewToDelete.rating,
        comment: reviewToDelete.comment,
        reviewType: reviewToDelete.reviewType,
      }

      console.log("Delete payload:", deletePayload)

      const result = await reviewService.delete(deletePayload)

      console.log("Delete result:", result)

      toast({
        title: "Sucesso!",
        description: "Avaliação deletada com sucesso.",
      })

      // Remover da lista localmente
      setReviews(reviews.filter(r => r.id !== reviewToDelete.id))
      setDeleteDialogOpen(false)
      setReviewToDelete(null)
    } catch (error) {
      console.error("Erro completo ao deletar avaliação:", error)
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      toast({
        title: "Erro",
        description: `Não foi possível deletar a avaliação: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = searchTerm === "" ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (review.username && review.username.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRating = ratingFilter === "all" ||
      review.rating.toString() === ratingFilter;
    const matchesType = typeFilter === "all" ||
      review.reviewType === typeFilter;

    return matchesSearch && matchesRating && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <Button onClick={loadReviews} className="mt-4">
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por usuário ou comentário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Avaliação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="5">5 Estrelas</SelectItem>
                <SelectItem value="4">4 Estrelas</SelectItem>
                <SelectItem value="3">3 Estrelas</SelectItem>
                <SelectItem value="2">2 Estrelas</SelectItem>
                <SelectItem value="1">1 Estrela</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value={ReviewType.COMMUNICATION}>Comunicação</SelectItem>
                <SelectItem value={ReviewType.SERVICE}>Atendimento</SelectItem>
                <SelectItem value={ReviewType.PROCESS}>Processo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Nenhuma avaliação encontrada.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {review.username ? review.username.substring(0, 2).toUpperCase() : `U${review.userId}`}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{review.username || `Usuário #${review.userId}`}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(review.reviewDate)}
                        </div>
                      </div>
                    </div>
                    {isManager && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(review)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className={`font-medium ${getRatingColor(review.rating)}`}>
                      {review.rating}/5
                    </span>
                    <Badge variant="outline">{getReviewTypeLabel(review.reviewType)}</Badge>
                  </div>

                  {/* Review Content */}
                  <div>
                    <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar esta avaliação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deletando..." : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
});

ReviewsList.displayName = 'ReviewsList';
