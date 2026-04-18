'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, type GiftType } from '@/lib/stores/app-store'
import { useLanguage } from '@/components/providers/language-provider'

// Gift SVG icons with animations
const giftIcons: Record<GiftType, React.ReactNode> = {
  jabana: (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <defs>
        <linearGradient id="jabanaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D2691E" />
          <stop offset="50%" stopColor="#8B4513" />
          <stop offset="100%" stopColor="#654321" />
        </linearGradient>
        <linearGradient id="steamGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      {/* Jabana pot body */}
      <ellipse cx="60" cy="85" rx="35" ry="25" fill="url(#jabanaGrad)" />
      <path d="M25 85 Q20 60 35 50 L85 50 Q100 60 95 85" fill="url(#jabanaGrad)" />
      {/* Spout */}
      <path d="M95 65 Q110 55 115 45" fill="none" stroke="#8B4513" strokeWidth="6" strokeLinecap="round" />
      {/* Handle */}
      <path d="M25 65 Q5 70 10 85 Q15 95 25 90" fill="none" stroke="#654321" strokeWidth="5" />
      {/* Steam animations */}
      <motion.path
        d="M50 45 Q55 35 50 25"
        fill="none"
        stroke="url(#steamGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        animate={{ y: [0, -10, 0], opacity: [0.8, 0.3, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.path
        d="M60 40 Q65 30 60 20"
        fill="none"
        stroke="url(#steamGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        animate={{ y: [0, -12, 0], opacity: [0.6, 0.2, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      />
      <motion.path
        d="M70 45 Q75 35 70 25"
        fill="none"
        stroke="url(#steamGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        animate={{ y: [0, -8, 0], opacity: [0.7, 0.25, 0.7] }}
        transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
      />
    </svg>
  ),
  crown: (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <defs>
        <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFA500" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
      </defs>
      <motion.g
        animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Crown base */}
        <path
          d="M20 90 L20 60 L40 75 L60 40 L80 75 L100 60 L100 90 Z"
          fill="url(#crownGrad)"
          stroke="#B8860B"
          strokeWidth="2"
        />
        {/* Crown band */}
        <rect x="20" y="85" width="80" height="10" fill="#B8860B" rx="2" />
        {/* Jewels */}
        <circle cx="60" cy="55" r="6" fill="#FF0000" />
        <circle cx="40" cy="70" r="4" fill="#00FF00" />
        <circle cx="80" cy="70" r="4" fill="#0000FF" />
        {/* Sparkles */}
        <motion.circle
          cx="30" cy="50"
          r="2"
          fill="white"
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.circle
          cx="90" cy="55"
          r="2"
          fill="white"
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        />
      </motion.g>
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C0C0C0" />
          <stop offset="50%" stopColor="#808080" />
          <stop offset="100%" stopColor="#A0A0A0" />
        </linearGradient>
        <linearGradient id="shieldAccent" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#065F46" />
        </linearGradient>
      </defs>
      <motion.g
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {/* Shield body */}
        <path
          d="M60 10 L100 25 L100 60 Q100 95 60 110 Q20 95 20 60 L20 25 Z"
          fill="url(#shieldGrad)"
          stroke="#404040"
          strokeWidth="3"
        />
        {/* Inner design */}
        <path
          d="M60 25 L85 35 L85 55 Q85 80 60 95 Q35 80 35 55 L35 35 Z"
          fill="url(#shieldAccent)"
        />
        {/* Star emblem */}
        <motion.path
          d="M60 40 L64 52 L76 52 L66 60 L70 72 L60 64 L50 72 L54 60 L44 52 L56 52 Z"
          fill="#FFD700"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '60px 56px' }}
        />
      </motion.g>
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <defs>
        <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="50%" stopColor="#EE5A5A" />
          <stop offset="100%" stopColor="#DC143C" />
        </linearGradient>
      </defs>
      <motion.path
        d="M60 100 Q20 70 20 45 Q20 20 45 20 Q55 20 60 30 Q65 20 75 20 Q100 20 100 45 Q100 70 60 100"
        fill="url(#heartGrad)"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        style={{ transformOrigin: '60px 60px' }}
      />
      {/* Sparkles */}
      <motion.circle
        cx="40" cy="35"
        r="8"
        fill="rgba(255,255,255,0.4)"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <defs>
        <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFC200" />
          <stop offset="100%" stopColor="#FFB300" />
        </linearGradient>
      </defs>
      <motion.path
        d="M60 10 L72 42 L105 42 L78 62 L88 95 L60 75 L32 95 L42 62 L15 42 L48 42 Z"
        fill="url(#starGrad)"
        stroke="#B8860B"
        strokeWidth="2"
        animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
        transition={{ 
          rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
          scale: { duration: 1.5, repeat: Infinity }
        }}
        style={{ transformOrigin: '60px 52px' }}
      />
      {/* Inner glow */}
      <motion.circle
        cx="60" cy="52"
        r="15"
        fill="rgba(255,255,255,0.3)"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </svg>
  ),
}

// Particle effect component
function Particles() {
  const particles = React.useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      size: 4 + Math.random() * 8,
    })),
    []
  )

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-accent"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
          }}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{ y: '-100vh', opacity: [0, 1, 1, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </>
  )
}

export function GiftOverlay() {
  const { activeGift, giftSender, hideGift } = useAppStore()
  const { t, isRTL } = useLanguage()

  // Auto-hide after 4 seconds
  React.useEffect(() => {
    if (activeGift) {
      const timer = setTimeout(hideGift, 4000)
      return () => clearTimeout(timer)
    }
  }, [activeGift, hideGift])

  return (
    <AnimatePresence>
      {activeGift && (
        <motion.div
          className="gift-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={hideGift}
        >
          {/* Background blur */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Particles */}
          <Particles />

          {/* Gift icon */}
          <motion.div
            className="relative z-10 w-48 h-48 sm:w-64 sm:h-64"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          >
            {giftIcons[activeGift]}
          </motion.div>

          {/* Gift name and sender */}
          <motion.div
            className={`absolute bottom-24 text-center ${isRTL ? 'font-arabic' : ''}`}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg mb-2">
              {t(`gift.${activeGift}`)}
            </h2>
            {giftSender && (
              <p className="text-lg sm:text-xl text-white/90 drop-shadow-md">
                {t('gift.sentBy')} {giftSender}
              </p>
            )}
          </motion.div>

          {/* Tap to dismiss hint */}
          <motion.p
            className="absolute bottom-8 text-white/60 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {isRTL ? 'اضغط للإغلاق' : 'Tap to dismiss'}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
