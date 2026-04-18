'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Settings, 
  Grid3X3, 
  Heart, 
  Bookmark, 
  Share2,
  Camera,
  MapPin,
  Calendar,
  Link2,
  Edit3,
  Award,
  ShieldCheck,
  MoreHorizontal,
  ImagePlus,
  Gift,
  Star,
  MessageCircle,
  Eye,
  EyeOff,
  Briefcase,
  GraduationCap,
  Sparkles,
  Crown,
  Sword,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AvatarWithCrown } from '@/components/ui/avatar-with-crown'
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useUserStore, type SocialStatus, type ProfessionalStatus, type ReceivedGift, type UserRank, type Gender, type User } from '@/lib/stores/user-store'
import { useAppStore } from '@/lib/stores/app-store'
import { useChatStore } from '@/lib/stores/chat-store'
import { useLanguage } from '@/components/providers/language-provider'
import { useGender } from '@/hooks/use-gender'
import { SOCIAL_STATUS_LABELS, PROFESSIONAL_STATUS_LABELS, RANK_LABELS } from '@/lib/gender-utils'
import { RAKOBA_GIFTS } from '@/lib/rakoba-gifts'
import { cn } from '@/lib/utils'

// Professional Status Icons (labels come from gender-utils)
const professionalStatusIcons: Record<ProfessionalStatus, React.ElementType> = {
  student: GraduationCap,
  employee: Briefcase,
  freelancer: Sparkles,
  unemployed: Star,
}

// Rank configurations with animation styles (titles come from gender-utils based on user gender)
const rankConfig: Record<UserRank, { gradient: string; animation: string; glowColor: string }> = {
  lion: {
    gradient: 'from-yellow-400 via-amber-500 to-yellow-600',
    animation: 'animate-spin-slow',
    glowColor: 'shadow-amber-500/50',
  },
  knight: {
    gradient: 'from-[#2D5A27] via-emerald-500 to-[#2D5A27]',
    animation: 'animate-pulse',
    glowColor: 'shadow-emerald-500/50',
  },
  advisor: {
    gradient: 'from-blue-400 via-indigo-500 to-blue-600',
    animation: '',
    glowColor: 'shadow-blue-500/50',
  },
  newbie: {
    gradient: 'from-gray-300 via-gray-400 to-gray-500',
    animation: '',
    glowColor: '',
  },
}

// Gallery item type
interface GalleryItem {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnail: string
  likes: number
}

// Mock gallery data
const mockGallery: GalleryItem[] = [
  { id: '1', type: 'image', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200', likes: 234 },
  { id: '2', type: 'image', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400', thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200', likes: 567 },
  { id: '3', type: 'image', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400', thumbnail: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200', likes: 123 },
  { id: '4', type: 'image', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400', thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200', likes: 890 },
  { id: '5', type: 'image', url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400', thumbnail: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=200', likes: 456 },
  { id: '6', type: 'image', url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400', thumbnail: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=200', likes: 678 },
]

// Animated Avatar Frame Component
function AnimatedAvatarFrame({ 
  rank, 
  children 
}: { 
  rank: 'lion' | 'knight' | 'advisor' | 'newbie'
  children: React.ReactNode 
}) {
  const config = rankConfig[rank]
  
  if (rank === 'newbie') {
    return <div className="relative">{children}</div>
  }

  return (
    <div className="relative">
      {/* Animated rotating gradient border */}
      <motion.div
        className={cn(
          'absolute -inset-2 rounded-full bg-gradient-to-r',
          config.gradient,
          'opacity-75 blur-sm',
          config.glowColor,
          'shadow-lg'
        )}
        animate={rank === 'lion' ? { rotate: 360 } : { scale: [1, 1.05, 1] }}
        transition={
          rank === 'lion' 
            ? { duration: 8, repeat: Infinity, ease: 'linear' }
            : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        }
      />
      <motion.div
        className={cn(
          'absolute -inset-1.5 rounded-full bg-gradient-to-r',
          config.gradient
        )}
        animate={rank === 'lion' ? { rotate: -360 } : {}}
        transition={
          rank === 'lion'
            ? { duration: 6, repeat: Infinity, ease: 'linear' }
            : {}
        }
      />
      <div className="relative bg-background rounded-full p-1">
        {children}
      </div>
    </div>
  )
}

// Gift Card Component
function GiftCard({ 
  gift, 
  isRTL 
}: { 
  gift: ReceivedGift
  isRTL: boolean 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-1 p-3 rounded-xl bg-secondary/50 min-w-[80px]"
    >
      <span className="text-2xl">{gift.giftEmoji}</span>
      <span className="text-xs font-arabic text-center">
        {isRTL ? gift.giftNameAr : gift.giftName}
      </span>
      <span className="text-[10px] text-muted-foreground font-arabic">
        {gift.isPrivate ? (
          <span className="flex items-center gap-1">
            <EyeOff className="h-3 w-3" />
            {isRTL ? 'فاعل خير' : 'Anonymous'}
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {isRTL ? gift.senderNameAr : gift.senderName}
          </span>
        )}
      </span>
    </motion.div>
  )
}

// Featured Post Card Component
function FeaturedPostCard({ 
  post, 
  onClick 
}: { 
  post: { id: string; thumbnail: string; likes: number; comments: number }
  onClick: () => void
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="relative aspect-square w-32 rounded-xl overflow-hidden flex-shrink-0"
      onClick={onClick}
    >
      <Image
        src={post.thumbnail}
        alt="Featured post"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-2 start-2 end-2 flex items-center justify-between text-white text-xs">
        <span className="flex items-center gap-1">
          <Heart className="h-3 w-3 fill-white" />
          {post.likes}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle className="h-3 w-3" />
          {post.comments}
        </span>
      </div>
    </motion.button>
  )
}

export default function ZoolProfile() {
  const { isRTL, t } = useLanguage()
  const { currentUser, followingIds, updateProfile, viewedUser, setViewedUser, loadUserProfile } = useUserStore()
  const { setSettingsOpen, triggerGift, viewingUserId, setViewingUserId, setActiveTab: setAppActiveTab } = useAppStore()
  const { chats, setActiveChatId } = useChatStore()
  const { socialStatus, professionalStatus, rank } = useGender()
  const [activeTab, setActiveTab] = React.useState('posts')
  const [selectedImage, setSelectedImage] = React.useState<GalleryItem | null>(null)
  const [giftsLoaded, setGiftsLoaded] = React.useState(false)
  const [highlightsLoaded, setHighlightsLoaded] = React.useState(false)
  
  // Determine which user to display
  const isViewingOtherUser = viewingUserId && viewingUserId !== currentUser?.id
  const displayUser = isViewingOtherUser ? viewedUser : currentUser
  const isOwnProfile = !isViewingOtherUser
  
  // Load user profile when viewing another user
  React.useEffect(() => {
    if (isViewingOtherUser && viewingUserId) {
      loadUserProfile(viewingUserId)
    }
  }, [viewingUserId, isViewingOtherUser, loadUserProfile])
  
  // Clean up when leaving profile
  React.useEffect(() => {
    return () => {
      if (isViewingOtherUser) {
        setViewedUser(null)
        setViewingUserId(null)
      }
    }
  }, [isViewingOtherUser, setViewedUser, setViewingUserId])
  
  // Start chat with viewed user
  const handleStartChat = () => {
    if (viewingUserId) {
      // Find existing chat or create new one
      const existingChat = chats.find(c => 
        c.type === 'private' && c.participants?.some(p => p.id === viewingUserId)
      )
      if (existingChat) {
        setActiveChatId(existingChat.id)
      } else {
        setActiveChatId(`chat-${viewingUserId}`)
      }
      setAppActiveTab('wansa')
      setViewingUserId(null)
    }
  }
  
  // Go back to previous view
  const handleGoBack = () => {
    setViewedUser(null)
    setViewingUserId(null)
    setAppActiveTab('wansa')
  }
  
  // Lazy load gifts and highlights
  React.useEffect(() => {
    const giftsTimer = setTimeout(() => setGiftsLoaded(true), 300)
    const highlightsTimer = setTimeout(() => setHighlightsLoaded(true), 500)
    return () => {
      clearTimeout(giftsTimer)
      clearTimeout(highlightsTimer)
    }
  }, [])

  const stats = [
    { label: isRTL ? 'المنشورات' : 'Posts', value: mockGallery.length },
    { label: isRTL ? 'المتابعين' : 'Followers', value: displayUser?.followers ?? 1234 },
    { label: isRTL ? 'يتابع' : 'Following', value: displayUser?.following ?? followingIds.length },
    { label: isRTL ? 'نقاط زول' : 'Zool Points', value: displayUser?.zoolPoints ?? 2500 },
  ]
  
  const BackIcon = isRTL ? ArrowRight : ArrowLeft

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const userRank = displayUser?.rank || 'newbie'
  const rankInfo = rankConfig[userRank]

  // Lightbox for images
  if (selectedImage) {
    return (
      <div 
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        onClick={() => setSelectedImage(null)}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 end-4 text-white hover:bg-white/20"
          onClick={() => setSelectedImage(null)}
        >
          <MoreHorizontal className="h-6 w-6 rotate-90" />
        </Button>
        <Image
          src={selectedImage.url}
          alt="Gallery image"
          width={600}
          height={600}
          className="max-w-full max-h-full object-contain"
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white">
          <Button variant="ghost" className="text-white hover:bg-white/20 gap-2">
            <Heart className="h-5 w-5" />
            {formatNumber(selectedImage.likes)}
          </Button>
          <Button variant="ghost" className="text-white hover:bg-white/20">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full bg-background w-full max-w-full overflow-x-hidden">
        <ScrollArea className="flex-1">
          {/* Cover Photo */}
          <div className="relative h-40 bg-gradient-to-br from-[#2D5A27] via-[#2D5A27]/80 to-emerald-700">
            {displayUser?.coverPhoto && (
              <Image
                src={displayUser.coverPhoto}
                alt="Cover"
                fill
                className="object-cover"
              />
            )}
            
            {/* Back Button (when viewing other user) */}
            {!isOwnProfile && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 bg-background/30 backdrop-blur-sm hover:bg-background/50 start-3"
                onClick={handleGoBack}
              >
                <BackIcon className="h-5 w-5 text-white" />
              </Button>
            )}
            
            {/* Settings Button (own profile only) */}
            {isOwnProfile && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 bg-background/30 backdrop-blur-sm hover:bg-background/50 end-3"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="h-5 w-5 text-white" />
              </Button>
            )}

            {/* Edit Cover Button (own profile only) */}
            {isOwnProfile && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute bottom-3 bg-background/30 backdrop-blur-sm hover:bg-background/50 text-white gap-1.5 end-3"
              >
                <Camera className="h-4 w-4" />
                <span className="text-xs">{isRTL ? 'تغيير' : 'Edit'}</span>
              </Button>
            )}
          </div>

          {/* Profile Header */}
          <div className="relative px-4 pb-4">
            {/* Animated Avatar with Rank Frame */}
            <div className="relative -mt-16 mb-4 flex justify-center">
              <AnimatedAvatarFrame rank={userRank}>
                <AvatarWithCrown
                  src={displayUser?.avatar || ''}
                  alt={displayUser?.name || (isRTL ? 'مستخدم راكوبتنا' : 'Rakobatna User')}
                  fallback={displayUser?.nickname?.[0] || displayUser?.nameAr?.[0] || 'ز'}
                  royalRank={displayUser?.royalRank}
                  size="xl"
                  className="border-4 border-background shadow-lg"
                />
              </AnimatedAvatarFrame>

              {displayUser?.royalRank && (
                <div className="absolute top-0 end-0 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/95 shadow-lg p-2 ring-2 ring-yellow-300">
                  <div className="flex items-center gap-1 text-sm font-bold text-[#2D5A27]">
                    {displayUser.royalRank === 'king-crown' && <Crown className="h-4 w-4 text-yellow-500" />}
                    {displayUser.royalRank === 'queen-crown' && <Crown className="h-4 w-4 text-pink-500" />}
                    {displayUser.royalRank === 'knight-royal' && <Sword className="h-4 w-4 text-slate-700" />}
                    <span className="font-arabic text-[11px] leading-none">
                      {displayUser.royalRank === 'king-crown'
                        ? (isRTL ? 'الملك' : 'King')
                        : displayUser.royalRank === 'queen-crown'
                        ? (isRTL ? 'الملكة' : 'Queen')
                        : (isRTL ? 'الفارس الملكي' : 'Royal Knight')
                      }
                    </span>
                  </div>
                </div>
              )}
              
              {/* Rank Badge */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      'absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r',
                      rankInfo.gradient
                    )}
                  >
                    {userRank === 'lion' && <Crown className="h-3 w-3 inline me-1" />}
                    {userRank === 'knight' && <Sword className="h-3 w-3 inline me-1" />}
                    <span className="font-arabic">{rank(userRank)}</span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-arabic">{isRTL ? 'رتبتك بناءً على نشاطك' : 'Your rank based on activity'}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Nickname (اللقب) - Prominent Display */}
            <div className="text-center space-y-1">
              {displayUser?.nickname && (
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold font-arabic text-[#2D5A27]"
                >
                  {displayUser.nickname}
                </motion.h1>
              )}
              
              <div className="flex items-center justify-center gap-2">
                <p className={cn('text-base font-medium', isRTL && 'font-arabic')}>
                  {isRTL ? displayUser?.nameAr : displayUser?.name || (isRTL ? 'مستخدم راكوبتنا' : 'Rakobatna User')}
                </p>
                {displayUser?.isVerified && (
                  <ShieldCheck className="h-4 w-4 text-[#2D5A27]" />
                )}
              </div>

              <p className="text-muted-foreground text-sm">@{displayUser?.username || 'rakobatna_user'}</p>
            </div>

            {/* Status Badges Row */}
            <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
              {/* Social Status - Dropdown for own profile, Badge for others */}
              {isOwnProfile ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1.5 font-arabic text-xs h-7">
                      <Heart className="h-3 w-3 text-pink-500" />
                      {displayUser?.socialStatus 
                        ? socialStatus(displayUser.socialStatus)
                        : (isRTL ? 'الحالة' : 'Status')
                      }
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="font-arabic">
                    {(Object.keys(SOCIAL_STATUS_LABELS) as SocialStatus[]).map((key) => (
                      <DropdownMenuItem
                        key={key}
                        onClick={() => updateProfile({ socialStatus: key })}
                        className={displayUser?.socialStatus === key ? 'bg-primary/10' : ''}
                      >
                        {socialStatus(key)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : displayUser?.socialStatus && (
                <Badge variant="secondary" className="gap-1.5 font-arabic text-xs">
                  <Heart className="h-3 w-3 text-pink-500" />
                  {socialStatus(displayUser.socialStatus)}
                </Badge>
              )}

              {/* Professional Status - Dropdown for own profile, Badge for others */}
              {isOwnProfile ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1.5 font-arabic text-xs h-7">
                      {displayUser?.professionalStatus && (
                        React.createElement(professionalStatusIcons[displayUser.professionalStatus], {
                          className: 'h-3 w-3 text-[#2D5A27]'
                        })
                      )}
                      {displayUser?.professionalStatus 
                        ? professionalStatus(displayUser.professionalStatus)
                        : (isRTL ? 'المهنة' : 'Work')
                      }
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="font-arabic">
                    {(Object.keys(PROFESSIONAL_STATUS_LABELS) as ProfessionalStatus[]).map((key) => {
                      const Icon = professionalStatusIcons[key]
                      return (
                        <DropdownMenuItem
                          key={key}
                          onClick={() => updateProfile({ professionalStatus: key })}
                          className={displayUser?.professionalStatus === key ? 'bg-primary/10' : ''}
                        >
                          <Icon className="h-4 w-4 me-2" />
                          {professionalStatus(key)}
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : displayUser?.professionalStatus && (
                <Badge variant="secondary" className="gap-1.5 font-arabic text-xs">
                  {React.createElement(professionalStatusIcons[displayUser.professionalStatus], {
                    className: 'h-3 w-3 text-[#2D5A27]'
                  })}
                  {professionalStatus(displayUser.professionalStatus)}
                </Badge>
              )}
            </div>

            {/* Bio */}
            {displayUser?.bio && (
              <p className={cn(
                'text-sm max-w-xs mx-auto text-center mt-3',
                isRTL && 'font-arabic'
              )}>
                {isRTL ? displayUser.bioAr : displayUser.bio}
              </p>
            )}

            {/* Location & Joined */}
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-2">
              {displayUser?.location && (
                <span className="flex items-center gap-1 font-arabic">
                  <MapPin className="h-3 w-3" />
                  {displayUser.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {isRTL ? 'انضم في 2024' : 'Joined 2024'}
              </span>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-2 mt-4 p-3 rounded-xl bg-secondary/50">
              {stats.map((stat, idx) => (
                <button
                  key={idx}
                  className="flex flex-col items-center gap-0.5 hover:bg-secondary rounded-lg p-2 transition-colors"
                >
                  <span className="text-lg font-bold text-[#2D5A27]">
                    {formatNumber(stat.value)}
                  </span>
                  <span className={cn('text-[10px] text-muted-foreground', isRTL && 'font-arabic')}>
                    {stat.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              {isOwnProfile ? (
                <>
                  <Button 
                    className="flex-1 gap-2" 
                    variant="outline"
                    onClick={() => setSettingsOpen(true)}
                  >
                    <Edit3 className="h-4 w-4" />
                    <span className="font-arabic">{isRTL ? 'تعديل الملف' : 'Edit Profile'}</span>
                  </Button>
                  <Button 
                    className="flex-1 gap-2 bg-[#2D5A27] hover:bg-[#2D5A27]/90 text-white"
                    onClick={() => triggerGift('jabana', displayUser?.name || 'User')}
                  >
                    <Gift className="h-4 w-4" />
                    <span className="font-arabic">{isRTL ? 'إرسال هدية' : 'Send Gift'}</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    className="flex-1 gap-2" 
                    variant="outline"
                    onClick={handleStartChat}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="font-arabic">{isRTL ? 'مراسلة' : 'Message'}</span>
                  </Button>
                  <Button 
                    className="flex-1 gap-2 bg-[#2D5A27] hover:bg-[#2D5A27]/90 text-white"
                    onClick={() => triggerGift('jabana', displayUser?.name || 'User')}
                  >
                    <Gift className="h-4 w-4" />
                    <span className="font-arabic">{isRTL ? 'إرسال هدية' : 'Send Gift'}</span>
                  </Button>
                </>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
                  <DropdownMenuItem className={cn(isRTL && 'font-arabic')}>
                    <Share2 className="h-4 w-4 me-2" />
                    {isRTL ? 'مشاركة الملف' : 'Share Profile'}
                  </DropdownMenuItem>
                  <DropdownMenuItem className={cn(isRTL && 'font-arabic')}>
                    <Link2 className="h-4 w-4 me-2" />
                    {isRTL ? 'نسخ الرابط' : 'Copy Link'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Al-Saha Museum (Highlights) Section */}
          {highlightsLoaded && displayUser?.featuredPosts && displayUser.featuredPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-4 border-t"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold font-arabic text-[#2D5A27]">
                  {isRTL ? 'متحف الساحة' : 'Al-Saha Museum'}
                </h3>
                <Star className="h-4 w-4 text-[#2D5A27]" />
              </div>
              <ScrollArea className="w-full">
                <div className="flex gap-3 pb-2">
                  {displayUser.featuredPosts.map((post) => (
                    <FeaturedPostCard
                      key={post.id}
                      post={post}
                      onClick={() => setSelectedImage({
                        id: post.id,
                        type: 'image',
                        url: post.thumbnail,
                        thumbnail: post.thumbnail,
                        likes: post.likes,
                      })}
                    />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </motion.div>
          )}

          {/* Gift Showcase (Karam System) Section */}
          {giftsLoaded && (displayUser?.gifts?.length || displayUser?.ownedGifts?.length) ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-4 border-t"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold font-arabic text-[#2D5A27]">
                  {isRTL ? 'هدايا الكرم' : 'Gift Showcase'}
                </h3>
                <Gift className="h-4 w-4 text-[#2D5A27]" />
              </div>

              {displayUser?.gifts && displayUser.gifts.length > 0 && (
                <div className="mb-4">
                  <p className={cn('text-xs font-medium text-muted-foreground mb-2', isRTL && 'font-arabic')}>
                    {isRTL ? 'الهدايا المستلمة' : 'Received Gifts'}
                  </p>
                  <ScrollArea className="w-full">
                    <div className="flex gap-3 pb-2">
                      {displayUser.gifts.map((gift) => (
                        <GiftCard key={`received-${gift.id}`} gift={gift} isRTL={isRTL} />
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              )}

              {displayUser?.ownedGifts && displayUser.ownedGifts.length > 0 && (
                <div>
                  <p className={cn('text-xs font-medium text-muted-foreground mb-2', isRTL && 'font-arabic')}>
                    {isRTL ? 'الهدايا المملوكة' : 'Owned Treasures'}
                  </p>
                  <ScrollArea className="w-full">
                    <div className="flex gap-3 pb-2">
                      {displayUser.ownedGifts.map((gift) => (
                        <GiftCard key={`owned-${gift.id}`} gift={gift} isRTL={isRTL} />
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              )}
            </motion.div>
          ) : null}

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 border-t">
            <TabsList className="w-full justify-around rounded-none border-b bg-transparent h-12">
              <TabsTrigger 
                value="posts" 
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#2D5A27] data-[state=active]:bg-transparent"
              >
                <Grid3X3 className="h-5 w-5" />
              </TabsTrigger>
              <TabsTrigger 
                value="collection" 
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#2D5A27] data-[state=active]:bg-transparent"
              >
                <Award className="h-5 w-5" />
              </TabsTrigger>
              <TabsTrigger 
                value="likes" 
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#2D5A27] data-[state=active]:bg-transparent"
              >
                <Heart className="h-5 w-5" />
              </TabsTrigger>
              <TabsTrigger 
                value="saved" 
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#2D5A27] data-[state=active]:bg-transparent"
              >
                <Bookmark className="h-5 w-5" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-0">
              {mockGallery.length > 0 ? (
                <div className="grid grid-cols-3 gap-0.5">
                  {mockGallery.map((item) => (
                    <button
                      key={item.id}
                      className="relative aspect-square bg-secondary overflow-hidden hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(item)}
                    >
                      <Image
                        src={item.thumbnail}
                        alt="Gallery item"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                        <div className="flex items-center gap-1 text-white text-sm font-medium">
                          <Heart className="h-4 w-4 fill-white" />
                          {formatNumber(item.likes)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon={ImagePlus}
                  title={isRTL ? 'لا توجد منشورات' : 'No Posts Yet'}
                  description={isRTL ? 'شارك أول صورة لك!' : 'Share your first photo!'}
                />
              )}
            </TabsContent>

            <TabsContent value="collection" className="mt-0">
              <div className="p-4 space-y-6">
                {/* Collection Header */}
                <div className="text-center">
                  <h2 className={cn('text-xl font-bold text-[#2D5A27] mb-2', isRTL && 'font-arabic')}>
                    {isRTL ? 'المعرض' : 'Collection'}
                  </h2>
                  <p className={cn('text-sm text-muted-foreground', isRTL && 'font-arabic')}>
                    {isRTL ? 'مجموعة الهدايا والشارات المكتسبة' : 'Your collection of earned gifts and badges'}
                  </p>
                </div>

                {/* Heritage Collection */}
                <div>
                  <h3 className={cn('font-semibold text-[#2D5A27] mb-3 flex items-center gap-2', isRTL && 'font-arabic')}>
                    <span className="text-amber-600">🏺</span>
                    {isRTL ? 'التراث السوداني' : 'Sudanese Heritage'}
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {RAKOBA_GIFTS.heritage.map((gift) => {
                      const isOwned = displayUser?.ownedGifts?.some(owned => owned.giftId === gift.id)
                      return (
                        <motion.div
                          key={gift.id}
                          whileHover={{ scale: 1.05 }}
                          className={cn(
                            'relative p-4 rounded-xl border-2 text-center transition-all',
                            isOwned 
                              ? 'border-[#2D5A27] bg-[#2D5A27]/10 shadow-lg' 
                              : 'border-muted bg-muted/30 opacity-50'
                          )}
                        >
                          <div className="text-3xl mb-2">{gift.emoji}</div>
                          <div className={cn('text-sm font-medium', isRTL && 'font-arabic')}>
                            {isRTL ? gift.nameAr : gift.name}
                          </div>
                          {isOwned && (
                            <div className="absolute -top-1 -end-1 w-6 h-6 bg-[#2D5A27] rounded-full flex items-center justify-center">
                              <ShieldCheck className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                {/* Flowers Collection */}
                <div>
                  <h3 className={cn('font-semibold text-[#2D5A27] mb-3 flex items-center gap-2', isRTL && 'font-arabic')}>
                    <span className="text-pink-500">🌸</span>
                    {isRTL ? 'الزهور' : 'Flowers'}
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {RAKOBA_GIFTS.flowers.map((gift) => {
                      const isOwned = displayUser?.ownedGifts?.some(owned => owned.giftId === gift.id)
                      return (
                        <motion.div
                          key={gift.id}
                          whileHover={{ scale: 1.05 }}
                          className={cn(
                            'relative p-4 rounded-xl border-2 text-center transition-all',
                            isOwned 
                              ? 'border-pink-500 bg-pink-50 shadow-lg' 
                              : 'border-muted bg-muted/30 opacity-50'
                          )}
                        >
                          <div className="text-3xl mb-2">{gift.emoji}</div>
                          <div className={cn('text-sm font-medium', isRTL && 'font-arabic')}>
                            {isRTL ? gift.nameAr : gift.name}
                          </div>
                          {isOwned && (
                            <div className="absolute -top-1 -end-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                              <ShieldCheck className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                {/* Luxury Collection */}
                <div>
                  <h3 className={cn('font-semibold text-[#2D5A27] mb-3 flex items-center gap-2', isRTL && 'font-arabic')}>
                    <span className="text-purple-600">💎</span>
                    {isRTL ? 'الفخامة' : 'Luxury'}
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {RAKOBA_GIFTS.luxury.map((gift) => {
                      const isOwned = displayUser?.ownedGifts?.some(owned => owned.giftId === gift.id)
                      return (
                        <motion.div
                          key={gift.id}
                          whileHover={{ scale: 1.05 }}
                          className={cn(
                            'relative p-4 rounded-xl border-2 text-center transition-all',
                            isOwned 
                              ? 'border-purple-500 bg-purple-50 shadow-lg' 
                              : 'border-muted bg-muted/30 opacity-50'
                          )}
                        >
                          <div className="text-3xl mb-2">{gift.emoji}</div>
                          <div className={cn('text-sm font-medium', isRTL && 'font-arabic')}>
                            {isRTL ? gift.nameAr : gift.name}
                          </div>
                          {isOwned && (
                            <div className="absolute -top-1 -end-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                              <ShieldCheck className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                {/* Received Gifts Showcase */}
                {displayUser?.gifts && displayUser.gifts.length > 0 && (
                  <div>
                    <h3 className={cn('font-semibold text-[#2D5A27] mb-3 flex items-center gap-2', isRTL && 'font-arabic')}>
                      <Gift className="h-5 w-5" />
                      {isRTL ? 'الهدايا المستلمة' : 'Received Gifts'}
                    </h3>
                    <ScrollArea className="w-full">
                      <div className="flex gap-3 pb-2">
                        {displayUser.gifts.map((gift) => (
                          <GiftCard key={`collection-${gift.id}`} gift={gift} isRTL={isRTL} />
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="likes" className="mt-0">
              <EmptyState 
                icon={Heart}
                title={isRTL ? 'لا توجد إعجابات' : 'No Likes Yet'}
                description={isRTL ? 'المنشورات التي أعجبتك ستظهر هنا' : 'Posts you like will appear here'}
              />
            </TabsContent>

            <TabsContent value="saved" className="mt-0">
              <EmptyState 
                icon={Bookmark}
                title={isRTL ? 'لا توجد محفوظات' : 'No Saved Items'}
                description={isRTL ? 'احفظ المنشورات للرجوع إليها لاحقاً' : 'Save posts to view them later'}
              />
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </div>
    </TooltipProvider>
  )
}

// Empty State Component
function EmptyState({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType
  title: string
  description: string 
}) {
  const { isRTL } = useLanguage()
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="p-4 rounded-full bg-secondary mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className={cn('font-semibold text-lg', isRTL && 'font-arabic')}>{title}</h3>
      <p className={cn('text-sm text-muted-foreground mt-1', isRTL && 'font-arabic')}>{description}</p>
    </div>
  )
}
