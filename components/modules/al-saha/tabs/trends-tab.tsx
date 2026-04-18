'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, MapPin, ChevronDown, Flame, Users } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useFeedStore } from '@/lib/stores/feed-store'
import { cn } from '@/lib/utils'

const cities = [
  { id: 'all', label: 'كل السودان' },
  { id: 'الخرطوم', label: 'الخرطوم' },
  { id: 'بورتسودان', label: 'بورتسودان' },
  { id: 'كسلا', label: 'كسلا' },
  { id: 'ود_مدني', label: 'ود مدني' },
  { id: 'الأبيض', label: 'الأبيض' },
  { id: 'نيالا', label: 'نيالا' },
]

export function TrendsTab() {
  const { trends } = useFeedStore()
  const [selectedCity, setSelectedCity] = React.useState('all')

  const filteredTrends = React.useMemo(() => {
    if (selectedCity === 'all') return trends
    return trends.filter((trend) => !trend.city || trend.city === selectedCity)
  }, [trends, selectedCity])

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <div className="flex flex-col h-full bg-[#F5F5DC] dark:bg-background">
      {/* City Filter Header */}
      <div className="sticky top-0 z-10 px-4 py-3 bg-white dark:bg-card border-b border-[#2D5A27]/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#2D5A27]" />
            <h2 className="text-lg font-bold font-arabic text-[#2D5A27]">الترندات</h2>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 font-arabic border-[#2D5A27]/20 hover:bg-[#2D5A27]/10"
              >
                <MapPin className="h-4 w-4 text-[#2D5A27]" />
                {cities.find((c) => c.id === selectedCity)?.label}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="font-arabic">
              {cities.map((city) => (
                <DropdownMenuItem
                  key={city.id}
                  onClick={() => setSelectedCity(city.id)}
                  className={cn(
                    'cursor-pointer',
                    selectedCity === city.id && 'bg-[#2D5A27]/10 text-[#2D5A27]'
                  )}
                >
                  {city.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Trends List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredTrends.map((trend, index) => (
            <motion.div
              key={trend.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-card rounded-xl p-4 border border-[#2D5A27]/10 hover:border-[#2D5A27]/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                {/* Rank */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2D5A27]/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#2D5A27]">{index + 1}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold font-arabic text-foreground truncate">
                      #{trend.tagAr}
                    </h3>
                    {trend.isHot && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="flex items-center gap-1 px-2 py-0.5 bg-red-500/10 rounded-full"
                      >
                        <Flame className="h-3 w-3 text-red-500" />
                        <span className="text-[10px] font-bold text-red-500 font-arabic">ساخن</span>
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      <span className="text-xs font-arabic">
                        {formatCount(trend.zoolsCount)} زول بيتكلموا
                      </span>
                    </div>
                    {trend.city && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="text-xs font-arabic">{trend.city}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hot Indicator */}
                {trend.isHot && (
                  <div className="flex-shrink-0">
                    <motion.div
                      animate={{ 
                        boxShadow: [
                          '0 0 0 0 rgba(239, 68, 68, 0.4)',
                          '0 0 0 8px rgba(239, 68, 68, 0)',
                        ]
                      }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-3 h-3 rounded-full bg-red-500"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {filteredTrends.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-arabic">ما في ترندات في الموقع ده حالياً</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
