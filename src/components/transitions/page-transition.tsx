"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 默认过渡动画持续时间（毫秒）
const DEFAULT_DURATION = 300;

/**
 * 页面过渡钩子，提供向右滑动的页面切换效果
 * @param {number} defaultDuration - 默认动画持续时间（毫秒）
 * @returns 包含页面导航方法的对象
 */
export function usePageTransition(defaultDuration = DEFAULT_DURATION) {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
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
  
  /**
   * 返回上一页，在移动设备上应用滑动动画
   * @param {number} duration - 动画持续时间（毫秒）
   */
  const goBack = (duration = defaultDuration) => {
    if (!isMobile) {
      // 桌面设备直接返回，无动画
      router.back();
      return;
    }
    
    if (isAnimating) return; // 防止动画重复触发
    setIsAnimating(true);
    
    // 更新CSS变量以控制动画速度
    document.documentElement.style.setProperty('--page-transition-duration', `${duration}ms`);
    
    // 添加动画类触发退出动画
    document.body.classList.add('page-exit-active');
    
    // 动画完成后移除类并导航
    setTimeout(() => {
      document.body.classList.remove('page-exit-active');
      router.back();
      setIsAnimating(false);
    }, duration);
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
    
    // 添加动画类触发退出动画
    document.body.classList.add('page-exit-active');
    
    // 动画完成后移除类并导航
    setTimeout(() => {
      document.body.classList.remove('page-exit-active');
      router.push(path);
      setIsAnimating(false);
    }, duration);
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
    isMobile
  };
}

// 默认导出钩子函数
export default usePageTransition; 