"use client"

import { usePathname } from 'next/navigation'
import React from 'react'
import Link from 'next/link'
import { menuOptions2 } from '@/lib/data/constant'
import clsx from 'clsx'
import { MailIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const BottomBar = () => {
  const pathName = usePathname()

  return (
    <div className="rounded-t-3xl md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-300 dark:border-white/20 bg-background">
      <nav className="px-2 py-2 flex justify-around items-center">
        <Link
          href="/"
          className={clsx(
            'flex flex-col items-center justify-center p-2 px-4 rounded-lg transition-colors',
            {
              'bg-[#EEE0FF] dark:bg-[#2F006B]': pathName === '/',
              'text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800': pathName !== '/'
            }
          )}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xs mt-1">首页</span>
        </Link>

        {menuOptions2.slice(0, 4).map((menuItem) => (
          <Link
            key={menuItem.name}
            href={menuItem.href}
            className={clsx(
              'flex flex-col items-center justify-center p-2 px-4 rounded-lg transition-colors',
              {
                'bg-[#EEE0FF] dark:bg-[#2F006B]': pathName?.split('/')[1] === menuItem.href.split('/')[1],
                'text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800': 
                  pathName?.split('/')[1] !== menuItem.href.split('/')[1]
              }
            )}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <menuItem.Component
                selected={pathName?.split('/')[1] === menuItem.href.split('/')[1]}
              />
            </div>
            <span className="text-xs mt-1">{menuItem.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default BottomBar
