'use client'

import InfoBar from '@/components/layout/Infobar';
import MenuOptions from '@/components/layout/sidebar';
import BottomBar from '@/components/layout/bottom-bar';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({
  children
}: LayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className='flex overflow-hidden h-screen w-screen'>
        <MenuOptions
            isCollapsed={isCollapsed} 
            setIsCollapsed={setIsCollapsed} 
        />
        <div className='w-full'>
            <InfoBar
                isCollapsed={isCollapsed} 
                setIsCollapsed={setIsCollapsed} 
            />
            <div className="pb-[60px] md:pb-80 overflow-hidden page-transition-wrapper">
              <div className="page-content h-full">
                {children}
              </div>
            </div>
            <BottomBar />
        </div>
    </div>
  );
};

export default Layout;