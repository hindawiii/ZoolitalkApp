'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Play, Heart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useIslamicStore, SURAH_LIBRARY } from '@/lib/stores/islamic-store'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'

export function AyahOfTheDay() {
  const { isRTL } = useLanguage()
  const { ayahOfTheDayId, setCurrentSurah, playSurah } = useIslamicStore()

  // For demo, cycle through different ayahs daily
  const today = new Date().getDate()
  const ayahIndex = today % SURAH_LIBRARY.length
  const dailyAyah = SURAH_LIBRARY[ayahIndex]

  const handlePlayAyah = () => {
    setCurrentSurah(dailyAyah.id)
    playSurah()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 mb-4"
    >
      <div className={cn(
        'relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20 border border-amber-200/50 dark:border-amber-800/50',
        'shadow-lg'
      )}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-4 w-20 h-20 border-2 border-amber-600 rounded-full" />
          <div className="absolute bottom-4 left-4 w-16 h-16 border border-amber-600 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-amber-600 rounded-full opacity-10" />
        </div>

        {/* Floating Status Badge */}
        <div className="absolute top-3 end-3 z-10">
          <Badge variant="secondary" className="bg-amber-600/90 text-white border-0 shadow-sm">
            {isRTL ? 'آية اليوم' : 'Ayah of the Day'}
          </Badge>
        </div>

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-600/20 flex items-center justify-center">
                <Heart className="h-4 w-4 text-amber-700 dark:text-amber-300" />
              </div>
              <h3 className={cn('font-semibold text-amber-900 dark:text-amber-100', isRTL && 'font-arabic')}>
                {isRTL ? dailyAyah.nameAr : dailyAyah.name}
              </h3>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-700 dark:text-amber-300">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Ayah Text */}
          <div className="mb-6">
            <p className={cn(
              'text-lg leading-relaxed text-amber-900 dark:text-amber-100 font-amiri',
              isRTL && 'text-right font-amiri'
            )}>
              {dailyAyah.ayah}
            </p>
            <p className={cn(
              'text-sm text-amber-700 dark:text-amber-300 mt-2 font-amiri',
              isRTL && 'text-right'
            )}>
              {isRTL ? dailyAyah.translation : dailyAyah.translation}
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4 text-center">
            <div className="bg-white/50 dark:bg-amber-950/30 rounded-lg p-2">
              <p className={cn('text-xs text-amber-700 dark:text-amber-300', isRTL && 'font-arabic')}>
                {isRTL ? 'السورة' : 'Surah'}
              </p>
              <p className={cn('font-semibold text-amber-900 dark:text-amber-100', isRTL && 'font-arabic')}>
                {dailyAyah.number}
              </p>
            </div>
            <div className="bg-white/50 dark:bg-amber-950/30 rounded-lg p-2">
              <p className={cn('text-xs text-amber-700 dark:text-amber-300', isRTL && 'font-arabic')}>
                {isRTL ? 'الآيات' : 'Verses'}
              </p>
              <p className={cn('font-semibold text-amber-900 dark:text-amber-100', isRTL && 'font-arabic')}>
                {dailyAyah.ayahCount}
              </p>
            </div>
            <div className="bg-white/50 dark:bg-amber-950/30 rounded-lg p-2">
              <p className={cn('text-xs text-amber-700 dark:text-amber-300', isRTL && 'font-arabic')}>
                {isRTL ? 'النوع' : 'Type'}
              </p>
              <p className={cn('font-semibold text-amber-900 dark:text-amber-100', isRTL && 'font-arabic')}>
                {isRTL ? 'مكية' : 'Meccan'}
              </p>
            </div>
          </div>

          {/* Play Button */}
          <Button
            onClick={handlePlayAyah}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-lg"
            size="lg"
          >
            <Play className="h-5 w-5 mr-2" />
            <span className={cn(isRTL && 'font-arabic')}>
              {isRTL ? 'استمع للآية' : 'Listen to Ayah'}
            </span>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}