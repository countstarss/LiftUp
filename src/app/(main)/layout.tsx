'use client'

import { useEffect } from 'react';
import InfoBar from '@/components/layout/Infobar';
import MenuOptions from '@/components/layout/sidebar';
import BottomBar from '@/components/layout/bottom-bar';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SquareChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBottomBar } from '@/context/bottom-bar-context';
import AppTransition from '@/components/transitions/app-transitions';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({
  children
}: LayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathName = usePathname();
  const { isHiddenOnRoute } = useBottomBar();

  // 检测网络状态
  useEffect(() => {
    const handleOnlineStatus = () => {
      if (navigator.onLine) {
        // 恢复在线状态
        console.log('网络连接已恢复');
      } else {
        // 离线状态下的处理
        console.log('当前已离线，应用将使用缓存数据');
      }
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // 离线加载应用内容
  useEffect(() => {
    // 在应用加载完成后，预缓存常用路由
    if ('serviceWorker' in navigator && navigator.onLine) {
      const routes = ['/', '/chat', '/explore'];
      routes.forEach(route => {
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = route;
        document.head.appendChild(prefetchLink);
      });
    }
  }, []);

  // 注意：将整个布局内容包装在一个函数中，以便AppTransition可以包装整个内容
  const renderContent = () => (
    <div className='flex overflow-clip w-screen h-screen'>
      {isCollapsed ? (
        <Button
          className={cn(
            'z-10 fixed top-20 left-3 mt-10 opacity-90 duration-200 transition-opacity',
            isHiddenOnRoute(pathName) ? 'hidden' : 'flex'
          )}
          onClick={() => setIsCollapsed(false)}
          size='icon'
          variant='ghost'
        >
          <SquareChevronRight className='h-6 w-6 text-2xl text-gray-500' />
        </Button>
      ) : null}
      <MenuOptions isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className='w-full'>
        <InfoBar
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed}
        />
        <div className='overflow-hidden h-[calc(100vh-56px)]'>
          {children}
        </div>
        <BottomBar />
      </div>
    </div>
  );
  
  // 在主布局中使用AppTransition包装整个内容
  return (
    <AppTransition>
      {renderContent()}
    </AppTransition>
  );
};

export default Layout;