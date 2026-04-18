'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Music2,
  ChevronUp,
  ChevronDown,
  Search,
  X,
  List,
  Heart,
} from 'lucide-react'
import { useIslamicStore, SURAH_LIBRARY } from '@/lib/stores/islamic-store'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

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
    isPlayerExpanded,
    togglePlayerExpanded,
    isSurahListVisible,
    setSurahListVisible,
  } = useIslamicStore()

  const [searchQuery, setSearchQuery] = React.useState('')
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const [duration, setDuration] = React.useState(0)

  const currentSurah = SURAH_LIBRARY.find((surah) => surah.id === currentSurahId)

  // Filter surahs based on search
  const filteredSurahs = React.useMemo(() => {
    if (!searchQuery.trim()) return SURAH_LIBRARY

    const query = searchQuery.toLowerCase()
    return SURAH_LIBRARY.filter((surah) =>
      surah.name.toLowerCase().includes(query) ||
      surah.nameAr.includes(query) ||
      surah.translation.toLowerCase().includes(query) ||
      surah.ayah.toLowerCase().includes(query)
    )
  }, [searchQuery])

  // Audio setup and event handlers
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
    if (!currentSurah || !audioRef.current) return
    audioRef.current.src = currentSurah.audioUrl
    audioRef.current.load()
    if (playbackState === 'playing') {
      audioRef.current.play().catch(() => {})
    }
  }, [currentSurah?.id])

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

  const handlePlayPause = () => {
    if (playbackState === 'playing') {
      pauseSurah()
    } else {
      playSurah()
    }
  }

  const handleSurahSelect = (surahId: string) => {
    setCurrentSurah(surahId)
    playSurah()
    if (window.innerWidth < 768) {
      setSurahListVisible(false)
    }
  }

  const handleNextSurah = () => {
    if (!currentSurahId) return
    const currentIndex = SURAH_LIBRARY.findIndex(s => s.id === currentSurahId)
    const nextIndex = (currentIndex + 1) % SURAH_LIBRARY.length
    handleSurahSelect(SURAH_LIBRARY[nextIndex].id)
  }

  const handlePreviousSurah = () => {
    if (!currentSurahId) return
    const currentIndex = SURAH_LIBRARY.findIndex(s => s.id === currentSurahId)
    const prevIndex = currentIndex === 0 ? SURAH_LIBRARY.length - 1 : currentIndex - 1
    handleSurahSelect(SURAH_LIBRARY[prevIndex].id)
  }

  // Don't render if no surah is selected and not expanded
  if (!currentSurah && !isPlayerExpanded) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Surah List Overlay */}
      <AnimatePresence>
        {isSurahListVisible && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-full left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border max-h-96 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Search Header */}
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isRTL ? 'البحث في السور' : 'Search surahs...'}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSurahListVisible(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Surah List */}
              <div className="max-h-64 overflow-y-auto space-y-2">
                {filteredSurahs.map((surah) => {
                  const isActive = surah.id === currentSurahId
                  return (
                    <motion.button
                      key={surah.id}
                      onClick={() => handleSurahSelect(surah.id)}
                      className={cn(
                        'w-full text-left p-3 rounded-xl transition-colors',
                        isActive
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-muted/50'
                      )}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {surah.number}
                            </Badge>
                            <p className={cn(
                              'font-semibold truncate',
                              isRTL ? 'font-amiri text-right' : ''
                            )}>
                              {isRTL ? surah.nameAr : surah.name}
                            </p>
                          </div>
                          <p className={cn(
                            'text-sm text-muted-foreground truncate',
                            isRTL ? 'font-amiri' : ''
                          )}>
                            {surah.ayah}
                          </p>
                        </div>
                        {isActive && playbackState === 'playing' && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                          </div>
                        )}
                      </div>
                    </motion.button>
                  )
                })}
                {filteredSurahs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    {isRTL ? 'لم يتم العثور على سور' : 'No surahs found'}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Player */}
      <motion.div
        layout
        className={cn(
          'bg-background/95 backdrop-blur-xl border-t border-border',
          isPlayerExpanded ? 'p-4' : 'p-3'
        )}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="max-w-4xl mx-auto">
          {isPlayerExpanded && currentSurah && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 space-y-4"
            >
              {/* Expanded Surah Info */}
              <div className="text-center space-y-2">
                <h3 className={cn(
                  'text-xl font-bold',
                  isRTL ? 'font-amiri' : ''
                )}>
                  {isRTL ? currentSurah.nameAr : currentSurah.name}
                </h3>
                <p className={cn(
                  'text-lg font-amiri text-primary',
                  isRTL ? 'text-right' : ''
                )}>
                  {currentSurah.ayah}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentSurah.translation}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="secondary">
                    {isRTL ? `سورة ${currentSurah.number}` : `Surah ${currentSurah.number}`}
                  </Badge>
                  <Badge variant="outline">
                    {isRTL ? `${currentSurah.ayahCount} آية` : `${currentSurah.ayahCount} verses`}
                  </Badge>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <input
                  type="range"
                  min={0}
                  max={Math.round(duration || 0)}
                  value={Math.min(Math.round(playbackPosition), Math.round(duration || 0))}
                  onChange={handleSeek}
                  className="w-full h-2 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatTime(playbackPosition)}</span>
                  <span>{formatTime(duration || 0)}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Compact Player Controls */}
          <div className="flex items-center justify-between gap-3">
            {/* Surah Info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Music2 className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={cn(
                  'font-semibold truncate',
                  isRTL ? 'font-amiri text-right' : ''
                )}>
                  {currentSurah ? (isRTL ? currentSurah.nameAr : currentSurah.name) : (isRTL ? 'لا توجد سورة محددة' : 'No surah selected')}
                </p>
                {!isPlayerExpanded && currentSurah && (
                  <p className="text-sm text-muted-foreground truncate">
                    {currentSurah.translation}
                  </p>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePreviousSurah}
                disabled={!currentSurah}
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                onClick={handlePlayPause}
                disabled={!currentSurah}
                className="h-12 w-12 rounded-full"
              >
                {playbackState === 'playing' ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextSurah}
                disabled={!currentSurah}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSurahListVisible(!isSurahListVisible)}
              >
                <List className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlayerExpanded}
              >
                {isPlayerExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Compact Progress Bar */}
          {!isPlayerExpanded && currentSurah && (
            <div className="mt-3">
              <input
                type="range"
                min={0}
                max={Math.round(duration || 0)}
                value={Math.min(Math.round(playbackPosition), Math.round(duration || 0))}
                onChange={handleSeek}
                className="w-full h-1 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}