'use client'

import * as React from 'react'
import { motion, AnimatePresence, PanInfo, useAnimation } from 'framer-motion'
import { Search, Plus, Users, Archive, BellOff, Pin, Trash2, Settings2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import { useChatStore, type Chat } from '@/lib/stores/chat-store'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'

interface ChatListProps {
  onOpenSettings?: () => void
  showArchived?: boolean
}

export function ChatList({ onOpenSettings, showArchived = false }: ChatListProps) {
  const { chats, setActiveChatId, archiveChat, unarchiveChat, muteChat, unmuteChat, pinChat, unpinChat } = useChatStore()
  const { t, language, isRTL } = useLanguage()
  const [searchQuery, setSearchQuery] = React.useState('')

  // Filter and sort chats
  const filteredChats = React.useMemo(() => {
    let filtered = chats
    
    // Filter by archive status based on prop
    if (showArchived) {
      filtered = filtered.filter(chat => chat.isArchived)
    } else {
      filtered = filtered.filter(chat => !chat.isArchived)
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (chat) =>
          chat.name.toLowerCase().includes(query) ||
          chat.nameAr.includes(query) ||
          chat.lastMessage.toLowerCase().includes(query)
      )
    }
    
    // Sort: pinned first, then by time
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    })
  }, [chats, searchQuery, showArchived])

  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: language === 'ar' ? ar : enUS,
    })
  }

  return (
    <div className="flex flex-col h-full w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className={cn('text-2xl font-bold', isRTL && 'font-arabic')}>
            {t('chat.title')}
          </h2>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="rounded-full" onClick={onOpenSettings}>
              <Settings2 className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full">
              <Plus className="h-5 w-5" />
              <span className="sr-only">{t('chat.newChat')}</span>
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground start-3" />
          <Input
            placeholder={t('chat.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 rounded-full bg-secondary/50 ps-10 pe-4"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="px-2 pb-4">
          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              {showArchived ? (
                <>
                  <Archive className="h-12 w-12 mb-4 opacity-50" />
                  <p className={cn(isRTL && 'font-arabic')}>
                    {isRTL ? 'لا توجد محادثات مؤرشفة' : 'No archived chats'}
                  </p>
                </>
              ) : (
                <>
                  <Users className="h-12 w-12 mb-4 opacity-50" />
                  <p className={cn(isRTL && 'font-arabic')}>{t('common.noResults')}</p>
                </>
              )}
            </div>
          ) : (
            <AnimatePresence>
              {filteredChats.map((chat) => (
                <SwipeableChatItem
                  key={chat.id}
                  chat={chat}
                  onClick={() => setActiveChatId(chat.id)}
                  formatTime={formatTime}
                  onArchive={() => chat.isArchived ? unarchiveChat(chat.id) : archiveChat(chat.id)}
                  onMute={() => chat.isMuted ? unmuteChat(chat.id) : muteChat(chat.id)}
                  onPin={() => chat.isPinned ? unpinChat(chat.id) : pinChat(chat.id)}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

interface SwipeableChatItemProps {
  chat: Chat
  onClick: () => void
  formatTime: (date: Date) => string
  onArchive: () => void
  onMute: () => void
  onPin: () => void
}

function SwipeableChatItem({ chat, onClick, formatTime, onArchive, onMute, onPin }: SwipeableChatItemProps) {
  const { isRTL } = useLanguage()
  const controls = useAnimation()
  const [showActions, setShowActions] = React.useState(false)

  const handleDragEnd = async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 80
    const swipeOffset = isRTL ? info.offset.x : -info.offset.x
    
    if (swipeOffset > threshold) {
      setShowActions(true)
      await controls.start({ x: isRTL ? 120 : -120 })
    } else {
      setShowActions(false)
      await controls.start({ x: 0 })
    }
  }

  const handleActionClick = (action: () => void) => {
    action()
    setShowActions(false)
    controls.start({ x: 0 })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: isRTL ? 100 : -100 }}
      className="relative mb-1"
    >
      {/* Swipe Actions */}
      <div className={cn(
        'absolute inset-y-0 flex items-center gap-1 px-2',
        isRTL ? 'start-0' : 'end-0'
      )}>
        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10 rounded-full bg-primary/10 text-primary"
          onClick={() => handleActionClick(onPin)}
        >
          <Pin className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10 rounded-full bg-yellow-500/10 text-yellow-600"
          onClick={() => handleActionClick(onMute)}
        >
          <BellOff className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10 rounded-full bg-blue-500/10 text-blue-600"
          onClick={() => handleActionClick(onArchive)}
        >
          <Archive className="h-4 w-4" />
        </Button>
      </div>

      {/* Chat Item */}
      <motion.div
        drag="x"
        dragConstraints={{ left: isRTL ? 0 : -120, right: isRTL ? 120 : 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="relative bg-background"
      >
        <button
          onClick={onClick}
          className={cn(
            'w-full flex items-center gap-3 p-3 rounded-xl transition-colors',
            'hover:bg-secondary/50 active:bg-secondary',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
          )}
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Avatar className="h-12 w-12">
              <AvatarImage src={chat.avatar} alt={chat.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {chat.type === 'group' ? (
                  <Users className="h-5 w-5" />
                ) : (
                  (isRTL ? chat.nameAr : chat.name)[0]
                )}
              </AvatarFallback>
            </Avatar>
            {/* Online indicator */}
            {chat.isOnline && chat.type === 'private' && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
            )}
            {/* Group indicator */}
            {chat.type === 'group' && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-background">
                {chat.participants?.length || 0}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 text-start">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {chat.isPinned && <Pin className="h-3 w-3 text-primary" />}
                {chat.isMuted && <BellOff className="h-3 w-3 text-muted-foreground" />}
                <span className={cn('font-semibold truncate', isRTL && 'font-arabic')}>
                  {isRTL ? chat.nameAr : chat.name}
                </span>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {formatTime(chat.lastMessageTime)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 mt-0.5">
              <p className={cn(
                'text-sm text-muted-foreground truncate',
                isRTL && 'font-arabic'
              )}>
                {chat.lastMessage}
              </p>
              {chat.unreadCount > 0 && (
                <span className={cn(
                  'flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center',
                  chat.isMuted 
                    ? 'bg-muted text-muted-foreground' 
                    : 'bg-accent text-accent-foreground'
                )}>
                  {chat.unreadCount}
                </span>
              )}
            </div>
          </div>
        </button>
      </motion.div>
    </motion.div>
  )
}
