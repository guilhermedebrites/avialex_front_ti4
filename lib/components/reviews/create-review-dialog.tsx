"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/lib/components/ui/dialog"
import { Button } from "@/lib/components/ui/button"
import { Label } from "@/lib/components/ui/label"
import { Textarea } from "@/lib/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/select"
import { Star, Loader2 } from "lucide-react"
import { ReviewService } from "@/lib/services/reviews/review-service"
import { ApiClient } from "@/lib/networking/api-client"
import { ReviewType } from "@/lib/domain/reviews/types"
import { useToast } from "@/lib/hooks/use-toast"
import { Session } from "@/lib/networking/session"

interface CreateReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onReviewCreated?: () => void
}

export function CreateReviewDialog({
  open,
  onOpenChange,
  onReviewCreated,
}: CreateReviewDialogProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [reviewType, setReviewType] = useState<ReviewType | "">("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const resetForm = () => {
    setRating(0)
    setHoveredRating(0)
    setComment("")
    setReviewType("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma avaliação.",
        variant: "destructive",
      })
      return
    }

    if (!comment.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, escreva um comentário.",
        variant: "destructive",
      })
      return
    }

    if (!reviewType) {
      toast({
        title: "Erro",
        description: "Por favor, selecione o tipo de avaliação.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      // Obter sessão do usuário
      const session = Session.getInstance()
      const token = session.getAccessToken()
      const userId = session.getUserId()

      if (!token || !userId) {
        toast({
          title: "Erro",
          description: "Você precisa estar autenticado para criar uma avaliação.",
          variant: "destructive",
        })
        return
      }

      const apiClient = new ApiClient({
        baseURL: process.env.NEXT_PUBLIC_API_URL || "https://avialex-ti4.onrender.com",
      })

      apiClient.setAccessToken(token)

      const reviewService = new ReviewService(apiClient)
      await reviewService.create({
        userId: userId,
        rating,
        comment: comment.trim(),
        reviewType: reviewType as ReviewType,
      })

      toast({
        title: "Sucesso!",
        description: "Avaliação criada com sucesso.",
      })

      resetForm()
      onOpenChange(false)
      onReviewCreated?.()
    } catch (error) {
      console.error("Erro ao criar avaliação:", error)
      toast({
        title: "Erro",
        description: "Não foi possível criar a avaliação. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Escrever Avaliação</DialogTitle>
          <DialogDescription>
            Compartilhe sua experiência com nossos serviços.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Rating */}
            <div className="space-y-2">
              <Label>Avaliação *</Label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    {rating}/5
                  </span>
                )}
              </div>
            </div>

            {/* Review Type */}
            <div className="space-y-2">
              <Label htmlFor="reviewType">Tipo de Avaliação *</Label>
              <Select
                value={reviewType}
                onValueChange={(value) => setReviewType(value as ReviewType)}
              >
                <SelectTrigger id="reviewType">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ReviewType.SERVICE}>
                    Atendimento
                  </SelectItem>
                  <SelectItem value={ReviewType.COMMUNICATION}>
                    Comunicação
                  </SelectItem>
                  <SelectItem value={ReviewType.PROCESS}>
                    Processo
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment">Comentário *</Label>
              <Textarea
                id="comment"
                placeholder="Conte-nos sobre sua experiência..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {comment.length} caracteres
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm()
                onOpenChange(false)
              }}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Avaliação"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
