'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, X, Check, RotateCcw, Contrast, Sun, ScanLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'

interface DocumentScannerProps {
  isOpen: boolean
  onClose: () => void
  onCapture: (imageData: string) => void
}

export function DocumentScanner({ isOpen, onClose, onCapture }: DocumentScannerProps) {
  const { isRTL } = useLanguage()
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = React.useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null)
  const [contrast, setContrast] = React.useState(1.2)
  const [brightness, setBrightness] = React.useState(1.1)
  const [isProcessing, setIsProcessing] = React.useState(false)

  // Start camera
  React.useEffect(() => {
    if (isOpen && !stream) {
      startCamera()
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [isOpen])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    // Set canvas size to video size
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame
    ctx.drawImage(video, 0, 0)

    // Apply document scanning filter (high contrast, grayscale-ish)
    applyDocumentFilter(ctx, canvas.width, canvas.height)

    // Convert to data URL
    const imageData = canvas.toDataURL('image/jpeg', 0.9)
    setCapturedImage(imageData)
  }

  const applyDocumentFilter = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      // Get RGB values
      let r = data[i]
      let g = data[i + 1]
      let b = data[i + 2]

      // Apply brightness
      r *= brightness
      g *= brightness
      b *= brightness

      // Apply contrast
      r = ((r / 255 - 0.5) * contrast + 0.5) * 255
      g = ((g / 255 - 0.5) * contrast + 0.5) * 255
      b = ((b / 255 - 0.5) * contrast + 0.5) * 255

      // Convert to grayscale for document-like appearance (optional, can be adjusted)
      // const gray = 0.299 * r + 0.587 * g + 0.114 * b

      // Clamp values
      data[i] = Math.max(0, Math.min(255, r))
      data[i + 1] = Math.max(0, Math.min(255, g))
      data[i + 2] = Math.max(0, Math.min(255, b))
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const reprocessImage = () => {
    if (!canvasRef.current || !capturedImage) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      applyDocumentFilter(ctx, canvas.width, canvas.height)
      setCapturedImage(canvas.toDataURL('image/jpeg', 0.9))
    }
    img.src = capturedImage
  }

  const confirmCapture = () => {
    if (capturedImage) {
      setIsProcessing(true)
      // Simulate processing
      setTimeout(() => {
        onCapture(capturedImage)
        handleClose()
      }, 500)
    }
  }

  const retake = () => {
    setCapturedImage(null)
  }

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setCapturedImage(null)
    setIsProcessing(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 text-white">
            <Button variant="ghost" size="icon" onClick={handleClose} className="text-white hover:bg-white/20">
              <X className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2">
              <ScanLine className="h-5 w-5" />
              <span className={cn('font-medium', isRTL && 'font-arabic')}>
                {isRTL ? 'مسح المستند' : 'Document Scanner'}
              </span>
            </div>
            <div className="w-10" />
          </div>

          {/* Camera/Preview */}
          <div className="flex-1 relative">
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured document"
                className="w-full h-full object-contain"
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Document frame overlay */}
                <div className="absolute inset-4 border-2 border-white/50 rounded-lg pointer-events-none">
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-lg" />
                </div>
                {/* Scanning line animation */}
                <motion.div
                  className="absolute left-4 right-4 h-0.5 bg-primary"
                  initial={{ top: '10%' }}
                  animate={{ top: ['10%', '90%', '10%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
              </>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Controls */}
          {capturedImage ? (
            <div className="p-6 space-y-4 bg-black/80">
              {/* Adjustment Sliders */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white">
                  <Contrast className="h-4 w-4" />
                  <span className={cn('text-sm w-20', isRTL && 'font-arabic')}>
                    {isRTL ? 'التباين' : 'Contrast'}
                  </span>
                  <Slider
                    value={[contrast]}
                    onValueChange={([v]) => {
                      setContrast(v)
                      reprocessImage()
                    }}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Sun className="h-4 w-4" />
                  <span className={cn('text-sm w-20', isRTL && 'font-arabic')}>
                    {isRTL ? 'السطوع' : 'Brightness'}
                  </span>
                  <Slider
                    value={[brightness]}
                    onValueChange={([v]) => {
                      setBrightness(v)
                      reprocessImage()
                    }}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-6">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={retake}
                  className="rounded-full border-white/50 text-white hover:bg-white/20 gap-2"
                >
                  <RotateCcw className="h-5 w-5" />
                  {isRTL ? 'إعادة' : 'Retake'}
                </Button>
                <Button
                  size="lg"
                  onClick={confirmCapture}
                  disabled={isProcessing}
                  className="rounded-full bg-primary hover:bg-primary/90"
                >
                  {isProcessing ? (
                    <motion.div
                      className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    <span className="flex items-center gap-2">
                      <Check className="h-5 w-5" />
                      {isRTL ? 'تأكيد' : 'Confirm'}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-6 flex justify-center">
              <Button
                size="lg"
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-white hover:bg-white/90"
              >
                <Camera className="h-8 w-8 text-black" />
              </Button>
            </div>
          )}

          {/* Hint Text */}
          <div className="pb-6 text-center text-white/70 text-sm">
            <p className={cn(isRTL && 'font-arabic')}>
              {capturedImage 
                ? (isRTL ? 'اضبط الصورة ثم اضغط تأكيد' : 'Adjust image and tap confirm')
                : (isRTL ? 'ضع المستند في الإطار واضغط للمسح' : 'Position document in frame and tap to scan')
              }
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
