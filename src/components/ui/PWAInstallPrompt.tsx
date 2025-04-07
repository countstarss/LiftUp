'use client'

import { useState, useEffect } from 'react'
import { X, Download } from 'lucide-react'
import { Button } from './button'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOSDevice, setIsIOSDevice] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // 检测是否是iOS设备
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOSDevice(isIOS)

    // 检测是否已经作为独立应用安装
    const isInStandaloneMode = () => 
      'standalone' in window.navigator && (window.navigator as any).standalone || 
      window.matchMedia('(display-mode: standalone)').matches
    
    setIsStandalone(isInStandaloneMode())

    // 捕获安装提示事件
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPromptEvent(e as BeforeInstallPromptEvent)
      // 仅当用户在PWA中未使用standalone模式时才显示提示
      if (!isInStandaloneMode()) {
        setShowPrompt(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // 如果用户已经安装或添加了PWA，从localStorage中检查
    const hasPromptDismissed = localStorage.getItem('pwa-install-prompt-dismissed')
    if (hasPromptDismissed === 'true' || isInStandaloneMode()) {
      setShowPrompt(false)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPromptEvent) return
    
    try {
      await installPromptEvent.prompt()
      const choiceResult = await installPromptEvent.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        console.log('用户已接受安装PWA')
        setShowPrompt(false)
      } else {
        console.log('用户已拒绝安装PWA')
        // 记录用户已经拒绝过提示
        localStorage.setItem('pwa-install-prompt-dismissed', 'true')
      }
    } catch (error) {
      console.error('安装PWA时出错', error)
    }
    
    setInstallPromptEvent(null)
  }

  const handleIOSInstall = () => {
    // 针对iOS提供的指导性消息
    alert('请点击浏览器底部的"分享"按钮，然后选择"添加到主屏幕"来安装LiftUp应用')
    setShowPrompt(false)
  }

  const handleClose = () => {
    setShowPrompt(false)
    // 记录用户已经关闭过提示，7天内不再显示
    const dismissExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7天
    localStorage.setItem('pwa-install-prompt-dismissed', 'true')
    localStorage.setItem('pwa-install-prompt-dismissed-until', dismissExpiry.toString())
  }

  // 如果已经是standalone模式或用户已经关闭提示，则不显示
  if (!showPrompt || isStandalone) return null

  return (
    <div className="fixed bottom-20 md:bottom-8 left-0 right-0 mx-auto w-[90%] max-w-md bg-background border rounded-xl shadow-lg p-4 z-50 fade-in-up">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">安装LiftUp应用</h3>
          <p className="text-sm text-muted-foreground">
            将LiftUp添加到您的主屏幕，获得更快的访问速度和离线功能。
          </p>
          
          <div className="mt-4 flex gap-2">
            {isIOSDevice ? (
              <Button onClick={handleIOSInstall} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>添加到主屏幕</span>
              </Button>
            ) : (
              <Button onClick={handleInstallClick} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>安装应用</span>
              </Button>
            )}
            <Button variant="outline" onClick={handleClose}>
              稍后再说
            </Button>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">关闭</span>
        </Button>
      </div>
    </div>
  )
} 