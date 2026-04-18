import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { doc, setDoc, getDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { db, isFirestoreAvailable } from '@/lib/firebase/config'

export type Gender = 'male' | 'female'
export type SocialStatus = 'single' | 'taken' | 'engaged' | 'married' | 'complicated' | 'gave_up'
export type ProfessionalStatus = 'student' | 'employee' | 'freelancer' | 'unemployed'
export type UserRank = 'lion' | 'knight' | 'advisor' | 'newbie'

export interface User {
  id: string
  username?: string
  name: string
  nameAr: string
  nickname?: string // اللقب - e.g., "هنداوي"
  email: string
  phone: string
  avatar: string
  coverPhoto: string
  bio: string
  bioAr: string
  zoolPoints: number
  followers: number
  following: number
  postsCount: number
  isOnline: boolean
  lastSeen: Date | null
  isVerified?: boolean
  location?: string
  // Gender for Arabic feminization
  gender?: Gender
  // New Sudanese Identity Fields
  socialStatus?: SocialStatus
  professionalStatus?: ProfessionalStatus
  rank?: UserRank
  rankTitle?: string // أسد/لبوة، فارس/فارسة، ناصح/ناصحة، راسطة
  // Royal rank overlays
  royalRank?: 'king-crown' | 'queen-crown' | 'knight-royal'
  // Gifts received and owned
  gifts?: ReceivedGift[]
  ownedGifts?: ReceivedGift[]
  // Featured posts (highlights)
  featuredPosts?: FeaturedPost[]
}

export interface ReceivedGift {
  id: string
  giftType: string
  giftName: string
  giftNameAr: string
  giftEmoji: string
  senderName?: string
  senderNameAr?: string
  category?: 'heritage' | 'badges' | 'luxury' | 'animals' | 'ranks'
  effect?: string
  symbol?: string
  rarity?: string
  isPrivate: boolean // فاعل خير
  receivedAt: Date
}

export interface FeaturedPost {
  id: string
  thumbnail: string
  likes: number
  comments: number
}

export interface BlockedUser {
  id: string
  name: string
  avatar: string
  blockedAt: Date
}

interface UserState {
  // Current user
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  updateProfile: (updates: Partial<User>) => void
  
  // Sync profile to Firestore
  syncProfileToFirestore: () => Promise<void>
  fetchUserProfile: (userId: string) => Promise<User | null>
  
  // Viewed user profile (for viewing other users)
  viewedUser: User | null
  setViewedUser: (user: User | null) => void
  loadUserProfile: (userId: string) => Promise<void>
  
  // Authentication
  isAuthenticated: boolean
  setAuthenticated: (auth: boolean) => void
  
  // Blocked users
  blockedUsers: BlockedUser[]
  blockUser: (user: BlockedUser) => void
  unblockUser: (userId: string) => void
  isBlocked: (userId: string) => boolean
  
  // Zool Points
  addZoolPoints: (points: number) => void
  
  // Gifts
  receiveGift: (gift: ReceivedGift) => void
  addOwnedGift: (gift: ReceivedGift) => void
  hasGift: (giftId: string) => boolean
  
  // Following
  followUser: (userId: string) => void
  unfollowUser: (userId: string) => void
  followingIds: string[]
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Demo user for development
      currentUser: {
        id: 'user-1',
        username: 'hindawiii',
        name: 'Hindawi',
        nameAr: 'هنداوي',
        nickname: 'هنداوي',
        email: 'hindawi@rakobatna.sd',
        phone: '+249912345678',
        avatar: '/avatars/default.jpg',
        coverPhoto: '/covers/default.jpg',
        bio: 'Proud Sudanese! Love coffee and good conversations.',
        bioAr: 'مواطن سوداني! ولربما يفاجئك ما قد يحدث.',
        zoolPoints: 1250,
        followers: 342,
        following: 156,
        postsCount: 47,
        isOnline: true,
        lastSeen: null,
        isVerified: true,
        location: 'الخرطوم',
        gender: 'male',
        socialStatus: 'single',
        professionalStatus: 'freelancer',
        rank: 'knight',
        rankTitle: 'فارس',
        royalRank: 'king-crown',
        gifts: [
          { id: 'g1', giftType: 'heritage', giftName: 'Jabana', giftNameAr: 'جبنة', giftEmoji: '☕', category: 'heritage', rarity: 'Legendary', senderName: 'Ahmed', senderNameAr: 'أحمد', isPrivate: false, receivedAt: new Date() },
          { id: 'g2', giftType: 'heritage', giftName: 'Markoub', giftNameAr: 'مركوب', giftEmoji: '👞', category: 'heritage', rarity: 'Rare', isPrivate: true, receivedAt: new Date() },
          { id: 'g3', giftType: 'animals', giftName: 'Jasmine', giftNameAr: 'ياسمين', giftEmoji: '🌸', category: 'animals', senderName: 'Sara', senderNameAr: 'سارة', isPrivate: false, receivedAt: new Date() },
          { id: 'g4', giftType: 'luxury', giftName: 'Gold Ring', giftNameAr: 'خاتم ذهب', giftEmoji: '💍', category: 'luxury', rarity: 'Epic', isPrivate: true, receivedAt: new Date() },
          { id: 'g5', giftType: 'animals', giftName: 'Red Rose', giftNameAr: 'ورد أحمر', giftEmoji: '🌹', category: 'animals', senderName: 'Mohamed', senderNameAr: 'محمد', isPrivate: false, receivedAt: new Date() },
        ],
        ownedGifts: [
          { id: 'g1', giftType: 'heritage', giftName: 'Jabana', giftNameAr: 'جبنة', giftEmoji: '☕', category: 'heritage', rarity: 'Legendary', isPrivate: false, receivedAt: new Date() },
          { id: 'g4', giftType: 'luxury', giftName: 'Gold Ring', giftNameAr: 'خاتم ذهب', giftEmoji: '💍', category: 'luxury', rarity: 'Epic', isPrivate: true, receivedAt: new Date() },
        ],
        featuredPosts: [
          { id: 'fp1', thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', likes: 234, comments: 45 },
          { id: 'fp2', thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400', likes: 567, comments: 89 },
          { id: 'fp3', thumbnail: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400', likes: 123, comments: 23 },
        ],
      },
      setCurrentUser: (currentUser) => set({ currentUser }),
      updateProfile: (updates) => {
        set((state) => ({
          currentUser: state.currentUser 
            ? { ...state.currentUser, ...updates }
            : null
        }))
        // Auto-sync to Firestore when profile is updated
        const { syncProfileToFirestore } = get()
        syncProfileToFirestore()
      },
      
      // Sync current user profile to Firestore
      syncProfileToFirestore: async () => {
        const { currentUser } = get()
        if (!currentUser || !isFirestoreAvailable() || !db) {
          console.log('[v0] Cannot sync profile - no user or Firestore not available')
          return
        }
        
        try {
          const userRef = doc(db, 'users', currentUser.id)
          await setDoc(userRef, {
            id: currentUser.id,
            username: currentUser.username,
            name: currentUser.name,
            nameAr: currentUser.nameAr,
            nickname: currentUser.nickname,
            avatar: currentUser.avatar,
            bio: currentUser.bio,
            bioAr: currentUser.bioAr,
            gender: currentUser.gender,
            location: currentUser.location,
            socialStatus: currentUser.socialStatus,
            professionalStatus: currentUser.professionalStatus,
            rank: currentUser.rank,
            rankTitle: currentUser.rankTitle,
            royalRank: currentUser.royalRank,
            gifts: currentUser.gifts || [],
            ownedGifts: currentUser.ownedGifts || [],
            isVerified: currentUser.isVerified,
            isOnline: currentUser.isOnline,
            lastSeen: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }, { merge: true })
          console.log('[v0] Profile synced to Firestore successfully')
        } catch (error) {
          console.error('[v0] Error syncing profile to Firestore:', error)
        }
      },
      
      // Fetch a user profile from Firestore
      fetchUserProfile: async (userId: string): Promise<User | null> => {
        if (!isFirestoreAvailable() || !db) {
          console.log('[v0] Firestore not available - cannot fetch user profile')
          return null
        }
        
        try {
          const userRef = doc(db, 'users', userId)
          const userDoc = await getDoc(userRef)
          
          if (userDoc.exists()) {
            const data = userDoc.data()
            return {
              id: data.id,
              username: data.username,
              name: data.name,
              nameAr: data.nameAr,
              nickname: data.nickname,
              email: data.email || '',
              phone: data.phone || '',
              avatar: data.avatar,
              coverPhoto: data.coverPhoto || '/covers/default.jpg',
              bio: data.bio,
              bioAr: data.bioAr,
              zoolPoints: data.zoolPoints || 0,
              followers: data.followers || 0,
              following: data.following || 0,
              postsCount: data.postsCount || 0,
              isOnline: data.isOnline || false,
              lastSeen: data.lastSeen?.toDate?.() || null,
              isVerified: data.isVerified,
              location: data.location,
              gender: data.gender,
              socialStatus: data.socialStatus,
              professionalStatus: data.professionalStatus,
              rank: data.rank,
              rankTitle: data.rankTitle,
            } as User
          }
          return null
        } catch (error) {
          console.error('[v0] Error fetching user profile:', error)
          return null
        }
      },
      
      // Viewed user for profile page
      viewedUser: null,
      setViewedUser: (viewedUser) => set({ viewedUser }),
      
      // Load a user profile
      loadUserProfile: async (userId: string) => {
        const { fetchUserProfile, setViewedUser } = get()
        const user = await fetchUserProfile(userId)
        setViewedUser(user)
      },
      
      isAuthenticated: true, // Demo: start authenticated
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      
      blockedUsers: [],
      blockUser: (user) => 
        set((state) => ({
          blockedUsers: [...state.blockedUsers, user]
        })),
      unblockUser: (userId) =>
        set((state) => ({
          blockedUsers: state.blockedUsers.filter(u => u.id !== userId)
        })),
      isBlocked: (userId) => get().blockedUsers.some(u => u.id === userId),
      
      addZoolPoints: (points) =>
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, zoolPoints: state.currentUser.zoolPoints + points }
            : null
        })),
      
      followingIds: [],
      followUser: (userId) =>
        set((state) => ({
          followingIds: [...state.followingIds, userId],
          currentUser: state.currentUser
            ? { ...state.currentUser, following: state.currentUser.following + 1 }
            : null
        })),
      unfollowUser: (userId) =>
        set((state) => ({
          followingIds: state.followingIds.filter(id => id !== userId),
          currentUser: state.currentUser
            ? { ...state.currentUser, following: state.currentUser.following - 1 }
            : null
        })),
      
      receiveGift: (gift) =>
        set((state) => {
          if (!state.currentUser) return { ...state }

          const hasReceived = state.currentUser.gifts?.some(existing => existing.id === gift.id)
          const hasOwned = state.currentUser.ownedGifts?.some(existing => existing.id === gift.id)

          return {
            currentUser: {
              ...state.currentUser,
              gifts: hasReceived ? state.currentUser.gifts : [...(state.currentUser.gifts || []), gift],
              ownedGifts: hasOwned ? state.currentUser.ownedGifts : [...(state.currentUser.ownedGifts || []), gift],
            },
          }
        }),
      
      addOwnedGift: (gift) =>
        set((state) => ({
          currentUser: state.currentUser
            ? {
                ...state.currentUser,
                ownedGifts: state.currentUser.ownedGifts?.some(existing => existing.id === gift.id)
                  ? state.currentUser.ownedGifts
                  : [...(state.currentUser.ownedGifts || []), gift],
              }
            : null,
        })),
      
      hasGift: (giftId) => {
        const currentUser = get().currentUser
        return [
          ...(currentUser?.gifts || []),
          ...(currentUser?.ownedGifts || []),
        ].some((gift) => gift.id === giftId)
      },
    }),
    {
      name: 'rakobatna-user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        blockedUsers: state.blockedUsers,
        followingIds: state.followingIds,
      }),
    }
  )
)
