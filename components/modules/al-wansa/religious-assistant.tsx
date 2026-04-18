'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Moon, 
  Volume2, 
  VolumeX, 
  Bell, 
  BellOff,
  Clock,
  Star,
  X,
  Settings,
  Play,
  Pause
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'

interface ReligiousAssistantProps {
  isOpen: boolean
  onClose: () => void
}

// Prayer times (demo - in production, use an API like Aladhan)
const prayerTimes = [
  { id: 'fajr', name: 'Fajr', nameAr: 'الفجر', time: '04:45', icon: Moon },
  { id: 'dhuhr', name: 'Dhuhr', nameAr: 'الظهر', time: '12:30', icon: Star },
  { id: 'asr', name: 'Asr', nameAr: 'العصر', time: '15:45', icon: Star },
  { id: 'maghrib', name: 'Maghrib', nameAr: 'المغرب', time: '18:30', icon: Moon },
  { id: 'isha', name: 'Isha', nameAr: 'العشاء', time: '20:00', icon: Moon },
]

// Dhikr phrases
const dhikrPhrases = [
  { id: 1, arabic: 'سبحان الله', transliteration: 'SubhanAllah', meaning: 'Glory be to Allah', count: 33 },
  { id: 2, arabic: 'الحمد لله', transliteration: 'Alhamdulillah', meaning: 'Praise be to Allah', count: 33 },
  { id: 3, arabic: 'الله أكبر', transliteration: 'Allahu Akbar', meaning: 'Allah is Greatest', count: 34 },
  { id: 4, arabic: 'لا إله إلا الله', transliteration: 'La ilaha illallah', meaning: 'There is no god but Allah', count: 100 },
  { id: 5, arabic: 'اللهم صل على محمد', transliteration: 'Allahumma salli ala Muhammad', meaning: 'O Allah, send blessings upon Muhammad', count: 10 },
]

interface Settings {
  azanEnabled: boolean
  azanVolume: number
  dhikrReminders: boolean
  salatAlaNabi: boolean
  salatAlaNabiInterval: number // in minutes
  selectedAzanStyle: 'mecca' | 'medina' | 'egypt'
}

export function ReligiousAssistant({ isOpen, onClose }: ReligiousAssistantProps) {
  const { isRTL } = useLanguage()
  const [showSettings, setShowSettings] = React.useState(false)
  const [settings, setSettings] = React.useState<Settings>({
    azanEnabled: true,
    azanVolume: 0.7,
    dhikrReminders: true,
    salatAlaNabi: true,
    salatAlaNabiInterval: 30,
    selectedAzanStyle: 'mecca',
  })
  const [dhikrCounts, setDhikrCounts] = React.useState<Record<number, number>>({})
  const [isPlaying, setIsPlaying] = React.useState<string | null>(null)

  const getCurrentPrayer = () => {
    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    
    for (let i = prayerTimes.length - 1; i >= 0; i--) {
      if (currentTime >= prayerTimes[i].time) {
        return prayerTimes[i].id
      }
    }
    return prayerTimes[prayerTimes.length - 1].id
  }

  const getNextPrayer = () => {
    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    
    for (const prayer of prayerTimes) {
      if (currentTime < prayer.time) {
        return prayer
      }
    }
    return prayerTimes[0]
  }

  const incrementDhikr = (id: number) => {
    const dhikr = dhikrPhrases.find(d => d.id === id)
    if (!dhikr) return
    
    setDhikrCounts(prev => {
      const current = prev[id] || 0
      const next = current >= dhikr.count ? 0 : current + 1
      return { ...prev, [id]: next }
    })
  }

  const playAzan = (prayerId: string) => {
    if (isPlaying === prayerId) {
      setIsPlaying(null)
      // Stop audio
    } else {
      setIsPlaying(prayerId)
      // Play audio (in production, use actual audio files)
      setTimeout(() => setIsPlaying(null), 3000)
    }
  }

  const currentPrayer = getCurrentPrayer()
  const nextPrayer = getNextPrayer()

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
            initial={{ x: isRTL ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'absolute top-0 bottom-0 w-full max-w-md bg-background',
              isRTL ? 'start-0' : 'end-0'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
              <div className="text-center">
                <h2 className={cn('text-lg font-semibold', isRTL && 'font-arabic')}>
                  {isRTL ? 'المساعد الديني' : 'Religious Assistant'}
                </h2>
                <p className="text-xs text-muted-foreground font-arabic">الذكر والصلاة</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="h-5 w-5" />
              </Button>
            </div>

            <ScrollArea className="h-[calc(100%-4rem)]">
              <AnimatePresence mode="wait">
                {showSettings ? (
                  <SettingsPanel
                    key="settings"
                    settings={settings}
                    onSettingsChange={setSettings}
                    isRTL={isRTL}
                  />
                ) : (
                  <motion.div
                    key="main"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 space-y-6"
                  >
                    {/* Next Prayer Card */}
                    <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl">
                      <p className={cn('text-sm text-muted-foreground mb-1', isRTL && 'font-arabic')}>
                        {isRTL ? 'الصلاة القادمة' : 'Next Prayer'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={cn('text-2xl font-bold', isRTL && 'font-arabic')}>
                            {isRTL ? nextPrayer.nameAr : nextPrayer.name}
                          </h3>
                          <p className="text-3xl font-mono font-bold text-primary">
                            {nextPrayer.time}
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant={isPlaying === nextPrayer.id ? 'default' : 'outline'}
                          className="h-14 w-14 rounded-full"
                          onClick={() => playAzan(nextPrayer.id)}
                        >
                          {isPlaying === nextPrayer.id ? (
                            <Pause className="h-6 w-6" />
                          ) : (
                            <Play className="h-6 w-6" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Prayer Times */}
                    <div className="space-y-3">
                      <h3 className={cn('font-semibold flex items-center gap-2', isRTL && 'font-arabic')}>
                        <Clock className="h-5 w-5 text-primary" />
                        {isRTL ? 'أوقات الصلاة' : 'Prayer Times'}
                      </h3>
                      <div className="space-y-2">
                        {prayerTimes.map((prayer) => (
                          <div
                            key={prayer.id}
                            className={cn(
                              'flex items-center justify-between p-3 rounded-xl transition-colors',
                              currentPrayer === prayer.id 
                                ? 'bg-primary/10 border border-primary/20' 
                                : 'bg-card'
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <prayer.icon className={cn(
                                'h-5 w-5',
                                currentPrayer === prayer.id ? 'text-primary' : 'text-muted-foreground'
                              )} />
                              <span className={cn('font-medium', isRTL && 'font-arabic')}>
                                {isRTL ? prayer.nameAr : prayer.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-semibold">{prayer.time}</span>
                              {settings.azanEnabled && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() => playAzan(prayer.id)}
                                >
                                  {isPlaying === prayer.id ? (
                                    <VolumeX className="h-4 w-4" />
                                  ) : (
                                    <Volume2 className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dhikr Counter */}
                    <div className="space-y-3">
                      <h3 className={cn('font-semibold flex items-center gap-2', isRTL && 'font-arabic')}>
                        <Star className="h-5 w-5 text-accent" />
                        {isRTL ? 'الأذكار' : 'Dhikr Counter'}
                      </h3>
                      <div className="space-y-2">
                        {dhikrPhrases.map((dhikr) => (
                          <motion.button
                            key={dhikr.id}
                            onClick={() => incrementDhikr(dhikr.id)}
                            whileTap={{ scale: 0.98 }}
                            className="w-full p-4 bg-card rounded-xl text-start active:bg-secondary/80 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xl font-arabic font-semibold">{dhikr.arabic}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-primary">
                                  {dhikrCounts[dhikr.id] || 0}
                                </span>
                                <span className="text-sm text-muted-foreground">/ {dhikr.count}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{dhikr.meaning}</p>
                            {/* Progress bar */}
                            <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ 
                                  width: `${((dhikrCounts[dhikr.id] || 0) / dhikr.count) * 100}%` 
                                }}
                              />
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Salat ala Nabi reminder */}
                    {settings.salatAlaNabi && (
                      <div className="p-4 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Star className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-arabic font-semibold text-green-700 dark:text-green-400">
                              صل على النبي
                            </p>
                            <p className={cn('text-sm text-muted-foreground', isRTL && 'font-arabic')}>
                              {isRTL ? 'تذكير تلقائي' : 'Auto reminder'}
                            </p>
                          </div>
                        </div>
                        <p className="text-center font-arabic text-lg text-green-700 dark:text-green-400">
                          اللهم صل وسلم على نبينا محمد
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Settings Panel Component
function SettingsPanel({ 
  settings, 
  onSettingsChange, 
  isRTL 
}: { 
  settings: Settings
  onSettingsChange: (settings: Settings) => void
  isRTL: boolean 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-4 space-y-4"
    >
      <h3 className={cn('font-semibold mb-4', isRTL && 'font-arabic')}>
        {isRTL ? 'الإعدادات' : 'Settings'}
      </h3>

      {/* Azan Settings */}
      <div className="space-y-3 p-4 bg-card rounded-xl">
        <h4 className={cn('text-sm font-medium text-muted-foreground', isRTL && 'font-arabic')}>
          {isRTL ? 'الأذان' : 'Azan'}
        </h4>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Volume2 className="h-5 w-5 text-primary" />
            <span className={cn(isRTL && 'font-arabic')}>
              {isRTL ? 'تفعيل الأذان' : 'Enable Azan'}
            </span>
          </div>
          <Switch 
            checked={settings.azanEnabled} 
            onCheckedChange={(v) => onSettingsChange({ ...settings, azanEnabled: v })} 
          />
        </div>

        {settings.azanEnabled && (
          <>
            <div className="space-y-2">
              <span className={cn('text-sm', isRTL && 'font-arabic')}>
                {isRTL ? 'مستوى الصوت' : 'Volume'}
              </span>
              <Slider
                value={[settings.azanVolume]}
                onValueChange={([v]) => onSettingsChange({ ...settings, azanVolume: v })}
                min={0}
                max={1}
                step={0.1}
              />
            </div>

            <div className="space-y-2">
              <span className={cn('text-sm', isRTL && 'font-arabic')}>
                {isRTL ? 'نوع الأذان' : 'Azan Style'}
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['mecca', 'medina', 'egypt'] as const).map((style) => (
                  <Button
                    key={style}
                    variant={settings.selectedAzanStyle === style ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onSettingsChange({ ...settings, selectedAzanStyle: style })}
                    className={cn('capitalize', isRTL && 'font-arabic')}
                  >
                    {style === 'mecca' ? (isRTL ? 'مكة' : 'Mecca') :
                     style === 'medina' ? (isRTL ? 'المدينة' : 'Medina') :
                     (isRTL ? 'مصر' : 'Egypt')}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Dhikr Reminders */}
      <div className="space-y-3 p-4 bg-card rounded-xl">
        <h4 className={cn('text-sm font-medium text-muted-foreground', isRTL && 'font-arabic')}>
          {isRTL ? 'التذكيرات' : 'Reminders'}
        </h4>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-accent" />
            <span className={cn(isRTL && 'font-arabic')}>
              {isRTL ? 'تذكيرات الأذكار' : 'Dhikr Reminders'}
            </span>
          </div>
          <Switch 
            checked={settings.dhikrReminders} 
            onCheckedChange={(v) => onSettingsChange({ ...settings, dhikrReminders: v })} 
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-green-500" />
            <span className={cn(isRTL && 'font-arabic')}>
              {isRTL ? 'صلاة على النبي' : 'Salat ala Nabi'}
            </span>
          </div>
          <Switch 
            checked={settings.salatAlaNabi} 
            onCheckedChange={(v) => onSettingsChange({ ...settings, salatAlaNabi: v })} 
          />
        </div>

        {settings.salatAlaNabi && (
          <div className="space-y-2">
            <span className={cn('text-sm', isRTL && 'font-arabic')}>
              {isRTL ? 'كل' : 'Every'} {settings.salatAlaNabiInterval} {isRTL ? 'دقيقة' : 'minutes'}
            </span>
            <Slider
              value={[settings.salatAlaNabiInterval]}
              onValueChange={([v]) => onSettingsChange({ ...settings, salatAlaNabiInterval: v })}
              min={15}
              max={120}
              step={15}
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}
