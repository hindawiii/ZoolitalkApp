'use client'

import { create } from 'zustand'

export type OpportunityApplicationType = 'inApp' | 'external'
export type OpportunityType = 'scholarship' | 'job'

export interface Opportunity {
  id: string
  type: OpportunityType
  title: string
  titleAr: string
  organization: string
  organizationAr: string
  location: string
  locationAr: string
  deadline: string
  deadlineAr: string
  description: string
  descriptionAr: string
  image: string
  source: string
  sourceAr: string
  sourceUrl: string
  applicationType: OpportunityApplicationType
  isVerified: boolean
  status: string
  categoryLabel: string
  categoryLabelAr: string
}

interface NewsState {
  opportunities: Opportunity[]
  selectedOpportunity: Opportunity | null
  setSelectedOpportunity: (opportunity: Opportunity | null) => void
}

const initialOpportunities: Opportunity[] = [
  {
    id: 'o1',
    type: 'scholarship',
    title: 'Qatar University Full Scholarship 2026',
    titleAr: 'منحة جامعة قطر الكاملة 2026',
    organization: 'Qatar University',
    organizationAr: 'جامعة قطر',
    location: 'Qatar',
    locationAr: 'قطر',
    deadline: 'May 15, 2026',
    deadlineAr: '15 مايو 2026',
    description: 'Full scholarship covering tuition, accommodation, and monthly stipend for undergraduate programs.',
    descriptionAr: 'منحة كاملة تشمل الرسوم الدراسية والسكن وبدل شهري لبرامج البكالوريوس.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900',
    source: 'Qatar University',
    sourceAr: 'جامعة قطر',
    sourceUrl: 'https://example.com/qatar-scholarship',
    applicationType: 'external',
    isVerified: true,
    status: 'Featured',
    categoryLabel: 'Scholarship',
    categoryLabelAr: 'منحة',
  },
  {
    id: 'o2',
    type: 'scholarship',
    title: 'Türkiye Bursları Scholarship Program',
    titleAr: 'برنامج المنح التركية',
    organization: 'Türkiye Scholarships',
    organizationAr: 'منح تركيا',
    location: 'Turkey',
    locationAr: 'تركيا',
    deadline: 'February 20, 2026',
    deadlineAr: '20 فبراير 2026',
    description: 'Government-funded scholarship for international students including Sudanese nationals.',
    descriptionAr: 'منحة حكومية للطلاب الدوليين بما في ذلك السودانيين.',
    image: 'https://images.unsplash.com/photo-1511174511562-5f7f18b874f2?w=900',
    source: 'Türkiye Scholarships',
    sourceAr: 'منح تركيا',
    sourceUrl: 'https://example.com/turkey-scholarship',
    applicationType: 'external',
    isVerified: true,
    status: 'Apply Now',
    categoryLabel: 'Scholarship',
    categoryLabelAr: 'منحة',
  },
  {
    id: 'o3',
    type: 'job',
    title: 'Frontend Developer',
    titleAr: 'مطور واجهات أمامية',
    organization: 'Remote Tech Co.',
    organizationAr: 'شركة ريموت تك',
    location: 'Remote',
    locationAr: 'عن بعد',
    deadline: 'June 1, 2026',
    deadlineAr: '1 يونيو 2026',
    description: 'React/Next.js developer position open to Sudanese developers worldwide.',
    descriptionAr: 'وظيفة مطور React/Next.js متاحة للمطورين السودانيين حول العالم.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900',
    source: 'Remote Tech Co.',
    sourceAr: 'شركة ريموت تك',
    sourceUrl: 'https://example.com/job1',
    applicationType: 'inApp',
    isVerified: true,
    status: 'Open',
    categoryLabel: 'Jobs',
    categoryLabelAr: 'وظائف',
  },
  {
    id: 'o4',
    type: 'job',
    title: 'Customer Support Specialist',
    titleAr: 'أخصائي دعم العملاء',
    organization: 'Gulf Services Ltd',
    organizationAr: 'خدمات الخليج المحدودة',
    location: 'Riyadh, Saudi Arabia',
    locationAr: 'الرياض، السعودية',
    deadline: 'May 30, 2026',
    deadlineAr: '30 مايو 2026',
    description: 'Arabic-speaking support role based in Riyadh, Saudi Arabia.',
    descriptionAr: 'وظيفة دعم بالعربية في الرياض، المملكة العربية السعودية.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900',
    source: 'Gulf Services Ltd',
    sourceAr: 'خدمات الخليج المحدودة',
    sourceUrl: 'https://example.com/job2',
    applicationType: 'external',
    isVerified: false,
    status: 'Hiring',
    categoryLabel: 'Jobs',
    categoryLabelAr: 'وظائف',
  },
]

export const useNewsStore = create<NewsState>((set) => ({
  opportunities: initialOpportunities,
  selectedOpportunity: null,
  setSelectedOpportunity: (opportunity) => set({ selectedOpportunity: opportunity }),
}))
