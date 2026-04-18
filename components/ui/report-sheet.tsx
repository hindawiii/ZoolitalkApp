'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flag, X, AlertTriangle, MessageSquare, ShoppingBag, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAppStore, type ReportTarget } from '@/lib/stores/app-store'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

const reportReasons = {
  spam: { en: 'Spam', ar: 'رسائل مزعجة' },
  harassment: { en: 'Harassment', ar: 'تحرش' },
  misinformation: { en: 'Misinformation', ar: 'معلومات خاطئة' },
  inappropriate: { en: 'Inappropriate Content', ar: 'محتوى غير مناسب' },
  violence: { en: 'Violence', ar: 'عنف' },
  other: { en: 'Other', ar: 'أخرى' },
}

const getTargetIcon = (type: ReportTarget['type']) => {
  switch (type) {
    case 'post': return MessageSquare
    case 'message': return MessageSquare
    case 'listing': return ShoppingBag
    case 'comment': return FileText
    default: return Flag
  }
}

const getTargetLabel = (type: ReportTarget['type'], isRTL: boolean) => {
  const labels = {
    post: { en: 'Post', ar: 'منشور' },
    message: { en: 'Message', ar: 'رسالة' },
    listing: { en: 'Listing', ar: 'إعلان' },
    comment: { en: 'Comment', ar: 'تعليق' },
  }
  return isRTL ? labels[type].ar : labels[type].en
}

export function ReportSheet() {
  const { isReportSheetOpen, reportTarget, setReportSheetOpen, submitReport } = useAppStore()
  const { isRTL } = useLanguage()
  const { toast } = useToast()
  const [selectedReason, setSelectedReason] = React.useState<string>('')
  const [details, setDetails] = React.useState<string>('')

  const handleSubmit = () => {
    if (!selectedReason || !reportTarget) return

    submitReport(selectedReason, details)

    // Show success toast
    toast({
      title: isRTL ? 'تم الإبلاغ بنجاح' : 'Report Submitted',
      description: isRTL ? 'شكراً لك على مساعدتنا في الحفاظ على مجتمع آمن' : 'Thank you for helping us maintain a safe community',
      duration: 3000,
    })

    // Reset form
    setSelectedReason('')
    setDetails('')
  }

  const handleClose = () => {
    setReportSheetOpen(false)
    setSelectedReason('')
    setDetails('')
  }

  if (!reportTarget) return null

  const TargetIcon = getTargetIcon(reportTarget.type)

  return (
    <AnimatePresence>
      {isReportSheetOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-card rounded-t-2xl shadow-xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-destructive/10">
                  <Flag className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h3 className={cn('font-semibold', isRTL && 'font-arabic')}>
                    {isRTL ? 'الإبلاغ عن محتوى' : 'Report Content'}
                  </h3>
                  <p className={cn('text-sm text-muted-foreground', isRTL && 'font-arabic')}>
                    {isRTL ? 'اختر سبب الإبلاغ' : 'Select a reason for reporting'}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(80vh-120px)]">
              {/* Target Info */}
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <TargetIcon className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-medium', isRTL && 'font-arabic')}>
                    {getTargetLabel(reportTarget.type, isRTL)}
                  </p>
                  {reportTarget.authorName && (
                    <p className={cn('text-xs text-muted-foreground', isRTL && 'font-arabic')}>
                      {isRTL ? 'بواسطة' : 'By'} {reportTarget.authorName}
                    </p>
                  )}
                </div>
              </div>

              {/* Report Reasons */}
              <div className="space-y-2">
                <h4 className={cn('text-sm font-medium', isRTL && 'font-arabic')}>
                  {isRTL ? 'سبب الإبلاغ' : 'Report Reason'}
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(reportReasons).map(([key, labels]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedReason(key)}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg border text-start transition-colors',
                        selectedReason === key
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-secondary/50',
                        isRTL && 'flex-row-reverse text-end'
                      )}
                    >
                      <div className={cn(
                        'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                        selectedReason === key ? 'border-primary bg-primary' : 'border-muted-foreground'
                      )}>
                        {selectedReason === key && (
                          <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                        )}
                      </div>
                      <span className={cn('text-sm', isRTL && 'font-arabic')}>
                        {isRTL ? labels.ar : labels.en}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-2">
                <h4 className={cn('text-sm font-medium', isRTL && 'font-arabic')}>
                  {isRTL ? 'تفاصيل إضافية (اختياري)' : 'Additional Details (Optional)'}
                </h4>
                <Textarea
                  placeholder={isRTL ? 'أضف المزيد من التفاصيل...' : 'Add more details...'}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className={cn('min-h-[80px] resize-none', isRTL && 'font-arabic text-right')}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-end">
                  {details.length}/500
                </p>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className={cn('text-sm text-amber-700 dark:text-amber-300', isRTL && 'font-arabic')}>
                  {isRTL
                    ? 'سيتم مراجعة الإبلاغ من قبل فريقنا. الإبلاغات الكاذبة قد تؤدي إلى تعليق الحساب.'
                    : 'This report will be reviewed by our team. False reports may result in account suspension.'
                  }
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-4 border-t bg-card">
              <Button
                variant="outline"
                onClick={handleClose}
                className={cn('flex-1', isRTL && 'font-arabic')}
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!selectedReason}
                className={cn('flex-1', isRTL && 'font-arabic')}
              >
                {isRTL ? 'إرسال الإبلاغ' : 'Submit Report'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}