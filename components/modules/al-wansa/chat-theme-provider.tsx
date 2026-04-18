'use client'

import * as React from 'react'

export type ChatBackground = 
  | 'default'
  | 'rakoba'
  | 'nile'
  | 'desert'
  | 'geometric'
  | 'stars'

export interface ChatTheme {
  background: ChatBackground
  bubbleSentColor: string
  bubbleReceivedColor: string
}

const defaultTheme: ChatTheme = {
  background: 'default',
  bubbleSentColor: 'hsl(var(--primary))',
  bubbleReceivedColor: 'hsl(var(--secondary))',
}

interface ChatThemeContextType {
  theme: ChatTheme
  setBackground: (bg: ChatBackground) => void
  backgrounds: { id: ChatBackground; name: string; nameAr: string; pattern: string }[]
}

const ChatThemeContext = React.createContext<ChatThemeContextType | null>(null)

// Sudanese-inspired background patterns
const backgrounds: { id: ChatBackground; name: string; nameAr: string; pattern: string }[] = [
  {
    id: 'default',
    name: 'Default',
    nameAr: 'افتراضي',
    pattern: '',
  },
  {
    id: 'rakoba',
    name: 'Rakoba Pattern',
    nameAr: 'نقشة الراكوبة',
    pattern: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232D5A27' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  },
  {
    id: 'nile',
    name: 'Nile Waves',
    nameAr: 'موجات النيل',
    pattern: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072V18.5c-4.54-1.455-7.96-2.715-14.93-4.618C4.777 11.97 0 10.6 0 10.6v3.4zM100 14c-10.271 0-15.362 1.222-24.629 4.928-.955.383-1.869.74-2.75 1.072v1.5c4.54-1.455 7.96-2.715 14.93-4.618 7.672-1.912 12.449-3.282 12.449-3.282V14z' fill='%231E88E5' fill-opacity='0.06' fill-rule='evenodd'/%3E%3C/svg%3E")`,
  },
  {
    id: 'desert',
    name: 'Desert Sands',
    nameAr: 'رمال الصحراء',
    pattern: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C4A35A' fill-opacity='0.12'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  },
  {
    id: 'geometric',
    name: 'Sudanese Geometric',
    nameAr: 'هندسي سوداني',
    pattern: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232D5A27' fill-opacity='0.06'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2l-6 6h-2zm4 0l4-4v2l-2 2h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  },
  {
    id: 'stars',
    name: 'Night Stars',
    nameAr: 'نجوم الليل',
    pattern: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFD700' fill-opacity='0.08' fill-rule='evenodd'%3E%3Ccircle cx='12' cy='12' r='1'/%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='21' cy='3' r='1'/%3E%3Ccircle cx='3' cy='21' r='1'/%3E%3Ccircle cx='21' cy='21' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
  },
]

export function ChatThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<ChatTheme>(defaultTheme)

  const setBackground = React.useCallback((bg: ChatBackground) => {
    setTheme((prev) => ({ ...prev, background: bg }))
  }, [])

  return (
    <ChatThemeContext.Provider value={{ theme, setBackground, backgrounds }}>
      {children}
    </ChatThemeContext.Provider>
  )
}

export function useChatTheme() {
  const context = React.useContext(ChatThemeContext)
  if (!context) {
    throw new Error('useChatTheme must be used within a ChatThemeProvider')
  }
  return context
}

export function ChatBackgroundPattern() {
  const { theme, backgrounds } = useChatTheme()
  const bg = backgrounds.find((b) => b.id === theme.background)

  if (!bg?.pattern) return null

  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-100"
      style={{ backgroundImage: bg.pattern }}
    />
  )
}
