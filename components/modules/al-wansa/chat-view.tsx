'use client'

import * as React from 'react'
import { motion, AnimatePresence, PanInfo, useAnimation } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  MoreVertical,
  Phone,
  Video,
  Send,
  Mic,
  Image as ImageIcon,
  Smile,
  X,
  Reply,
  Forward,
  Edit2,
  Trash2,
  Copy,
  Check,
  CheckCheck,
  MapPin,
  Camera,
  Languages,
  Gamepad2,
  Archive,
  BellOff,
  Bell,
  Pin,
  PinOff,
  Clock,
  Pause,
  Play,
  Settings,
  Flag,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AvatarWithCrown } from '@/components/ui/avatar-with-crown'
import { UserAvatarPopover } from '@/components/ui/user-avatar-popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { GiftSelector } from '@/components/ui/gift-selector'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useChatStore, type Message } from '@/lib/stores/chat-store'
import { useUserStore } from '@/lib/stores/user-store'
import { useAppStore } from '@/lib/stores/app-store'
import { useLanguage } from '@/components/providers/language-provider'
import { useGender } from '@/hooks/use-gender'
import { ChatBackgroundPattern, useChatTheme } from './chat-theme-provider'
import { EmojiPicker, AnimatedEmoji, FlyingEmoji } from './animated-emoji'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'

interface ChatViewProps {
  onBack: () => void
  onOpenGames?: () => void
  onOpenProfile?: (userId: string) => void
  onOpenScanner?: () => void
}

export function ChatView({ onBack, onOpenGames, onOpenProfile, onOpenScanner }: ChatViewProps) {
  const { 
    activeChatId, 
    chats, 
    messages, 
    addMessage, 
    isRecording, 
    setRecording, 
    recordingDuration, 
    setRecordingDuration,
    archiveChat,
    muteChat,
    unmuteChat,
    pinChat,
    unpinChat,
    shareLocation,
  } = useChatStore()
  const { currentUser } = useUserStore()
  const { t, language, isRTL } = useLanguage()
  const { setLanguage } = useAppStore()
  const { interaction, greeting } = useGender()
  const { setBackground, backgrounds } = useChatTheme()
  
  const [inputValue, setInputValue] = React.useState('')
  const [autoTranslate, setAutoTranslate] = React.useState(false)
  const [selectedMessage, setSelectedMessage] = React.useState<Message | null>(null)
  const [replyingTo, setReplyingTo] = React.useState<Message | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false)
  const [flyingEmoji, setFlyingEmoji] = React.useState<string | null>(null)
  const [showLocationSheet, setShowLocationSheet] = React.useState(false)
  const [isListening, setIsListening] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [deleteTarget, setDeleteTarget] = React.useState<{ message: Message; type: 'me' | 'everyone' } | null>(null)
  const [showWallpaperPicker, setShowWallpaperPicker] = React.useState(false)
  
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const recordingTimerRef = React.useRef<number | null>(null)

  const chat = chats.find((c) => c.id === activeChatId)
  const chatMessages = messages[activeChatId || ''] || []

  const BackIcon = isRTL ? ArrowRight : ArrowLeft

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatMessages])

  // Recording timer
  React.useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingDuration(recordingDuration + 1)
      }, 1000)
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }
  }, [isRecording, recordingDuration, setRecordingDuration])

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSend = () => {
    if (!inputValue.trim() || !currentUser || !activeChatId) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId: activeChatId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content: inputValue.trim(),
      type: 'text',
      timestamp: new Date(),
      status: 'sending',
      replyTo: replyingTo?.id,
    }

    addMessage(activeChatId, newMessage)
    setInputValue('')
    setReplyingTo(null)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Voice recording handlers
  const startRecording = () => {
    setRecording(true)
  }

  const cancelRecording = () => {
    setRecording(false)
  }

  const sendVoiceNote = () => {
    if (!currentUser || !activeChatId) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId: activeChatId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content: '',
      type: 'voice',
      voiceDuration: recordingDuration,
      timestamp: new Date(),
      status: 'sending',
    }

    addMessage(activeChatId, newMessage)
    setRecording(false)
  }

  // Handle swipe to cancel
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isRTL ? info.offset.x > 100 : info.offset.x < -100) {
      cancelRecording()
    }
  }

  // Speech-to-text handler
  const startSpeechToText = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert(isRTL ? 'المتصفح لا يدعم التعرف على الصوت' : 'Speech recognition not supported')
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.lang = language === 'ar' ? 'ar-SD' : 'en-US'
    recognition.interimResults = true
    recognition.continuous = false

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)
    
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('')
      setInputValue(transcript)
    }

    recognition.start()
  }

  // Share location
  const handleShareLocation = (isLive: boolean, duration?: number) => {
    if (!currentUser || !activeChatId) return
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          shareLocation(
            activeChatId,
            currentUser.id,
            currentUser.name,
            currentUser.avatar,
            position.coords.latitude,
            position.coords.longitude,
            isLive,
            duration
          )
          setShowLocationSheet(false)
        },
        () => {
          alert(isRTL ? 'لا يمكن الوصول للموقع' : 'Cannot access location')
        }
      )
    }
  }

  // Emoji handler
  const handleEmojiSelect = (emoji: string) => {
    setInputValue((prev) => prev + emoji)
    setFlyingEmoji(emoji)
  }

  if (!chat) return null

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="flex flex-col h-full bg-background w-full max-w-full overflow-hidden relative">
      {/* Background Pattern - Click to change wallpaper */}
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={() => setShowWallpaperPicker(true)}
        aria-label={isRTL ? 'تغيير الخلفية' : 'Change wallpaper'}
      >
        <ChatBackgroundPattern />
      </div>
      
      {/* Header */}
      <header className="flex items-center gap-3 px-2 py-2 bg-card/95 backdrop-blur-sm border-b relative z-10">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <BackIcon className="h-5 w-5" />
        </Button>
        
        {/* Clickable Avatar + Name to open profile */}
        <UserAvatarPopover
          user={{
            id: chat.id,
            name: chat.name,
            nameAr: chat.nameAr,
            avatar: chat.avatar,
            location: chat.isOnline ? (isRTL ? 'متصل الآن' : 'Online now') : (isRTL ? 'غير متصل' : 'Offline'),
            isOnline: chat.isOnline,
            royalRank: chat.type === 'private' ? 'knight-royal' : undefined,
          }}
          chatId={chat.id}
          placement="bottom"
        >
          <button 
            className="flex items-center gap-3 flex-1 min-w-0 hover:bg-secondary/50 rounded-lg p-1 -m-1 transition-colors"
          >
            <div className="relative flex-shrink-0">
              <AvatarWithCrown
                src={chat.avatar}
                alt={isRTL ? chat.nameAr : chat.name}
                fallback={(isRTL ? chat.nameAr : chat.name)[0]}
                royalRank={chat.type === 'private' ? 'knight-royal' : undefined}
                size="md"
              />
              {chat.isOnline && chat.type === 'private' && (
                <span className="absolute bottom-0 end-0 w-2.5 h-2.5 bg-green-500 border-2 border-card rounded-full" />
              )}
            </div>

            <div className="flex-1 min-w-0 text-start">
              <h3 className={cn('font-semibold truncate', isRTL && 'font-arabic')}>
                {isRTL ? chat.nameAr : chat.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {chat.isOnline ? t('chat.online') : t('chat.offline')}
              </p>
            </div>
          </button>
        </UserAvatarPopover>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="w-52">
              {/* Pin/Unpin */}
              <DropdownMenuItem 
                onClick={() => chat.isPinned ? unpinChat(chat.id) : pinChat(chat.id)}
                className={cn('gap-3', isRTL && 'flex-row-reverse')}
              >
                {chat.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                <span className={cn(isRTL && 'font-arabic')}>
                  {chat.isPinned ? (isRTL ? 'إلغاء التثبيت' : 'Unpin') : (isRTL ? 'تثبيت' : 'Pin')}
                </span>
              </DropdownMenuItem>
              
              {/* Mute/Unmute */}
              <DropdownMenuItem 
                onClick={() => chat.isMuted ? unmuteChat(chat.id) : muteChat(chat.id)}
                className={cn('gap-3', isRTL && 'flex-row-reverse')}
              >
                {chat.isMuted ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                <span className={cn(isRTL && 'font-arabic')}>
                  {chat.isMuted ? (isRTL ? 'إلغاء الكتم' : 'Unmute') : t('chat.mute')}
                </span>
              </DropdownMenuItem>
              
              {/* Archive */}
              <DropdownMenuItem 
                onClick={() => archiveChat(chat.id)}
                className={cn('gap-3', isRTL && 'flex-row-reverse')}
              >
                <Archive className="h-4 w-4" />
                <span className={cn(isRTL && 'font-arabic')}>{isRTL ? 'أرشفة' : 'Archive'}</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => onOpenScanner?.()}
                className={cn('gap-3', isRTL && 'flex-row-reverse')}
              >
                <Camera className="h-4 w-4" />
                <span className={cn(isRTL && 'font-arabic')}>{isRTL ? 'مسح وثيقة' : 'Scan Document'}</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => setAutoTranslate((prev) => !prev)}
                className={cn('gap-3', isRTL && 'flex-row-reverse')}
              >
                <Languages className="h-4 w-4" />
                <span className={cn(isRTL && 'font-arabic')}>
                  {autoTranslate
                    ? (isRTL ? 'إيقاف الترجمة التلقائية' : 'Disable Auto-translate')
                    : (isRTL ? 'تشغيل الترجمة التلقائية' : 'Enable Auto-translate')
                  }
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className={cn('gap-3', isRTL && 'flex-row-reverse')}
              >
                <Languages className="h-4 w-4" />
                <span className={cn(isRTL && 'font-arabic')}>
                  {isRTL ? 'English' : 'العربية'}
                </span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Games */}
              <DropdownMenuItem 
                onClick={onOpenGames}
                className={cn('gap-3', isRTL && 'flex-row-reverse')}
              >
                <Gamepad2 className="h-4 w-4" />
                <span className={cn(isRTL && 'font-arabic')}>{isRTL ? 'الألعاب' : 'Games'}</span>
              </DropdownMenuItem>
              
              {chat.type === 'group' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className={cn(isRTL && 'font-arabic')}>{t('chat.kick')}</DropdownMenuItem>
                  <DropdownMenuItem className={cn(isRTL && 'font-arabic')}>{t('chat.promote')}</DropdownMenuItem>
                </>
              )}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem className={cn('text-destructive gap-3', isRTL && 'flex-row-reverse font-arabic')}>
                {t('chat.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4 pb-24 relative z-0">
        <div className="space-y-4">
          {chatMessages.map((message, index) => {
            const isSent = message.senderId === currentUser?.id
            const showAvatar = !isSent && (
              index === 0 || chatMessages[index - 1]?.senderId !== message.senderId
            )
            
            // Don't show deleted messages
            if (message.deletedForEveryone) {
              return (
                <div key={message.id} className="flex justify-center">
                  <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                    {isRTL ? 'تم حذف هذه الرسالة' : 'This message was deleted'}
                  </span>
                </div>
              )
            }
            
            // Don't show if deleted for current user
            if (message.deletedFor?.includes(currentUser?.id || '')) {
              return null
            }

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isSent={isSent}
                showAvatar={showAvatar}
                onLongPress={() => setSelectedMessage(message)}
                onReply={() => setReplyingTo(message)}
                onSwipeReply={() => setReplyingTo(message)}
                chatMessages={chatMessages}
                chatId={chat.id}
                autoTranslate={autoTranslate}
              />
            )
          })}
        </div>
      </ScrollArea>

      {/* Reply preview */}
      <AnimatePresence>
        {replyingTo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t bg-secondary/30 relative z-10"
          >
            <div className="flex items-center gap-2 px-4 py-2">
              <Reply className="h-4 w-4 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-primary">{replyingTo.senderName}</p>
                <p className="text-sm text-muted-foreground truncate">{replyingTo.content}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setReplyingTo(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Input Area */}
      <div 
        className="sticky bottom-0 start-0 end-0 p-3 border-t bg-card/95 backdrop-blur-sm z-20"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {isRecording ? (
          <motion.div
            className="flex items-center gap-3"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
          >
            <div className="recording-pulse w-3 h-3 bg-destructive rounded-full" />
            <span className="text-destructive font-mono">
              {formatRecordingTime(recordingDuration)}
            </span>
            <span className={cn('flex-1 text-sm text-muted-foreground', isRTL && 'font-arabic')}>
              {t('chat.slideCancel')}
            </span>
            <Button
              size="icon"
              className="rounded-full bg-primary hover:bg-primary/90"
              onClick={sendVoiceNote}
            >
              <Send className="h-5 w-5" />
            </Button>
          </motion.div>
        ) : (
          <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
            {/* Settings Gear - opens wallpaper picker */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 flex-shrink-0"
              onClick={() => setShowWallpaperPicker(true)}
            >
              <Settings className="h-5 w-5 text-muted-foreground" />
            </Button>
            
            {/* Emoji Picker Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn('h-10 w-10 flex-shrink-0', showEmojiPicker && 'bg-secondary')}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              {showEmojiPicker ? <X className="h-5 w-5" /> : <Smile className="h-5 w-5" />}
            </Button>
            
            {/* Attachment Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 flex-shrink-0">
                  <ImageIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? 'start' : 'start'} className="min-w-[180px]" dir={isRTL ? 'rtl' : 'ltr'}>
                <DropdownMenuItem className={cn('gap-2', isRTL && 'flex-row-reverse')}>
                  <ImageIcon className="h-4 w-4" />
                  <span className={cn(isRTL && 'font-arabic')}>{isRTL ? 'صورة' : 'Photo'}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className={cn('gap-2', isRTL && 'flex-row-reverse')}>
                  <Camera className="h-4 w-4" />
                  <span className={cn(isRTL && 'font-arabic')}>{isRTL ? 'مسح مستند' : 'Scan Document'}</span>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className={cn('gap-2', isRTL && 'flex-row-reverse')}>
                    <MapPin className="h-4 w-4" />
                    <span className={cn(isRTL && 'font-arabic')}>{isRTL ? 'موقع' : 'Location'}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent dir={isRTL ? 'rtl' : 'ltr'}>
                    <DropdownMenuItem onClick={() => handleShareLocation(false)} className={cn('gap-2', isRTL && 'flex-row-reverse')}>
                      <MapPin className="h-4 w-4" />
                      <span className={cn(isRTL && 'font-arabic')}>{isRTL ? 'الموقع الحالي' : 'Current Location'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleShareLocation(true, 15)} className={cn('gap-2', isRTL && 'flex-row-reverse')}>
                      <Clock className="h-4 w-4" />
                      <span className={cn(isRTL && 'font-arabic')}>{isRTL ? 'مباشر 15 دقيقة' : 'Live 15 min'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShareLocation(true, 60)} className={cn('gap-2', isRTL && 'flex-row-reverse')}>
                      <Clock className="h-4 w-4" />
                      <span className={cn(isRTL && 'font-arabic')}>{isRTL ? 'مباشر 1 ساعة' : 'Live 1 hour'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShareLocation(true, 480)} className={cn('gap-2', isRTL && 'flex-row-reverse')}>
                      <Clock className="h-4 w-4" />
                      <span className={cn(isRTL && 'font-arabic')}>{isRTL ? 'مباشر 8 ساعات' : 'Live 8 hours'}</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t('chat.typeMessage')}
              className={cn(
                'flex-1 rounded-full bg-secondary/50 border-none',
                isRTL && 'font-arabic text-right'
              )}
            />

            {inputValue.trim() ? (
              <Button
                size="icon"
                className="rounded-full bg-primary hover:bg-primary/90 flex-shrink-0"
                onClick={handleSend}
              >
                <Send className={cn('h-5 w-5', isRTL && 'rotate-180')} />
              </Button>
            ) : (
              <div className="flex items-center gap-1">
                <GiftSelector chatId={activeChatId || ''} isRTL={isRTL} />
                {/* Speech-to-Text */}
                <Button
                  size="icon"
                  variant={isListening ? 'default' : 'ghost'}
                  className={cn('flex-shrink-0 rounded-full', isListening && 'recording-pulse')}
                  onClick={startSpeechToText}
                >
                  <Mic className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Message Context Menu */}
      <AnimatePresence>
        {selectedMessage && (
          <MessageContextMenu
            message={selectedMessage}
            onClose={() => setSelectedMessage(null)}
            onReply={() => {
              setReplyingTo(selectedMessage)
              setSelectedMessage(null)
            }}
            onDeleteForMe={(msg) => {
              setDeleteTarget({ message: msg, type: 'me' })
              setShowDeleteDialog(true)
              setSelectedMessage(null)
            }}
            onDeleteForEveryone={(msg) => {
              setDeleteTarget({ message: msg, type: 'everyone' })
              setShowDeleteDialog(true)
              setSelectedMessage(null)
            }}
          />
        )}
      </AnimatePresence>

      {/* Flying Emoji */}
      <AnimatePresence>
        {flyingEmoji && (
          <FlyingEmoji emoji={flyingEmoji} onComplete={() => setFlyingEmoji(null)} />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <DeleteMessageDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        deleteTarget={deleteTarget}
      />

      {/* Bottom-Docked Emoji Picker (Telegram Style) */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-[72px] inset-x-0 bg-card border-t z-30 overflow-hidden"
          >
            <div className="p-4 grid grid-cols-8 gap-3 place-items-center max-h-[200px] overflow-y-auto">
              {['😊', '❤️', '😂', '👍', '🤲', '☕', '🙏', '💪', '🎉', '👏', '🤝', '✨', '😍', '🥰', '😢', '🔥', '🇸🇩', '💚', '🌴', '☀️', '🌙', '🌺', '🤗', '😎'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    handleEmojiSelect(emoji)
                    setShowEmojiPicker(false)
                  }}
                  className="text-2xl hover:scale-125 transition-transform active:scale-95 p-1"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wallpaper Picker Sheet */}
      <AnimatePresence>
        {showWallpaperPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setShowWallpaperPicker(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-0 inset-x-0 bg-card rounded-t-2xl p-4 max-h-[60vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={cn('text-lg font-semibold', isRTL && 'font-arabic')}>
                  {isRTL ? 'خلفية المحادثة' : 'Chat Wallpaper'}
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setShowWallpaperPicker(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {backgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => {
                      setBackground(bg.id)
                      setShowWallpaperPicker(false)
                    }}
                    className="aspect-video rounded-lg border-2 border-transparent hover:border-primary transition-colors overflow-hidden relative"
                  >
                    <div
                      className="w-full h-full bg-background"
                      style={{ backgroundImage: bg.pattern }}
                    />
                    <span className={cn(
                      'absolute bottom-1 inset-x-1 text-xs text-center bg-black/50 text-white rounded px-1 py-0.5',
                      isRTL && 'font-arabic'
                    )}>
                      {isRTL ? bg.nameAr : bg.name}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Message Bubble Component with Swipe to Reply
interface MessageBubbleProps {
  message: Message
  isSent: boolean
  showAvatar: boolean
  onLongPress: () => void
  onReply: () => void
  onSwipeReply: () => void
  chatMessages: Message[]
  chatId: string
  autoTranslate: boolean
}

function MessageBubble({ message, isSent, showAvatar, onLongPress, onSwipeReply, chatMessages, chatId, autoTranslate }: MessageBubbleProps) {
  const { language, isRTL } = useLanguage()
  const { openReportSheet } = useAppStore()
  const { currentUser } = useUserStore()
  const longPressTimer = React.useRef<number | null>(null)
  const controls = useAnimation()
  const [showReplyIcon, setShowReplyIcon] = React.useState(false)

  const bubbleAlignmentClass = cn(
    'flex gap-2 items-end',
    isSent ? 'justify-end' : 'justify-start',
    !isSent && isRTL ? 'flex-row-reverse' : 'flex-row'
  )

  const handleTouchStart = () => {
    longPressTimer.current = window.setTimeout(onLongPress, 500)
  }

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
  }

  const handleDragEnd = async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 80
    const swipeDirection = isRTL ? -info.offset.x : info.offset.x
    
    if (swipeDirection > threshold) {
      onSwipeReply()
    }
    
    await controls.start({ x: 0 })
    setShowReplyIcon(false)
  }

  const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeDirection = isRTL ? -info.offset.x : info.offset.x
    setShowReplyIcon(swipeDirection > 30)
  }

  const formatMessageTime = (date: Date) => {
    return format(date, 'p', { locale: language === 'ar' ? ar : enUS })
  }

  const StatusIcon = message.status === 'read' ? CheckCheck : 
                     message.status === 'delivered' ? CheckCheck : Check

  // Find reply message
  const replyMessage = message.replyTo 
    ? chatMessages.find(m => m.id === message.replyTo) 
    : null

  return (
    <div className="relative">
      {/* Reply Icon */}
      <AnimatePresence>
        {showReplyIcon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className={cn(
              'absolute top-1/2 -translate-y-1/2 z-10',
              isSent ? (isRTL ? 'end-full me-2' : 'start-full ms-2') : (isRTL ? 'start-full ms-2' : 'end-full me-2')
            )}
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Reply className="h-4 w-4 text-primary" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={controls}
        className={bubbleAlignmentClass}
        dir={isRTL ? 'rtl' : 'ltr'}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onContextMenu={(e) => {
          e.preventDefault()
          onLongPress()
        }}
      >
        {/* Avatar (for received messages) */}
        {!isSent && (
          <div className="w-8 flex-shrink-0">
            {showAvatar && (
              <UserAvatarPopover
                user={{
                  id: message.senderId,
                  name: message.senderName,
                  nameAr: message.senderName,
                  avatar: message.senderAvatar,
                  royalRank: currentUser?.id === message.senderId ? currentUser?.royalRank : 'knight-royal',
                  isOnline: false,
                }}
                chatId={chatId}
                placement="right"
              >
                <AvatarWithCrown
                  src={message.senderAvatar}
                  alt={message.senderName}
                  fallback={message.senderName[0]}
                  royalRank={message.senderId === currentUser?.id ? currentUser?.royalRank : undefined}
                  size="sm"
                />
              </UserAvatarPopover>
            )}
          </div>
        )}

        {/* Bubble */}
        <div
          className={cn(
            'chat-bubble',
            isSent ? 'chat-bubble-sent' : 'chat-bubble-received',
            isRTL && 'text-right'
          )}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Reply Preview */}
          {replyMessage && (
            <div className={cn(
              'mb-2 pb-2 border-b text-sm opacity-80',
              isSent ? 'border-primary-foreground/20' : 'border-secondary-foreground/20'
            )}>
              <p className="font-medium text-xs">{replyMessage.senderName}</p>
              <p className="truncate">{replyMessage.content}</p>
            </div>
          )}
          
          {message.type === 'voice' ? (
            <VoiceMessagePlayer message={message} isSent={isSent} />
          ) : message.type === 'location' ? (
            <LocationMessage message={message} isSent={isSent} />
          ) : message.type === 'gift' ? (
            <GiftMessage message={message} isSent={isSent} />
          ) : (
            <>
              <p className={cn(isRTL && 'font-arabic')}>
                {autoTranslate && !message.translatedContent
                  ? (isRTL ? 'تمت الترجمة تلقائياً' : 'Auto-translated')
                  : message.content
                }
              </p>
              {message.translatedContent && (
                <p className={cn('mt-2 pt-2 border-t text-sm opacity-80', isRTL && 'font-arabic')}>
                  {message.translatedContent}
                </p>
              )}
            </>
          )}
          
          {/* Time and status */}
          <div className={cn(
            'flex items-center gap-1 mt-1',
            isSent ? 'justify-end' : 'justify-start'
          )}>
            <span className="text-[10px] opacity-70">
              {formatMessageTime(message.timestamp)}
            </span>
            {isSent && (
              <StatusIcon className={cn(
                'h-3 w-3',
                message.status === 'read' ? 'text-blue-400' : 'opacity-70'
              )} />
            )}
            {message.isEdited && (
              <span className="text-[10px] opacity-50">
                {isRTL ? 'معدل' : 'edited'}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-6 w-6 p-0 text-muted-foreground', isRTL && 'order-first')}
              onClick={() => openReportSheet({
                type: 'message',
                id: message.id,
                content: message.content,
                authorId: message.senderId,
                authorName: message.senderName,
              })}
              aria-label={isRTL ? 'إبلاغ الرسالة' : 'Report message'}
            >
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Voice Message Player
function VoiceMessagePlayer({ message, isSent }: { message: Message; isSent: boolean }) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  return (
    <div className="flex items-center gap-2 min-w-[150px]">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 rounded-full"
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      <div className="flex-1 h-1 bg-current/30 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-current/70"
          initial={{ width: '0%' }}
          animate={{ width: isPlaying ? '100%' : `${progress}%` }}
          transition={{ duration: message.voiceDuration || 5 }}
        />
      </div>
      <span className="text-xs opacity-70">
        {Math.floor((message.voiceDuration || 0) / 60)}:
        {((message.voiceDuration || 0) % 60).toString().padStart(2, '0')}
      </span>
    </div>
  )
}

// Location Message
function LocationMessage({ message, isSent }: { message: Message; isSent: boolean }) {
  const { isRTL } = useLanguage()
  
  if (!message.location) return null
  
  return (
    <div className="min-w-[180px]">
      <div className="w-full h-24 bg-muted/50 rounded-lg flex items-center justify-center mb-2">
        <MapPin className="h-8 w-8 text-primary" />
      </div>
      <div className="flex items-center gap-2">
        {message.location.isLive && (
          <span className="recording-pulse w-2 h-2 bg-green-500 rounded-full" />
        )}
        <span className="text-sm">
          {message.location.isLive 
            ? (isRTL ? 'موقع مباشر' : 'Live Location')
            : (isRTL ? 'الموقع' : 'Location')
          }
        </span>
        {message.location.duration && (
          <span className="text-xs opacity-70">
            ({message.location.duration} {isRTL ? 'دقيقة' : 'min'})
          </span>
        )}
      </div>
    </div>
  )
}

// Gift Message
function GiftMessage({ message, isSent }: { message: Message; isSent: boolean }) {
  const { isRTL } = useLanguage()
  
  if (!message.gift) return null
  
  const { gift } = message
  
  // Get gift animation class based on effect
  const getAnimationClass = (effect?: string) => {
    switch (effect) {
      case 'shake': return 'gift-shake'
      case 'glow': return 'gift-glow'
      case 'eye-blink': return 'gift-eye-blink'
      case 'heartbeat': return 'gift-heartbeat'
      case 'explosion': return 'gift-explosion'
      default: return ''
    }
  }
  
  // Get rarity color
  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'Legendary': return 'text-yellow-500'
      case 'Epic': return 'text-purple-500'
      case 'Rare': return 'text-blue-500'
      case 'Common': return 'text-gray-500'
      default: return 'text-primary'
    }
  }
  
  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
      {/* Gift Icon/Emoji */}
      <div className={cn(
        'text-4xl',
        getAnimationClass(gift.effect)
      )}>
        {gift.symbol || '🎁'}
      </div>
      
      {/* Gift Name */}
      <div className="text-center">
        <p className={cn(
          'font-semibold text-sm',
          isRTL && 'font-arabic'
        )}>
          {isRTL ? gift.nameAr : gift.name}
        </p>
        
        {/* Category and Rarity */}
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-xs opacity-70 capitalize">
            {gift.category}
          </span>
          {gift.rarity && (
            <>
              <span className="text-xs opacity-50">•</span>
              <span className={cn('text-xs font-medium', getRarityColor(gift.rarity))}>
                {gift.rarity}
              </span>
            </>
          )}
        </div>
      </div>
      
      {/* Gift Message */}
      <p className={cn(
        'text-xs opacity-80 text-center',
        isRTL && 'font-arabic'
      )}>
        {isSent 
          ? (isRTL ? 'أرسلت هدية' : 'Sent a gift')
          : (isRTL ? 'تلقيت هدية' : 'Received a gift')
        }
      </p>
    </div>
  )
}

// Message Context Menu
interface MessageContextMenuProps {
  message: Message
  onClose: () => void
  onReply: () => void
  onDeleteForMe: (message: Message) => void
  onDeleteForEveryone: (message: Message) => void
}

function MessageContextMenu({ message, onClose, onReply, onDeleteForMe, onDeleteForEveryone }: MessageContextMenuProps) {
  const { t, isRTL } = useLanguage()
  const { translateMessage } = useChatStore()
  const { currentUser } = useUserStore()
  const { openReportSheet } = useAppStore()

  const isSent = message.senderId === currentUser?.id

  const handleTranslate = async () => {
    // Mock translation - in production, use a translation API
    const translatedContent = isRTL 
      ? 'Translated to English...'
      : 'تمت الترجمة للعربية...'
    translateMessage(message.chatId, message.id, translatedContent, isRTL ? 'ar' : 'en')
    onClose()
  }

  const handleReport = () => {
    openReportSheet({
      type: 'message',
      id: message.id,
      content: message.content,
      authorId: message.senderId,
      authorName: message.senderName,
    })
    onClose()
  }

  const actions = [
    { icon: Reply, label: t('chat.reply'), onClick: onReply },
    { icon: Forward, label: t('chat.forward'), onClick: () => {} },
    { icon: Copy, label: t('chat.copy'), onClick: () => navigator.clipboard.writeText(message.content) },
    { icon: Languages, label: isRTL ? 'ترجمة' : 'Translate', onClick: handleTranslate },
    { icon: Flag, label: isRTL ? 'إبلاغ' : 'Report', onClick: handleReport },
    ...(isSent ? [
      { icon: Edit2, label: t('chat.edit'), onClick: () => {} },
    ] : []),
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-card rounded-xl p-2 min-w-[200px] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => {
              action.onClick()
              onClose()
            }}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              'hover:bg-secondary',
              isRTL && 'flex-row-reverse'
            )}
          >
            <action.icon className="h-5 w-5" />
            <span className={cn(isRTL && 'font-arabic')}>{action.label}</span>
          </button>
        ))}
        
        {/* Delete options */}
        <div className="border-t mt-1 pt-1">
          <button
            onClick={() => onDeleteForMe(message)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              'hover:bg-secondary text-muted-foreground',
              isRTL && 'flex-row-reverse'
            )}
          >
            <Trash2 className="h-5 w-5" />
            <span className={cn(isRTL && 'font-arabic')}>
              {isRTL ? 'حذف لي' : 'Delete for me'}
            </span>
          </button>
          
          {isSent && (
            <button
              onClick={() => onDeleteForEveryone(message)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                'hover:bg-destructive/10 text-destructive',
                isRTL && 'flex-row-reverse'
              )}
            >
              <Trash2 className="h-5 w-5" />
              <span className={cn(isRTL && 'font-arabic')}>
                {isRTL ? 'حذف للجميع' : 'Delete for everyone'}
              </span>
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Delete Message Dialog
function DeleteMessageDialog({ 
  open, 
  onOpenChange, 
  deleteTarget 
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void
  deleteTarget: { message: Message; type: 'me' | 'everyone' } | null
}) {
  const { deleteMessageForMe, deleteMessageForEveryone } = useChatStore()
  const { currentUser } = useUserStore()
  const { isRTL } = useLanguage()

  const handleDelete = () => {
    if (!deleteTarget || !currentUser) return

    if (deleteTarget.type === 'me') {
      deleteMessageForMe(deleteTarget.message.chatId, deleteTarget.message.id, currentUser.id)
    } else {
      deleteMessageForEveryone(deleteTarget.message.chatId, deleteTarget.message.id)
    }
    
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={cn(isRTL && 'font-arabic text-right')}>
            {isRTL ? 'حذف الرسالة' : 'Delete Message'}
          </AlertDialogTitle>
          <AlertDialogDescription className={cn(isRTL && 'font-arabic text-right')}>
            {deleteTarget?.type === 'everyone'
              ? (isRTL ? 'سيتم حذف هذه الرسالة للجميع' : 'This message will be deleted for everyone')
              : (isRTL ? 'سيتم حذف هذه الرسالة لك فقط' : 'This message will only be deleted for you')
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={cn(isRTL && 'flex-row-reverse')}>
          <AlertDialogCancel className={cn(isRTL && 'font-arabic')}>
            {isRTL ? 'إلغاء' : 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className={cn('bg-destructive hover:bg-destructive/90', isRTL && 'font-arabic')}>
            {isRTL ? 'حذف' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
