'use client'

import * as React from 'react'
import Image from 'next/image'
import { 
  X, 
  Heart, 
  Share2, 
  MessageCircle, 
  Phone, 
  MapPin, 
  Calendar, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Flag,
  ShieldCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { type Listing, categoryLabels, useSouqStore } from '@/lib/stores/souq-store'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'

interface ListingDetailProps {
  listing: Listing
  onClose: () => void
  onStartWansa: (listing: Listing) => void
}

export function ListingDetail({ listing, onClose, onStartWansa }: ListingDetailProps) {
  const { isRTL, t } = useLanguage()
  const { toggleFavorite, favorites } = useSouqStore()
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)
  const isFavorite = favorites.includes(listing.id)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SD' : 'en-SD', {
      style: 'currency',
      currency: 'SDG',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(isRTL ? 'ar-SD' : 'en-SD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  const categoryLabel = categoryLabels[listing.category]

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev < listing.images.length - 1 ? prev + 1 : 0
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev > 0 ? prev - 1 : listing.images.length - 1
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleFavorite(listing.id)}
          >
            <Heart className={cn(
              'h-5 w-5',
              isFavorite ? 'fill-red-500 text-red-500' : ''
            )} />
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Flag className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <ScrollArea className="flex-1">
        {/* Image Gallery */}
        <div className="relative aspect-square bg-secondary">
          {listing.images.length > 0 ? (
            <>
              <Image
                src={listing.images[currentImageIndex]}
                alt={isRTL ? listing.titleAr : listing.title}
                fill
                className="object-cover"
              />
              {listing.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full start-2"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full end-2"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-5 w-5 rtl:rotate-180" />
                  </Button>
                  {/* Dots indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {listing.images.map((_, idx) => (
                      <button
                        key={idx}
                        className={cn(
                          'w-2 h-2 rounded-full transition-colors',
                          idx === currentImageIndex ? 'bg-primary' : 'bg-background/60'
                        )}
                        onClick={() => setCurrentImageIndex(idx)}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              {isRTL ? 'لا توجد صور' : 'No images'}
            </div>
          )}
        </div>

        <div className="p-4 space-y-4">
          {/* Price & Badges */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-3xl font-bold text-primary">
                {formatPrice(listing.price)}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">
                  {isRTL ? categoryLabel.ar : categoryLabel.en}
                </Badge>
                {listing.isBarter && (
                  <Badge className="bg-accent text-accent-foreground">
                    <RefreshCw className="h-3 w-3 me-1" />
                    {isRTL ? 'مقايضة متاحة' : 'Barter Available'}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className={cn(
            'text-xl font-semibold',
            isRTL && 'font-arabic'
          )}>
            {isRTL ? listing.titleAr : listing.title}
          </h1>

          {/* Description */}
          <p className={cn(
            'text-muted-foreground leading-relaxed',
            isRTL && 'font-arabic'
          )}>
            {isRTL ? listing.descriptionAr : listing.description}
          </p>

          <Separator />

          {/* Details */}
          <div className="space-y-3">
            {listing.location && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className={cn(isRTL && 'font-arabic')}>
                  {isRTL ? listing.locationAr || listing.location : listing.location}
                </span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>{formatDate(listing.createdAt)}</span>
            </div>
          </div>

          <Separator />

          {/* Seller Info */}
          <div className="p-4 rounded-xl bg-secondary/50">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-primary">
                <AvatarImage src={listing.seller.avatar} alt={listing.seller.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {listing.seller.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{listing.seller.name}</h3>
                  {listing.seller.isVerified && (
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'عضو منذ 2024' : 'Member since 2024'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Bottom Actions */}
      <div className="p-4 border-t bg-background/95 backdrop-blur-sm">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => {/* Call seller */}}
          >
            <Phone className="h-4 w-4" />
            {isRTL ? 'اتصال' : 'Call'}
          </Button>
          <Button
            className="flex-1 gap-2 bg-primary hover:bg-primary/90"
            onClick={() => onStartWansa(listing)}
          >
            <MessageCircle className="h-4 w-4" />
            {isRTL ? 'ابدأ ونسة' : 'Start Wansa'}
          </Button>
        </div>
      </div>
    </div>
  )
}
