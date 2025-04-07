'use client'

import { Suspense, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// 动态导入PWA安装提示组件，在客户端包装器中处理
const PWAInstallPromptComponent = dynamic(
  () => import('./PWAInstallPrompt'),
  { ssr: false }
)

export default function PWAInstallPromptWrapper() {
  const [mounted, setMounted] = useState(false)

  // 确保只在客户端渲染，避免水合错误
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Suspense fallback={null}>
      <PWAInstallPromptComponent />
    </Suspense>
  )
} 