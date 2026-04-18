'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Search,
  Plus,
  SlidersHorizontal,
  Car,
  Bike,
  Home,
  Smartphone,
  Sofa,
  Shirt,
  Wrench,
  Package,
  Gavel,
  ArrowLeftRight,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { ListingCard } from './listing-card'
import { ListingDetail } from './listing-detail'
import { CreateListingSheet } from './create-listing-sheet'
import { useSouqStore, type ListingCategory, categoryLabels } from '@/lib/stores/souq-store'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'

// Category icons
const categoryIcons: Record<ListingCategory, React.ComponentType<{ className?: string }>> = {
  vehicles: Car,
  rickshaws: Bike,
  property: Home,
  electronics: Smartphone,
  furniture: Sofa,
  clothes: Shirt,
  services: Wrench,
  other: Package,
}

export default function SouqAlJumaa() {
  const {
    listings,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    showBarterOnly,
    setShowBarterOnly,
    showAuctionsOnly,
    setShowAuctionsOnly,
  } = useSouqStore()
  const { t, language, isRTL } = useLanguage()
  const [selectedListingId, setSelectedListingId] = React.useState<string | null>(null)
  const [showCreateListing, setShowCreateListing] = React.useState(false)

  // Filter listings
  const filteredListings = React.useMemo(() => {
    return listings.filter((listing) => {
      // Category filter
      if (activeCategory !== 'all' && listing.category !== activeCategory) return false
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          listing.title.toLowerCase().includes(query) ||
          listing.titleAr.includes(query) ||
          listing.description.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }
      
      // Barter filter
      if (showBarterOnly && !listing.isBarter) return false
      
      // Auction filter
      if (showAuctionsOnly && !listing.isAuction) return false
      
      return true
    })
  }, [listings, activeCategory, searchQuery, showBarterOnly, showAuctionsOnly])

  const selectedListing = listings.find((l) => l.id === selectedListingId)

  return (
    <div className="flex flex-col h-full w-full max-w-full overflow-x-hidden">
      {/* Detail View */}
      <AnimatePresence>
        {selectedListing && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute inset-0 z-20 bg-background"
          >
            <ListingDetail
              listing={selectedListing}
              onBack={() => setSelectedListingId(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="p-4 space-y-3 border-b bg-card/50">
        <div className="flex items-center justify-between">
          <h2 className={cn('text-2xl font-bold', isRTL && 'font-arabic')}>
            {t('souq.title')}
          </h2>
          <Button
            size="sm"
            className="gap-1.5 bg-primary hover:bg-primary/90"
            onClick={() => setShowCreateListing(true)}
          >
            <Plus className="h-4 w-4" />
            <span className={cn(isRTL && 'font-arabic')}>{t('souq.newListing')}</span>
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground start-3" />
          <Input
            placeholder={t('souq.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 rounded-full bg-secondary/50 ps-10 pe-12"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 -translate-y-1/2 h-8 w-8 end-1"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick filters */}
        <div className="flex gap-2">
          <Button
            variant={showBarterOnly ? 'default' : 'outline'}
            size="sm"
            className="gap-1.5"
            onClick={() => setShowBarterOnly(!showBarterOnly)}
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span className={cn(isRTL && 'font-arabic')}>{t('souq.barter')}</span>
          </Button>
          <Button
            variant={showAuctionsOnly ? 'default' : 'outline'}
            size="sm"
            className="gap-1.5"
            onClick={() => setShowAuctionsOnly(!showAuctionsOnly)}
          >
            <Gavel className="h-4 w-4" />
            <span className={cn(isRTL && 'font-arabic')}>{t('souq.fridayAuction')}</span>
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-3 border-b overflow-x-auto overflow-y-hidden w-full max-w-full scrollbar-hide">
        <div className="flex gap-2 w-max">
          {/* All category */}
          <button
            onClick={() => setActiveCategory('all')}
            className={cn(
              'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors flex-shrink-0',
              activeCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/50 hover:bg-secondary'
            )}
          >
            <Package className="h-5 w-5" />
            <span className={cn('text-xs', isRTL && 'font-arabic')}>
              {t('souq.all')}
            </span>
          </button>

          {/* Category buttons */}
          {(Object.keys(categoryLabels) as ListingCategory[]).map((category) => {
            const Icon = categoryIcons[category]
            const isActive = activeCategory === category
            
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors flex-shrink-0',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 hover:bg-secondary'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className={cn('text-xs', isRTL && 'font-arabic')}>
                  {language === 'ar' ? categoryLabels[category].ar : categoryLabels[category].en}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Listings Grid */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {filteredListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mb-4 opacity-50" />
              <p className={cn(isRTL && 'font-arabic')}>{t('common.noResults')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onClick={() => setSelectedListingId(listing.id)}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Create Listing Sheet */}
      <CreateListingSheet
        open={showCreateListing}
        onOpenChange={setShowCreateListing}
      />
    </div>
  )
}
