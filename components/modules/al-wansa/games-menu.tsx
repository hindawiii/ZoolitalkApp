'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Gamepad2, 
  Dice1, 
  Dice2, 
  Dice3, 
  Dice4, 
  Dice5, 
  Dice6,
  X,
  Users,
  Trophy,
  Crown,
  Sparkles,
  Grid3X3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useLanguage } from '@/components/providers/language-provider'
import { useChatStore } from '@/lib/stores/chat-store'
import { cn } from '@/lib/utils'

interface GamesMenuProps {
  isOpen: boolean
  onClose: () => void
}

type GameId = 'ludo' | 'dominoes' | 'snakes' | 'crosswords'

interface Game {
  id: GameId
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  players: string
  status: 'available' | 'coming_soon'
}

const games: Game[] = [
  {
    id: 'ludo',
    name: 'Sudanese Ludo',
    nameAr: 'لودو سوداني',
    description: 'Classic Ludo with Sudanese motifs',
    descriptionAr: 'لعبة اللودو الكلاسيكية بزخارف سودانية',
    icon: Dice6,
    color: 'bg-primary',
    players: '2-4',
    status: 'available',
  },
  {
    id: 'dominoes',
    name: 'Dominoes',
    nameAr: 'دومينو',
    description: 'Traditional dominoes game',
    descriptionAr: 'لعبة الدومينو التقليدية',
    icon: Grid3X3,
    color: 'bg-accent',
    players: '2-4',
    status: 'coming_soon',
  },
  {
    id: 'snakes',
    name: 'Snakes & Ladders',
    nameAr: 'الثعابين والسلالم',
    description: 'Fun for the whole family',
    descriptionAr: 'متعة لكل العائلة',
    icon: Sparkles,
    color: 'bg-green-600',
    players: '2-6',
    status: 'coming_soon',
  },
  {
    id: 'crosswords',
    name: 'Sudanese Crosswords',
    nameAr: 'الكلمات المتقاطعة',
    description: 'Local proverbs & riddles',
    descriptionAr: 'أمثال وألغاز سودانية',
    icon: Grid3X3,
    color: 'bg-blue-600',
    players: '1-2',
    status: 'coming_soon',
  },
]

export function GamesMenu({ isOpen, onClose }: GamesMenuProps) {
  const { isRTL } = useLanguage()
  const { setActiveGame, activeGame } = useChatStore()
  const [selectedGame, setSelectedGame] = React.useState<GameId | null>(null)

  const handlePlayGame = (gameId: GameId) => {
    if (games.find(g => g.id === gameId)?.status === 'coming_soon') {
      return
    }
    setSelectedGame(gameId)
    setActiveGame(gameId)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-0 start-0 end-0 bg-background rounded-t-3xl max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3">
              <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <Gamepad2 className="h-6 w-6 text-primary" />
                <div>
                  <h2 className={cn('text-lg font-semibold', isRTL && 'font-arabic')}>
                    {isRTL ? 'ألعاب الونسة' : 'Al-Wansa Games'}
                  </h2>
                  <p className={cn('text-xs text-muted-foreground', isRTL && 'font-arabic')}>
                    {isRTL ? 'العب مع أصدقائك' : 'Play with friends'}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <ScrollArea className="max-h-[60vh]">
              <div className="p-4 space-y-4">
                {/* Games Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {games.map((game) => (
                    <motion.button
                      key={game.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePlayGame(game.id)}
                      className={cn(
                        'relative p-4 rounded-2xl text-start transition-all',
                        game.status === 'coming_soon' 
                          ? 'bg-muted/50 opacity-60' 
                          : 'bg-card hover:shadow-lg'
                      )}
                    >
                      {game.status === 'coming_soon' && (
                        <span className={cn(
                          'absolute top-2 text-[10px] px-2 py-0.5 bg-muted rounded-full',
                          isRTL ? 'start-2' : 'end-2'
                        )}>
                          {isRTL ? 'قريباً' : 'Soon'}
                        </span>
                      )}
                      
                      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-3', game.color)}>
                        <game.icon className="h-6 w-6 text-white" />
                      </div>
                      
                      <h3 className={cn('font-semibold mb-1', isRTL && 'font-arabic')}>
                        {isRTL ? game.nameAr : game.name}
                      </h3>
                      <p className={cn('text-xs text-muted-foreground mb-2', isRTL && 'font-arabic')}>
                        {isRTL ? game.descriptionAr : game.description}
                      </p>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{game.players}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Active Game */}
                {selectedGame === 'ludo' && (
                  <LudoGame onClose={() => setSelectedGame(null)} />
                )}
              </div>
            </ScrollArea>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Sudanese Ludo Game Component
function LudoGame({ onClose }: { onClose: () => void }) {
  const { isRTL } = useLanguage()
  const [diceValue, setDiceValue] = React.useState<number>(1)
  const [isRolling, setIsRolling] = React.useState(false)
  const [currentPlayer, setCurrentPlayer] = React.useState(0)
  const [showEffect, setShowEffect] = React.useState<string | null>(null)
  
  const players = [
    { color: 'bg-red-500', name: 'Player 1', nameAr: 'اللاعب ١' },
    { color: 'bg-blue-500', name: 'Player 2', nameAr: 'اللاعب ٢' },
    { color: 'bg-green-500', name: 'Player 3', nameAr: 'اللاعب ٣' },
    { color: 'bg-yellow-500', name: 'Player 4', nameAr: 'اللاعب ٤' },
  ]

  const DiceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6]
  const CurrentDice = DiceIcons[diceValue - 1]

  // Sudanese sound effect triggers
  const soundEffects = {
    kill: ['بلبص!', 'الليلة ما تنوم!'],
    win: ['مكانا!', 'تسلم يا زول!'],
    six: ['سته يا سته!', 'يا سلام!'],
  }

  const rollDice = () => {
    if (isRolling) return
    
    setIsRolling(true)
    
    // Simulate dice rolling animation
    let rolls = 0
    const maxRolls = 10
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1)
      rolls++
      
      if (rolls >= maxRolls) {
        clearInterval(interval)
        const finalValue = Math.floor(Math.random() * 6) + 1
        setDiceValue(finalValue)
        setIsRolling(false)
        
        // Show effect for rolling 6
        if (finalValue === 6) {
          setShowEffect(soundEffects.six[Math.floor(Math.random() * soundEffects.six.length)])
          setTimeout(() => setShowEffect(null), 2000)
        }
        
        // Move to next player if not 6
        if (finalValue !== 6) {
          setTimeout(() => setCurrentPlayer((prev) => (prev + 1) % 4), 500)
        }
      }
    }, 100)
  }

  // Simulate game events
  const simulateKill = () => {
    setShowEffect(soundEffects.kill[Math.floor(Math.random() * soundEffects.kill.length)])
    setTimeout(() => setShowEffect(null), 2000)
  }

  const simulateWin = () => {
    setShowEffect(soundEffects.win[Math.floor(Math.random() * soundEffects.win.length)])
    setTimeout(() => setShowEffect(null), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Game Header */}
      <div className="flex items-center justify-between">
        <h3 className={cn('font-semibold flex items-center gap-2', isRTL && 'font-arabic')}>
          <Dice6 className="h-5 w-5 text-primary" />
          {isRTL ? 'لودو سوداني' : 'Sudanese Ludo'}
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Sound Effect Display */}
      <AnimatePresence>
        {showEffect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-50 text-center"
          >
            <span className="inline-block px-6 py-3 bg-primary text-primary-foreground text-2xl font-bold rounded-full font-arabic shadow-lg">
              {showEffect}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ludo Board (Simplified) */}
      <div className="aspect-square bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-4 border-2 border-primary/20 relative">
        {/* Sudanese pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20h20v20H20V20zm0-20h20v20H20V0zM0 20h20v20H0V20zm0-20h20v20H0V0z' fill='%232D5A27' fill-opacity='0.3'/%3E%3C/svg%3E")`
          }}
        />
        
        {/* Corner homes */}
        <div className="absolute top-4 start-4 w-[38%] h-[38%] bg-red-500/20 rounded-xl border-2 border-red-500/50 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-red-500 rounded-full shadow-sm" />
            ))}
          </div>
        </div>
        <div className="absolute top-4 end-4 w-[38%] h-[38%] bg-blue-500/20 rounded-xl border-2 border-blue-500/50 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-blue-500 rounded-full shadow-sm" />
            ))}
          </div>
        </div>
        <div className="absolute bottom-4 start-4 w-[38%] h-[38%] bg-green-500/20 rounded-xl border-2 border-green-500/50 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-green-500 rounded-full shadow-sm" />
            ))}
          </div>
        </div>
        <div className="absolute bottom-4 end-4 w-[38%] h-[38%] bg-yellow-500/20 rounded-xl border-2 border-yellow-500/50 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm" />
            ))}
          </div>
        </div>

        {/* Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[24%] h-[24%] bg-card rounded-xl border-2 border-primary/30 flex items-center justify-center">
          <Trophy className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Players & Controls */}
      <div className="grid grid-cols-4 gap-2">
        {players.map((player, index) => (
          <div
            key={index}
            className={cn(
              'p-2 rounded-xl text-center transition-all',
              currentPlayer === index ? 'bg-card ring-2 ring-primary' : 'bg-muted/30'
            )}
          >
            <div className={cn('w-6 h-6 rounded-full mx-auto mb-1', player.color)} />
            <p className={cn('text-[10px]', isRTL && 'font-arabic')}>
              {isRTL ? player.nameAr : player.name}
            </p>
            {currentPlayer === index && (
              <Crown className="h-3 w-3 mx-auto mt-1 text-yellow-500" />
            )}
          </div>
        ))}
      </div>

      {/* Dice & Roll Button */}
      <div className="flex items-center justify-center gap-4">
        <motion.div
          animate={isRolling ? { rotate: [0, 360] } : {}}
          transition={{ duration: 0.1, repeat: isRolling ? Infinity : 0 }}
          className="w-16 h-16 bg-card rounded-xl flex items-center justify-center border-2 border-primary/30 shadow-lg"
        >
          <CurrentDice className="h-10 w-10 text-primary" />
        </motion.div>
        
        <Button
          size="lg"
          onClick={rollDice}
          disabled={isRolling}
          className={cn('rounded-full px-8', isRTL && 'font-arabic')}
        >
          {isRolling ? (isRTL ? 'جاري...' : 'Rolling...') : (isRTL ? 'ارمي النرد' : 'Roll Dice')}
        </Button>
      </div>

      {/* Demo Buttons */}
      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" size="sm" onClick={simulateKill} className={cn(isRTL && 'font-arabic')}>
          {isRTL ? 'محاكاة قتل' : 'Simulate Kill'}
        </Button>
        <Button variant="outline" size="sm" onClick={simulateWin} className={cn(isRTL && 'font-arabic')}>
          {isRTL ? 'محاكاة فوز' : 'Simulate Win'}
        </Button>
      </div>
    </motion.div>
  )
}
