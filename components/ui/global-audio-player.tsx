'use client'

import * as React from 'react'
import { Play, Pause, ArrowRight, ArrowLeft, Music2, X, Search, List } from 'lucide-react'
import { useIslamicStore, SURAH_LIBRARY } from '@/lib/stores/islamic-store'
import { useLanguage } from '@/components/providers/language-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export function GlobalAudioPlayer() {
  const { isRTL } = useLanguage()
  const {
    currentSurahId,
    playbackState,
    playbackPosition,
    setPlaybackPosition,
    playSurah,
    pauseSurah,
    setCurrentSurah,
  } = useIslamicStore()

  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const [duration, setDuration] = React.useState(0)
  const [isSurahListOpen, setIsSurahListOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const surah = SURAH_LIBRARY.find((surah) => surah.id === currentSurahId)

  React.useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.preload = 'metadata'

      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0)
      })

      audioRef.current.addEventListener('timeupdate', () => {
        if (!audioRef.current) return
        setPlaybackPosition(audioRef.current.currentTime)
      })

      audioRef.current.addEventListener('ended', () => {
        pauseSurah()
      })
    }

    return () => {
      audioRef.current?.pause()
    }
  }, [pauseSurah, setPlaybackPosition])

  React.useEffect(() => {
    if (!surah || !audioRef.current) return
    audioRef.current.src = surah.audioUrl
    audioRef.current.load()
    if (playbackState === 'playing') {
      audioRef.current.play().catch(() => {})
    }
  }, [surah?.id])

  React.useEffect(() => {
    if (!audioRef.current) return
    if (playbackState === 'playing') {
      audioRef.current.play().catch(() => {})
    } else {
      audioRef.current.pause()
    }
  }, [playbackState])

  const formatTime = (value: number) => {
    const minutes = Math.floor(value / 60)
    const seconds = Math.floor(value % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Number(event.target.value)
    setPlaybackPosition(Number(event.target.value))
  }

  const handlePlayNext = () => {
    if (!surah) return
    const currentIndex = SURAH_LIBRARY.findIndex(s => s.id === surah.id)
    const nextIndex = (currentIndex + 1) % SURAH_LIBRARY.length
    setCurrentSurah(SURAH_LIBRARY[nextIndex].id)
  }

  const handlePlayPrevious = () => {
    if (!surah) return
    const currentIndex = SURAH_LIBRARY.findIndex(s => s.id === surah.id)
    const prevIndex = currentIndex === 0 ? SURAH_LIBRARY.length - 1 : currentIndex - 1
    setCurrentSurah(SURAH_LIBRARY[prevIndex].id)
  }

  const filteredSurahs = SURAH_LIBRARY.filter(surah =>
    surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.nameAr.includes(searchQuery) ||
    surah.ayah.includes(searchQuery)
  )

  // Only show player if there's a current surah or it's been opened
  if (!surah && !isSurahListOpen) return null

  return (
    <>
      {/* Persistent Player */}
      <div className={cn(
        'fixed inset-x-4 bottom-20 z-50 overflow-hidden rounded-3xl border border-white/10 bg-white/95 shadow-2xl backdrop-blur-xl',
        'dark:bg-slate-950/90 dark:border-slate-700',
        isRTL && 'rtl'
      )}>
        <div className="flex items-center justify-between gap-3 p-3 md:p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
              <Music2 className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className={cn('text-sm font-semibold truncate font-amiri', isRTL && 'font-arabic')}>
                {isRTL ? surah?.nameAr : surah?.name}
              </p>
              <p className="text-[11px] text-muted-foreground truncate font-amiri">
                {isRTL ? surah?.ayah : surah?.translation}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePlayPrevious}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <Button
              onClick={playbackState === 'playing' ? pauseSurah : playSurah}
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2D5A27] text-white shadow-lg transition-transform hover:scale-[1.02]',
                isRTL && 'order-first'
              )}
              aria-label={playbackState === 'playing' ? (isRTL ? 'إيقاف' : 'Pause') : (isRTL ? 'تشغيل' : 'Play')}
            >
              {playbackState === 'playing' ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handlePlayNext}
              className="h-9 w-9"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Sheet open={isSurahListOpen} onOpenChange={setIsSurahListOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <List className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side={isRTL ? 'right' : 'left'} className="w-full sm:w-96">
                <SheetHeader>
                  <SheetTitle className={cn('font-amiri', isRTL && 'font-arabic')}>
                    {isRTL ? 'قائمة السور' : 'Surah List'}
                  </SheetTitle>
                </SheetHeader>

                {/* Search */}
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={isRTL ? 'البحث في السور...' : 'Search surahs...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Surah List */}
                <ScrollArea className="mt-4 h-[calc(100vh-200px)]">
                  <div className="space-y-2">
                    {filteredSurahs.map((surahItem) => (
                      <button
                        key={surahItem.id}
                        onClick={() => {
                          setCurrentSurah(surahItem.id)
                          setIsSurahListOpen(false)
                        }}
                        className={cn(
                          'w-full p-3 rounded-lg text-start transition-colors hover:bg-muted',
                          currentSurahId === surahItem.id && 'bg-primary/10 border border-primary/20'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                            <p className={cn('font-semibold truncate font-amiri', isRTL && 'font-arabic')}>
                              {isRTL ? surahItem.nameAr : surahItem.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate font-amiri">
                              {surahItem.ayahCount} {isRTL ? 'آية' : 'verses'}
                            </p>
                          </div>
                          <span className="text-sm font-mono text-muted-foreground ml-2">
                            {surahItem.number}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 truncate font-amiri">
                          {isRTL ? surahItem.ayah : surahItem.translation}
                        </p>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className={cn('px-4 pb-4', isRTL && 'text-right')}>
          <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
            <span>{formatTime(playbackPosition)}</span>
            <span>{formatTime(duration || 0)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={Math.round(duration || 0)}
            value={Math.min(Math.round(playbackPosition), Math.round(duration || 0))}
            onChange={handleSeek}
            className="mt-2 h-1 w-full cursor-pointer appearance-none rounded-full bg-muted accent-[#2D5A27] focus:outline-none"
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            aria-label={isRTL ? 'شريط التقدم' : 'Progress bar'}
          />
        </div>
      </div>
    </>
  )
}