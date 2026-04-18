'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  MessageCircle, 
  LayoutGrid, 
  ShoppingBag, 
  Newspaper, 
  User 
} from 'lucide-react'
import { useAppStore, type TabId } from '@/lib/stores/app-store'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'

interface NavItem {
  id: TabId
  labelKey: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { id: 'wansa', labelKey: 'nav.wansa', icon: MessageCircle },
  { id: 'saha', labelKey: 'nav.saha', icon: LayoutGrid },
  { id: 'souq', labelKey: 'nav.souq', icon: ShoppingBag },
  { id: 'news', labelKey: 'nav.news', icon: Newspaper },
  { id: 'profile', labelKey: 'nav.profile', icon: User },
]

export function BottomNavigation() {
  const { activeTab, setActiveTab } = useAppStore()
  const { t, isRTL } = useLanguage()

  const handleTabChange = (tabId: TabId) => {
    // Only update if tab is different - prevents unnecessary re-renders
    if (tabId !== activeTab) {
      setActiveTab(tabId)
    }
  }

  return (
    <nav className="bottom-nav w-full max-w-full overflow-x-hidden" role="navigation" aria-label="Main navigation">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2 w-full">
        {navItems.map((item) => {
          const isActive = activeTab === item.id
          const Icon = item.icon

          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={cn(
                'relative flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-colors min-w-[60px]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
              aria-label={t(item.labelKey)}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              
              <Icon 
                className={cn(
                  'relative z-10 h-5 w-5 transition-transform',
                  isActive && 'scale-110'
                )} 
              />
              <span 
                className={cn(
                  'relative z-10 text-[10px] font-medium transition-all',
                  isRTL && 'font-arabic',
                  isActive && 'font-semibold'
                )}
              >
                {t(item.labelKey)}
              </span>

              {/* Notification badge example - can be connected to store */}
              {item.id === 'wansa' && (
                <span className="absolute top-1 end-1 w-2 h-2 bg-accent rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
