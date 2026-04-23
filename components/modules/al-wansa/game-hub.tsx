'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Award,
  CheckCircle,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  Grid,
  Heart,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Shuffle,
  Star,
  X,
  Minimize2,
  ArrowDownCircle,
  ArrowUpCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useChatStore } from '@/lib/stores/chat-store'
import { useAppStore } from '@/lib/stores/app-store'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'
import { FloatingBubble } from '@/components/ui/floating-bubble'

const games = [
  {
    id: 'siga',
    name: 'Siga 5x5',
    nameAr: 'سيقة ٥×٥',
    description: 'A compact capture board where every stone matters.',
    descriptionAr: 'لوحة أسرٍ ٥×٥ حيث تُحسم المعارك بخطوة واحدة.',
    icon: Dice1,
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'card-50',
    name: 'Card Game 50',
    nameAr: 'ورق ٥٠',
    description: 'Bid, score and race to the golden fifty.',
    descriptionAr: 'زايد وراهن وسجل للوصول إلى الخمسين.',
    icon: Dice3,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'crossword',
    name: 'Proverbs Crossword',
    nameAr: 'كلمات تقاطع أمثال',
    description: 'Fill the board to uncover a Sudanese proverb.',
    descriptionAr: 'أكمل الشبكة لتكشف مثلاً سودانياً.',
    icon: Grid,
    color: 'from-sky-500 to-blue-600',
  },
] as const

type GameId = (typeof games)[number]['id']

const proverbPuzzle = [
  { word: 'الجار', hint: 'Neighbor' },
  { word: 'قبل', hint: 'Before' },
  { word: 'الدار', hint: 'House' },
]

function createEmptyBoard() {
  return Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => ''))
}

function cloneBoard(board: string[][]) {
  return board.map((row) => [...row])
}

function getGroupCells(board: string[][], r: number, c: number, marker: string) {
  const visited = new Set<string>()
  const stack = [[r, c]]
  const cells: [number, number][] = []

  while (stack.length) {
    const [row, col] = stack.pop()!
    const key = `${row}:${col}`
    if (visited.has(key)) continue
    visited.add(key)
    if (board[row]?.[col] !== marker) continue
    cells.push([row, col])
    const neighbors: [number, number][] = [
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1],
    ]
    for (const [nr, nc] of neighbors) {
      if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5) {
        stack.push([nr, nc])
      }
    }
  }

  return cells
}

function hasLiberty(board: string[][], cells: [number, number][]) {
  for (const [row, col] of cells) {
    const neighbors: [number, number][] = [
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1],
    ]
    for (const [nr, nc] of neighbors) {
      if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5) {
        if (!board[nr][nc]) {
          return true
        }
      }
    }
  }
  return false
}

export function GameHub() {
  const { isRTL } = useLanguage()
  const { activeGame, setActiveGame, isGameMinimized, setGameMinimized } = useChatStore()
  const [selectedGame, setSelectedGame] = React.useState<GameId | null>(activeGame as GameId | null)

  React.useEffect(() => {
    if (activeGame) {
      setSelectedGame(activeGame as GameId)
    }
  }, [activeGame])

  const currentGameId = selectedGame || (activeGame as GameId | null)
  const currentGame = games.find((game) => game.id === currentGameId) ?? null

  const handleLaunch = (gameId: GameId) => {
    setSelectedGame(gameId)
    setActiveGame(gameId)
    setGameMinimized(false)
  }

  const handleClose = () => {
    setSelectedGame(null)
    setActiveGame(null)
    setGameMinimized(false)
  }

  const handleMinimize = () => {
    setGameMinimized(true)
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-5">
        <div className="rounded-[2rem] border border-green-900/10 bg-white/90 p-5 shadow-2xl dark:border-emerald-800/30 dark:bg-slate-950/90">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className={cn('text-sm font-semibold text-emerald-700 dark:text-amber-300', isRTL && 'font-arabic')}>
                {isRTL ? 'مركز الألعاب' : 'Game Hub'}
              </p>
              <h2 className={cn('mt-1 text-2xl font-bold text-[#2D5A27]', isRTL && 'font-arabic')}>
                {isRTL ? 'ساحة التحديات السودانية' : 'Sudanese Play Arena'}
              </h2>
              <p className={cn('mt-2 text-sm text-muted-foreground', isRTL && 'font-arabic')}>
                {isRTL ? 'اختر لعبة، احفظ تقدمك، وواصل الدردشة دون أن تفقد اللعب.' : 'Choose a game, keep progress, and keep chatting while you stay in play.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className={cn('rounded-full border border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-600/30 dark:bg-amber-900/20 dark:text-amber-200', isRTL && 'font-arabic')}>
                {isRTL ? 'اللعب متعدد المهام' : 'Multitasking Ready'}
              </Badge>
              <Badge className={cn('rounded-full border border-primary/20 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/20 dark:text-primary-foreground', isRTL && 'font-arabic')}>
                {isRTL ? 'اللعبة الآن' : 'Game Live'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {games.map((game) => {
            const Icon = game.icon
            const isActive = currentGameId === game.id
            return (
              <div key={game.id} className={cn('rounded-3xl border p-4 shadow-sm transition hover:shadow-lg', isActive ? 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40' : 'border-border bg-card')}>
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br', game.color, 'text-white mb-4')}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className={cn('text-lg font-semibold', isRTL && 'font-arabic')}>
                  {isRTL ? game.nameAr : game.name}
                </h3>
                <p className={cn('mt-2 text-sm text-muted-foreground', isRTL && 'font-arabic')}>
                  {isRTL ? game.descriptionAr : game.description}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <Button size="sm" onClick={() => handleLaunch(game.id)} className={cn(isRTL && 'font-arabic')}>
                    {isActive ? (isRTL ? 'استمر' : 'Continue') : (isRTL ? 'ابدأ' : 'Play')}
                  </Button>
                  {isActive && (
                    <Badge variant="secondary" className={cn(isRTL && 'font-arabic')}>
                      {isRTL ? 'مفتوحة' : 'Open'}
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {currentGame && (
          <div className="rounded-[2rem] border border-border bg-card p-5 shadow-2xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#2D5A27]/10 text-[#2D5A27]">
                    <currentGame.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className={cn('text-xl font-semibold', isRTL && 'font-arabic')}>
                      {isRTL ? currentGame.nameAr : currentGame.name}
                    </h3>
                    <p className={cn('text-sm text-muted-foreground', isRTL && 'font-arabic')}>
                      {isRTL ? currentGame.descriptionAr : currentGame.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleMinimize} className={cn(isRTL && 'font-arabic')}>
                  <Minimize2 className="h-4 w-4" />
                  {isRTL ? 'تصغير' : 'Minimize'}
                </Button>
                <Button size="sm" variant="ghost" onClick={handleClose} className={cn(isRTL && 'font-arabic')}>
                  <X className="h-4 w-4" />
                  {isRTL ? 'إغلاق' : 'Close'}
                </Button>
              </div>
            </div>

            <div className="mt-6">
              {currentGame.id === 'siga' && <SigaGame />}
              {currentGame.id === 'card-50' && <CardGame50 />}
              {currentGame.id === 'crossword' && <ProverbsCrossword />}
            </div>
          </div>
        )}

        {currentGame && isGameMinimized && (
          <div className="rounded-3xl border border-amber-300/20 bg-amber-50 p-4 text-center shadow-lg dark:border-amber-700/30 dark:bg-amber-950/20">
            <p className={cn('text-sm font-semibold text-amber-900 dark:text-amber-100', isRTL && 'font-arabic')}>
              {isRTL ? 'اللعبة مصغرة. استخدم الفقاعة العائمة للعودة إليها.' : 'Game minimized. Use the floating bubble to restore it.'}
            </p>
          </div>
        )}

        {/* Floating Bubble for minimized games */}
        <AnimatePresence>
          {currentGame && isGameMinimized && (
            <FloatingBubble
              gameId={currentGame.id}
              gameName={currentGame.name}
              gameNameAr={currentGame.nameAr}
              gameIcon={currentGame.icon}
              onRestore={() => setGameMinimized(false)}
              onClose={handleClose}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function SigaGame() {
  const { isRTL } = useLanguage()
  const [board, setBoard] = React.useState<string[][]>(createEmptyBoard)
  const [currentPlayer, setCurrentPlayer] = React.useState(1)
  const [captures, setCaptures] = React.useState({ 1: 0, 2: 0 })
  const [status, setStatus] = React.useState<string | null>(null)

  const placeStone = (row: number, col: number) => {
    if (board[row][col] || status === 'finished') return
    const playerMarker = currentPlayer === 1 ? 'p1' : 'p2'
    const opponentMarker = currentPlayer === 1 ? 'p2' : 'p1'
    const nextBoard = cloneBoard(board)
    nextBoard[row][col] = playerMarker

    let capturedCount = 0
    const neighbors: [number, number][] = [
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1],
    ]

    for (const [nr, nc] of neighbors) {
      if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5 && nextBoard[nr][nc] === opponentMarker) {
        const group = getGroupCells(nextBoard, nr, nc, opponentMarker)
        if (!hasLiberty(nextBoard, group)) {
          capturedCount += group.length
          for (const [gr, gc] of group) {
            nextBoard[gr][gc] = ''
          }
        }
      }
    }

    const nextPlayer = capturedCount === 0 ? (currentPlayer === 1 ? 2 : 1) : currentPlayer
    setBoard(nextBoard)
    setCaptures((prev) => ({
      ...prev,
      [currentPlayer]: prev[currentPlayer as keyof typeof prev] + capturedCount,
    }))
    setCurrentPlayer(nextPlayer)
    setStatus(capturedCount > 0
      ? isRTL ? `تم أسر ${capturedCount} حجر${capturedCount > 1 ? 'ان' : ''}` : `Captured ${capturedCount} stone${capturedCount > 1 ? 's' : ''}`
      : isRTL ? `دور اللاعب ${currentPlayer === 1 ? '١' : '٢'}` : `Player ${currentPlayer === 1 ? '1' : '2'} moved`)
  }

  const resetBoard = () => {
    setBoard(createEmptyBoard())
    setCurrentPlayer(1)
    setCaptures({ 1: 0, 2: 0 })
    setStatus(isRTL ? 'ابدأ اللعب بالضغط على الخانات' : 'Start by placing stones on the board')
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-3xl border border-border bg-background p-4 text-center">
          <p className={cn('text-xs text-muted-foreground', isRTL && 'font-arabic')}>
            {isRTL ? 'اللاعب الجاري' : 'Current Player'}
          </p>
          <p className={cn('mt-2 text-lg font-semibold', isRTL && 'font-arabic')}>
            {currentPlayer === 1 ? (isRTL ? 'الأحمر' : 'Red') : (isRTL ? 'الأزرق' : 'Blue')}
          </p>
        </div>
        <div className="rounded-3xl border border-border bg-background p-4 text-center">
          <p className={cn('text-xs text-muted-foreground', isRTL && 'font-arabic')}>
            {isRTL ? 'الأسرات' : 'Captures'}
          </p>
          <div className="mt-2 flex items-center justify-center gap-4 text-sm font-semibold">
            <span>{isRTL ? 'أحمر' : 'Red'}: {captures[1]}</span>
            <span>{isRTL ? 'أزرق' : 'Blue'}: {captures[2]}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 rounded-3xl border border-border bg-card p-3">
        {board.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isP1 = cell === 'p1'
            const isP2 = cell === 'p2'
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => placeStone(rowIndex, colIndex)}
                className={cn(
                  'aspect-square rounded-2xl border transition-colors focus:outline-none',
                  cell
                    ? isP1
                      ? 'border-red-500/60 bg-red-500/20 text-red-700'
                      : 'border-sky-500/60 bg-sky-500/20 text-sky-700'
                    : 'border-border bg-muted/80 hover:bg-muted'
                )}
                aria-label={isRTL ? `صف ${rowIndex + 1} عمود ${colIndex + 1}` : `Row ${rowIndex + 1} Col ${colIndex + 1}`}
              >
                {cell && (
                  <span className={cn('inline-flex h-3.5 w-3.5 rounded-full', isP1 ? 'bg-red-500' : 'bg-sky-500')} />
                )}
              </button>
            )
          }),
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={cn('text-sm text-muted-foreground', isRTL && 'font-arabic')}>
          {status}
        </p>
        <Button size="sm" variant="outline" onClick={resetBoard} className={cn(isRTL && 'font-arabic')}>
          {isRTL ? 'إعادة ضبط' : 'Reset Board'}
        </Button>
      </div>
    </div>
  )
}

function CardGame50() {
  const { isRTL } = useLanguage()
  const [bid, setBid] = React.useState(25)
  const [round, setRound] = React.useState(1)
  const [playerScore, setPlayerScore] = React.useState(0)
  const [opponentScore, setOpponentScore] = React.useState(0)
  const [history, setHistory] = React.useState<Array<{ round: number; playerBid: number; opponentBid: number; result: string }>>([])
  const [message, setMessage] = React.useState('')

  const playRound = () => {
    const opponentBid = Math.max(1, Math.min(50, 50 - bid + Math.round((Math.random() - 0.5) * 20)))
    const playerDiff = Math.abs(50 - bid)
    const opponentDiff = Math.abs(50 - opponentBid)
    const playerWin = playerDiff <= opponentDiff
    const delta = playerWin ? 10 : -8

    setPlayerScore((prev) => prev + delta)
    setOpponentScore((prev) => prev + (playerWin ? -5 : 10))
    setHistory((prev) => [
      { round, playerBid: bid, opponentBid, result: playerWin ? (isRTL ? 'فزت' : 'Win') : (isRTL ? 'خسرت' : 'Lose') },
      ...prev,
    ].slice(0, 5))
    setMessage(playerWin
      ? isRTL ? `دور ${round}: اقتربت أكثر!` : `Round ${round}: You were closer!`
      : isRTL ? `دور ${round}: الخصم أخذ الجولة.` : `Round ${round}: Opponent takes it.`)
    setRound((prev) => prev + 1)
  }

  const resetGame = () => {
    setBid(25)
    setRound(1)
    setPlayerScore(0)
    setOpponentScore(0)
    setHistory([])
    setMessage(isRTL ? 'اختَر قيمة المزايدة وابدأ الجولة.' : 'Choose your bid and start the round.')
  }

  React.useEffect(() => {
    setMessage(isRTL ? 'اختَر قيمة المزايدة وابدأ الجولة.' : 'Choose your bid and start the round.')
  }, [isRTL])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-3xl border border-border bg-background p-4 text-center">
          <p className={cn('text-xs text-muted-foreground', isRTL && 'font-arabic')}>
            {isRTL ? 'نقاطك' : 'Your Score'}
          </p>
          <p className={cn('mt-2 text-2xl font-bold', isRTL && 'font-arabic')}>
            {playerScore}
          </p>
        </div>
        <div className="rounded-3xl border border-border bg-background p-4 text-center">
          <p className={cn('text-xs text-muted-foreground', isRTL && 'font-arabic')}>
            {isRTL ? 'نقاط الخصم' : 'Opponent Score'}
          </p>
          <p className={cn('mt-2 text-2xl font-bold', isRTL && 'font-arabic')}>
            {opponentScore}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className={cn('text-sm font-semibold', isRTL && 'font-arabic')}>
              {isRTL ? 'سعر المزايدة' : 'Bid Value'}
            </p>
            <p className={cn('text-xs text-muted-foreground', isRTL && 'font-arabic')}>
              {isRTL ? 'اختر قيمة بين 1 و 50' : 'Choose a number between 1 and 50'}
            </p>
          </div>
          <Badge className={cn(isRTL && 'font-arabic')}>
            {bid}
          </Badge>
        </div>

        <div className="mt-4 space-y-3">
          <input
            type="range"
            min={1}
            max={50}
            value={bid}
            onChange={(event) => setBid(Number(event.target.value))}
            className="w-full accent-[#2D5A27]"
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm" onClick={playRound} className={cn(isRTL && 'font-arabic')}>
              {isRTL ? 'ابدأ الجولة' : 'Play Round'}
            </Button>
            <Button size="sm" variant="outline" onClick={resetGame} className={cn(isRTL && 'font-arabic')}>
              {isRTL ? 'إعادة ضبط' : 'Reset'}
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-background p-4">
        <p className={cn('text-sm text-muted-foreground', isRTL && 'font-arabic')}>
          {message}
        </p>
      </div>

      <div className="space-y-2">
        <p className={cn('text-sm font-semibold', isRTL && 'font-arabic')}>
          {isRTL ? 'سجل الجولات' : 'Round History'}
        </p>
        <div className="space-y-2">
          {history.length === 0 ? (
            <p className={cn('text-xs text-muted-foreground', isRTL && 'font-arabic')}>
              {isRTL ? 'ستظهر الجولات هنا بعد اللعب.' : 'Rounds will appear here after playing.'}
            </p>
          ) : (
            history.map((entry) => (
              <div key={entry.round} className="rounded-2xl border border-border bg-card p-3 text-sm">
                <p className={cn('font-semibold', isRTL && 'font-arabic')}>
                  {isRTL ? `الجولة ${entry.round}` : `Round ${entry.round}`}
                </p>
                <p className={cn('text-muted-foreground', isRTL && 'font-arabic')}>
                  {isRTL ? `مزايدتك: ${entry.playerBid}، خصم: ${entry.opponentBid}` : `Your bid: ${entry.playerBid}, Opponent: ${entry.opponentBid}`}
                </p>
                <p className={cn('text-sm', entry.result === (isRTL ? 'فزت' : 'Win') ? 'text-emerald-700' : 'text-destructive', isRTL && 'font-arabic')}>
                  {entry.result}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function ProverbsCrossword() {
  const { isRTL } = useLanguage()
  const [entries, setEntries] = React.useState<string[]>(['', '', ''])
  const [solved, setSolved] = React.useState(false)

  const handleChange = (index: number, value: string) => {
    const next = [...entries]
    next[index] = value
    setEntries(next)
    if (next.every((value, idx) => value.trim() === proverbPuzzle[idx].word)) {
      setSolved(true)
    } else {
      setSolved(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-border bg-background p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className={cn('text-sm font-semibold', isRTL && 'font-arabic')}>
              {isRTL ? 'اللغز الأمثال' : 'Proverbs Crossword'}
            </p>
            <p className={cn('text-xs text-muted-foreground', isRTL && 'font-arabic')}>
              {isRTL ? 'أكمل الكلمات لتكشف المثل السوداني.' : 'Complete the words to reveal the Sudanese proverb.'}
            </p>
          </div>
          <Badge variant="secondary" className={cn(isRTL && 'font-arabic')}>
            {isRTL ? 'حلقة الكلمات' : 'Word Puzzle'}
          </Badge>
        </div>

        <div className="mt-4 space-y-3">
          {proverbPuzzle.map((item, index) => (
            <div key={item.word} className="space-y-2">
              <div className={cn('flex items-center justify-between text-xs text-muted-foreground', isRTL && 'font-arabic')}>
                <span>{isRTL ? item.hint : item.hint}</span>
                <span>{isRTL ? `كلمة ${index + 1}` : `Word ${index + 1}`}</span>
              </div>
              <Input
                value={entries[index]}
                onChange={(event) => handleChange(index, event.target.value)}
                placeholder={isRTL ? item.word.split('').map(() => '_').join(' ') : item.word.split('').map(() => '_').join(' ')}
                className={cn('font-semibold text-center', isRTL && 'font-arabic')}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={cn('rounded-3xl border p-4 text-center', solved ? 'border-emerald-500/30 bg-emerald-50 text-emerald-900' : 'border-border bg-card text-muted-foreground')}>
        {solved ? (
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600/10 px-3 py-1 text-sm font-semibold text-emerald-800">
              <CheckCircle className="h-4 w-4" />
              {isRTL ? 'تم الكشف عن المثل!' : 'Proverb revealed!'}
            </div>
            <p className={cn('text-base font-semibold', isRTL && 'font-arabic')}>
              {isRTL ? 'الجار قبل الدار' : 'Al-jar qabl al-dar'}
            </p>
            <p className={cn('text-sm', isRTL && 'font-arabic')}>
              {isRTL ? 'الجار أولى من الدار.' : 'The neighbor comes before the house.'}
            </p>
          </div>
        ) : (
          <p className={cn('text-sm text-muted-foreground', isRTL && 'font-arabic')}>
            {isRTL ? 'اكتب الكلمات الصحيحة لتكتشف المثل السوداني.' : 'Enter the correct words to reveal the Sudanese proverb.'}
          </p>
        )}
      </div>
    </div>
  )
}

export function GameBubble() {
  const { isRTL } = useLanguage()
  const { activeGame, isGameMinimized, setGameMinimized } = useChatStore()
  const { setActiveTab } = useAppStore()

  if (!activeGame || !isGameMinimized) return null

  const gameName = games.find((game) => game.id === activeGame)?.name ?? (isRTL ? 'اللعبة' : 'Game')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragMomentum={false}
      className={cn(
        'fixed bottom-24 end-4 z-50 rounded-full border border-emerald-200 bg-white/95 p-3 shadow-2xl backdrop-blur-md dark:bg-slate-900/95',
        isRTL ? 'rtl' : ''
      )}
      onClick={() => {
        setActiveTab('wansa')
        setGameMinimized(false)
      }}
    >
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className={cn('text-sm font-semibold', isRTL && 'font-arabic')}>
            {isRTL ? 'اللعبة مصغرة' : 'Game Minimized'}
          </p>
          <p className={cn('text-xs text-muted-foreground truncate', isRTL && 'font-arabic')}>
            {gameName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpCircle className="h-5 w-5 text-emerald-700" />
        </div>
      </div>
    </motion.div>
  )
}
