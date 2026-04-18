'use client'

import { cn } from '@/lib/utils'

interface RakobaLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function RakobaLogo({ className, size = 'md' }: RakobaLogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <svg
      viewBox="0 0 64 64"
      className={cn(sizeClasses[size], className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Rakoba (Traditional Sudanese Shelter) */}
      <defs>
        <linearGradient id="roofGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#228B22" />
          <stop offset="50%" stopColor="#008000" />
          <stop offset="100%" stopColor="#006400" />
        </linearGradient>
        <linearGradient id="woodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A0522D" />
          <stop offset="50%" stopColor="#8B4513" />
          <stop offset="100%" stopColor="#654321" />
        </linearGradient>
        <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#DEB887" />
          <stop offset="100%" stopColor="#D2B48C" />
        </linearGradient>
      </defs>

      {/* Ground/Base */}
      <ellipse cx="32" cy="58" rx="28" ry="4" fill="url(#groundGradient)" opacity="0.6" />

      {/* Wooden Pillars */}
      <rect x="12" y="32" width="4" height="26" rx="1" fill="url(#woodGradient)" />
      <rect x="48" y="32" width="4" height="26" rx="1" fill="url(#woodGradient)" />
      <rect x="28" y="28" width="4" height="30" rx="1" fill="url(#woodGradient)" />
      <rect x="34" y="28" width="4" height="30" rx="1" fill="url(#woodGradient)" />

      {/* Palm Leaf Roof (Rakoba style) */}
      <path
        d="M6 32 L32 8 L58 32 Z"
        fill="url(#roofGradient)"
        stroke="#006400"
        strokeWidth="1"
      />
      
      {/* Roof texture lines */}
      <path d="M12 28 L32 12 L52 28" stroke="#228B22" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M16 30 L32 16 L48 30" stroke="#228B22" strokeWidth="1" fill="none" opacity="0.4" />

      {/* Cross beams */}
      <rect x="10" y="32" width="44" height="3" rx="1" fill="url(#woodGradient)" />
      <rect x="8" y="44" width="48" height="2" rx="1" fill="url(#woodGradient)" opacity="0.8" />

      {/* Decorative palm fronds hanging */}
      <path d="M20 32 Q18 36 16 34" stroke="#228B22" strokeWidth="1.5" fill="none" />
      <path d="M44 32 Q46 36 48 34" stroke="#228B22" strokeWidth="1.5" fill="none" />
      
      {/* Small decorative element at top */}
      <circle cx="32" cy="10" r="2" fill="#8B4513" />
    </svg>
  )
}
