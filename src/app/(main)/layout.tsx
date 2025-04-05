'use client'

import InfoBar from '@/components/layout/Infobar';
import MenuOptions from '@/components/layout/sidebar';
import BottomBar from '@/components/layout/bottom-bar';
import React, { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({
  children
}: LayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className='flex overflow-hidden h-screen'>
        <MenuOptions
            isCollapsed={isCollapsed} 
            setIsCollapsed={setIsCollapsed} 
        />
        <div className='w-full'>
            <InfoBar
                isCollapsed={isCollapsed} 
                setIsCollapsed={setIsCollapsed} 
            />
            <div className="pb-[60px] md:pb-0">
              {children}
            </div>
            {/* <BottomBar /> */}
        </div>
    </div>
  );
};

export default Layout;