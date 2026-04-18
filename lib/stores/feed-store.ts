import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore'
import { db, isFirestoreAvailable, getFirebaseConnectionStatus } from '@/lib/firebase/config'

export type ReactionType = 'like' | 'love' | 'kaffu' | 'abshir' | 'haha' | 'sad'

export type PostExpiry = '24h' | '1week' | '1month' | 'permanent'

export interface Post {
  id: string
  authorId: string
  authorName: string
  authorNameAr: string
  authorAvatar: string
  content: string
  contentAr: string
  images: string[]
  videoUrl?: string
  isReel?: boolean
  reactions: Record<ReactionType, number>
  userReaction?: ReactionType
  commentsCount: number
  sharesCount: number
  timestamp: Date
  location?: string
  expiry?: PostExpiry
  expiresAt?: Date
}

export interface TrendingHashtag {
  id: string
  tag: string
  tagAr: string
  zoolsCount: number
  isHot: boolean
  city?: string
}

export interface LocalService {
  id: string
  name: string
  nameAr: string
  category: 'hospital' | 'pharmacy' | 'market'
  address: string
  addressAr: string
  statusUpdates: ServiceStatus[]
  isOpen: boolean
  distance?: string
}

export interface ServiceStatus {
  id: string
  message: string
  messageAr: string
  timestamp: Date
  authorName: string
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  authorName: string
  authorAvatar: string
  content: string
  voiceNoteUrl?: string
  voiceDuration?: number
  timestamp: Date
  likes: number
  replies: Comment[]
}

interface FeedState {
  // Posts
  posts: Post[]
  setPosts: (posts: Post[]) => void
  addPost: (post: Post) => void
  addPostToFirestore: (post: Omit<Post, 'id' | 'timestamp'>) => Promise<void>
  subscribeToFirestorePosts: () => () => void
  
  // Reactions
  reactToPost: (postId: string, reaction: ReactionType) => void
  removeReaction: (postId: string) => void
  
  // Comments
  comments: Record<string, Comment[]>
  addComment: (postId: string, comment: Comment) => void
  addVoiceReply: (postId: string, commentId: string, voiceUrl: string, duration: number) => void
  
  // Reels
  reels: Post[]
  currentReelIndex: number
  setCurrentReelIndex: (index: number) => void
  
  // Trending
  trends: TrendingHashtag[]
  setTrends: (trends: TrendingHashtag[]) => void
  
  // Local Services
  services: LocalService[]
  setServices: (services: LocalService[]) => void
  addServiceStatus: (serviceId: string, status: ServiceStatus) => void
  
  // Loading states
  isLoading: boolean
  setLoading: (loading: boolean) => void
  
  // Firebase connection status
  firebaseStatus: 'unconfigured' | 'connecting' | 'connected' | 'error'
  firebaseError: string | null
}

// Demo posts
const demoPosts: Post[] = [
  {
    id: 'post-1',
    authorId: 'user-2',
    authorName: 'Fatima Ali',
    authorNameAr: 'فاطمة علي',
    authorAvatar: '/avatars/fatima.jpg',
    content: 'Beautiful sunset over the Nile today! Nothing beats Khartoum evenings.',
    contentAr: 'غروب جميل على النيل اليوم! ما في أحلى من ليالي الخرطوم.',
    images: ['/posts/sunset-nile.jpg'],
    reactions: { like: 45, love: 23, kaffu: 12, abshir: 5, haha: 2, sad: 0 },
    userReaction: undefined,
    commentsCount: 8,
    sharesCount: 3,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    location: 'Khartoum, Sudan',
  },
  {
    id: 'post-2',
    authorId: 'user-3',
    authorName: 'Omar Hassan',
    authorNameAr: 'عمر حسن',
    authorAvatar: '/avatars/omar.jpg',
    content: 'Al-Hilal won again! What a match!',
    contentAr: 'الهلال كسب تاني! يا سلام على الماتش!',
    images: ['/posts/hilal-match.jpg', '/posts/hilal-fans.jpg'],
    reactions: { like: 156, love: 89, kaffu: 67, abshir: 34, haha: 12, sad: 5 },
    userReaction: 'kaffu',
    commentsCount: 45,
    sharesCount: 23,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: 'post-3',
    authorId: 'user-4',
    authorName: 'Amira Mohamed',
    authorNameAr: 'أميرة محمد',
    authorAvatar: '/avatars/amira.jpg',
    content: 'Made traditional Kisra today! Family recipe passed down for generations.',
    contentAr: 'عملت كسرة اليوم! وصفة العائلة من زمان.',
    images: ['/posts/kisra.jpg'],
    reactions: { like: 78, love: 45, kaffu: 23, abshir: 0, haha: 0, sad: 0 },
    commentsCount: 12,
    sharesCount: 8,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
]

// Demo trending hashtags
const demoTrends: TrendingHashtag[] = [
  { id: 't1', tag: 'كورة_الهلال', tagAr: 'كورة_الهلال', zoolsCount: 4523, isHot: true, city: 'الخرطوم' },
  { id: 't2', tag: 'الكهرباء_رجعت', tagAr: 'الكهرباء_رجعت', zoolsCount: 3891, isHot: true, city: 'بورتسودان' },
  { id: 't3', tag: 'سعر_الدولار', tagAr: 'سعر_الدولار', zoolsCount: 2456, isHot: false },
  { id: 't4', tag: 'مطر_الخرطوم', tagAr: 'مطر_الخرطوم', zoolsCount: 1892, isHot: true, city: 'الخرطوم' },
  { id: 't5', tag: 'زواج_السنة', tagAr: 'زواج_السنة', zoolsCount: 1567, isHot: false, city: 'كسلا' },
  { id: 't6', tag: 'صباح_الخير_يا_بلد', tagAr: 'صباح_الخير_يا_بلد', zoolsCount: 1234, isHot: false },
  { id: 't7', tag: 'المريخ_الليلة', tagAr: 'المريخ_الليلة', zoolsCount: 987, isHot: true, city: 'الخرطوم' },
  { id: 't8', tag: 'جبنة_الصباح', tagAr: 'جبنة_الصباح', zoolsCount: 756, isHot: false },
]

// Demo local services
const demoServices: LocalService[] = [
  {
    id: 's1',
    name: 'Soba Teaching Hospital',
    nameAr: 'مستشفى سوبا التعليمي',
    category: 'hospital',
    address: 'Soba, Khartoum',
    addressAr: 'سوبا، الخرطوم',
    isOpen: true,
    distance: '2.3 كم',
    statusUpdates: [
      { id: 'st1', message: 'Emergency open 24/7', messageAr: 'الطوارئ مفتوحة ٢٤ ساعة', timestamp: new Date(), authorName: 'أحمد' },
    ],
  },
  {
    id: 's2',
    name: 'Al-Noor Pharmacy',
    nameAr: 'صيدلية النور المناوبة',
    category: 'pharmacy',
    address: 'Bahri, Khartoum',
    addressAr: 'بحري، الخرطوم',
    isOpen: true,
    distance: '1.1 كم',
    statusUpdates: [
      { id: 'st2', message: 'All medicines available', messageAr: 'كل الأدوية متوفرة', timestamp: new Date(), authorName: 'محمد' },
      { id: 'st3', message: 'Crowded now', messageAr: 'الصيدلية مزدحمة حالياً', timestamp: new Date(Date.now() - 1000 * 60 * 30), authorName: 'سارة' },
    ],
  },
  {
    id: 's3',
    name: 'Souq Al-Arabi',
    nameAr: 'سوق العربي',
    category: 'market',
    address: 'Central Khartoum',
    addressAr: 'وسط الخرطوم',
    isOpen: true,
    distance: '3.5 كم',
    statusUpdates: [
      { id: 'st4', message: 'Bread available now', messageAr: 'خبز متوفر الآن', timestamp: new Date(), authorName: 'خالد' },
      { id: 'st5', message: 'Good prices today', messageAr: 'أسعار ممتازة اليوم', timestamp: new Date(Date.now() - 1000 * 60 * 45), authorName: 'فاطمة' },
    ],
  },
  {
    id: 's4',
    name: 'Royal Care Hospital',
    nameAr: 'مستشفى رويال كير',
    category: 'hospital',
    address: 'Riyadh, Khartoum',
    addressAr: 'الرياض، الخرطوم',
    isOpen: true,
    distance: '4.2 كم',
    statusUpdates: [],
  },
  {
    id: 's5',
    name: 'Al-Shifa Pharmacy',
    nameAr: 'صي��لية الشفاء المناوبة',
    category: 'pharmacy',
    address: 'Omdurman',
    addressAr: 'أم درمان',
    isOpen: false,
    distance: '5.8 كم',
    statusUpdates: [
      { id: 'st6', message: 'Opens at 8 AM', messageAr: 'تفتح الساعة ٨ صباحاً', timestamp: new Date(), authorName: 'عمر' },
    ],
  },
  {
    id: 's6',
    name: 'Souq Omdurman',
    nameAr: 'سوق أم درمان',
    category: 'market',
    address: 'Central Omdurman',
    addressAr: 'وسط أم درمان',
    isOpen: true,
    distance: '6.1 كم',
    statusUpdates: [
      { id: 'st7', message: 'Fresh vegetables arrived', messageAr: 'خضار طازة وصلت', timestamp: new Date(), authorName: 'أمينة' },
    ],
  },
]

// Demo reels
const demoReels: Post[] = [
  {
    id: 'reel-1',
    authorId: 'user-5',
    authorName: 'Yousif Ahmed',
    authorNameAr: 'يوسف أحمد',
    authorAvatar: '/avatars/yousif.jpg',
    content: 'Sudanese coffee ritual',
    contentAr: 'طقوس الجبنة السودانية',
    images: [],
    videoUrl: '/reels/coffee-ritual.mp4',
    isReel: true,
    reactions: { like: 234, love: 156, kaffu: 89, abshir: 45, haha: 12, sad: 0 },
    commentsCount: 34,
    sharesCount: 67,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
]

export const useFeedStore = create<FeedState>()(
  persist(
    (set, get) => ({
      posts: demoPosts,
      setPosts: (posts) => set({ posts }),
      addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
      
      // Add post to Firestore
      addPostToFirestore: async (post) => {
        // Check if Firestore is available
        if (!isFirestoreAvailable() || !db) {
          console.warn('[v0] Firestore not available - adding post to local state only')
          // Add to local state with a generated ID
          const localPost: Post = {
            ...post,
            id: `local-${Date.now()}`,
            timestamp: new Date(),
          }
          set((state) => ({ posts: [localPost, ...state.posts] }))
          return
        }
        
        try {
          const postsRef = collection(db, 'posts')
          await addDoc(postsRef, {
            ...post,
            timestamp: serverTimestamp(),
            createdAt: serverTimestamp(),
          })
          console.log('[v0] Post added to Firestore successfully')
        } catch (error) {
          console.error('[v0] Error adding post to Firestore:', error)
          set({ firebaseError: error instanceof Error ? error.message : 'Failed to add post' })
          throw error
        }
      },
      
      // Subscribe to real-time Firestore posts
      subscribeToFirestorePosts: () => {
        // Get current Firebase status
        const { status, error } = getFirebaseConnectionStatus()
        set({ firebaseStatus: status, firebaseError: error })
        
        // If Firestore is not available, just use demo posts
        if (!isFirestoreAvailable() || !db) {
          console.warn('[v0] Firestore not configured - using demo posts only')
          set({ 
            posts: demoPosts, 
            isLoading: false,
            firebaseStatus: 'unconfigured',
            firebaseError: 'Firebase environment variables not configured'
          })
          // Return no-op unsubscribe
          return () => {}
        }
        
        console.log('[v0] Subscribing to Firestore posts...')
        const postsRef = collection(db, 'posts')
        const q = query(postsRef, orderBy('timestamp', 'desc'))
        
        set({ isLoading: true, firebaseStatus: 'connecting' })
        
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            console.log('[v0] Firestore snapshot received:', snapshot.docs.length, 'posts')
            const firestorePosts: Post[] = snapshot.docs.map((doc) => {
              const data = doc.data()
              return {
                id: doc.id,
                authorId: data.authorId || '',
                authorName: data.authorName || '',
                authorNameAr: data.authorNameAr || '',
                authorAvatar: data.authorAvatar || '',
                content: data.content || '',
                contentAr: data.contentAr || data.content || '',
                images: data.images || [],
                videoUrl: data.videoUrl,
                isReel: data.isReel,
                reactions: data.reactions || { like: 0, love: 0, kaffu: 0, abshir: 0, haha: 0, sad: 0 },
                userReaction: data.userReaction,
                commentsCount: data.commentsCount || 0,
                sharesCount: data.sharesCount || 0,
                timestamp: data.timestamp?.toDate?.() || new Date(),
                location: data.location,
                expiry: data.expiry,
                expiresAt: data.expiresAt?.toDate?.(),
              }
            })
            
            // Merge Firestore posts with demo posts, avoiding duplicates
            const existingIds = new Set(firestorePosts.map(p => p.id))
            const mergedPosts = [
              ...firestorePosts,
              ...demoPosts.filter(p => !existingIds.has(p.id)),
            ]
            
            set({ 
              posts: mergedPosts, 
              isLoading: false,
              firebaseStatus: 'connected',
              firebaseError: null
            })
          },
          (error) => {
            console.error('[v0] Error subscribing to Firestore posts:', error)
            set({ 
              isLoading: false,
              firebaseStatus: 'error',
              firebaseError: error instanceof Error ? error.message : 'Connection error'
            })
          }
        )
        
        return unsubscribe
      },
      
      reactToPost: (postId, reaction) =>
        set((state) => ({
          posts: state.posts.map(post => {
            if (post.id !== postId) return post
            const reactions = { ...post.reactions }
            // Remove previous reaction if exists
            if (post.userReaction) {
              reactions[post.userReaction] = Math.max(0, reactions[post.userReaction] - 1)
            }
            // Add new reaction
            reactions[reaction] = (reactions[reaction] || 0) + 1
            return { ...post, reactions, userReaction: reaction }
          }),
        })),
      removeReaction: (postId) =>
        set((state) => ({
          posts: state.posts.map(post => {
            if (post.id !== postId || !post.userReaction) return post
            const reactions = { ...post.reactions }
            reactions[post.userReaction] = Math.max(0, reactions[post.userReaction] - 1)
            return { ...post, reactions, userReaction: undefined }
          }),
        })),
      
      comments: {},
      addComment: (postId, comment) =>
        set((state) => ({
          comments: {
            ...state.comments,
            [postId]: [...(state.comments[postId] || []), comment],
          },
          posts: state.posts.map(post =>
            post.id === postId ? { ...post, commentsCount: post.commentsCount + 1 } : post
          ),
        })),
      addVoiceReply: (postId, commentId, voiceUrl, duration) =>
        set((state) => ({
          comments: {
            ...state.comments,
            [postId]: (state.comments[postId] || []).map(comment =>
              comment.id === commentId
                ? {
                    ...comment,
                    replies: [
                      ...comment.replies,
                      {
                        id: `reply-${Date.now()}`,
                        postId,
                        authorId: 'user-1',
                        authorName: 'Ahmed',
                        authorAvatar: '/avatars/ahmed.jpg',
                        content: '',
                        voiceNoteUrl: voiceUrl,
                        voiceDuration: duration,
                        timestamp: new Date(),
                        likes: 0,
                        replies: [],
                      },
                    ],
                  }
                : comment
            ),
          },
        })),
      
      reels: demoReels,
      currentReelIndex: 0,
      setCurrentReelIndex: (currentReelIndex) => set({ currentReelIndex }),
      
      // Trending
      trends: demoTrends,
      setTrends: (trends) => set({ trends }),
      
      // Local Services
      services: demoServices,
      setServices: (services) => set({ services }),
      addServiceStatus: (serviceId, status) =>
        set((state) => ({
          services: state.services.map(service =>
            service.id === serviceId
              ? { ...service, statusUpdates: [status, ...service.statusUpdates] }
              : service
          ),
        })),
      
      isLoading: false,
      setLoading: (isLoading) => set({ isLoading }),
      
      // Firebase connection status
      firebaseStatus: 'connecting',
      firebaseError: null,
    }),
    {
      name: 'rakobatna-feed-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        posts: state.posts,
        comments: state.comments,
      }),
    }
  )
)
