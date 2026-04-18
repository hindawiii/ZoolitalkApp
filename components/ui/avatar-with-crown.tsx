'use client'

import * as React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { RoyalCrownOverlay } from '@/components/ui/royal-crown-overlay'
import { cn } from '@/lib/utils'

interface AvatarWithCrownProps {
  src: string
  alt: string
  fallback?: string
  royalRank?: 'king-crown' | 'queen-crown' | 'knight-royal'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showCrown?: boolean
}

export function AvatarWithCrown({
  src,
  alt,
  fallback,
  royalRank,
  size = 'md',
  className,
  showCrown = true
}: AvatarWithCrownProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  const crownSize = {
    sm: 'sm',
    md: 'md',
    lg: 'md',
    xl: 'lg'
  } as const

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <Avatar className="w-full h-full">
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback>{fallback || alt[0]}</AvatarFallback>
      </Avatar>
      {showCrown && royalRank && ['king-crown', 'queen-crown'].includes(royalRank) && (
        <RoyalCrownOverlay
          royalRank={royalRank}
          size={crownSize[size]}
          className="top-0 end-0"
        />
      )}
    </div>
  )
}