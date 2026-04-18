'use client'

import * as React from 'react'
import { useAppStore, type Language } from '@/lib/stores/app-store'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

const LanguageContext = React.createContext<LanguageContextType | null>(null)

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  ar: {
    // App
    'app.name': 'راكوبتنا',
    'app.tagline': 'الراكوبة الرقمية',
    
    // Navigation
    'nav.wansa': 'الونسة',
    'nav.saha': 'الساحة',
    'nav.souq': 'السوق',
    'nav.news': 'الأخبار',
    'nav.profile': 'حسابي',
    
    // Settings
    'settings.title': 'الإعدادات',
    'settings.account': 'إدارة الحساب',
    'settings.editProfile': 'تعديل الملف الشخصي',
    'settings.email': 'البريد الإلكتروني',
    'settings.phone': 'رقم الهاتف',
    'settings.password': 'تغيير كلمة المرور',
    'settings.twoFactor': 'المصادقة الثنائية',
    'settings.language': 'اللغة',
    'settings.theme': 'المظهر',
    'settings.darkMode': 'الوضع الليلي',
    'settings.lightMode': 'الوضع النهاري',
    'settings.privacy': 'الخصوصية والأمان',
    'settings.blocklist': 'قائمة الحظر',
    'settings.onlineStatus': 'إظهار حالة النشاط',
    'settings.dataSaver': 'توفير البيانات',
    'settings.about': 'حول البرنامج',
    'settings.version': 'الإصدار',
    'settings.terms': 'شروط الاستخدام',
    'settings.privacy': 'سياسة الخصوصية',
    'settings.deleteAccount': 'حذف الحساب',
    'settings.deleteWarning': 'هل أنت متأكد؟ هذا الإجراء لا يمكن التراجع عنه.',
    'settings.logout': 'تسجيل الخروج',
    
    // Chat (Al-Wansa)
    'chat.title': 'الونسة',
    'chat.search': 'ابحث في الونسات...',
    'chat.newChat': 'ونسة جديدة',
    'chat.typeMessage': 'اكتب رسالتك...',
    'chat.voiceNote': 'رسالة صوتية',
    'chat.slideCancel': 'اسحب للإلغاء',
    'chat.online': 'نشط الآن',
    'chat.offline': 'غير متصل',
    'chat.typing': 'يكتب...',
    'chat.reply': 'رد',
    'chat.forward': 'تحويل',
    'chat.edit': 'تعديل',
    'chat.delete': 'حذف',
    'chat.copy': 'نسخ',
    'chat.mute': 'كتم',
    'chat.kick': 'طرد',
    'chat.promote': 'ترقية',
    'chat.archive': 'أرشفة',
    'chat.pin': 'تثبيت',
    'chat.unpin': 'إلغاء التثبيت',
    'chat.unmute': 'إلغاء الكتم',
    'chat.translate': 'ترجمة',
    'chat.deleteForMe': 'حذف لي',
    'chat.deleteForEveryone': 'حذف للجميع',
    'chat.games': 'الألعاب',
    'chat.occasions': 'المناسبات',
    'chat.religious': 'المساعد الديني',
    'chat.contacts': 'جهات الاتصال',
    'chat.location': 'موقع',
    'chat.liveLocation': 'موقع مباشر',
    'chat.scanDocument': 'مسح مستند',
    
    // Feed (Al-Saha)
    'feed.title': 'الساحة',
    'feed.newPost': 'منشور جديد',
    'feed.whatsNew': 'شنو الجديد يا زول؟',
    'feed.photo': 'صورة',
    'feed.video': 'فيديو',
    'feed.reels': 'ريلز',
    'feed.like': 'إعجاب',
    'feed.love': 'حب',
    'feed.kaffu': 'كفو',
    'feed.abshir': 'أبشر',
    'feed.comment': 'تعليق',
    'feed.share': 'مشاركة',
    'feed.comments': 'التعليقات',
    'feed.voiceReply': 'رد صوتي',
    
    // Marketplace (Souq)
    'souq.title': 'سوق الجمعة',
    'souq.search': 'ابحث في السوق...',
    'souq.newListing': 'إعلان جديد',
    'souq.all': 'الكل',
    'souq.vehicles': 'عربات',
    'souq.rickshaws': 'ركشات',
    'souq.property': 'عقارات',
    'souq.electronics': 'إلكترونيات',
    'souq.furniture': 'أثاث',
    'souq.clothes': 'ملابس',
    'souq.services': 'خدمات',
    'souq.other': 'أخرى',
    'souq.barter': 'للمقايضة',
    'souq.auction': 'مزاد',
    'souq.fridayAuction': 'مزاد الجمعة',
    'souq.placeBid': 'قدم عرضك',
    'souq.currentBid': 'العرض الحالي',
    'souq.startWansa': 'ابدأ ونسة',
    'souq.price': 'السعر',
    'souq.location': 'الموقع',
    'souq.step1': 'الصور',
    'souq.step2': 'الوصف',
    'souq.step3': 'السعر',
    
    // News
    'news.title': 'أخبار راكوبتنا',
    'news.sudan': 'السودان',
    'news.sports': 'الرياضة',
    'news.economy': 'الاقتصاد',
    'news.crypto': 'العملات الرقمية',
    'news.weather': 'الطقس',
    'news.trending': 'شنو الحاصل؟',
    'news.currency': 'أسعار الصرف',
    'news.gold': 'سعر الذهب',
    
    // Profile
    'profile.title': 'الملف الشخصي',
    'profile.posts': 'المنشورات',
    'profile.followers': 'المتابعين',
    'profile.following': 'المتابَعين',
    'profile.zoolPoints': 'نقاط الزول',
    'profile.editProfile': 'تعديل الملف',
    'profile.follow': 'متابعة',
    'profile.unfollow': 'إلغاء المتابعة',
    'profile.message': 'رسالة',
    'profile.gallery': 'المعرض',
    
    // Gifts
    'gift.jabana': 'جبنة',
    'gift.crown': 'تاج',
    'gift.shield': 'درع',
    'gift.heart': 'قلب',
    'gift.star': 'نجمة',
    'gift.sentBy': 'هدية من',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ',
    'common.retry': 'حاول مرة أخرى',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.confirm': 'تأكيد',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.send': 'إرسال',
    'common.close': 'إغلاق',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.done': 'تم',
    'common.search': 'بحث',
    'common.noResults': 'لا توجد نتائج',
    
    // Placeholders
    'placeholder.enterPhone': 'دخل رقمك يا زول',
    'placeholder.enterEmail': 'دخل إيميلك يا زول',
    'placeholder.enterName': 'اسمك شنو؟',
  },
  en: {
    // App
    'app.name': 'Rakobatna',
    'app.tagline': 'The Digital Rakoba',
    
    // Navigation
    'nav.wansa': 'Al-Wansa',
    'nav.saha': 'Al-Saha',
    'nav.souq': 'Souq',
    'nav.news': 'News',
    'nav.profile': 'Profile',
    
    // Settings
    'settings.title': 'Settings',
    'settings.account': 'Account Management',
    'settings.editProfile': 'Edit Profile',
    'settings.email': 'Email',
    'settings.phone': 'Phone Number',
    'settings.password': 'Change Password',
    'settings.twoFactor': 'Two-Factor Authentication',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.darkMode': 'Dark Mode',
    'settings.lightMode': 'Light Mode',
    'settings.privacy': 'Privacy & Security',
    'settings.blocklist': 'Blocked Users',
    'settings.onlineStatus': 'Show Online Status',
    'settings.dataSaver': 'Data Saver',
    'settings.about': 'About',
    'settings.version': 'Version',
    'settings.terms': 'Terms of Service',
    'settings.deleteAccount': 'Delete Account',
    'settings.deleteWarning': 'Are you sure? This action cannot be undone.',
    'settings.logout': 'Log Out',
    
    // Chat (Al-Wansa)
    'chat.title': 'Al-Wansa',
    'chat.search': 'Search chats...',
    'chat.newChat': 'New Chat',
    'chat.typeMessage': 'Type a message...',
    'chat.voiceNote': 'Voice Note',
    'chat.slideCancel': 'Slide to cancel',
    'chat.online': 'Online',
    'chat.offline': 'Offline',
    'chat.typing': 'typing...',
    'chat.reply': 'Reply',
    'chat.forward': 'Forward',
    'chat.edit': 'Edit',
    'chat.delete': 'Delete',
    'chat.copy': 'Copy',
    'chat.mute': 'Mute',
    'chat.kick': 'Kick',
    'chat.promote': 'Promote',
    'chat.archive': 'Archive',
    'chat.pin': 'Pin',
    'chat.unpin': 'Unpin',
    'chat.unmute': 'Unmute',
    'chat.translate': 'Translate',
    'chat.deleteForMe': 'Delete for me',
    'chat.deleteForEveryone': 'Delete for everyone',
    'chat.games': 'Games',
    'chat.occasions': 'Occasions',
    'chat.religious': 'Religious Assistant',
    'chat.contacts': 'Contacts',
    'chat.location': 'Location',
    'chat.liveLocation': 'Live Location',
    'chat.scanDocument': 'Scan Document',
    
    // Feed (Al-Saha)
    'feed.title': 'Al-Saha',
    'feed.newPost': 'New Post',
    'feed.whatsNew': "What's new, Zool?",
    'feed.photo': 'Photo',
    'feed.video': 'Video',
    'feed.reels': 'Reels',
    'feed.like': 'Like',
    'feed.love': 'Love',
    'feed.kaffu': 'Kaffu',
    'feed.abshir': 'Abshir',
    'feed.comment': 'Comment',
    'feed.share': 'Share',
    'feed.comments': 'Comments',
    'feed.voiceReply': 'Voice Reply',
    
    // Marketplace (Souq)
    'souq.title': "Souq Al-Juma'a",
    'souq.search': 'Search marketplace...',
    'souq.newListing': 'New Listing',
    'souq.all': 'All',
    'souq.vehicles': 'Vehicles',
    'souq.rickshaws': 'Rickshaws',
    'souq.property': 'Property',
    'souq.electronics': 'Electronics',
    'souq.furniture': 'Furniture',
    'souq.clothes': 'Clothes',
    'souq.services': 'Services',
    'souq.other': 'Other',
    'souq.barter': 'For Barter',
    'souq.auction': 'Auction',
    'souq.fridayAuction': 'Friday Auction',
    'souq.placeBid': 'Place Bid',
    'souq.currentBid': 'Current Bid',
    'souq.startWansa': 'Start Wansa',
    'souq.price': 'Price',
    'souq.location': 'Location',
    'souq.step1': 'Photos',
    'souq.step2': 'Description',
    'souq.step3': 'Price',
    
    // News
    'news.title': 'Rakobatna News',
    'news.sudan': 'Sudan',
    'news.sports': 'Sports',
    'news.economy': 'Economy',
    'news.crypto': 'Crypto',
    'news.weather': 'Weather',
    'news.trending': "What's Happening?",
    'news.currency': 'Exchange Rates',
    'news.gold': 'Gold Price',
    
    // Profile
    'profile.title': 'Profile',
    'profile.posts': 'Posts',
    'profile.followers': 'Followers',
    'profile.following': 'Following',
    'profile.zoolPoints': 'Zool Points',
    'profile.editProfile': 'Edit Profile',
    'profile.follow': 'Follow',
    'profile.unfollow': 'Unfollow',
    'profile.message': 'Message',
    'profile.gallery': 'Gallery',
    
    // Gifts
    'gift.jabana': 'Jabana',
    'gift.crown': 'Crown',
    'gift.shield': 'Shield',
    'gift.heart': 'Heart',
    'gift.star': 'Star',
    'gift.sentBy': 'Gift from',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.retry': 'Try Again',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.send': 'Send',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.done': 'Done',
    'common.search': 'Search',
    'common.noResults': 'No results found',
    
    // Placeholders
    'placeholder.enterPhone': 'Enter your phone, Zool',
    'placeholder.enterEmail': 'Enter your email, Zool',
    'placeholder.enterName': "What's your name?",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { language, setLanguage } = useAppStore()
  const isRTL = language === 'ar'

  // Update document direction when language changes
  React.useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
  }, [language, isRTL])

  const t = React.useCallback(
    (key: string): string => {
      return translations[language][key] || key
    },
    [language]
  )

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = React.useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
