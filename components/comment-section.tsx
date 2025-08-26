"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, AlertCircle, TrendingUp, StickyNote, Plus, X } from 'lucide-react'
import type { Comment } from '@/utils/goal-helpers'

interface CommentSectionProps {
  patientId: string
  comments: Comment[]
}

export function CommentSection({ patientId, comments }: CommentSectionProps) {
  const [showAddComment, setShowAddComment] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [commentType, setCommentType] = useState<Comment['type']>('note')
  
  // Filtrer les commentaires du patient et trier par date
  const patientComments = comments
    .filter(c => c.patientId === patientId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  
  const getCommentIcon = (type: Comment['type']) => {
    switch (type) {
      case 'absence': return <AlertCircle className="w-4 h-4" />
      case 'progress': return <TrendingUp className="w-4 h-4" />
      default: return <StickyNote className="w-4 h-4" />
    }
  }
  
  const getCommentBadgeVariant = (type: Comment['type']) => {
    switch (type) {
      case 'absence': return 'destructive' as const
      case 'progress': return 'success' as const
      default: return 'secondary' as const
    }
  }
  
  const getCommentTypeLabel = (type: Comment['type']) => {
    switch (type) {
      case 'absence': return 'Absence'
      case 'progress': return 'Progrès'
      default: return 'Note'
    }
  }
  
  const handleAddComment = () => {
    if (!newComment.trim()) return
    
    // En vrai, on sauvegarderait le commentaire
    console.log('Nouveau commentaire:', {
      patientId,
      text: newComment,
      type: commentType,
      createdAt: new Date().toISOString()
    })
    
    setNewComment('')
    setShowAddComment(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Notes & Observations
          </span>
          {!showAddComment && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddComment(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Ajouter
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formulaire d'ajout rapide */}
        {showAddComment && (
          <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={commentType === 'absence' ? 'default' : 'outline'}
                onClick={() => setCommentType('absence')}
              >
                🤒 Absence
              </Button>
              <Button
                size="sm"
                variant={commentType === 'progress' ? 'default' : 'outline'}
                onClick={() => setCommentType('progress')}
              >
                ✅ Progrès
              </Button>
              <Button
                size="sm"
                variant={commentType === 'note' ? 'default' : 'outline'}
                onClick={() => setCommentType('note')}
              >
                📝 Note
              </Button>
            </div>
            
            <Textarea
              placeholder={
                commentType === 'absence' 
                  ? "Ex: Malade cette semaine, n'a pas pu faire les exercices..."
                  : commentType === 'progress'
                  ? "Ex: Belle amélioration sur..."
                  : "Ex: À noter pour la prochaine fois..."
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px]"
            />
            
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowAddComment(false)
                  setNewComment('')
                }}
              >
                <X className="w-4 h-4 mr-1" />
                Annuler
              </Button>
              <Button
                size="sm"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                Ajouter
              </Button>
            </div>
          </div>
        )}
        
        {/* Liste des commentaires */}
        {patientComments.length > 0 ? (
          <div className="space-y-3">
            {patientComments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-3 p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  {getCommentIcon(comment.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <Badge variant={getCommentBadgeVariant(comment.type)} className="text-xs">
                      {getCommentTypeLabel(comment.type)}
                    </Badge>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 break-words">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Aucune note pour le moment</p>
            <p className="text-xs mt-1">Cliquez sur "Ajouter" pour créer une note</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}