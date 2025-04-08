'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// 调试开关
const DEBUG = true;
// 历史记录栈 - 使用持久化存储
let historyStack: string[] = [];

// 调试日志函数
function debugLog(...args: any[]) {
  if (DEBUG) {
    console.log('[AppTransition]', ...args);
  }
}

// 在客户端初始化历史栈
if (typeof window !== 'undefined') {
  try {
    const savedStack = sessionStorage.getItem('app_history_stack');
    if (savedStack) {
      historyStack = JSON.parse(savedStack);
      debugLog('已从会话存储中恢复历史栈:', historyStack);
    }
  } catch (e) {
    console.error('读取历史栈时出错:', e);
  }
}

// 页面过渡设置
interface PageTransitionOptions {
  duration?: number;      // 动画持续时间
  direction?: 'forward' | 'backward'; // 动画方向
  onAnimationStart?: () => void;  // 动画开始回调
  onAnimationComplete?: () => void; // 动画完成回调
}

// 定义过渡处理钩子
export function useAppTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [nextPath, setNextPath] = useState<string | null>(null);
  
  // 更新历史栈
  useEffect(() => {
    if (!pathname) return;
    
    debugLog('当前路径:', pathname);
    
    // 避免重复添加相同路径
    if (!historyStack.includes(pathname)) {
      historyStack.push(pathname);
      // 限制历史栈大小
      if (historyStack.length > 20) {
        historyStack = historyStack.slice(-20);
      }
      
      // 持久化存储历史栈
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('app_history_stack', JSON.stringify(historyStack));
        } catch (e) {
          console.error('保存历史栈时出错:', e);
        }
      }
      
      debugLog('历史栈已更新:', historyStack);
    }
  }, [pathname]);
  
  // 预加载页面
  const preloadPage = useCallback((url: string) => {
    debugLog('预加载页面:', url);
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if (registration.active) {
          registration.active.postMessage({
            type: 'PRELOAD_PAGE',
            url: url
          });
        }
      }).catch(err => {
        console.error('Failed to preload page:', err);
      });
    }
  }, []);
  
  // 导航到新页面，带过渡效果
  const navigateTo = useCallback((path: string, options: PageTransitionOptions = {}) => {
    if (isTransitioning || path === pathname) return;
    
    const { 
      duration = 500, // 增加持续时间至500ms
      direction: navDirection = 'forward',
      onAnimationStart, 
      onAnimationComplete 
    } = options;
    
    debugLog('导航到:', path, '方向:', navDirection);
    
    setIsTransitioning(true);
    setDirection(navDirection);
    setNextPath(path);
    
    // 开始动画前回调
    if (onAnimationStart) onAnimationStart();
    
    // 预加载目标页面
    preloadPage(path);
    
    // 延迟执行路由跳转，等待动画完成
    setTimeout(() => {
      debugLog('执行实际导航');
      router.push(path);
      
      // 动画完成后回调
      if (onAnimationComplete) onAnimationComplete();
      
      // 等待额外时间再重置状态，确保动画完成
      setTimeout(() => {
        setIsTransitioning(false);
        setNextPath(null);
      }, 100);
    }, duration);
  }, [router, pathname, isTransitioning, preloadPage]);
  
  // 返回上一页，带右滑动画
  const goBack = useCallback((options: PageTransitionOptions = {}) => {
    debugLog('尝试返回上一页, 当前历史栈:', historyStack);
    debugLog('当前路径:', pathname);
    
    // 查找历史栈中的上一个页面
    const currentIndex = historyStack.indexOf(pathname || '');
    debugLog('当前索引:', currentIndex);
    
    // 如果当前页面不在历史栈中或者是第一个页面，返回首页
    if (currentIndex <= 0) {
      debugLog('没有找到上一页，返回首页');
      return navigateTo('/', {
        ...options,
        direction: 'backward'
      });
    }
    
    // 找到上一个页面
    const previousPath = historyStack[currentIndex - 1];
    debugLog('找到上一页:', previousPath);
    
    // 执行返回导航，指定为后退动画
    navigateTo(previousPath, {
      duration: 500, // 显式设置持续时间
      direction: 'backward',
      ...options
    });
  }, [pathname, navigateTo]);
  
  return {
    navigateTo,
    goBack,
    isTransitioning,
    direction,
    nextPath,
    currentPath: pathname
  };
}

// 页面容器组件
interface AppTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export default function AppTransition({ children, className = '' }: AppTransitionProps) {
  const { direction } = useAppTransition();
  const pathname = usePathname();
  
  // 动画变体
  const variants = {
    initial: (dir: string) => {
      const value = dir === 'backward' ? '-100%' : '100%';
      debugLog('初始状态:', { x: value, dir });
      return {
        x: value,
        opacity: 0.3,
        scale: 0.9
      };
    },
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5, // 增加持续时间
        ease: [0.22, 1, 0.36, 1] // 使用更平滑的缓动函数
      }
    },
    exit: (dir: string) => {
      const value = dir === 'backward' ? '100%' : '-100%';
      debugLog('退出状态:', { x: value, dir });
      return {
        x: value,
        opacity: 0.3,
        scale: 0.9,
        transition: {
          duration: 0.5, // 增加持续时间
          ease: [0.22, 1, 0.36, 1]
        }
      };
    }
  };
  
  // 当前路径的键值，用于AnimatePresence
  const pathKey = pathname || 'unknown';
  
  useEffect(() => {
    debugLog('渲染页面:', pathKey, '方向:', direction);
  }, [pathKey, direction]);
  
  return (
    <div className={`w-full h-full overflow-hidden ${className}`}>
      <AnimatePresence 
        mode="wait" 
        initial={false} 
        custom={direction}
        onExitComplete={() => debugLog('退出动画完成')}
      >
        <motion.div
          key={pathKey}
          custom={direction}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full h-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// 预渲染导航链接组件
interface PreloadLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function PreloadLink({ href, children, className = '', onClick }: PreloadLinkProps) {
  const { navigateTo } = useAppTransition();
  const hasPreloaded = useRef(false);
  
  // 预加载页面
  const preload = useCallback(() => {
    if (!hasPreloaded.current && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if (registration.active) {
          registration.active.postMessage({
            type: 'PRELOAD_PAGE',
            url: href
          });
          hasPreloaded.current = true;
          debugLog('已预加载页面:', href);
        }
      }).catch(console.error);
    }
  }, [href]);
  
  // 处理点击事件
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    debugLog('Link点击:', href);
    if (onClick) onClick(e);
    navigateTo(href);
  };
  
  return (
    <a 
      href={href} 
      onClick={handleClick} 
      onMouseEnter={preload}
      onTouchStart={preload}
      className={className}
    >
      {children}
    </a>
  );
}

// 返回按钮组件
interface BackButtonProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function BackButton({ children, className = '', onClick }: BackButtonProps) {
  const { goBack } = useAppTransition();
  
  // 处理点击事件
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    debugLog('返回按钮点击');
    if (onClick) onClick(e);
    goBack();
  };
  
  return (
    <button 
      onClick={handleClick} 
      className={className}
    >
      {children || '返回'}
    </button>
  );
} 