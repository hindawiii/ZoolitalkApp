'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, Moon, Gamepad2, Archive } from 'lucide-react'
import { ChatList } from './chat-list'
import { ChatView } from './chat-view'
import { ChatThemeProvider } from './chat-theme-provider'
import { GamesMenu } from './games-menu'
import { OccasionsHub } from './occasions-hub'
import { Islamiyat } from './islamiyat'
import { GameHub } from './game-hub'
import { ContactManager } from './contact-manager'
import { DocumentScanner } from './document-scanner'
import { useChatStore } from '@/lib/stores/chat-store'
import { useAppStore } from '@/lib/stores/app-store'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'

type TabId = 'messages' | 'islamic' | 'games' | 'archive'

interface Tab {
  id: TabId
  labelAr: string
  labelEn: string
  icon: React.ComponentType<{ className?: string }>
}

// RTL order: Messages (right) -> Islamic -> Games -> Archive (left)
const tabs: Tab[] = [
  { id: 'messages', labelAr: 'الرسائل', labelEn: 'Messages', icon: MessageCircle },
  { id: 'islamic', labelAr: 'إسلاميات', labelEn: 'Islamic', icon: Moon },
  { id: 'games', labelAr: 'الألعاب', labelEn: 'Games', icon: Gamepad2 },
  { id: 'archive', labelAr: 'الأرشيف', labelEn: 'Archive', icon: Archive },
]

export default function AlWansa() {
  const { activeChatId, setActiveChatId } = useChatStore()
  const { openUserProfile } = useAppStore()
  const { isRTL } = useLanguage()
  const [activeTab, setActiveTab] = React.useState<TabId>('messages')
  const [showOccasions, setShowOccasions] = React.useState(false)
  const [showContacts, setShowContacts] = React.useState(false)
  const [showScanner, setShowScanner] = React.useState(false)

  const handleStartChat = (contactId: string) => {
    setActiveChatId(`chat-${contactId}`)
    setShowContacts(false)
  }
  
  // Handle opening a user's profile from the chat header
  const handleOpenProfile = (userId: string) => {
    console.log('[v0] Opening profile for user:', userId)
    openUserProfile(userId)
  }

  const handleScanCapture = (imageData: string) => {
    console.log('Document scanned:', imageData.slice(0, 100))
    setShowScanner(false)
  }

  // Get the index for the sliding indicator
  const activeTabIndex = tabs.findIndex(t => t.id === activeTab)

  return (
    <ChatThemeProvider>
      <div className="h-full flex flex-col w-full max-w-full overflow-x-hidden">
        {/* Sticky Tab Navigation Header */}
        <div className="sticky top-0 z-40 bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b">
          <div className="relative flex items-center">
            {/* Tabs - reversed for RTL */}
            <div className={cn(
              'flex w-full',
              isRTL && 'flex-row-reverse'
            )}>
              {tabs.map((tab, index) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex-1 flex flex-col items-center gap-1 py-3 px-2 transition-colors relative',
                      isActive 
                        ? 'text-[#2D5A27]' 
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className={cn(
                      'h-5 w-5 transition-transform',
                      isActive && 'scale-110'
                    )} />
                    <span className={cn(
                      'text-xs font-medium',
                      isRTL && 'font-arabic'
                    )}>
                      {isRTL ? tab.labelAr : tab.labelEn}
                    </span>
                  </button>
                )
              })}
            </div>
            
            {/* Sliding Indicator */}
            <motion.div
              className="absolute bottom-0 h-0.5 bg-[#2D5A27] rounded-full"
              initial={false}
              animate={{
                width: `${100 / tabs.length}%`,
                x: isRTL 
                  ? `${(tabs.length - 1 - activeTabIndex) * 100}%`
                  : `${activeTabIndex * 100}%`,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ width: `${100 / tabs.length}%` }}
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {/* When in active chat view, show ChatView regardless of tab */}
            {activeChatId ? (
              <motion.div
                key="chat-view"
                initial={{ x: isRTL ? '-100%' : '100%' }}
                animate={{ x: 0 }}
                exit={{ x: isRTL ? '-100%' : '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="h-full w-full max-w-full"
              >
                <ChatView 
                  onBack={() => setActiveChatId(null)} 
                  onOpenGames={() => setActiveTab('games')}
                  onOpenProfile={handleOpenProfile}
                  onOpenScanner={() => setShowScanner(true)}
                />
              </motion.div>
            ) : (
              <>
                {/* Messages Tab */}
                {activeTab === 'messages' && (
                  <motion.div
                    key="messages"
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full w-full max-w-full"
                  >
                    <ChatList showArchived={false} />
                  </motion.div>
                )}

                {/* Islamic Tab */}
                {activeTab === 'islamic' && (
                  <motion.div
                    key="islamic"
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full w-full max-w-full"
                  >
                    <Islamiyat />
                  </motion.div>
                )}

                {/* Games Tab */}
                {activeTab === 'games' && (
                  <motion.div
                    key="games"
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full w-full max-w-full"
                  >
                    <GameHub />
                  </motion.div>
                )}

                {/* Archive Tab */}
                {activeTab === 'archive' && (
                  <motion.div
                    key="archive"
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full w-full max-w-full"
                  >
                    <ChatList showArchived={true} />
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Occasions Hub */}
        <OccasionsHub 
          isOpen={showOccasions} 
          onClose={() => setShowOccasions(false)} 
        />

        {/* Contact Manager */}
        <ContactManager 
          isOpen={showContacts} 
          onClose={() => setShowContacts(false)}
          onStartChat={handleStartChat}
        />

        {/* Document Scanner */}
        <DocumentScanner
          isOpen={showScanner}
          onClose={() => setShowScanner(false)}
          onCapture={handleScanCapture}
        />
      </div>
    </ChatThemeProvider>
  )
}
