'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { useChatStore } from '@/lib/stores/chat-store'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'

export function GamzaNotification() {
  const { showGamzaNotification, gamzaMessage } = useChatStore()
  const { isRTL } = useLanguage()

  return (
    <AnimatePresence>
      {showGamzaNotification && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-2xl bg-amber-500 text-white shadow-2xl',
            'border border-amber-400/50 backdrop-blur-sm',
            isRTL && 'font-arabic'
          )}>
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-medium truncate max-w-xs">
              {gamzaMessage}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}