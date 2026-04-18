'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedEmojiProps {
  emoji: string
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
  onClick?: () => void
  className?: string
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
}

export function AnimatedEmoji({
  emoji,
  size = 'md',
  animate = true,
  onClick,
  className,
}: AnimatedEmojiProps) {
  const [isAnimating, setIsAnimating] = React.useState(false)

  const handleClick = () => {
    if (animate) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 500)
    }
    onClick?.()
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      className={cn(
        'cursor-pointer select-none focus:outline-none',
        sizeClasses[size],
        className
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={
        isAnimating
          ? {
              scale: [1, 1.3, 0.9, 1.1, 1],
              rotate: [0, -10, 10, -5, 0],
            }
          : {}
      }
      transition={{
        duration: 0.5,
        ease: 'easeInOut',
      }}
    >
      {emoji}
    </motion.button>
  )
}

// Emoji picker with commonly used Sudanese-friendly reactions
const commonEmojis = [
  '😊', '❤️', '😂', '👍',
  '🤲', '☕', '🙏', '💪',
  '🎉', '👏', '🤝', '✨',
  '😍', '🥰', '😢', '🔥',
]

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
  onClose: () => void
  isOpen: boolean
}

export function EmojiPicker({ onSelect, onClose, isOpen }: EmojiPickerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-card border border-border rounded-2xl p-4 shadow-xl min-w-[200px]"
        >
          <div className="grid grid-cols-4 gap-3 place-items-center">
            {commonEmojis.map((emoji) => (
              <AnimatedEmoji
                key={emoji}
                emoji={emoji}
                size="lg"
                className="w-10 h-10 flex items-center justify-center hover:bg-secondary rounded-lg transition-colors"
                onClick={() => {
                  onSelect(emoji)
                  onClose()
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Flying emoji animation for reactions
interface FlyingEmojiProps {
  emoji: string
  onComplete: () => void
}

export function FlyingEmoji({ emoji, onComplete }: FlyingEmojiProps) {
  React.useEffect(() => {
    const timer = setTimeout(onComplete, 1500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed pointer-events-none text-5xl z-[100]"
      initial={{ 
        opacity: 1, 
        scale: 0.5,
        y: '50vh',
        x: '50vw',
      }}
      animate={{
        opacity: [1, 1, 0],
        scale: [0.5, 1.5, 1],
        y: ['50vh', '30vh', '-10vh'],
        x: ['50vw', '45vw', '50vw'],
      }}
      transition={{
        duration: 1.5,
        ease: 'easeOut',
      }}
    >
      {emoji}
    </motion.div>
  )
}
