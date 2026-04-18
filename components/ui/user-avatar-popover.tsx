'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  MessageCircle,
  Phone,
  Video,
  MoreHorizontal,
  Edit3,
  VolumeX,
  Volume2,
  Ban,
  Flag,
  Heart,
  MapPin,
  Calendar,
  Crown,
  ShieldCheck
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useUserStore } from '@/lib/stores/user-store'
import { useChatStore } from '@/lib/stores/chat-store'
import { useAppStore } from '@/lib/stores/app-store'
import { useLanguage } from '@/components/providers/language-provider'
import { useGender } from '@/hooks/use-gender'
import { cn } from '@/lib/utils'

interface UserAvatarPopoverProps {
  user: {
    id: string
    name: string
    nameAr: string
    avatar: string
    nickname?: string
    bio?: string
    bioAr?: string
    location?: string
    socialStatus?: string
    professionalStatus?: string
    royalRank?: 'king-crown' | 'queen-crown' | 'knight-royal'
    isOnline?: boolean
    lastSeen?: Date
  }
  chatId?: string
  children: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

export function UserAvatarPopover({
  user,
  children,
  placement = 'top'
}: UserAvatarPopoverProps) {
  const { isRTL } = useLanguage()
  const { currentUser, updateProfile, blockUser, unblockUser, isBlocked } = useUserStore()
  const { chats, muteChat, unmuteChat, muteUser, unmuteUser } = useChatStore()
  const { openUserProfile } = useAppStore()
  const { socialStatus, professionalStatus } = useGender()

  const [isEditingNickname, setIsEditingNickname] = React.useState(false)
  const [nickname, setNickname] = React.useState(user.nickname || '')
  const [isOpen, setIsOpen] = React.useState(false)

  const isOwnProfile = currentUser?.id === user.id
  const isBlockedUser = isBlocked(user.id)
  const chat = chatId ? chats.find((c) => c.id === chatId) : undefined
  const isMutedUser = chat?.mutedUsers?.includes(user.id) || chat?.isMuted

  const handleSaveNickname = () => {
    if (isOwnProfile && nickname !== user.nickname) {
      updateProfile({ nickname })
    }
    setIsEditingNickname(false)
  }

  const handleMuteToggle = () => {
    if (!chatId) {
      setIsOpen(false)
      return
    }

    if (chat?.isMuted) {
      unmuteChat(chatId)
    } else {
      muteChat(chatId)
    }

    if (chat?.participants?.some((participant) => participant.id === user.id)) {
      if (isMutedUser) {
        unmuteUser(chatId, user.id)
      } else {
        muteUser(chatId, user.id)
      }
    }

    setIsOpen(false)
  }

  const handleBlockToggle = () => {
    if (isBlockedUser) {
      unblockUser(user.id)
    } else {
      blockUser({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        blockedAt: new Date()
      })
    }
    setIsOpen(false)
  }

  const handleReport = () => {
    // Open report sheet
    setIsOpen(false)
  }

  const handleStartChat = () => {
    // Navigate to chat with this user
    setIsOpen(false)
  }

  const handleViewProfile = () => {
    openUserProfile(user.id)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        align={placement === 'top' ? 'center' : placement}
        side={placement}
        sideOffset={8}
      >
        <div className="p-4 space-y-4">
          {/* User Header */}
          <div className="flex items-start gap-3">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              {/* Royal Crown Overlay */}
              {user.royalRank && ['king-crown', 'queen-crown'].includes(user.royalRank) && (
                <div className="absolute -top-1 -end-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="h-3 w-3 text-white" fill="currentColor" />
                </div>
              )}
              {/* Online Status */}
              {user.isOnline && (
                <div className="absolute bottom-0 end-0 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={cn('font-semibold truncate', isRTL && 'font-arabic')}>
                  {isRTL ? user.nameAr : user.name}
                </h3>
                {user.royalRank && (
                  <Crown className="h-4 w-4 text-yellow-500" fill="currentColor" />
                )}
              </div>

              {/* Nickname */}
              {isOwnProfile ? (
                <div className="flex items-center gap-2">
                  {isEditingNickname ? (
                    <div className="flex items-center gap-1 flex-1">
                      <Input
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="h-6 text-xs"
                        placeholder={isRTL ? 'اللقب' : 'Nickname'}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveNickname()
                          if (e.key === 'Escape') setIsEditingNickname(false)
                        }}
                        autoFocus
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={handleSaveNickname}
                      >
                        ✓
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditingNickname(true)}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <Edit3 className="h-3 w-3" />
                      {user.nickname || (isRTL ? 'أضف لقب' : 'Add nickname')}
                    </button>
                  )}
                </div>
              ) : (
                user.nickname && (
                  <p className="text-xs text-muted-foreground">
                    "{user.nickname}"
                  </p>
                )
              )}

              {/* Status Badges */}
              <div className="flex items-center gap-1 mt-1 flex-wrap">
                {user.socialStatus && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    <Heart className="h-3 w-3 mr-1" />
                    {socialStatus(user.socialStatus)}
                  </Badge>
                )}
                {user.professionalStatus && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                    {professionalStatus(user.professionalStatus)}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {(user.bio || user.bioAr) && (
            <div>
              <p className={cn('text-sm text-muted-foreground', isRTL && 'font-arabic')}>
                {isRTL ? user.bioAr : user.bio}
              </p>
            </div>
          )}

          {/* Location & Last Seen */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {user.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {user.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {user.isOnline
                ? (isRTL ? 'متصل الآن' : 'Online now')
                : user.lastSeen
                  ? (isRTL ? 'آخر ظهور' : 'Last seen') + ' ' + new Date(user.lastSeen).toLocaleDateString()
                  : (isRTL ? 'غير متصل' : 'Offline')
              }
            </span>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-2">
            {!isOwnProfile && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={handleStartChat}
                >
                  <MessageCircle className="h-4 w-4" />
                  {isRTL ? 'بدء محادثة' : 'Start Chat'}
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Phone className="h-4 w-4" />
                    {isRTL ? 'اتصال' : 'Call'}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Video className="h-4 w-4" />
                    {isRTL ? 'فيديو' : 'Video'}
                  </Button>
                </div>
              </>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={handleViewProfile}
            >
              <User className="h-4 w-4" />
              {isRTL ? 'عرض الملف الشخصي' : 'View Profile'}
            </Button>

            {!isOwnProfile && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={handleMuteToggle}
                >
                  <VolumeX className="h-4 w-4" />
                  {isRTL ? 'كتم الإشعارات' : 'Mute Notifications'}
                </Button>

                <Button
                  variant={isBlockedUser ? "default" : "destructive"}
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={handleBlockToggle}
                >
                  <Ban className="h-4 w-4" />
                  {isBlockedUser
                    ? (isRTL ? 'إلغاء الحظر' : 'Unblock')
                    : (isRTL ? 'حظر' : 'Block')
                  }
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                  onClick={handleReport}
                >
                  <Flag className="h-4 w-4" />
                  {isRTL ? 'إبلاغ' : 'Report'}
                </Button>
              </>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}