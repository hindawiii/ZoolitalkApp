'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  UserPlus, 
  Search,
  X,
  Mail,
  Phone,
  RefreshCw,
  Check,
  ChevronRight,
  ChevronLeft,
  QrCode,
  Share2,
  Link2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'

interface ContactManagerProps {
  isOpen: boolean
  onClose: () => void
  onStartChat: (contactId: string) => void
}

interface Contact {
  id: string
  name: string
  nameAr: string
  phone?: string
  email?: string
  avatar: string
  isOnApp: boolean
  isOnline?: boolean
}

// Demo contacts - some on app, some not
const demoContacts: Contact[] = [
  { id: '1', name: 'Ahmed Hassan', nameAr: 'أحمد حسن', phone: '+249912345678', avatar: '/avatars/ahmed.jpg', isOnApp: true, isOnline: true },
  { id: '2', name: 'Fatima Ali', nameAr: 'فاطمة علي', phone: '+249923456789', avatar: '/avatars/fatima.jpg', isOnApp: true, isOnline: false },
  { id: '3', name: 'Omar Khalid', nameAr: 'عمر خالد', phone: '+249934567890', avatar: '/avatars/omar.jpg', isOnApp: true, isOnline: true },
  { id: '4', name: 'Sara Mohamed', nameAr: 'سارة محمد', phone: '+249945678901', avatar: '/avatars/sara.jpg', isOnApp: false },
  { id: '5', name: 'Hassan Ibrahim', nameAr: 'حسن ابراهيم', phone: '+249956789012', avatar: '', isOnApp: false },
  { id: '6', name: 'Aisha Osman', nameAr: 'عائشة عثمان', email: 'aisha@email.com', avatar: '/avatars/aisha.jpg', isOnApp: true, isOnline: true },
  { id: '7', name: 'Yousif Ali', nameAr: 'يوسف علي', phone: '+249967890123', avatar: '', isOnApp: false },
  { id: '8', name: 'Mona Hassan', nameAr: 'منى حسن', phone: '+249978901234', avatar: '/avatars/mona.jpg', isOnApp: true, isOnline: false },
]

export function ContactManager({ isOpen, onClose, onStartChat }: ContactManagerProps) {
  const { isRTL } = useLanguage()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [activeTab, setActiveTab] = React.useState<'all' | 'add'>('all')
  const [isSyncing, setIsSyncing] = React.useState(false)
  const [addMethod, setAddMethod] = React.useState<'phone' | 'email' | null>(null)
  const [addValue, setAddValue] = React.useState('')
  const [invitedContacts, setInvitedContacts] = React.useState<string[]>([])

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight

  // Filter contacts
  const filteredContacts = React.useMemo(() => {
    if (!searchQuery) return demoContacts
    const query = searchQuery.toLowerCase()
    return demoContacts.filter(
      c => c.name.toLowerCase().includes(query) || 
           c.nameAr.includes(query) ||
           c.phone?.includes(query) ||
           c.email?.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const contactsOnApp = filteredContacts.filter(c => c.isOnApp)
  const contactsNotOnApp = filteredContacts.filter(c => !c.isOnApp)

  // Sync contacts (simulated)
  const syncContacts = async () => {
    setIsSyncing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSyncing(false)
  }

  // Invite contact
  const inviteContact = (contactId: string) => {
    setInvitedContacts(prev => [...prev, contactId])
    // In production, send SMS/email invitation
  }

  // Add contact by phone/email
  const addContact = () => {
    if (!addValue.trim()) return
    // In production, search for user and add
    setAddValue('')
    setAddMethod(null)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: isRTL ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'absolute top-0 bottom-0 w-full max-w-md bg-background',
              isRTL ? 'start-0' : 'end-0'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
              <h2 className={cn('text-lg font-semibold', isRTL && 'font-arabic')}>
                {isRTL ? 'جهات الاتصال' : 'Contacts'}
              </h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={syncContacts}
                disabled={isSyncing}
              >
                <RefreshCw className={cn('h-5 w-5', isSyncing && 'animate-spin')} />
              </Button>
            </div>

            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground start-3" />
                <Input
                  placeholder={isRTL ? 'ابحث عن جهة اتصال...' : 'Search contacts...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-full bg-secondary/50 ps-10 pe-4"
                />
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'add')}>
              <TabsList className="w-full grid grid-cols-2 mx-4 mt-2" style={{ width: 'calc(100% - 2rem)' }}>
                <TabsTrigger value="all" className={cn('gap-2', isRTL && 'font-arabic')}>
                  <Users className="h-4 w-4" />
                  {isRTL ? 'الكل' : 'All'}
                </TabsTrigger>
                <TabsTrigger value="add" className={cn('gap-2', isRTL && 'font-arabic')}>
                  <UserPlus className="h-4 w-4" />
                  {isRTL ? 'إضافة' : 'Add'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <ScrollArea className="h-[calc(100vh-13rem)]">
                  <div className="p-4 space-y-4">
                    {/* Contacts on App */}
                    {contactsOnApp.length > 0 && (
                      <div className="space-y-2">
                        <h3 className={cn('text-sm font-medium text-muted-foreground', isRTL && 'font-arabic')}>
                          {isRTL ? 'على راكوبتنا' : 'On Rakobatna'} ({contactsOnApp.length})
                        </h3>
                        {contactsOnApp.map((contact) => (
                          <ContactItem
                            key={contact.id}
                            contact={contact}
                            isRTL={isRTL}
                            onStartChat={() => onStartChat(contact.id)}
                          />
                        ))}
                      </div>
                    )}

                    {/* Invite to App */}
                    {contactsNotOnApp.length > 0 && (
                      <div className="space-y-2">
                        <h3 className={cn('text-sm font-medium text-muted-foreground', isRTL && 'font-arabic')}>
                          {isRTL ? 'ادعوهم للراكوبة' : 'Invite to Rakobatna'} ({contactsNotOnApp.length})
                        </h3>
                        {contactsNotOnApp.map((contact) => (
                          <InviteContactItem
                            key={contact.id}
                            contact={contact}
                            isRTL={isRTL}
                            isInvited={invitedContacts.includes(contact.id)}
                            onInvite={() => inviteContact(contact.id)}
                          />
                        ))}
                      </div>
                    )}

                    {filteredContacts.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className={cn(isRTL && 'font-arabic')}>
                          {isRTL ? 'لا توجد جهات اتصال' : 'No contacts found'}
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="add" className="mt-0">
                <div className="p-4 space-y-4">
                  {/* Add Methods */}
                  {!addMethod ? (
                    <div className="space-y-3">
                      <p className={cn('text-sm text-muted-foreground text-center', isRTL && 'font-arabic')}>
                        {isRTL ? 'كيف تريد إضافة جهة اتصال؟' : 'How would you like to add a contact?'}
                      </p>

                      <Button
                        variant="outline"
                        className="w-full justify-between h-14"
                        onClick={() => setAddMethod('phone')}
                      >
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-primary" />
                          <span className={cn(isRTL && 'font-arabic')}>
                            {isRTL ? 'رقم الهاتف' : 'Phone Number'}
                          </span>
                        </div>
                        <ChevronIcon className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-between h-14"
                        onClick={() => setAddMethod('email')}
                      >
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-primary" />
                          <span className={cn(isRTL && 'font-arabic')}>
                            {isRTL ? 'البريد الإلكتروني' : 'Email'}
                          </span>
                        </div>
                        <ChevronIcon className="h-4 w-4" />
                      </Button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className={cn('bg-background px-2 text-muted-foreground', isRTL && 'font-arabic')}>
                            {isRTL ? 'أو' : 'or'}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full justify-between h-14"
                      >
                        <div className="flex items-center gap-3">
                          <QrCode className="h-5 w-5 text-primary" />
                          <span className={cn(isRTL && 'font-arabic')}>
                            {isRTL ? 'مسح رمز QR' : 'Scan QR Code'}
                          </span>
                        </div>
                        <ChevronIcon className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-between h-14"
                      >
                        <div className="flex items-center gap-3">
                          <Link2 className="h-5 w-5 text-primary" />
                          <span className={cn(isRTL && 'font-arabic')}>
                            {isRTL ? 'رابط الدعوة' : 'Invite Link'}
                          </span>
                        </div>
                        <ChevronIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAddMethod(null)}
                        className="gap-2"
                      >
                        <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                        {isRTL ? 'رجوع' : 'Back'}
                      </Button>

                      <div className="space-y-3">
                        <label className={cn('text-sm font-medium', isRTL && 'font-arabic')}>
                          {addMethod === 'phone' 
                            ? (isRTL ? 'رقم الهاتف' : 'Phone Number')
                            : (isRTL ? 'البريد الإلكتروني' : 'Email Address')
                          }
                        </label>
                        <Input
                          type={addMethod === 'phone' ? 'tel' : 'email'}
                          placeholder={addMethod === 'phone' ? '+249 xxx xxx xxx' : 'email@example.com'}
                          value={addValue}
                          onChange={(e) => setAddValue(e.target.value)}
                          className={cn(isRTL && 'text-right')}
                          dir="ltr"
                        />
                        <Button 
                          className="w-full gap-2" 
                          onClick={addContact}
                          disabled={!addValue.trim()}
                        >
                          <UserPlus className="h-4 w-4" />
                          <span className={cn(isRTL && 'font-arabic')}>
                            {isRTL ? 'إضافة جهة اتصال' : 'Add Contact'}
                          </span>
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Share Your Profile */}
                  <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl mt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Share2 className="h-5 w-5 text-primary" />
                      <h3 className={cn('font-semibold', isRTL && 'font-arabic')}>
                        {isRTL ? 'شارك ملفك' : 'Share Your Profile'}
                      </h3>
                    </div>
                    <p className={cn('text-sm text-muted-foreground mb-3', isRTL && 'font-arabic')}>
                      {isRTL 
                        ? 'دع أصدقاءك يضيفوك بسهولة'
                        : 'Let your friends add you easily'
                      }
                    </p>
                    <Button variant="outline" className="w-full gap-2">
                      <QrCode className="h-4 w-4" />
                      <span className={cn(isRTL && 'font-arabic')}>
                        {isRTL ? 'عرض رمز QR الخاص بك' : 'Show Your QR Code'}
                      </span>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Contact Item Component
function ContactItem({ 
  contact, 
  isRTL, 
  onStartChat 
}: { 
  contact: Contact
  isRTL: boolean
  onStartChat: () => void 
}) {
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onStartChat}
      className="w-full flex items-center gap-3 p-3 bg-card rounded-xl hover:bg-secondary/50 transition-colors"
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={contact.avatar} alt={contact.name} />
          <AvatarFallback>{(isRTL ? contact.nameAr : contact.name)[0]}</AvatarFallback>
        </Avatar>
        {contact.isOnline && (
          <span className="absolute bottom-0 end-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
        )}
      </div>
      <div className="flex-1 text-start">
        <p className={cn('font-medium', isRTL && 'font-arabic')}>
          {isRTL ? contact.nameAr : contact.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {contact.phone || contact.email}
        </p>
      </div>
      <ChevronIcon className="h-4 w-4 text-muted-foreground" />
    </motion.button>
  )
}

// Invite Contact Item Component
function InviteContactItem({ 
  contact, 
  isRTL,
  isInvited,
  onInvite 
}: { 
  contact: Contact
  isRTL: boolean
  isInvited: boolean
  onInvite: () => void 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-3 bg-card rounded-xl"
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={contact.avatar} alt={contact.name} />
        <AvatarFallback className="bg-muted">
          {(isRTL ? contact.nameAr : contact.name)[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className={cn('font-medium', isRTL && 'font-arabic')}>
          {isRTL ? contact.nameAr : contact.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {contact.phone || contact.email}
        </p>
      </div>
      <Button
        size="sm"
        variant={isInvited ? 'outline' : 'default'}
        onClick={onInvite}
        disabled={isInvited}
        className={cn(isRTL && 'font-arabic')}
      >
        {isInvited ? (
          <span className="flex items-center gap-1">
            <Check className="h-4 w-4" />
            {isRTL ? 'تم' : 'Sent'}
          </span>
        ) : (
          isRTL ? 'دعوة' : 'Invite'
        )}
      </Button>
    </motion.div>
  )
}
