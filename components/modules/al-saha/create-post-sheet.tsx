'use client'

import * as React from 'react'
import { Image as ImageIcon, Video, MapPin, X, Clock, ChevronDown } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useFeedStore, type PostExpiry } from '@/lib/stores/feed-store'
import { useUserStore } from '@/lib/stores/user-store'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'

const expiryOptions: { value: PostExpiry; label: string }[] = [
  { value: 'permanent', label: 'دائم' },
  { value: '24h', label: '٢٤ ساعة' },
  { value: '1week', label: 'أسبوع' },
  { value: '1month', label: 'شهر' },
]

const getExpiryDate = (expiry: PostExpiry): Date | undefined => {
  const now = new Date()
  switch (expiry) {
    case '24h':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000)
    case '1week':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    case '1month':
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    default:
      return undefined
  }
}

interface CreatePostSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePostSheet({ open, onOpenChange }: CreatePostSheetProps) {
  const { addPost, addPostToFirestore } = useFeedStore()
  const { currentUser, addZoolPoints } = useUserStore()
  const { t, language, isRTL } = useLanguage()
  
  const [content, setContent] = React.useState('')
  const [images, setImages] = React.useState<string[]>([])
  const [expiry, setExpiry] = React.useState<PostExpiry>('permanent')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async () => {
    if (!content.trim() || !currentUser) return

    setIsSubmitting(true)

    const postData = {
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorNameAr: currentUser.nameAr,
      authorAvatar: currentUser.avatar,
      content: content,
      contentAr: content, // In production, would have translation
      images: images,
      reactions: { like: 0, love: 0, kaffu: 0, abshir: 0, haha: 0, sad: 0 },
      commentsCount: 0,
      sharesCount: 0,
      expiry: expiry,
      expiresAt: getExpiryDate(expiry),
    }

    try {
      // Save to Firestore for real-time sync
      await addPostToFirestore(postData)
      addZoolPoints(10) // Award points for posting
    } catch (error) {
      // Fallback to local store if Firestore fails
      console.error('[v0] Failed to save to Firestore, using local store:', error)
      addPost({
        ...postData,
        id: `post-${Date.now()}`,
        timestamp: new Date(),
      })
    }
    
    setContent('')
    setImages([])
    setExpiry('permanent')
    setIsSubmitting(false)
    onOpenChange(false)
  }

  const addDemoImage = () => {
    if (images.length < 10) {
      setImages([...images, `/posts/demo-${images.length + 1}.jpg`])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
        <SheetHeader className="flex flex-row items-center justify-between border-b pb-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <SheetTitle className={cn(isRTL && 'font-arabic')}>
            {t('feed.newPost')}
          </SheetTitle>
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              t('common.send')
            )}
          </Button>
        </SheetHeader>

        <div className="py-4 space-y-4">
          {/* Author info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={currentUser?.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {(isRTL ? currentUser?.nameAr : currentUser?.name)?.[0] || 'Z'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className={cn('font-semibold', isRTL && 'font-arabic')}>
                {isRTL ? currentUser?.nameAr : currentUser?.name}
              </p>
              <button className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {isRTL ? 'إضافة موقع' : 'Add location'}
              </button>
            </div>
          </div>

          {/* Text input */}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('feed.whatsNew')}
            className={cn(
              'min-h-[150px] resize-none border-none text-lg focus-visible:ring-0',
              isRTL && 'font-arabic text-right'
            )}
          />

          {/* Image previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square bg-secondary rounded-lg">
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    {isRTL ? 'صورة' : 'Image'} {index + 1}
                  </div>
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 end-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Post Expiry Selector */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-arabic">مدة المنشور:</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 font-arabic">
                  {expiryOptions.find(o => o.value === expiry)?.label}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="font-arabic">
                {expiryOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setExpiry(option.value)}
                    className={expiry === option.value ? 'bg-primary/10' : ''}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Media buttons */}
          <div className="flex items-center gap-2 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={addDemoImage}
              disabled={images.length >= 10}
            >
              <ImageIcon className="h-5 w-5 text-green-600" />
              <span className={cn(isRTL && 'font-arabic')}>{t('feed.photo')}</span>
              {images.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({images.length}/10)
                </span>
              )}
            </Button>
            <Button variant="outline" className="flex-1 gap-2">
              <Video className="h-5 w-5 text-red-600" />
              <span className={cn(isRTL && 'font-arabic')}>{t('feed.video')}</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
