"use client"

import { createContext, useContext, ReactNode } from 'react'

// 在这里配置需要隐藏底部栏的路由
// 支持完整路径和路径前缀（如'/chat'会匹配'/chat'和'/chat/123'）
const HIDDEN_ROUTES: string[] = [
  '/chat',
  '/space',
  // '/settings',
  // '/profile/edit',
]

interface BottomBarContextType {
  isHiddenOnRoute: (currentPath: string) => boolean
}

const BottomBarContext = createContext<BottomBarContextType | undefined>(undefined)

export function BottomBarProvider({ children }: { children: ReactNode }) {
  const isHiddenOnRoute = (currentPath: string) => {
    // 检查完全匹配的路由
    if (HIDDEN_ROUTES.includes(currentPath)) {
      return true
    }
    
    // 检查路径前缀匹配
    for (const route of HIDDEN_ROUTES) {
      if (currentPath.startsWith(route)) {
        return true
      }
    }
    
    return false
  }

  return (
    <BottomBarContext.Provider value={{
      isHiddenOnRoute
    }}>
      {children}
    </BottomBarContext.Provider>
  )
}

export function useBottomBar() {
  const context = useContext(BottomBarContext)
  if (context === undefined) {
    throw new Error('useBottomBar must be used within a BottomBarProvider')
  }
  return context
} 