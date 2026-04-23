'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Search,
  CloudSnow,
  Share2,
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Moon,
  SunMedium,
  ShieldCheck,
  Play,
  Pause,
  Bookmark,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { AyahOfTheDay } from '@/components/ui/ayah-of-the-day'
import { useLanguage } from '@/components/providers/language-provider'
import { useUserStore } from '@/lib/stores/user-store'
import { useFeedStore } from '@/lib/stores/feed-store'
import { useIslamicStore, SURAH_LIBRARY, HADITH_LIBRARY } from '@/lib/stores/islamic-store'
import { cn } from '@/lib/utils'

export function Islamiyat() {
  const { isRTL } = useLanguage()
  const { currentUser } = useUserStore()
  const { addPost } = useFeedStore()
  const {
    currentSurahId,
    playbackState,
    playSurah,
    pauseSurah,
    isOfflineCacheEnabled,
    toggleOfflineCache,
    cachedSurahs,
    setCurrentSurah,
    toggleSurahCache,
    isNightMode,
    setNightMode,
    ayahOfTheDayId,
    setAyahOfTheDay,
    togglePlayerExpanded,
    setSurahListVisible,
  } = useIslamicStore()

  const [search, setSearch] = React.useState('')
  const [expandedHadith, setExpandedHadith] = React.useState<string | null>(null)

  const surahList = React.useMemo(() => {
    return SURAH_LIBRARY.filter((surah) => {
      if (!search.trim()) return true
      const query = search.toLowerCase()
      return (
        surah.name.toLowerCase().includes(query) ||
        surah.nameAr.includes(query) ||
        surah.ayah.toLowerCase().includes(query) ||
        surah.translation.toLowerCase().includes(query)
      )
    })
  }, [search])

  const ayahOfTheDay = SURAH_LIBRARY.find((surah) => surah.id === ayahOfTheDayId) || SURAH_LIBRARY[0]

  const handleSelectSurah = (surahId: string) => {
    setCurrentSurah(surahId)
    playSurah()
    togglePlayerExpanded()
    setSurahListVisible(true)
  }

  const handleShareCard = (title: string, body: string) => {
    const authorName = currentUser?.name || (isRTL ? 'زول راكوبتنا' : 'Rakobatna User')
   const authorNameAr = currentUser?.nameAr || 'راكوبتنا'

     addPost({
       id: Date.now().toString(),
       authorId: currentUser?.id || 'anonymous',
       authorName,
       authorNameAr,
       authorAvatar: currentUser?.avatar || '',
       content: newPostContent,
       contentAr: newPostContent, // أو ترجمتها إذا كان هناك حقل مخصص
       images: [],
       reactions: { like: 0, love: 0, kaffu: 0, abshir: 0, haha: 0, sad: 0 },
       commentsCount: 0,
       sharesCount: 0,
       timestamp: new Date(),
     });
  }

  return (
    <div className={cn(
      'min-h-full py-5 px-4 pb-24',
      isNightMode ? 'bg-[#071a0f] text-amber-100' : 'bg-background text-foreground'
    )}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,_rgba(56,161,105,0.18),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.16),_transparent_28%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_40%)]" />

      {/* Ayah of the Day */}
      <AyahOfTheDay />

      {/* Surah Search and Player Section */}
      <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className={cn('space-y-4 rounded-[2rem] border p-5 shadow-lg', isNightMode ? 'border-amber-300/15 bg-[#081f12]/95' : 'border-green-900/10 bg-white/90')}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className={cn('text-sm font-semibold', isNightMode ? 'text-amber-200' : 'text-emerald-700', isRTL && 'font-arabic')}>
                {isRTL ? 'أدعية وسور' : 'Surahs & Recitations'}
              </p>
              <p className={cn('text-xs', isNightMode ? 'text-amber-300' : 'text-muted-foreground', isRTL && 'font-arabic')}>
                {isRTL ? 'اغتنم لحظات السكينة مع الشيخ الزين' : 'Choose a surah to play with Sheikh Alzain'}
              </p>
            </div>
            <Button
              variant={isNightMode ? 'secondary' : 'outline'}
              size="sm"
              onClick={toggleOfflineCache}
              className={cn('gap-2', isRTL && 'font-arabic')}
            >
              <CloudSnow className="h-4 w-4" />
              {isOfflineCacheEnabled ? (isRTL ? 'التخزين متاح' : 'Offline Ready') : (isRTL ? 'التخزين غير مفعل' : 'Cache for Offline')}
            </Button>
          </div>

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={isRTL ? 'ابحث عن سورة أو آية' : 'Search a surah or verse'}
            className={cn(isRTL && 'font-arabic')}
            leadingAccessory={<Search className="h-4 w-4 text-muted-foreground" />}
          />

          <div className="space-y-3">
            {surahList.map((surah) => {
              const isActive = surah.id === currentSurahId
              const isCached = cachedSurahs.includes(surah.id)

              return (
                <motion.div
                  key={surah.id}
                  layout
                  className={cn(
                    'rounded-3xl border p-4 transition-shadow',
                    isActive
                      ? 'border-emerald-500/30 bg-emerald-50 shadow-lg dark:bg-emerald-900/30'
                      : isNightMode
                      ? 'border-amber-300/10 bg-[#0c2718]/80'
                      : 'border-green-900/10 bg-white'
                  )}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className={cn('text-sm font-semibold truncate', isRTL ? 'font-arabic' : '')}>
                        {isRTL ? surah.nameAr : surah.name}
                      </p>
                      <p className={cn('mt-1 text-xs leading-5', isNightMode ? 'text-amber-200' : 'text-muted-foreground')}>
                        {surah.translation}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {isCached && (
                        <Badge variant="secondary" className={cn(isRTL && 'font-arabic')}>
                          {isRTL ? 'محفوظ' : 'Cached'}
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant={isActive ? 'secondary' : 'outline'}
                        onClick={() => handleSelectSurah(surah.id)}
                        className={cn('gap-2', isRTL && 'font-arabic')}
                      >
                        {isActive ? (
                          playbackState === 'playing' ? (isRTL ? 'إيقاف' : 'Pause') : (isRTL ? 'تشغيل' : 'Play')
                        ) : (
                          isRTL ? 'تشغيل' : 'Play'
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleSurahCache(surah.id)}
                        className={cn('gap-2', isRTL && 'font-arabic')}
                      >
                        <Bookmark className="h-4 w-4" />
                        {isCached ? (isRTL ? 'إلغاء الحفظ' : 'Remove') : (isRTL ? 'احفظ' : 'Cache')}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <div className={cn('rounded-[2rem] border p-5 shadow-lg', isNightMode ? 'border-amber-300/15 bg-[#081f12]/95' : 'border-green-900/10 bg-white/90')}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className={cn('text-sm font-semibold', isNightMode ? 'text-amber-200' : 'text-emerald-700', isRTL && 'font-arabic')}>
                {isRTL ? 'تفسير عميق' : 'Tafsir & Spiritual Notes'}
              </p>
              <p className={cn('text-xs', isNightMode ? 'text-amber-300' : 'text-muted-foreground', isRTL && 'font-arabic')}>
                {isRTL ? 'تفاصيل فكرية لكل آية' : 'Expand to reveal the spiritual meaning'}
              </p>
            </div>
            <Badge variant="outline" className={cn(isRTL && 'font-arabic')}>
              {isRTL ? 'وضع الليل' : 'Night Mode'}
            </Badge>
          </div>

          {HADITH_LIBRARY.map((hadith) => {
            const isOpen = expandedHadith === hadith.id
            return (
              <div
                key={hadith.id}
                className={cn(
                  'mb-3 overflow-hidden rounded-3xl border transition-colors',
                  isNightMode
                    ? 'border-amber-300/10 bg-[#0c2718]/80'
                    : 'border-green-900/10 bg-white'
                )}
              >
                <button
                  onClick={() => setExpandedHadith(isOpen ? null : hadith.id)}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 p-4 text-left',
                    isNightMode ? 'text-amber-100' : 'text-slate-900'
                  )}
                >
                  <div>
                    <p className={cn('font-amiri text-lg leading-tight', isRTL && 'font-amiri')}>
                      {hadith.arabic}
                    </p>
                    <p className={cn('mt-2 text-xs', isNightMode ? 'text-amber-300' : 'text-muted-foreground')}>
                      {hadith.source}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('text-xs font-medium', isNightMode ? 'text-amber-200' : 'text-emerald-700')}>
                      {isOpen ? (isRTL ? 'إخفاء' : 'Hide') : (isRTL ? 'عرض' : 'Show')}
                    </span>
                    {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className={cn('px-4 pb-4', isNightMode ? 'bg-[#06170b]/95' : 'bg-slate-50')}
                    >
                      <p className={cn('text-sm leading-7', isNightMode ? 'text-amber-200' : 'text-slate-700')}>
                        {hadith.translation}
                      </p>
                      <p className={cn('mt-3 text-xs', isNightMode ? 'text-amber-300' : 'text-muted-foreground')}>
                        {hadith.explanation}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShareCard(
                          isRTL ? `حديث • ${hadith.source}` : `Hadith • ${hadith.source}`,
                          isRTL ? `${hadith.arabic}\n${hadith.translation}` : `${hadith.arabic}\n${hadith.translation}`
                        )}
                        className={cn('mt-4 gap-2', isRTL && 'font-arabic')}
                      >
                        <Share2 className="h-4 w-4" />
                        {isRTL ? 'مشاركة إلى الساحة' : 'Share to Saha'}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
