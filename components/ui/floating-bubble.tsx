'use client'

import * as React from 'react'
import { motion, PanInfo } from 'framer-motion'
import { X, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChatStore } from '@/lib/stores/chat-store'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'

interface FloatingBubbleProps {
  gameId: string
  gameName: string
  gameNameAr: string
  gameIcon: React.ComponentType<{ className?: string }>
  onRestore: () => void
  onClose: () => void
}

export function FloatingBubble({
  gameId,
  gameName,
  gameNameAr,
  gameIcon: GameIcon,
  onRestore,
  onClose
}: FloatingBubbleProps) {
  const { isRTL } = useLanguage()
  const [position, setPosition] = React.useState({ x: 20, y: window.innerHeight - 200 })

  const handleDragEnd = (event: any, info: PanInfo) => {
    const newX = position.x + info.offset.x
    const newY = position.y + info.offset.y

    // Keep bubble within screen bounds
    const maxX = window.innerWidth - 80
    const maxY = window.innerHeight - 80

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    })
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={{
        left: 0,
        right: window.innerWidth - 80,
        top: 0,
        bottom: window.innerHeight - 80
      }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="fixed z-50 cursor-move"
      style={{
        left: position.x,
        top: position.y
      }}
    >
      <div className="relative">
        <div className={cn(
          'w-20 h-20 rounded-2xl bg-card border border-border shadow-2xl backdrop-blur-sm',
          'flex flex-col items-center justify-center gap-1 p-2',
          'hover:scale-105 transition-transform'
        )}>
          <GameIcon className="h-6 w-6 text-primary" />
          <span className={cn(
            'text-xs font-medium truncate w-full text-center',
            isRTL && 'font-arabic'
          )}>
            {isRTL ? gameNameAr : gameName}
          </span>
        </div>

        {/* Restore button */}
        <Button
          size="sm"
          variant="secondary"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 shadow-lg"
          onClick={(e) => {
            e.stopPropagation()
            onRestore()
          }}
        >
          <Minimize2 className="h-3 w-3 rotate-180" />
        </Button>

        {/* Close button */}
        <Button
          size="sm"
          variant="destructive"
          className="absolute -top-2 -left-2 h-6 w-6 rounded-full p-0 shadow-lg"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  )
}