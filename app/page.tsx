'use client'

import { Suspense } from 'react'
import { AppShell } from '@/components/shell/app-shell'

// Loading fallback
function AppLoader() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground font-arabic">جاري التحميل...</p>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<AppLoader />}>
      <AppShell />
    </Suspense>
  )
}
