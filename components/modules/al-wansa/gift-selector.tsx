'use client'

import { useState } from 'react'
import { Gift, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { RAKOBA_GIFTS } from '@/lib/rakoba-gifts'
import { useChatStore } from '@/lib/stores/chat-store'
import { useUserStore } from '@/lib/stores/user-store'
import { cn } from '@/lib/utils'

interface GiftSelectorProps {
  chatId: string
  isRTL: boolean
}

export function GiftSelector({ chatId, isRTL }: GiftSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { sendGift } = useChatStore()
  const { currentUser } = useUserStore()

  const handleSendGift = (gift: any, category: string) => {
    if (!currentUser) return

    sendGift(chatId, currentUser.id, currentUser.name, currentUser.avatar, {
      id: gift.id,
      name: gift.name,
      nameAr: gift.nameAr || gift.name,
      category,
      effect: gift.effect,
      symbol: gift.symbol,
      rarity: gift.rarity,
    })

    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary"
          title={isRTL ? 'إرسال هدية' : 'Send Gift'}
        >
          <Gift className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={cn('text-center', isRTL && 'font-arabic')}>
            {isRTL ? 'اختر هدية راكوباتنا' : 'Choose Rakobatna Gift'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Badges Section */}
          <div>
            <h3 className={cn('text-sm font-medium mb-3', isRTL && 'font-arabic text-right')}>
              {isRTL ? 'شارات اللغة العامية' : 'Animated Slang Badges'}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {RAKOBA_GIFTS.badges.map((badge) => (
                <Button
                  key={badge.id}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center gap-2 hover:border-primary"
                  onClick={() => handleSendGift(badge, 'badges')}
                >
                  <div className="text-2xl">
                    {badge.effect === 'shake' && '🤖'}
                    {badge.effect === 'glow' && '✨'}
                    {badge.effect === 'eye-blink' && '👁️'}
                    {badge.effect === 'heartbeat' && '💖'}
                  </div>
                  <span className={cn('text-xs text-center', isRTL && 'font-arabic')}>
                    {isRTL ? badge.name : badge.name}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Heritage Section */}
          <div>
            <h3 className={cn('text-sm font-medium mb-3', isRTL && 'font-arabic text-right')}>
              {isRTL ? 'التراث السوداني' : 'Sudanese Heritage'}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {RAKOBA_GIFTS.heritage.map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  className="h-auto p-3 flex items-center gap-3 hover:border-primary"
                  onClick={() => handleSendGift(item, 'heritage')}
                >
                  <div className="text-2xl">
                    {item.id === 'full-look' && '👑'}
                    {item.id === 'jalabiya' && '👔'}
                    {item.id === 'merkoub' && '🐆'}
                    {item.id === 'angareb' && '🦅'}
                    {item.id === 'dalooka' && '🎺'}
                    {item.id === 'sout-anj' && '🪓'}
                  </div>
                  <div className={cn('flex-1 text-left', isRTL && 'text-right')}>
                    <div className={cn('text-sm font-medium', isRTL && 'font-arabic')}>
                      {isRTL ? item.name : item.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.rarity}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Luxury Section */}
          <div>
            <h3 className={cn('text-sm font-medium mb-3', isRTL && 'font-arabic text-right')}>
              {isRTL ? 'الفخامة والثراء' : 'Luxury & Wealth'}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {RAKOBA_GIFTS.luxury.map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  className="h-auto p-3 flex items-center gap-3 hover:border-primary"
                  onClick={() => handleSendGift(item, 'luxury')}
                >
                  <div className="text-2xl">
                    {item.id === 'diamond-ring' && '💍'}
                    {item.id === 'yacht-royal' && '🛥️'}
                    {item.id === 'private-jet' && '✈️'}
                    {item.id === 'royal-perfume' && '🕯️'}
                    {item.id === 'luck-box' && '🎁'}
                  </div>
                  <div className={cn('flex-1 text-left', isRTL && 'text-right')}>
                    <div className={cn('text-sm font-medium', isRTL && 'font-arabic')}>
                      {isRTL ? item.name : item.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.price || item.rarity}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Animals Section */}
          <div>
            <h3 className={cn('text-sm font-medium mb-3', isRTL && 'font-arabic text-right')}>
              {isRTL ? 'الحيوانات الرمزية' : 'Symbolic Animals'}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {RAKOBA_GIFTS.animals.map((animal) => (
                <Button
                  key={animal.id}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center gap-2 hover:border-primary"
                  onClick={() => handleSendGift(animal, 'animals')}
                >
                  <div className="text-3xl">{animal.symbol}</div>
                  <span className={cn('text-xs text-center', isRTL && 'font-arabic')}>
                    {isRTL ? animal.name : animal.name}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Royal Rank Section */}
          <div>
            <h3 className={cn('text-sm font-medium mb-3', isRTL && 'font-arabic text-right')}>
              {isRTL ? 'تراتبية الملكية' : 'Royal Ranks'}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {RAKOBA_GIFTS.ranks.map((rank) => (
                <Button
                  key={rank.id}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center gap-2 hover:border-primary"
                  onClick={() => handleSendGift({
                    ...rank,
                    symbol: rank.id === 'king-crown' ? '👑' : rank.id === 'queen-crown' ? '👑' : '🛡️',
                    nameAr: rank.name,
                    name: rank.name,
                  }, 'ranks')}
                >
                  <div className="text-3xl">
                    {rank.id === 'king-crown' && '👑'}
                    {rank.id === 'queen-crown' && '👑'}
                    {rank.id === 'knight-royal' && '🛡️'}
                  </div>
                  <span className={cn('text-xs text-center', isRTL && 'font-arabic')}>
                    {isRTL ? rank.name : rank.name}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}