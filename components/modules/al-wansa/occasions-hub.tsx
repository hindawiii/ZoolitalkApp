'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Gift, 
  Bell, 
  Star, 
  ChevronRight, 
  ChevronLeft,
  PartyPopper,
  Cake,
  Moon,
  Sun,
  Flag,
  Heart,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'
import { format, addDays, isSameDay, differenceInDays } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'

interface OccasionsHubProps {
  isOpen: boolean
  onClose: () => void
}

// Sudanese national holidays and important dates
const sudaneseHolidays = [
  { id: 1, name: 'Independence Day', nameAr: 'عيد الاستقلال', date: new Date(2026, 0, 1), icon: Flag, color: 'bg-green-500' },
  { id: 2, name: 'Revolution Day', nameAr: 'ذكرى الثورة', date: new Date(2026, 11, 19), icon: Star, color: 'bg-primary' },
  { id: 3, name: 'Eid Al-Fitr', nameAr: 'عيد الفطر', date: new Date(2026, 3, 20), icon: Moon, color: 'bg-accent' },
  { id: 4, name: 'Eid Al-Adha', nameAr: 'عيد الأضحى', date: new Date(2026, 5, 28), icon: Moon, color: 'bg-accent' },
  { id: 5, name: 'Mawlid', nameAr: 'المولد النبوي', date: new Date(2026, 8, 5), icon: Star, color: 'bg-green-600' },
  { id: 6, name: 'Mothers Day', nameAr: 'عيد الأم', date: new Date(2026, 2, 21), icon: Heart, color: 'bg-pink-500' },
]

// Demo birthday contacts
const birthdayContacts = [
  { id: 1, name: 'Ahmed Hassan', nameAr: 'أحمد حسن', avatar: '/avatars/ahmed.jpg', birthday: addDays(new Date(), 2) },
  { id: 2, name: 'Fatima Ali', nameAr: 'فاطمة علي', avatar: '/avatars/fatima.jpg', birthday: addDays(new Date(), 5) },
  { id: 3, name: 'Omar Khalid', nameAr: 'عمر خالد', avatar: '/avatars/omar.jpg', birthday: addDays(new Date(), 12) },
  { id: 4, name: 'Sara Mohamed', nameAr: 'سارة محمد', avatar: '/avatars/sara.jpg', birthday: addDays(new Date(), 20) },
]

export function OccasionsHub({ isOpen, onClose }: OccasionsHubProps) {
  const { isRTL, language } = useLanguage()
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true)
  const [birthdayReminders, setBirthdayReminders] = React.useState(true)

  const upcomingHolidays = React.useMemo(() => {
    const today = new Date()
    return sudaneseHolidays
      .map(h => ({
        ...h,
        daysUntil: differenceInDays(h.date, today)
      }))
      .filter(h => h.daysUntil >= 0 && h.daysUntil <= 90)
      .sort((a, b) => a.daysUntil - b.daysUntil)
  }, [])

  const upcomingBirthdays = React.useMemo(() => {
    const today = new Date()
    return birthdayContacts
      .map(c => ({
        ...c,
        daysUntil: differenceInDays(c.birthday, today)
      }))
      .filter(c => c.daysUntil >= 0)
      .sort((a, b) => a.daysUntil - b.daysUntil)
  }, [])

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight

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
            <div className="flex items-center justify-between p-4 border-b">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
              <h2 className={cn('text-lg font-semibold', isRTL && 'font-arabic')}>
                {isRTL ? 'المناسبات' : 'Occasions Hub'}
              </h2>
              <div className="w-10" />
            </div>

            <ScrollArea className="h-[calc(100%-4rem)]">
              <div className="p-4 space-y-6">
                {/* Settings */}
                <div className="space-y-3">
                  <h3 className={cn('text-sm font-medium text-muted-foreground', isRTL && 'font-arabic')}>
                    {isRTL ? 'الإعدادات' : 'Settings'}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-primary" />
                        <span className={cn(isRTL && 'font-arabic')}>
                          {isRTL ? 'إشعارات المناسبات' : 'Holiday Notifications'}
                        </span>
                      </div>
                      <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                      <div className="flex items-center gap-3">
                        <Cake className="h-5 w-5 text-pink-500" />
                        <span className={cn(isRTL && 'font-arabic')}>
                          {isRTL ? 'تذكير أعياد الميلاد' : 'Birthday Reminders'}
                        </span>
                      </div>
                      <Switch checked={birthdayReminders} onCheckedChange={setBirthdayReminders} />
                    </div>
                  </div>
                </div>

                {/* Upcoming Holidays */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className={cn('font-semibold', isRTL && 'font-arabic')}>
                      {isRTL ? 'المناسبات القادمة' : 'Upcoming Holidays'}
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    {upcomingHolidays.length === 0 ? (
                      <p className={cn('text-sm text-muted-foreground text-center py-4', isRTL && 'font-arabic')}>
                        {isRTL ? 'لا توجد مناسبات قريبة' : 'No upcoming holidays'}
                      </p>
                    ) : (
                      upcomingHolidays.map((holiday) => (
                        <motion.div
                          key={holiday.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3 p-3 bg-card rounded-xl"
                        >
                          <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', holiday.color)}>
                            <holiday.icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className={cn('font-medium', isRTL && 'font-arabic')}>
                              {isRTL ? holiday.nameAr : holiday.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(holiday.date, 'PPP', { locale: language === 'ar' ? ar : enUS })}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-bold text-primary">{holiday.daysUntil}</p>
                            <p className={cn('text-xs text-muted-foreground', isRTL && 'font-arabic')}>
                              {isRTL ? 'يوم' : 'days'}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>

                {/* Birthday Tracker */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Cake className="h-5 w-5 text-pink-500" />
                    <h3 className={cn('font-semibold', isRTL && 'font-arabic')}>
                      {isRTL ? 'أعياد ميلاد قادمة' : 'Upcoming Birthdays'}
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    {upcomingBirthdays.map((contact) => (
                      <motion.button
                        key={contact.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full flex items-center gap-3 p-3 bg-card rounded-xl hover:bg-secondary/50 transition-colors"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={contact.avatar} alt={contact.name} />
                          <AvatarFallback>{(isRTL ? contact.nameAr : contact.name)[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-start">
                          <p className={cn('font-medium', isRTL && 'font-arabic')}>
                            {isRTL ? contact.nameAr : contact.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(contact.birthday, 'PPP', { locale: language === 'ar' ? ar : enUS })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {contact.daysUntil <= 3 && (
                            <span className="px-2 py-0.5 bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 text-xs rounded-full">
                              {isRTL ? 'قريباً!' : 'Soon!'}
                            </span>
                          )}
                          <div className="text-center">
                            <p className="text-lg font-bold text-pink-500">{contact.daysUntil}</p>
                            <p className={cn('text-xs text-muted-foreground', isRTL && 'font-arabic')}>
                              {isRTL ? 'يوم' : 'days'}
                            </p>
                          </div>
                          <ChevronIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Send Greeting */}
                <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <PartyPopper className="h-6 w-6 text-primary" />
                    <h3 className={cn('font-semibold', isRTL && 'font-arabic')}>
                      {isRTL ? 'أرسل تهنئة' : 'Send Greeting'}
                    </h3>
                  </div>
                  <p className={cn('text-sm text-muted-foreground mb-3', isRTL && 'font-arabic')}>
                    {isRTL 
                      ? 'أرسل رسالة تهنئة لأصدقائك في المناسبات الخاصة'
                      : 'Send greeting messages to your friends on special occasions'
                    }
                  </p>
                  <Button className={cn('w-full gap-2', isRTL && 'font-arabic')}>
                    <Gift className="h-4 w-4" />
                    {isRTL ? 'أرسل تهنئة' : 'Send Greeting'}
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
