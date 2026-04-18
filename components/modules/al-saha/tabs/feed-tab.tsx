'use client'

import * as React from 'react'
import { Plus, Camera, Video, Wifi, WifiOff, AlertCircle, Database } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PostCard } from '../post-card'
import { CreatePostSheet } from '../create-post-sheet'
import { useFeedStore } from '@/lib/stores/feed-store'
import { useUserStore } from '@/lib/stores/user-store'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'

export function FeedTab() {
  const { posts, isLoading, subscribeToFirestorePosts, firebaseStatus, firebaseError } = useFeedStore()
  const { currentUser } = useUserStore()
  const { isRTL } = useLanguage()
  const [showCreatePost, setShowCreatePost] = React.useState(false)

  // Subscribe to Firestore posts on mount
  React.useEffect(() => {
    const unsubscribe = subscribeToFirestorePosts()
    return () => unsubscribe()
  }, [subscribeToFirestorePosts])
  
  // Connection status display
  const getStatusConfig = () => {
    switch (firebaseStatus) {
      case 'connected':
        return { 
          icon: Wifi, 
          text: isRTL ? 'متصل بالخادم' : 'Connected', 
          color: 'text-green-600 bg-green-100 dark:bg-green-900/30' 
        }
      case 'connecting':
        return { 
          icon: Database, 
          text: isRTL ? 'جاري الاتصال...' : 'Connecting...', 
          color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' 
        }
      case 'error':
        return { 
          icon: AlertCircle, 
          text: isRTL ? 'خطأ في الاتصال' : 'Connection Error', 
          color: 'text-red-600 bg-red-100 dark:bg-red-900/30' 
        }
      case 'unconfigured':
      default:
        return { 
          icon: WifiOff, 
          text: isRTL ? 'وضع تجريبي' : 'Demo Mode', 
          color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' 
        }
    }
  }
  
  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="pb-4">
          {/* Firebase Connection Status - Dev indicator */}
          {process.env.NODE_ENV === 'development' && (
            <div className={cn(
              'flex items-center justify-center gap-2 py-1.5 text-xs font-medium',
              statusConfig.color
            )}>
              <StatusIcon className="h-3.5 w-3.5" />
              <span className={cn(isRTL && 'font-arabic')}>{statusConfig.text}</span>
            </div>
          )}
          
          {/* Firebase Error Alert */}
          {firebaseStatus === 'error' && firebaseError && (
            <Alert variant="destructive" className="mx-4 mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className={cn(isRTL && 'font-arabic')}>
                {isRTL ? 'خطأ في الاتصال' : 'Connection Error'}
              </AlertTitle>
              <AlertDescription className="text-xs">
                {firebaseError}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Demo Mode Notice */}
          {firebaseStatus === 'unconfigured' && (
            <div className="mx-4 mt-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className={cn('text-sm text-blue-700 dark:text-blue-300', isRTL && 'font-arabic text-end')}>
                {isRTL 
                  ? 'تعمل في وضع تجريبي - قم بتكوين Firebase لتمكين المنشورات في الوقت الفعلي'
                  : 'Running in demo mode - configure Firebase for real-time posts'}
              </p>
            </div>
          )}
          
          {/* Create Post Prompt */}
          <div className="p-4 border-b border-[#2D5A27]/10 bg-white dark:bg-card">
            <button
              onClick={() => setShowCreatePost(true)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#F5F5DC] dark:bg-secondary/50 hover:bg-[#eaeacc] dark:hover:bg-secondary transition-colors"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                <AvatarFallback className="bg-[#2D5A27]/10 text-[#2D5A27]">
                  {currentUser?.nameAr?.[0] || 'ز'}
                </AvatarFallback>
              </Avatar>
              <span className="flex-1 text-start text-muted-foreground font-arabic">
                شنو الجديد يا زول؟
              </span>
              <div className="h-9 w-9 flex items-center justify-center rounded-full bg-[#2D5A27]/10 text-[#2D5A27]">
                <Plus className="h-5 w-5" />
              </div>
            </button>
          </div>

          {/* Stories Row - Dark Olive Theme with Gold Accents */}
          <div className="px-4 py-3 border-b border-[#2D5A27]/20 overflow-x-auto overflow-y-hidden w-full max-w-full scrollbar-hide bg-[#1a3a18] dark:bg-[#0f1f0e]">
            <div className="flex gap-4 w-max">
              {/* Add Story */}
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className="relative p-0.5 rounded-full border-2 border-dashed border-[#C9A227]/60 hover:border-[#C9A227] transition-colors">
                  <Avatar className="h-16 w-16 bg-[#1a3a18] dark:bg-[#0f1f0e]">
                    <AvatarImage src={currentUser?.avatar} />
                    <AvatarFallback className="bg-[#2D5A27]/30 text-[#C9A227]">
                      <Plus className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <span className="text-xs font-arabic text-[#F5F0E1]/80">إضافة</span>
              </div>
              
              {/* Story placeholders - with new/viewed states */}
              {[
                { name: 'فاطمة', hasNew: true },
                { name: 'عمر', hasNew: true },
                { name: 'أميرة', hasNew: false },
                { name: 'خالد', hasNew: true },
                { name: 'سارة', hasNew: false },
              ].map((story, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
                  {/* Story ring - Gold for new, muted for viewed */}
                  <div className={cn(
                    'p-0.5 rounded-full transition-all duration-200',
                    story.hasNew 
                      ? 'bg-gradient-to-br from-[#C9A227] via-[#D4AF37] to-[#A67C00] group-hover:shadow-[0_0_8px_rgba(201,162,39,0.4)]'
                      : 'bg-[#4a6741]/50 group-hover:bg-[#4a6741]/70'
                  )}>
                    <Avatar className="h-16 w-16 border-2 border-[#1a3a18] dark:border-[#0f1f0e]">
                      <AvatarFallback className={cn(
                        'font-arabic text-lg',
                        story.hasNew 
                          ? 'bg-[#2D5A27]/40 text-[#F5F0E1]'
                          : 'bg-[#2D5A27]/20 text-[#F5F0E1]/60'
                      )}>
                        {story.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <span className={cn(
                    'text-xs font-arabic transition-colors',
                    story.hasNew 
                      ? 'text-[#F5F0E1]'
                      : 'text-[#F5F0E1]/50'
                  )}>
                    {story.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Posts Feed */}
          <div className="divide-y divide-[#2D5A27]/10">
            {posts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-card">
                <PostCard post={post} />
              </div>
            ))}
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="jabana-loader w-12 h-12">
                <svg viewBox="0 0 64 64" className="w-full h-full">
                  <ellipse cx="32" cy="48" rx="20" ry="12" fill="currentColor" className="text-[#2D5A27]" />
                  <path d="M12 48 Q8 32 18 26 L46 26 Q56 32 52 48" fill="currentColor" className="text-[#2D5A27]" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Create Post Sheet */}
      <CreatePostSheet open={showCreatePost} onOpenChange={setShowCreatePost} />
    </div>
  )
}
