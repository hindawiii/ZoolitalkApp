'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { RAKOBA_GIFTS } from '@/lib/rakoba-gifts'
import { useChatStore } from '@/lib/stores/chat-store'
import { useUserStore } from '@/lib/stores/user-store'
import { useLanguage } from '@/components/providers/language-provider'

interface GiftSelectorProps {
  chatId: string
  isRTL: boolean
}

export function GiftSelector({ chatId, isRTL }: GiftSelectorProps) {
  const { currentUser } = useUserStore()
  const { addMessage } = useChatStore()
  const { isRTL: languageRTL } = useLanguage()
  const [isOpen, setIsOpen] = React.useState(false)

  const handleSendGift = (gift: any, category: string) => {
    if (!currentUser || !chatId) return

    const newMessage: any = {
      id: `msg-${Date.now()}`,
      chatId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content: isRTL ? gift.name : gift.name,
      type: 'gift',
      gift: {
        id: gift.id,
        name: gift.name,
        nameAr: gift.name,
        category,
        effect: gift.effect,
        symbol: gift.symbol,
        rarity: gift.rarity,
      },
      timestamp: new Date(),
      status: 'sending',
    }

    addMessage(chatId, newMessage)
    setIsOpen(false)
  }

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'Legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500'
      case 'Epic': return 'bg-gradient-to-r from-purple-400 to-pink-500'
      case 'Rare': return 'bg-gradient-to-r from-blue-400 to-cyan-500'
      case 'Common': return 'bg-gradient-to-r from-gray-400 to-gray-500'
      default: return 'bg-gradient-to-r from-green-400 to-emerald-500'
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="flex-shrink-0 rounded-full hover:bg-primary/10"
        >
          <Gift className="h-5 w-5 text-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        align={isRTL ? 'start' : 'end'}
        side="top"
        sideOffset={8}
      >
        <div className="p-4 border-b">
          <h3 className={cn('font-semibold flex items-center gap-2', isRTL && 'font-arabic')}>
            <Sparkles className="h-5 w-5 text-primary" />
            {isRTL ? 'إرسال هدية' : 'Send Gift'}
          </h3>
          <p className={cn('text-sm text-muted-foreground mt-1', isRTL && 'font-arabic')}>
            {isRTL ? 'اختر هدية لإرسالها' : 'Choose a gift to send'}
          </p>
        </div>

        <ScrollArea className="h-96">
          <div className="p-4 space-y-6">
            {/* Heritage Gifts */}
            <div>
              <h4 className={cn('font-medium mb-3 flex items-center gap-2', isRTL && 'font-arabic')}>
                <span className="text-amber-600">🏺</span>
                {isRTL ? 'الهدايا التراثية' : 'Heritage Gifts'}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {RAKOBA_GIFTS.heritage.map((gift) => (
                  <motion.button
                    key={gift.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSendGift(gift, 'heritage')}
                    className={cn(
                      'relative p-3 rounded-xl border text-start transition-all hover:shadow-md',
                      getRarityColor(gift.rarity)
                    )}
                  >
                    <div className="text-white text-sm font-medium truncate">
                      {isRTL ? gift.name : gift.name}
                    </div>
                    {gift.rarity && (
                      <Badge
                        variant="secondary"
                        className="absolute top-1 end-1 text-xs px-1.5 py-0.5 bg-white/20 text-white border-0"
                      >
                        {gift.rarity}
                      </Badge>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Slang Badges */}
            <div>
              <h4 className={cn('font-medium mb-3 flex items-center gap-2', isRTL && 'font-arabic')}>
                <span className="text-red-500">🏷️</span>
                {isRTL ? 'شارات اللهجة' : 'Slang Badges'}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {RAKOBA_GIFTS.badges.map((badge) => (
                  <motion.button
                    key={badge.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSendGift(badge, 'badges')}
                    className="p-3 rounded-xl border bg-gradient-to-r from-red-400 to-pink-500 text-white text-start hover:shadow-md transition-all"
                  >
                    <div className="text-sm font-medium truncate">
                      {isRTL ? badge.name : badge.name}
                    </div>
                    <div className="text-xs opacity-80 mt-1">
                      {badge.effect}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Luxury Gifts */}
            <div>
              <h4 className={cn('font-medium mb-3 flex items-center gap-2', isRTL && 'font-arabic')}>
                <span className="text-purple-600">💎</span>
                {isRTL ? 'الهدايا الفاخرة' : 'Luxury Gifts'}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {RAKOBA_GIFTS.luxury.map((luxury) => (
                  <motion.button
                    key={luxury.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSendGift(luxury, 'luxury')}
                    className={cn(
                      'relative p-3 rounded-xl border text-start transition-all hover:shadow-md',
                      getRarityColor(luxury.rarity)
                    )}
                  >
                    <div className="text-white text-sm font-medium truncate">
                      {isRTL ? luxury.name : luxury.name}
                    </div>
                    {luxury.price && (
                      <Badge
                        variant="secondary"
                        className="absolute top-1 end-1 text-xs px-1.5 py-0.5 bg-white/20 text-white border-0"
                      >
                        {luxury.price}
                      </Badge>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Animals */}
            <div>
              <h4 className={cn('font-medium mb-3 flex items-center gap-2', isRTL && 'font-arabic')}>
                <span className="text-green-600">🐾</span>
                {isRTL ? 'الحيوانات' : 'Animals'}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {RAKOBA_GIFTS.animals.map((animal) => (
                  <motion.button
                    key={animal.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSendGift(animal, 'animals')}
                    className="p-3 rounded-xl border bg-gradient-to-r from-green-400 to-emerald-500 text-white text-start hover:shadow-md transition-all"
                  >
                    <div className="text-2xl mb-1">{animal.symbol}</div>
                    <div className="text-sm font-medium truncate">
                      {isRTL ? animal.name : animal.name}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Royal Ranks */}
            <div>
              <h4 className={cn('font-medium mb-3 flex items-center gap-2', isRTL && 'font-arabic')}>
                <span className="text-yellow-600">👑</span>
                {isRTL ? 'الرتب الملكية' : 'Royal Ranks'}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {RAKOBA_GIFTS.ranks.map((rank) => (
                  <motion.button
                    key={rank.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSendGift(rank, 'ranks')}
                    className="p-3 rounded-xl border bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-start hover:shadow-md transition-all"
                  >
                    <div className="text-2xl mb-1">
                      {rank.id.includes('king') ? '👑' : rank.id.includes('queen') ? '👸' : '⚔️'}
                    </div>
                    <div className="text-sm font-medium truncate">
                      {isRTL ? rank.name : rank.name}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}