import { useMemo } from 'react'
import { useUserStore, type Gender } from '@/lib/stores/user-store'
import {
  formatByGender,
  getSocialStatusLabel,
  getProfessionalStatusLabel,
  getRankLabel,
  getInteractionLabel,
  getGreetingLabel,
  getPronoun,
  createGenderFormatter,
  type InteractionKey,
  type GreetingKey,
  type PronounKey,
} from '@/lib/gender-utils'
import type { SocialStatus, ProfessionalStatus, UserRank } from '@/lib/stores/user-store'

/**
 * Hook to access gender-based text formatting with automatic user detection
 * 
 * @example
 * const { format, socialStatus, interaction } = useGender()
 * 
 * // Auto-detects current user's gender
 * const greeting = format('أهلاً بك', 'أهلاً بكِ')
 * const status = socialStatus('single') // Returns سنجل or سنجلة
 * const action = interaction('liked') // Returns أعجب or أعجبت
 * 
 * // For other users, pass their gender explicitly
 * const otherUserGreeting = format('أهلاً بك', 'أهلاً بكِ', otherUser.gender)
 */
export function useGender(overrideGender?: Gender) {
  const currentUser = useUserStore((state) => state.currentUser)
  const gender = overrideGender ?? currentUser?.gender

  return useMemo(() => ({
    // Current gender
    gender,
    
    // Core formatting function
    format: (male: string, female: string, targetGender?: Gender) => 
      formatByGender(male, female, targetGender ?? gender),
    
    // Status labels
    socialStatus: (status: SocialStatus | undefined, targetGender?: Gender) => 
      getSocialStatusLabel(status, targetGender ?? gender),
    
    professionalStatus: (status: ProfessionalStatus | undefined, targetGender?: Gender) => 
      getProfessionalStatusLabel(status, targetGender ?? gender),
    
    rank: (rank: UserRank | undefined, targetGender?: Gender) => 
      getRankLabel(rank, targetGender ?? gender),
    
    // Interaction labels
    interaction: (key: InteractionKey, targetGender?: Gender) => 
      getInteractionLabel(key, targetGender ?? gender),
    
    // Greeting labels
    greeting: (key: GreetingKey, targetGender?: Gender) => 
      getGreetingLabel(key, targetGender ?? gender),
    
    // Pronouns
    pronoun: (key: PronounKey, targetGender?: Gender) => 
      getPronoun(key, targetGender ?? gender),

    // Get a formatter for a specific gender (useful for rendering other users)
    forGender: (targetGender: Gender | undefined) => createGenderFormatter(targetGender),
  }), [gender])
}

/**
 * Standalone hook to get current user's gender only
 */
export function useCurrentGender(): Gender | undefined {
  return useUserStore((state) => state.currentUser?.gender)
}
