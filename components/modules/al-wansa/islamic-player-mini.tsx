'use client'

import * as React from 'react'
import { Play, Pause, ArrowRight, ArrowLeft, Music2 } from 'lucide-react'
import { useIslamicStore, SURAH_LIBRARY } from '@/lib/stores/islamic-store'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'

export function IslamicMiniPlayer() {
  const { isRTL } = useLanguage()
  const {
    currentSurahId,
    playbackState,
    playbackPosition,
    setPlaybackPosition,
    playSurah,
    pauseSurah,
  } = useIslamicStore()

  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const [duration, setDuration] = React.useState(0)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (!surah) return null

  return (
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
            <p className={cn('text-sm font-semibold truncate', isRTL && 'font-arabic')}>
              {isRTL ? surah.nameAr : surah.name}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {isRTL ? surah.ayah : surah.translation}
            </p>
          </div>
        </div>

        <button
          onClick={playbackState === 'playing' ? pauseSurah : playSurah}
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2D5A27] text-white shadow-lg transition-transform hover:scale-[1.02]',
            isRTL && 'order-first'
          )}
          aria-label={playbackState === 'playing' ? (isRTL ? 'إيقاف' : 'Pause') : (isRTL ? 'تشغيل' : 'Play')}
        >
          {playbackState === 'playing' ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
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
          className="mt-2 h-1 w-full cursor-pointer appearance-none rounded-full bg-muted accent-[#2D5A27]"
          style={{ direction: isRTL ? 'rtl' : 'ltr' }}
          aria-label={isRTL ? 'شريط التقدم' : 'Progress bar'}
        />
      </div>
    </div>
  )
}
