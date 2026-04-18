'use client'

import * as React from 'react'
import Image from 'next/image'
import { Heart, MapPin, RefreshCw, Flag } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { type Listing, categoryLabels, useSouqStore } from '@/lib/stores/souq-store'
import { useAppStore } from '@/lib/stores/app-store'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'

interface ListingCardProps {
  listing: Listing
  onClick?: () => void
}

export function ListingCard({ listing, onClick }: ListingCardProps) {
  const { isRTL, t } = useLanguage()
  const { toggleFavorite, favorites } = useSouqStore()
  const { openReportSheet } = useAppStore()
  const isFavorite = favorites.includes(listing.id)

  const handleReport = () => {
    openReportSheet({
      type: 'listing',
      id: listing.id,
      content: listing.title,
      authorId: listing.sellerId,
      authorName: listing.sellerName,
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SD' : 'en-SD', {
      style: 'currency',
      currency: 'SDG',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatTimeAgo = (date: Date | string | undefined) => {
    if (!date) return isRTL ? 'الآن' : 'Just now'
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diff = now.getTime() - dateObj.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) {
      return isRTL ? `منذ ${days} يوم` : `${days}d ago`
    }
    if (hours > 0) {
      return isRTL ? `منذ ${hours} ساعة` : `${hours}h ago`
    }
    return isRTL ? 'الآن' : 'Just now'
  }

  const categoryLabel = categoryLabels[listing.category]

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border-border/50"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-square bg-secondary">
        {listing.images[0] ? (
          <Image
            src={listing.images[0]}
            alt={isRTL ? listing.titleAr : listing.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            {isRTL ? 'لا توجد صورة' : 'No image'}
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 flex gap-1 start-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs">
            {isRTL ? categoryLabel.ar : categoryLabel.en}
          </Badge>
          {listing.isBarter && (
            <Badge className="bg-accent text-accent-foreground text-xs">
              <RefreshCw className="h-3 w-3 me-1" />
              {isRTL ? 'مقايضة' : 'Barter'}
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 end-2 flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={(e) => {
              e.stopPropagation()
              handleReport()
            }}
          >
            <Flag className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(listing.id)
            }}
          >
            <Heart 
              className={cn(
                'h-4 w-4 transition-colors',
                isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
              )} 
            />
          </Button>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-3 space-y-2">
        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg text-primary">
            {formatPrice(listing.price)}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTimeAgo(listing.timestamp)}
          </span>
        </div>

        {/* Title */}
        <h3 className={cn(
          'font-medium line-clamp-2 text-sm',
          isRTL && 'font-arabic'
        )}>
          {isRTL ? listing.titleAr : listing.title}
        </h3>

        {/* Location */}
        {listing.location && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className={cn(isRTL && 'font-arabic')}>
              {isRTL ? listing.locationAr || listing.location : listing.location}
            </span>
          </div>
        )}

        {/* Seller */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          <Avatar className="h-6 w-6">
            <AvatarImage src={listing.sellerAvatar} alt={listing.sellerName} />
            <AvatarFallback className="text-xs bg-primary/10">
              {listing.sellerName?.[0] ?? '?'}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate">
            {listing.sellerName}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
