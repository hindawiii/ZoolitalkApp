import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Language = 'ar' | 'en'
export type TabId = 'wansa' | 'saha' | 'souq' | 'news' | 'profile'

interface AppState {
  // Language & RTL
  language: Language
  setLanguage: (lang: Language) => void
  
  // Navigation
  activeTab: TabId
  setActiveTab: (tab: TabId) => void
  
  // Profile viewing (for viewing other users' profiles)
  viewingUserId: string | null
  setViewingUserId: (userId: string | null) => void
  openUserProfile: (userId: string) => void
  
  // Settings drawer
  isSettingsOpen: boolean
  setSettingsOpen: (open: boolean) => void
  
  // Gift overlay
  activeGift: GiftType | null
  giftSender: string | null
  showGift: (gift: GiftType, sender: string) => void
  hideGift: () => void
  triggerGift: (gift: GiftType, sender: string) => void
  
  // Report system
  isReportSheetOpen: boolean
  reportTarget: ReportTarget | null
  setReportSheetOpen: (open: boolean) => void
  openReportSheet: (target: ReportTarget) => void
  submitReport: (reason: string, details?: string) => void
  
  // Data saver mode
  dataSaverEnabled: boolean
  setDataSaver: (enabled: boolean) => void
  
  // Online status visibility
  showOnlineStatus: boolean
  setShowOnlineStatus: (show: boolean) => void
}

export type GiftType = 'jabana' | 'crown' | 'shield' | 'heart' | 'star'

export type ReportTarget = {
  type: 'post' | 'message' | 'listing' | 'comment'
  id: string
  content?: string
  authorId?: string
  authorName?: string
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Language defaults to Arabic
      language: 'ar',
      setLanguage: (language) => set({ language }),
      
      // Default tab is Al-Wansa (chat)
      activeTab: 'wansa',
      setActiveTab: (activeTab) => set({ activeTab }),
      
      // Profile viewing
      viewingUserId: null,
      setViewingUserId: (viewingUserId) => set({ viewingUserId }),
      openUserProfile: (userId) => {
        set({ viewingUserId: userId, activeTab: 'profile' })
      },
      
      // Settings drawer
      isSettingsOpen: false,
      setSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),
      
      // Gift overlay
      activeGift: null,
      giftSender: null,
      showGift: (gift, sender) => set({ activeGift: gift, giftSender: sender }),
      hideGift: () => set({ activeGift: null, giftSender: null }),
      triggerGift: (gift, sender) => {
        set({ activeGift: gift, giftSender: sender })
        // Auto-hide after animation
        setTimeout(() => set({ activeGift: null, giftSender: null }), 4000)
      },
      
      // Report system
      isReportSheetOpen: false,
      reportTarget: null,
      setReportSheetOpen: (isReportSheetOpen) => set({ isReportSheetOpen }),
      openReportSheet: (reportTarget) => set({ reportTarget, isReportSheetOpen: true }),
      submitReport: (reason, details) => {
        // In a real app, this would send to backend
        // TODO: Implement backend report submission
        // Show success toast (we'll implement this)
        set({ isReportSheetOpen: false, reportTarget: null })
      },
      
      // Data saver (default on for Sudan's network conditions)
      dataSaverEnabled: true,
      setDataSaver: (dataSaverEnabled) => set({ dataSaverEnabled }),
      
      // Online status
      showOnlineStatus: true,
      setShowOnlineStatus: (showOnlineStatus) => set({ showOnlineStatus }),
    }),
    {
      name: 'rakobatna-app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        language: state.language,
        dataSaverEnabled: state.dataSaverEnabled,
        showOnlineStatus: state.showOnlineStatus,
      }),
    }
  )
)
