'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings } from 'lucide-react'
import { BottomNavigation } from './bottom-navigation'
import { SettingsDrawer } from './settings-drawer'
import { IslamicMiniPlayer } from '@/components/modules/al-wansa/islamic-player-mini'
import { GlobalAudioPlayer } from '@/components/ui/global-audio-player'
import { GamzaNotification } from '@/components/ui/gamza-notification'
import { useAppStore, type TabId } from '@/lib/stores/app-store'
import { useLanguage } from '@/components/providers/language-provider'
import { Button } from '@/components/ui/button'
import { RakobaLogo } from '@/components/ui/rakoba-logo'
import { ReportSheet } from '@/components/ui/report-sheet'
import { cn } from '@/lib/utils'

// Lazy load module components
const AlWansa = React.lazy(() => import('@/components/modules/al-wansa'))
const AlSaha = React.lazy(() => import('@/components/modules/al-saha'))
const SouqAlJumaa = React.lazy(() => import('@/components/modules/souq-al-jumaa'))
const ZooliNews = React.lazy(() => import('@/components/modules/zooli-news'))
const ZoolProfile = React.lazy(() => import('@/components/modules/zool-profile'))

// Map tabs to components
const tabComponents: Record<TabId, React.LazyExoticComponent<React.ComponentType>> = {
  wansa: AlWansa,
  saha: AlSaha,
  souq: SouqAlJumaa,
  news: ZooliNews,
  profile: ZoolProfile,
}

// Loading fallback with Jabana spinner (Sudanese coffee pot with steam)
function JabanaLoader() {
  const { isRTL } = useLanguage()
  
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="jabana-loader w-16 h-16">
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="jabanaLoaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#008000" />
              <stop offset="100%" stopColor="#8B4513" />
            </linearGradient>
          </defs>
          {/* Jabana pot body */}
          <ellipse cx="32" cy="48" rx="20" ry="12" fill="url(#jabanaLoaderGrad)" />
          <path d="M12 48 Q8 32 18 26 L46 26 Q56 32 52 48" fill="url(#jabanaLoaderGrad)" />
          {/* Spout */}
          <path d="M52 34 Q60 28 62 22" fill="none" stroke="#8B4513" strokeWidth="3" strokeLinecap="round" />
          {/* Handle */}
          <path d="M12 34 Q2 38 6 48 Q10 54 14 50" fill="none" stroke="#8B4513" strokeWidth="3" />
          {/* Steam animation */}
          <circle cx="28" cy="18" r="2" fill="#008000" opacity="0.6">
            <animate attributeName="cy" values="18;10;18" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="36" cy="16" r="2" fill="#008000" opacity="0.4">
            <animate attributeName="cy" values="16;8;16" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.1;0.4" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="32" cy="14" r="2.5" fill="#228B22" opacity="0.5">
            <animate attributeName="cy" values="14;6;14" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.15;0.5" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
      <p className={cn('text-sm text-muted-foreground', isRTL && 'font-arabic')}>
        {isRTL ? 'جاري التحميل...' : 'Loading...'}
      </p>
    </div>
  )
}

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, x: 20 },
  enter: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

export function AppShell() {
  const { activeTab, setSettingsOpen } = useAppStore()
  const { t, isRTL } = useLanguage()
  
  const ActiveModule = tabComponents[activeTab]

  return (
    <div className="relative flex flex-col min-h-dvh bg-background w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-card/80 backdrop-blur-md border-b w-full max-w-full">
        <div className="flex items-center gap-2">
          <RakobaLogo size="sm" />
          <h1 className={cn(
            'text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent',
            isRTL && 'font-arabic'
          )}>
            {t('app.name')}
          </h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSettingsOpen(true)}
          aria-label={t('settings.title')}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden content-area w-full max-w-full box-border pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="min-h-full w-full max-w-full overflow-x-hidden box-border"
          >
            <React.Suspense fallback={<JabanaLoader />}>
              <ActiveModule />
            </React.Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Islamic Player */}
      <GlobalAudioPlayer />

      {/* Gamza Notification */}
      <GamzaNotification />

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Settings Drawer */}
      <SettingsDrawer />

      {/* Report Sheet */}
      <ReportSheet />
    </div>
  )
}
