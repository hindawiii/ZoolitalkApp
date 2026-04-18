'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Shield, 
  Globe, 
  Moon, 
  Sun, 
  Wifi,
  UserX,
  Eye,
  Info,
  FileText,
  Trash2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useAppStore } from '@/lib/stores/app-store'
import { useUserStore } from '@/lib/stores/user-store'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { RakobaLogo } from '@/components/ui/rakoba-logo'

interface SettingsSection {
  title: string
  items: SettingsItem[]
}

interface SettingsItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  type: 'navigate' | 'toggle' | 'action' | 'danger'
  value?: boolean
  onToggle?: (value: boolean) => void
  onClick?: () => void
}

export function SettingsDrawer() {
  const { isSettingsOpen, setSettingsOpen, dataSaverEnabled, setDataSaver, showOnlineStatus, setShowOnlineStatus } = useAppStore()
  const { language, setLanguage, t, isRTL } = useLanguage()
  const { theme, setTheme } = useTheme()
  const { currentUser, blockedUsers, unblockUser, setAuthenticated } = useUserStore()
  const [showBlocklist, setShowBlocklist] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && theme === 'dark'
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight

  const handleLanguageToggle = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar')
  }

  const handleThemeToggle = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  const handleLogout = () => {
    setAuthenticated(false)
    setSettingsOpen(false)
  }

  // Blocklist view
  if (showBlocklist) {
    return (
<Drawer open={isSettingsOpen} onOpenChange={setSettingsOpen} direction={isRTL ? 'right' : 'left'}>
        <DrawerContent dir={isRTL ? 'rtl' : 'ltr'} className={cn('w-full max-w-full overflow-x-hidden', isRTL && 'font-arabic')}>
          <DrawerHeader className="flex flex-row items-center gap-3 border-b w-full">
            <Button variant="ghost" size="icon" onClick={() => setShowBlocklist(false)}>
              {isRTL ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
            <div>
              <DrawerTitle>{t('settings.blocklist')}</DrawerTitle>
              <DrawerDescription className="sr-only">
                {isRTL ? 'قائمة المستخدمين المحظورين' : 'List of blocked users'}
              </DrawerDescription>
            </div>
          </DrawerHeader>
          <ScrollArea className="flex-1 p-4">
            {blockedUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <UserX className="h-12 w-12 mb-4 opacity-50" />
                <p>{t('common.noResults')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {blockedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => unblockUser(user.id)}
                    >
                      {isRTL ? 'إلغاء الحظر' : 'Unblock'}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Drawer open={isSettingsOpen} onOpenChange={setSettingsOpen} direction={isRTL ? 'right' : 'left'}>
      <DrawerContent dir={isRTL ? 'rtl' : 'ltr'} className={cn(isRTL && 'font-arabic')}>
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-xl">{t('settings.title')}</DrawerTitle>
              <DrawerDescription className="sr-only">
                {isRTL ? 'إعدادات التطبيق والحساب' : 'App and account settings'}
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="sm">
                {t('common.close')}
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-4 pb-8 space-y-6">
            {/* Profile Header */}
            {currentUser && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                <Avatar className="h-14 w-14 border-2 border-primary">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {(isRTL ? currentUser.nameAr : currentUser.name)[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">
                    {isRTL ? currentUser.nameAr : currentUser.name}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {currentUser.email}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  {t('settings.editProfile')}
                </Button>
              </div>
            )}

            {/* Account Management */}
            <section>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
                {t('settings.account')}
              </h4>
              <div className="space-y-1 rounded-xl bg-card border overflow-hidden">
                <SettingsRow icon={Mail} label={t('settings.email')} type="navigate" />
                <Separator />
                <SettingsRow icon={Phone} label={t('settings.phone')} type="navigate" />
                <Separator />
                <SettingsRow icon={Lock} label={t('settings.password')} type="navigate" />
                <Separator />
                <SettingsRow icon={Shield} label={t('settings.twoFactor')} type="navigate" />
              </div>
            </section>

            {/* App Preferences */}
            <section>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
                {isRTL ? 'تفضيلات التطبيق' : 'App Preferences'}
              </h4>
              <div className="space-y-1 rounded-xl bg-card border overflow-hidden">
                {/* Language Toggle */}
                <button
                  onClick={handleLanguageToggle}
                  className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <span>{t('settings.language')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'العربية' : 'English'}
                    </span>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {language === 'ar' ? 'AR' : 'EN'}
                    </div>
                  </div>
                </button>
                <Separator />
                {/* Theme Toggle */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    {isDark ? (
                      <Moon className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Sun className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span>{isDark ? t('settings.darkMode') : t('settings.lightMode')}</span>
                  </div>
                  <Switch
                    checked={isDark}
                    onCheckedChange={handleThemeToggle}
                  />
                </div>
                <Separator />
                {/* Data Saver */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Wifi className="h-5 w-5 text-muted-foreground" />
                    <span>{t('settings.dataSaver')}</span>
                  </div>
                  <Switch
                    checked={dataSaverEnabled}
                    onCheckedChange={setDataSaver}
                  />
                </div>
              </div>
            </section>

            {/* Privacy & Security */}
            <section>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
                {t('settings.privacy')}
              </h4>
              <div className="space-y-1 rounded-xl bg-card border overflow-hidden">
                <button
                  onClick={() => setShowBlocklist(true)}
                  className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <UserX className="h-5 w-5 text-muted-foreground" />
                    <span>{t('settings.blocklist')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {blockedUsers.length}
                    </span>
                    <ChevronIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
                <Separator />
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-muted-foreground" />
                    <span>{t('settings.onlineStatus')}</span>
                  </div>
                  <Switch
                    checked={showOnlineStatus}
                    onCheckedChange={setShowOnlineStatus}
                  />
                </div>
              </div>
            </section>

            {/* About */}
            <section>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
                {t('settings.about')}
              </h4>
              <div className="space-y-1 rounded-xl bg-card border overflow-hidden">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Info className="h-5 w-5 text-muted-foreground" />
                    <span>{t('settings.version')}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">v3.0.0</span>
                </div>
                <Separator />
                <SettingsRow icon={FileText} label={t('settings.terms')} type="navigate" />
              </div>
            </section>

            {/* Danger Zone */}
            <section>
              <h4 className="text-sm font-semibold text-destructive/70 mb-3 px-1">
                {isRTL ? 'منطقة الخطر' : 'Danger Zone'}
              </h4>
              <div className="space-y-1 rounded-xl bg-card border border-destructive/20 overflow-hidden">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="w-full flex items-center gap-3 p-4 text-destructive hover:bg-destructive/10 transition-colors">
                      <Trash2 className="h-5 w-5" />
                      <span>{t('settings.deleteAccount')}</span>
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className={cn(isRTL && 'font-arabic')}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('settings.deleteAccount')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('settings.deleteWarning')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className={cn(isRTL && 'flex-row-reverse')}>
                      <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        {t('common.delete')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </section>

            {/* Logout Button */}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              {t('settings.logout')}
            </Button>

            {/* App Info Footer */}
            <div className="flex flex-col items-center justify-center py-4 gap-2">
              <RakobaLogo size="lg" />
              <p className={cn('text-lg font-semibold text-primary', isRTL && 'font-arabic')}>
                {t('app.name')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('app.tagline')}
              </p>
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}

// Reusable settings row component
function SettingsRow({
  icon: Icon,
  label,
  type,
  value,
  onToggle,
  onClick,
}: SettingsItem) {
  const { isRTL } = useLanguage()
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight

  if (type === 'toggle') {
    return (
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-muted-foreground" />
          <span>{label}</span>
        </div>
        <Switch checked={value} onCheckedChange={onToggle} />
      </div>
    )
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors',
        type === 'danger' && 'text-destructive hover:bg-destructive/10'
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <span>{label}</span>
      </div>
      {type === 'navigate' && <ChevronIcon className="h-4 w-4 text-muted-foreground" />}
    </button>
  )
}
