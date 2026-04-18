'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RoyalCrownOverlayProps {
  royalRank?: 'king-crown' | 'queen-crown' | 'knight-royal'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function RoyalCrownOverlay({
  royalRank,
  size = 'md',
  className
}: RoyalCrownOverlayProps) {
  if (!royalRank || !['king-crown', 'queen-crown'].includes(royalRank)) {
    return null
  }

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const crownSize = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  const isQueen = royalRank === 'queen-crown'

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'royal-crown-overlay absolute z-10 pointer-events-none',
        sizeClasses[size],
        className
      )}
    >
      <motion.div
        className="royal-crown w-full h-full flex items-center justify-center"
        animate={{
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <Crown
          className={cn(
            crownSize[size],
            isQueen ? 'text-pink-500' : 'text-yellow-500',
            'drop-shadow-lg'
          )}
          fill="currentColor"
        />
      </motion.div>
    </motion.div>
  )
}

// Hook to check if user has royal rank
export function useRoyalRank(user?: { royalRank?: string }) {
  return {
    hasRoyalRank: user?.royalRank && ['king-crown', 'queen-crown'].includes(user.royalRank),
    isKing: user?.royalRank === 'king-crown',
    isQueen: user?.royalRank === 'queen-crown',
    royalRank: user?.royalRank as 'king-crown' | 'queen-crown' | undefined
  }
}