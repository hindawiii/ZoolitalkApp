'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  Hospital, 
  Pill, 
  ShoppingCart, 
  MapPin, 
  Clock, 
  MessageSquare,
  ChevronDown,
  Plus,
  Send,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useFeedStore, type LocalService, type ServiceStatus } from '@/lib/stores/feed-store'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'

type CategoryFilter = 'all' | 'hospital' | 'pharmacy' | 'market'

const categories = [
  { id: 'all' as CategoryFilter, label: 'الكل', icon: null },
  { id: 'hospital' as CategoryFilter, label: 'مستشفيات', icon: Hospital },
  { id: 'pharmacy' as CategoryFilter, label: 'صيدليات مناوبة', icon: Pill },
  { id: 'market' as CategoryFilter, label: 'أسواق', icon: ShoppingCart },
]

const getCategoryIcon = (category: LocalService['category']) => {
  switch (category) {
    case 'hospital':
      return Hospital
    case 'pharmacy':
      return Pill
    case 'market':
      return ShoppingCart
    default:
      return MapPin
  }
}

const getCategoryColor = (category: LocalService['category']) => {
  switch (category) {
    case 'hospital':
      return 'bg-red-500/10 text-red-600 border-red-200'
    case 'pharmacy':
      return 'bg-green-500/10 text-green-600 border-green-200'
    case 'market':
      return 'bg-blue-500/10 text-blue-600 border-blue-200'
    default:
      return 'bg-gray-500/10 text-gray-600 border-gray-200'
  }
}

interface ServiceCardProps {
  service: LocalService
  onOpenDetail: (service: LocalService) => void
}

function ServiceCard({ service, onOpenDetail }: ServiceCardProps) {
  const Icon = getCategoryIcon(service.category)
  const latestStatus = service.statusUpdates[0]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-card rounded-xl border border-[#2D5A27]/10 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onOpenDetail(service)}
    >
      {/* Header */}
      <div className="p-4 border-b border-[#2D5A27]/10">
        <div className="flex items-start gap-3">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            getCategoryColor(service.category)
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold font-arabic text-sm truncate">{service.nameAr}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-arabic truncate">
                {service.addressAr}
              </span>
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div className="flex items-center justify-between mt-3">
          <Badge 
            variant="outline" 
            className={cn(
              'font-arabic text-[10px]',
              service.isOpen 
                ? 'bg-green-500/10 text-green-600 border-green-200' 
                : 'bg-red-500/10 text-red-600 border-red-200'
            )}
          >
            {service.isOpen ? (
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> مفتوح</span>
            ) : (
              <span className="flex items-center gap-1"><XCircle className="h-3 w-3" /> مغلق</span>
            )}
          </Badge>
          {service.distance && (
            <span className="text-xs text-muted-foreground font-arabic">
              {service.distance}
            </span>
          )}
        </div>
      </div>

      {/* Latest status */}
      {latestStatus && (
        <div className="p-3 bg-[#F5F5DC]/50 dark:bg-secondary/30">
          <div className="flex items-start gap-2">
            <MessageSquare className="h-3.5 w-3.5 text-[#2D5A27] mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-arabic leading-relaxed text-foreground">
                {latestStatus.messageAr}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-muted-foreground font-arabic">
                  {latestStatus.authorName}
                </span>
                <span className="text-[10px] text-muted-foreground">•</span>
                <span className="text-[10px] text-muted-foreground font-arabic">
                  {formatDistanceToNow(latestStatus.timestamp, { locale: ar, addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {service.statusUpdates.length === 0 && (
        <div className="p-3 bg-[#F5F5DC]/50 dark:bg-secondary/30">
          <p className="text-xs text-muted-foreground font-arabic text-center">
            ما في تحديثات حالياً
          </p>
        </div>
      )}
    </motion.div>
  )
}

interface ServiceDetailSheetProps {
  service: LocalService | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function ServiceDetailSheet({ service, open, onOpenChange }: ServiceDetailSheetProps) {
  const { addServiceStatus } = useFeedStore()
  const [newStatus, setNewStatus] = React.useState('')

  if (!service) return null

  const Icon = getCategoryIcon(service.category)

  const handleSubmitStatus = () => {
    if (!newStatus.trim()) return
    
    const status: ServiceStatus = {
      id: `st-${Date.now()}`,
      message: newStatus,
      messageAr: newStatus,
      timestamp: new Date(),
      authorName: 'أنت',
    }
    
    addServiceStatus(service.id, status)
    setNewStatus('')
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              getCategoryColor(service.category)
            )}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <SheetTitle className="font-arabic text-right">{service.nameAr}</SheetTitle>
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-arabic">
                  {service.addressAr}
                </span>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="py-4 flex flex-col h-full">
          {/* Add status input */}
          <div className="flex gap-2 mb-4">
            <Input
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              placeholder="شارك تحديث... (مثال: خبز متوفر)"
              className="flex-1 font-arabic text-right"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitStatus()}
            />
            <Button 
              onClick={handleSubmitStatus}
              disabled={!newStatus.trim()}
              className="bg-[#2D5A27] hover:bg-[#2D5A27]/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Status feed */}
          <ScrollArea className="flex-1">
            <div className="space-y-3">
              <h3 className="text-sm font-bold font-arabic text-muted-foreground mb-2">
                تحديثات المجتمع
              </h3>
              
              {service.statusUpdates.length > 0 ? (
                service.statusUpdates.map((status, index) => (
                  <motion.div
                    key={status.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-[#F5F5DC] dark:bg-secondary/50 rounded-lg p-3"
                  >
                    <p className="text-sm font-arabic">{status.messageAr}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-bold text-[#2D5A27] font-arabic">
                        {status.authorName}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground font-arabic">
                        {formatDistanceToNow(status.timestamp, { locale: ar, addSuffix: true })}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground font-arabic">
                    كن أول من يشارك تحديث
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function RadarTab() {
  const { services } = useFeedStore()
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryFilter>('all')
  const [selectedService, setSelectedService] = React.useState<LocalService | null>(null)
  const [showDetail, setShowDetail] = React.useState(false)

  const filteredServices = React.useMemo(() => {
    if (selectedCategory === 'all') return services
    return services.filter((service) => service.category === selectedCategory)
  }, [services, selectedCategory])

  const handleOpenDetail = (service: LocalService) => {
    setSelectedService(service)
    setShowDetail(true)
  }

  return (
    <div className="flex flex-col h-full bg-[#F5F5DC] dark:bg-background">
      {/* Category Filter */}
      <div className="sticky top-0 z-10 px-4 py-3 bg-white dark:bg-card border-b border-[#2D5A27]/10">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  'gap-1.5 font-arabic whitespace-nowrap flex-shrink-0',
                  selectedCategory === category.id
                    ? 'bg-[#2D5A27] hover:bg-[#2D5A27]/90 text-white'
                    : 'border-[#2D5A27]/20 hover:bg-[#2D5A27]/10'
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {category.label}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Services Grid */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {filteredServices.map((service, index) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onOpenDetail={handleOpenDetail}
              />
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-arabic">
                ما في خدمات في الفئة دي حالياً
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Service Detail Sheet */}
      <ServiceDetailSheet 
        service={selectedService}
        open={showDetail}
        onOpenChange={setShowDetail}
      />
    </div>
  )
}
