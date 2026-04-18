import type { Gender, SocialStatus, ProfessionalStatus, UserRank } from './stores/user-store'

// ============================================
// GLOBAL GENDER-BASED TEXT FORMATTING UTILITY
// "Write once, apply everywhere"
// ============================================

/**
 * Core function to return text based on gender
 * @param maleText - Text for male users
 * @param femaleText - Text for female users  
 * @param gender - User's gender ('male' | 'female')
 * @returns The appropriate gendered text
 */
export function formatByGender(
  maleText: string,
  femaleText: string,
  gender: Gender | undefined
): string {
  return gender === 'female' ? femaleText : maleText
}

// ============================================
// SOCIAL STATUS LABELS
// ============================================
export const SOCIAL_STATUS_LABELS: Record<SocialStatus, { male: string; female: string }> = {
  single: { male: 'سنجل', female: 'سنجلة' },
  taken: { male: 'مرتبط', female: 'مرتبطة' },
  engaged: { male: 'خاطب', female: 'مخطوبة' },
  married: { male: 'معرس', female: 'معرسة' },
  complicated: { male: 'سجمان ورمدان', female: 'سجمان ورمدان' },
  gave_up: { male: 'بعت الفكرة', female: 'بعتِ الفكرة' },
}

export function getSocialStatusLabel(status: SocialStatus | undefined, gender: Gender | undefined): string {
  if (!status) return ''
  const labels = SOCIAL_STATUS_LABELS[status]
  return formatByGender(labels.male, labels.female, gender)
}

// ============================================
// PROFESSIONAL STATUS LABELS
// ============================================
export const PROFESSIONAL_STATUS_LABELS: Record<ProfessionalStatus, { male: string; female: string }> = {
  student: { male: 'طالب', female: 'طالبة' },
  employee: { male: 'موظف', female: 'موظفة' },
  freelancer: { male: 'عمل حر', female: 'عمل حر' },
  unemployed: { male: 'فارغ وشغل ما عندي', female: 'فارغة وشغل ما عندي' },
}

export function getProfessionalStatusLabel(status: ProfessionalStatus | undefined, gender: Gender | undefined): string {
  if (!status) return ''
  const labels = PROFESSIONAL_STATUS_LABELS[status]
  return formatByGender(labels.male, labels.female, gender)
}

// ============================================
// USER RANK LABELS
// ============================================
export const RANK_LABELS: Record<UserRank, { male: string; female: string }> = {
  lion: { male: 'أسد', female: 'لبوة' },
  knight: { male: 'فارس', female: 'فارسة' },
  advisor: { male: 'ناصح', female: 'ناصحة' },
  newbie: { male: 'راسطة', female: 'راسطة' },
}

export function getRankLabel(rank: UserRank | undefined, gender: Gender | undefined): string {
  if (!rank) return ''
  const labels = RANK_LABELS[rank]
  return formatByGender(labels.male, labels.female, gender)
}

// ============================================
// INTERACTION LABELS (for chat, posts, etc.)
// ============================================
export const INTERACTION_LABELS = {
  sent: { male: 'أرسل', female: 'أرسلت' },
  commented: { male: 'علق', female: 'علقت' },
  liked: { male: 'أعجب', female: 'أعجبت' },
  shared: { male: 'شارك', female: 'شاركت' },
  followed: { male: 'تابع', female: 'تابعت' },
  replied: { male: 'رد', female: 'ردت' },
  mentioned: { male: 'ذكر', female: 'ذكرت' },
  abshir: { male: 'أبشر يا فارس', female: 'أبشري يا فارسة' },
  welcome: { male: 'أهلاً بك', female: 'أهلاً بكِ' },
  thanks: { male: 'شكراً لك', female: 'شكراً لكِ' },
  congrats: { male: 'مبروك عليك', female: 'مبروك عليكِ' },
} as const

export type InteractionKey = keyof typeof INTERACTION_LABELS

export function getInteractionLabel(key: InteractionKey, gender: Gender | undefined): string {
  const labels = INTERACTION_LABELS[key]
  return formatByGender(labels.male, labels.female, gender)
}

// ============================================
// GREETING LABELS
// ============================================
export const GREETING_LABELS = {
  morning: { male: 'صباح الخير يا زول', female: 'صباح الخير يا زولة' },
  evening: { male: 'مساء الخير يا زول', female: 'مساء الخير يا زولة' },
  hello: { male: 'سلام يا زول', female: 'سلام يا زولة' },
  bye: { male: 'مع السلامة يا زول', female: 'مع السلامة يا زولة' },
  howAreYou: { male: 'كيفك يا زول؟', female: 'كيفك يا زولة؟' },
} as const

export type GreetingKey = keyof typeof GREETING_LABELS

export function getGreetingLabel(key: GreetingKey, gender: Gender | undefined): string {
  const labels = GREETING_LABELS[key]
  return formatByGender(labels.male, labels.female, gender)
}

// ============================================
// PRONOUN HELPERS
// ============================================
export const PRONOUNS = {
  he_she: { male: 'هو', female: 'هي' },
  his_her: { male: 'له', female: 'لها' },
  him_her: { male: 'إياه', female: 'إياها' },
  you: { male: 'أنت', female: 'أنتِ' },
  your: { male: 'لك', female: 'لكِ' },
} as const

export type PronounKey = keyof typeof PRONOUNS

export function getPronoun(key: PronounKey, gender: Gender | undefined): string {
  const labels = PRONOUNS[key]
  return formatByGender(labels.male, labels.female, gender)
}

// ============================================
// NOTIFICATION TEMPLATES
// ============================================
export function getNotificationText(
  action: 'liked' | 'commented' | 'followed' | 'mentioned' | 'shared',
  senderName: string,
  senderGender: Gender | undefined
): string {
  const actionLabel = getInteractionLabel(action, senderGender)
  
  switch (action) {
    case 'liked':
      return `${senderName} ${actionLabel} بمنشورك`
    case 'commented':
      return `${senderName} ${actionLabel} على منشورك`
    case 'followed':
      return `${senderName} ${actionLabel}ك`
    case 'mentioned':
      return `${senderName} ${actionLabel}ك في منشور`
    case 'shared':
      return `${senderName} ${actionLabel} منشورك`
    default:
      return ''
  }
}

// ============================================
// HOOK FOR EASY ACCESS WITH CURRENT USER
// ============================================
// This will be used with useUserStore to auto-detect gender

export function createGenderFormatter(gender: Gender | undefined) {
  return {
    format: (male: string, female: string) => formatByGender(male, female, gender),
    socialStatus: (status: SocialStatus | undefined) => getSocialStatusLabel(status, gender),
    professionalStatus: (status: ProfessionalStatus | undefined) => getProfessionalStatusLabel(status, gender),
    rank: (rank: UserRank | undefined) => getRankLabel(rank, gender),
    interaction: (key: InteractionKey) => getInteractionLabel(key, gender),
    greeting: (key: GreetingKey) => getGreetingLabel(key, gender),
    pronoun: (key: PronounKey) => getPronoun(key, gender),
  }
}
