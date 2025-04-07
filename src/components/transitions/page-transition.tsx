"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// 默认过渡动画持续时间（毫秒）
const DEFAULT_DURATION = 300;
// 预加载延迟时间 - 给预加载一些时间完成
const PRELOAD_DELAY = 80;

// 缓存记录上一个路径
let cachedRoutes: string[] = [];
// 最多缓存路径数量
const MAX_CACHED_ROUTES = 5;

/**
 * 页面过渡钩子，提供向右滑动的页面切换效果
 * @param {number} defaultDuration - 默认动画持续时间（毫秒）
 * @returns 包含页面导航方法的对象
 */
export function usePageTransition(defaultDuration = DEFAULT_DURATION) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [navigationState, setNavigationState] = useState<{
    active: boolean;
    pendingPath: string | null;
    animationStartTime: number | null;
  }>({
    active: false,
    pendingPath: null,
    animationStartTime: null
  });
  
  // 缓存当前路径
  useEffect(() => {
    if (pathname && typeof window !== 'undefined') {
      // 记录当前路径以便后续快速返回
      if (!cachedRoutes.includes(pathname)) {
        cachedRoutes.unshift(pathname);
        if (cachedRoutes.length > MAX_CACHED_ROUTES) {
          cachedRoutes.pop();
        }
      }
      
      // 使用浏览器预取API预加载已访问过的相邻页面
      if (cachedRoutes.length > 1) {
        // 预加载前一个路径和后一个路径
        const currentIndex = cachedRoutes.indexOf(pathname);
        if (currentIndex > 0) {
          const prevPath = cachedRoutes[currentIndex - 1];
          prefetchPath(prevPath);
        }
        if (currentIndex < cachedRoutes.length - 1) {
          const nextPath = cachedRoutes[currentIndex + 1];
          prefetchPath(nextPath);
        }
      }
    }
  }, [pathname]);
  
  // 检测移动设备
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 设置初始移动设备状态
      setIsMobile(window.innerWidth < 768);
      
      // 监听窗口大小变化
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // 预加载指定路径
  const prefetchPath = useCallback((path: string) => {
    if (typeof window !== 'undefined') {
      // 创建一个隐藏的iframe来预加载页面
      const preloadFrame = document.createElement('iframe');
      preloadFrame.style.width = '0';
      preloadFrame.style.height = '0';
      preloadFrame.style.position = 'absolute';
      preloadFrame.style.top = '-9999px';
      preloadFrame.style.border = 'none';
      preloadFrame.setAttribute('aria-hidden', 'true');
      preloadFrame.setAttribute('tabindex', '-1');
      
      // 设置iframe源为要预加载的路径
      preloadFrame.src = path;
      
      // 添加到DOM
      document.body.appendChild(preloadFrame);
      
      // 5秒后移除iframe以避免内存泄漏
      setTimeout(() => {
        if (document.body.contains(preloadFrame)) {
          document.body.removeChild(preloadFrame);
        }
      }, 5000);
    }
  }, []);
  
  /**
   * 返回上一页，在移动设备上应用滑动动画
   * @param {number} duration - 动画持续时间（毫秒）
   */
  const goBack = (duration = defaultDuration) => {
    if (!isMobile) {
      // 桌面设备直接返回，无动画
      router.push('/');
      return;
    }
    
    if (isAnimating) return; // 防止动画重复触发
    setIsAnimating(true);
    
    // 更新CSS变量以控制动画速度
    document.documentElement.style.setProperty('--page-transition-duration', `${duration}ms`);
    
    // 获取上一个路径
    const previousPath = cachedRoutes.length > 1 ? cachedRoutes[1] : '/';
    
    // 预加载上一个页面内容 - 立即开始预加载
    if (previousPath && previousPath !== pathname) {
      prefetchPath(previousPath);
    }
    
    // 添加动画类触发退出动画
    document.body.classList.add('page-exit-active');
    
    // 记录开始时间
    const startTime = Date.now();
    
    // 预加载延迟，让浏览器有时间预加载资源
    setTimeout(() => {
      // 计算已经过去的时间
      const elapsedTime = Date.now() - startTime;
      // 计算剩余动画时间
      const remainingTime = Math.max(0, duration - elapsedTime);
      
      // 创建一个隐藏的div显示目标页面内容
      const preloadContainer = document.createElement('div');
      preloadContainer.className = 'preload-container';
      preloadContainer.style.position = 'fixed';
      preloadContainer.style.top = '0';
      preloadContainer.style.left = '0';
      preloadContainer.style.width = '100%';
      preloadContainer.style.height = '100%';
      preloadContainer.style.zIndex = '-1';
      preloadContainer.style.opacity = '0';
      preloadContainer.style.pointerEvents = 'none';
      document.body.appendChild(preloadContainer);
      
      // 动画完成后再执行路由跳转
      setTimeout(() => {
        document.body.classList.remove('page-exit-active');
        router.push('/');
        setIsAnimating(false);
        // 移除预加载容器
        if (document.body.contains(preloadContainer)) {
          document.body.removeChild(preloadContainer);
        }
      }, remainingTime);
    }, PRELOAD_DELAY);
  };
  
  /**
   * 导航到指定路径，在移动设备上应用滑动动画
   * @param {string} path - 目标路径
   * @param {number} duration - 动画持续时间（毫秒）
   */
  const goTo = (path: string, duration = defaultDuration) => {
    if (!isMobile) {
      // 桌面设备直接导航，无动画
      router.push(path);
      return;
    }
    
    if (isAnimating) return; // 防止动画重复触发
    setIsAnimating(true);
    
    // 更新CSS变量以控制动画速度
    document.documentElement.style.setProperty('--page-transition-duration', `${duration}ms`);
    
    // 预加载目标页面内容 - 立即开始预加载
    prefetchPath(path);
    
    // 添加动画类触发退出动画
    document.body.classList.add('page-exit-active');
    
    // 记录开始时间
    const startTime = Date.now();
    
    // 预加载延迟，让浏览器有时间预加载资源
    setTimeout(() => {
      // 计算已经过去的时间
      const elapsedTime = Date.now() - startTime;
      // 计算剩余动画时间
      const remainingTime = Math.max(0, duration - elapsedTime);
      
      // 创建一个隐藏的div显示目标页面内容
      const preloadContainer = document.createElement('div');
      preloadContainer.className = 'preload-container';
      preloadContainer.style.position = 'fixed';
      preloadContainer.style.top = '0';
      preloadContainer.style.left = '0';
      preloadContainer.style.width = '100%';
      preloadContainer.style.height = '100%';
      preloadContainer.style.zIndex = '-1';
      preloadContainer.style.opacity = '0';
      preloadContainer.style.pointerEvents = 'none';
      document.body.appendChild(preloadContainer);
      
      // 动画完成后再执行路由跳转
      setTimeout(() => {
        document.body.classList.remove('page-exit-active');
        router.push(path);
        setIsAnimating(false);
        // 移除预加载容器
        if (document.body.contains(preloadContainer)) {
          document.body.removeChild(preloadContainer);
        }
      }, remainingTime);
    }, PRELOAD_DELAY);
  };
  
  /**
   * 触发测试动画效果
   * @param {number} duration - 动画持续时间（毫秒）
   */
  const testAnimation = (duration = defaultDuration) => {
    if (!isMobile) {
      console.log('非移动设备不显示滑动效果');
      return;
    }
    
    if (isAnimating) return;
    setIsAnimating(true);
    
    // 更新CSS变量以控制动画速度
    document.documentElement.style.setProperty('--page-transition-duration', `${duration}ms`);
    
    // 添加动画类触发退出动画
    document.body.classList.add('page-exit-active');
    
    // 动画完成后移除类
    setTimeout(() => {
      document.body.classList.remove('page-exit-active');
      setIsAnimating(false);
      console.log(`动画完成，持续时间：${duration}ms`);
    }, duration);
  };
  
  return {
    goBack,
    goTo,
    testAnimation,
    isAnimating,
    isMobile,
    cachedRoutes
  };
}

// 默认导出钩子函数
export default usePageTransition; 