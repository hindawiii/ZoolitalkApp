import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage, isFirestoreAvailable } from '@/lib/firebase/config'

export type ListingCategory = 
  | 'vehicles' // عربات
  | 'rickshaws' // ركشات
  | 'property' // عقارات
  | 'electronics' // إلكترونيات
  | 'furniture' // أثاث
  | 'clothes' // ملابس
  | 'services' // خدمات
  | 'other' // أخرى

export interface Listing {
  id: string
  sellerId: string
  sellerName: string
  sellerAvatar: string
  sellerPhone: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  category: ListingCategory
  price: number
  currency: 'SDG' | 'USD'
  images: string[]
  location: string
  locationAr: string
  isBarter: boolean // للمقايضة
  barterFor?: string // مقايضة بـ
  isAuction: boolean
  auctionEndTime?: Date
  currentBid?: number
  highestBidderId?: string
  views: number
  isFavorite?: boolean
  timestamp: Date
  status: 'active' | 'sold' | 'expired'
}

export interface Bid {
  id: string
  listingId: string
  bidderId: string
  bidderName: string
  amount: number
  timestamp: Date
}

interface SouqState {
  // Listings
  listings: Listing[]
  setListings: (listings: Listing[]) => void
  addListing: (listing: Listing) => void
  updateListing: (id: string, updates: Partial<Listing>) => void
  
  // Filters
  activeCategory: ListingCategory | 'all'
  setActiveCategory: (category: ListingCategory | 'all') => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  showBarterOnly: boolean
  setShowBarterOnly: (show: boolean) => void
  showAuctionsOnly: boolean
  setShowAuctionsOnly: (show: boolean) => void
  
  // Favorites
  favorites: string[]
  toggleFavorite: (listingId: string) => void
  
  // Auctions
  bids: Record<string, Bid[]>
  placeBid: (listingId: string, bid: Bid) => void
  
  // Posting flow
  draftListing: Partial<Listing> | null
  setDraftListing: (draft: Partial<Listing> | null) => void
  postingStep: 1 | 2 | 3
  setPostingStep: (step: 1 | 2 | 3) => void
}

// Demo listings
const demoListings: Listing[] = [
  {
    id: 'listing-1',
    sellerId: 'user-5',
    sellerName: 'Khalid Ibrahim',
    sellerAvatar: '/avatars/khalid.jpg',
    sellerPhone: '+249912345678',
    title: 'Toyota Corolla 2018',
    titleAr: 'تويوتا كورولا 2018',
    description: 'Excellent condition, low mileage, full service history.',
    descriptionAr: 'حالة ممتازة، كيلومترات قليلة، صيانة كاملة.',
    category: 'vehicles',
    price: 450000,
    currency: 'SDG',
    images: ['/listings/corolla1.jpg', '/listings/corolla2.jpg'],
    location: 'Khartoum 2',
    locationAr: 'الخرطوم 2',
    isBarter: false,
    isAuction: false,
    views: 234,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'active',
  },
  {
    id: 'listing-2',
    sellerId: 'user-6',
    sellerName: 'Mona Ahmed',
    sellerAvatar: '/avatars/mona.jpg',
    sellerPhone: '+249923456789',
    title: 'iPhone 14 Pro Max',
    titleAr: 'آيفون 14 برو ماكس',
    description: 'Like new, with box and accessories. 256GB Space Black.',
    descriptionAr: 'مثل الجديد، مع الكرتونة والإكسسوارات. 256 جيجا أسود.',
    category: 'electronics',
    price: 85000,
    currency: 'SDG',
    images: ['/listings/iphone.jpg'],
    location: 'Omdurman',
    locationAr: 'أم درمان',
    isBarter: true,
    barterFor: 'Samsung S23 Ultra',
    isAuction: false,
    views: 567,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    status: 'active',
  },
  {
    id: 'listing-3',
    sellerId: 'user-7',
    sellerName: 'Hassan Omar',
    sellerAvatar: '/avatars/hassan.jpg',
    sellerPhone: '+249934567890',
    title: 'Rickshaw Bajaj 2020',
    titleAr: 'ركشة باجاج 2020',
    description: 'Friday Auction! Great rickshaw for business.',
    descriptionAr: 'مزاد الجمعة! ركشة ممتازة للشغل.',
    category: 'rickshaws',
    price: 150000,
    currency: 'SDG',
    images: ['/listings/rickshaw.jpg'],
    location: 'Bahri',
    locationAr: 'بحري',
    isBarter: false,
    isAuction: true,
    auctionEndTime: new Date(Date.now() + 1000 * 60 * 60 * 48),
    currentBid: 175000,
    views: 890,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    status: 'active',
  },
  {
    id: 'listing-4',
    sellerId: 'user-8',
    sellerName: 'Aisha Mohammed',
    sellerAvatar: '/avatars/aisha.jpg',
    sellerPhone: '+249945678901',
    title: 'Apartment for Rent - 3BR',
    titleAr: 'شقة للإيجار - 3 غرف',
    description: 'Spacious apartment in Riyadh neighborhood. Families only.',
    descriptionAr: 'شقة واسعة في حي الرياض. للعائلات فقط.',
    category: 'property',
    price: 25000,
    currency: 'SDG',
    images: ['/listings/apartment1.jpg', '/listings/apartment2.jpg'],
    location: 'Khartoum - Riyadh',
    locationAr: 'الخرطوم - الرياض',
    isBarter: false,
    isAuction: false,
    views: 1234,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    status: 'active',
  },
]

export const useSouqStore = create<SouqState>()(
  persist(
    (set, get) => ({
      listings: demoListings,
      setListings: (listings) => set({ listings }),
      addListing: (listing) => set((state) => ({ listings: [listing, ...state.listings] })),
      updateListing: (id, updates) =>
        set((state) => ({
          listings: state.listings.map(l => (l.id === id ? { ...l, ...updates } : l)),
        })),
      
      activeCategory: 'all',
      setActiveCategory: (activeCategory) => set({ activeCategory }),
      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      showBarterOnly: false,
      setShowBarterOnly: (showBarterOnly) => set({ showBarterOnly }),
      showAuctionsOnly: false,
      setShowAuctionsOnly: (showAuctionsOnly) => set({ showAuctionsOnly }),
      
      favorites: [],
      toggleFavorite: (listingId) =>
        set((state) => ({
          favorites: state.favorites.includes(listingId)
            ? state.favorites.filter(id => id !== listingId)
            : [...state.favorites, listingId],
        })),
      
      bids: {},
      placeBid: (listingId, bid) =>
        set((state) => ({
          bids: {
            ...state.bids,
            [listingId]: [...(state.bids[listingId] || []), bid],
          },
          listings: state.listings.map(l =>
            l.id === listingId
              ? { ...l, currentBid: bid.amount, highestBidderId: bid.bidderId }
              : l
          ),
        })),
      
      draftListing: null,
      setDraftListing: (draftListing) => set({ draftListing }),
      postingStep: 1,
      setPostingStep: (postingStep) => set({ postingStep }),
    }),
    {
      name: 'rakobatna-souq-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        listings: state.listings,
        favorites: state.favorites,
        bids: state.bids,
      }),
    }
  )
)

// Category labels
export const categoryLabels: Record<ListingCategory, { en: string; ar: string }> = {
  vehicles: { en: 'Vehicles', ar: 'عربات' },
  rickshaws: { en: 'Rickshaws', ar: 'ركشات' },
  property: { en: 'Property', ar: 'عقارات' },
  electronics: { en: 'Electronics', ar: 'إلكترونيات' },
  furniture: { en: 'Furniture', ar: 'أثاث' },
  clothes: { en: 'Clothes', ar: 'ملابس' },
  services: { en: 'Services', ar: 'خدمات' },
  other: { en: 'Other', ar: 'أخرى' },
}
