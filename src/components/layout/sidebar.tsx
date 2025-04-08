"use client"

import { usePathname } from 'next/navigation'
import React from 'react'
import Link from 'next/link'
import { TooltipProvider, Tooltip, TooltipTrigger } from '@/components/ui/tooltip'
import { menuOptions2 } from '@/lib/data/constant'
import clsx from 'clsx'
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from '@/components/ui/mode-toggle'
import { MailIcon, SquareChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import ContextMenuWrapper from '@/components/ContextMenuWrapper'
import { Button } from '@/components/ui/button'

const MenuOptions = ({
  isCollapsed,
  setIsCollapsed
}: {
  isCollapsed: boolean,
  setIsCollapsed: (isCollapsed: boolean) => void
}) => {
  const pathName = usePathname()
  return (
    <ContextMenuWrapper>
      <nav className={cn(
        "sticky top-0 left-0 hidden w-[80px] min-w-[80px] max-w-[80px] dark:bg-black h-screen justify-between md:flex items-center flex-col  gap-10 py-6 px-2 border-r-[1px] border-gray-300 dark:border-white/20 transition-all duration-300 overflow-hidden",
        isCollapsed ? "w-[0px] min-w-[0px] max-w-[0px] px-0 opacity-0" : "w-[80px] min-w-[80px] max-w-[80px]"
      )}
      >
        <div className="flex items-center flex-col gap-8 h-screen overflow-scroll">
          <Link
            href="/"
            className='flex font-bold flex-row text-sm'
          >
            Mandarin
          </Link>
          {/* //  MARK: MenuOptions
         */}
          
          <TooltipProvider>
            {menuOptions2.map((menuItem) => (
              <ul key={menuItem.name}>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    <li>
                      <Link
                        href={menuItem.href}
                        className={clsx(
                          'group h-8 w-8 flex items-center justify-center  scale-[1.5] rounded-lg p-[3px]  cursor-pointer',
                          {
                            'dark:bg-[#2F006B] bg-[#EEE0FF] ':
                              pathName?.split('/')[1] === menuItem.href.split('/')[1],
                          }
                        )}
                      >
                        <menuItem.Component
                          selected={pathName?.split('/')[1] === menuItem.href.split('/')[1]}
                        />
                      </Link>
                    </li>
                  </TooltipTrigger>
                </Tooltip>
              </ul>
            ))}
            <Separator />
          </TooltipProvider>

        </div>
        {/* //MARK: ModeToggle
       */}
        <div className="flex items-center justify-center flex-col gap-4" >
          <Separator />
          <div className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-300/20 rounded-lg border-gray-300 dark:border-white/20">
            <Link href="/mail">
              <Button variant="outline" size="icon">
                <MailIcon />
              </Button>
            </Link>
          </div>
          <div className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-300/20 rounded-lg border-gray-300 dark:border-white/20">
            <SquareChevronLeft
              className='text-xl text-gray-500'
              onClick={() => setIsCollapsed(true)}
            />
          </div>
          <ModeToggle />
        </div>
      </nav>
    </ContextMenuWrapper>
  )
}

export default MenuOptions;