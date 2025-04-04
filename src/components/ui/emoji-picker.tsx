'use client';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Smile } from 'lucide-react';

interface EmojiPickerProps {
  onChange: (emoji: string) => void;
}

export function EmojiPicker({ onChange }: EmojiPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant='ghost' 
          size='icon'
        >
          <Smile className='h-4 w-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <Picker
          data={data}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
          theme='light'
        />
      </PopoverContent>
    </Popover>
  );
} 