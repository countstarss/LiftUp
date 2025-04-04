'use client'

import { useMotionValue } from 'framer-motion'
import React from 'react'
import { cn } from '@/lib/utils'

export const EvervaultCard = ({
  text,
  className,
}: {
  text?: string;
  className?: string;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);


  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn(
        'p-0.5  bg-transparent aspect-square  flex items-center justify-center w-full h-full relative',
        className
      )}
    >
      <div
        onMouseMove={onMouseMove}
        className='group/card rounded-3xl w-full relative overflow-hidden bg-transparent flex items-center justify-center h-full'
      >
        <div className='relative z-10 flex items-center justify-center'>
          <div className='relative h-44 w-44  rounded-full flex items-center justify-center text-white font-bold text-2xl'>
            <span className='dark:text-white z-20 text-indigo-500'>
              {text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth='1.5'
      stroke='currentColor'
      className={className}
      {...rest}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M12 6v12m6-6H6'
      />
    </svg>
  );
};
