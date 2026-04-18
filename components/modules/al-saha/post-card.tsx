'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  MapPin,
  Bookmark,
  Volume2,
  VolumeX,
  Clock,
  Flag,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useFeedStore, type Post, type ReactionType } from '@/lib/stores/feed-store'
import { useAppStore } from '@/lib/stores/app-store'
import { useLanguage } from '@/components/providers/language-provider'
import { useGender } from '@/hooks/use-gender'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'

// Helper to calculate remaining time
function useCountdown(expiresAt?: Date) {
  const [timeLeft, setTimeLeft] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!expiresAt) {
      setTimeLeft(null)
      return
    }

    const updateTimeLeft = () => {
      const now = new Date()
      const diff = expiresAt.getTime() - now.getTime()
      
      if (diff <= 0) {
        setTimeLeft('انتهى')
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      if (hours >= 24) {
        const days = Math.floor(hours / 24)
        setTimeLeft(`${days} يوم`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}س ${minutes}د`)
      } else {
        setTimeLeft(`${minutes}د`)
      }
    }

    updateTimeLeft()
    const interval = setInterval(updateTimeLeft, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [expiresAt])

  return timeLeft
}

interface PostCardProps {
  post: Post
}

// Reaction definitions with Sudanese flavor
const reactions: { type: ReactionType; emoji: string; label: { ar: string; en: string } }[] = [
  { type: 'like', emoji: '👍', label: { ar: 'إعجاب', en: 'Like' } },
  { type: 'love', emoji: '❤️', label: { ar: 'حب', en: 'Love' } },
  { type: 'kaffu', emoji: '👏', label: { ar: 'كفو', en: 'Kaffu' } },
  { type: 'abshir', emoji: '🤝', label: { ar: 'أبشر', en: 'Abshir' } },
  { type: 'haha', emoji: '😂', label: { ar: 'هههه', en: 'Haha' } },
  { type: 'sad', emoji: '😢', label: { ar: 'حزين', en: 'Sad' } },
]

export function PostCard({ post }: PostCardProps) {
  const { reactToPost, removeReaction } = useFeedStore()
  const { openReportSheet } = useAppStore()
  const { language, isRTL } = useLanguage()
  const { interaction } = useGender()
  const [showReactions, setShowReactions] = React.useState(false)
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)
  const [isBookmarked, setIsBookmarked] = React.useState(false)
  const [isMuted, setIsMuted] = React.useState(true)
  const longPressTimer = React.useRef<number | null>(null)
  const countdown = useCountdown(post.expiresAt)

  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: language === 'ar' ? ar : enUS,
    })
  }

  const totalReactions = Object.values(post.reactions).reduce((sum, count) => sum + count, 0)

  const handleLikePress = () => {
    if (post.userReaction) {
      removeReaction(post.id)
    } else {
      reactToPost(post.id, 'like')
    }
  }

  const handleLongPressStart = () => {
    longPressTimer.current = window.setTimeout(() => {
      setShowReactions(true)
    }, 500)
  }

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
  }

  const handleReaction = (type: ReactionType) => {
    reactToPost(post.id, type)
    setShowReactions(false)
  }

  const handleReport = () => {
    openReportSheet({
      type: 'post',
      id: post.id,
      content: post.content,
      authorId: post.authorId,
      authorName: post.authorName,
    })
  }

  const currentReaction = reactions.find((r) => r.type === post.userReaction)

  return (
    <article className="py-4 relative">
      {/* Countdown Badge for Timed Posts */}
      {countdown && post.expiry !== 'permanent' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 start-2 z-10 flex items-center gap-1 px-2 py-1 bg-orange-500/90 text-white rounded-full text-xs font-arabic"
        >
          <Clock className="h-3 w-3" />
          <span>{countdown}</span>
        </motion.div>
      )}
      
      {/* Header */}
      <div className="flex items-center gap-3 px-4 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.authorAvatar} alt={post.authorName} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {(isRTL ? post.authorNameAr : post.authorName)[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className={cn('font-semibold text-sm', isRTL && 'font-arabic')}>
            {isRTL ? post.authorNameAr : post.authorName}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{formatTime(post.timestamp)}</span>
            {post.location && (
              <>
                <span>•</span>
                <MapPin className="h-3 w-3" />
                <span>{post.location}</span>
              </>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
            <DropdownMenuItem onClick={() => setIsBookmarked(!isBookmarked)}>
              {isRTL ? 'حفظ' : 'Save'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleReport}>
              {isRTL ? 'إبلاغ' : 'Report'}
            </DropdownMenuItem>
            <DropdownMenuItem>{isRTL ? 'إخفاء' : 'Hide'}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="px-4 mb-3">
        <p className={cn('text-sm leading-relaxed', isRTL && 'font-arabic')}>
          {isRTL ? post.contentAr : post.content}
        </p>
      </div>

      {/* Media */}
      {(post.images.length > 0 || post.videoUrl) && (
        <div className="relative mb-3">
          {post.isReel || post.videoUrl ? (
            // Video/Reel
            <div className="relative aspect-[9/16] max-h-[500px] bg-black flex items-center justify-center">
              <div className="text-white text-center">
                <p className="text-sm opacity-70">{isRTL ? 'فيديو' : 'Video'}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-4 end-4 bg-black/50 text-white hover:bg-black/70"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
            </div>
          ) : (
            // Images carousel
            <div className="relative">
              <div className="aspect-square bg-secondary flex items-center justify-center overflow-hidden">
                <div
                  className="flex transition-transform duration-300 w-full h-full"
                  style={{ transform: `translateX(${isRTL ? currentImageIndex * 100 : -currentImageIndex * 100}%)` }}
                >
                  {post.images.map((img, index) => (
                    <div
                      key={index}
                      className="w-full h-full flex-shrink-0 bg-secondary flex items-center justify-center"
                    >
                      <div className="text-muted-foreground text-sm">
                        {isRTL ? 'صورة' : 'Image'} {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Carousel indicators */}
              {post.images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {post.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        'w-1.5 h-1.5 rounded-full transition-all',
                        index === currentImageIndex
                          ? 'bg-white w-3'
                          : 'bg-white/50'
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Reaction Stats */}
      {totalReactions > 0 && (
        <div className="px-4 mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex -space-x-1">
            {reactions
              .filter((r) => post.reactions[r.type] > 0)
              .slice(0, 3)
              .map((r) => (
                <span key={r.type} className="text-sm">{r.emoji}</span>
              ))}
          </div>
          <span>{totalReactions}</span>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* Like button with reactions */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'gap-1.5',
                post.userReaction && 'text-primary'
              )}
              onClick={handleLikePress}
              onMouseDown={handleLongPressStart}
              onMouseUp={handleLongPressEnd}
              onMouseLeave={handleLongPressEnd}
              onTouchStart={handleLongPressStart}
              onTouchEnd={handleLongPressEnd}
            >
              {currentReaction ? (
                <span className="text-lg">{currentReaction.emoji}</span>
              ) : (
                <Heart className={cn('h-5 w-5', post.userReaction && 'fill-current')} />
              )}
              <span className={cn('text-sm', isRTL && 'font-arabic')}>
                {currentReaction
                  ? (isRTL ? currentReaction.label.ar : currentReaction.label.en)
                  : (isRTL ? 'إعجاب' : 'Like')}
              </span>
            </Button>

            {/* Reactions popup */}
            <AnimatePresence>
              {showReactions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  className="absolute bottom-full mb-2 start-0 flex gap-1 p-2 bg-card rounded-full shadow-lg border"
                >
                  {reactions.map((reaction) => (
                    <motion.button
                      key={reaction.type}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleReaction(reaction.type)}
                      className="text-2xl p-1 hover:bg-secondary rounded-full transition-colors"
                      title={isRTL ? reaction.label.ar : reaction.label.en}
                    >
                      {reaction.emoji}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Comment button */}
          <Button variant="ghost" size="sm" className="gap-1.5">
            <MessageCircle className="h-5 w-5" />
            <span>{post.commentsCount}</span>
          </Button>

          {/* Share button */}
          <Button variant="ghost" size="sm" className="gap-1.5">
            <Share2 className="h-5 w-5" />
            <span>{post.sharesCount}</span>
          </Button>

          {/* Report button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReport}
            aria-label={isRTL ? 'إبلاغ المنشور' : 'Report post'}
            className="h-8 w-8"
          >
            <Flag className="h-4 w-4" />
          </Button>
        </div>

        {/* Bookmark */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsBookmarked(!isBookmarked)}
        >
          <Bookmark className={cn('h-5 w-5', isBookmarked && 'fill-current')} />
        </Button>
      </div>

      {/* Click outside to close reactions */}
      {showReactions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowReactions(false)}
        />
      )}
    </article>
  )
}
