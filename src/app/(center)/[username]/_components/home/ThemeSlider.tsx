"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

interface Theme {
  id: string;
  title: string;
  courses: Course[];
}

interface Course {
  id: string;
  title: string;
  smallSummary: string;
  price: number;
  uploadedAt: Date;
  videoUrl?: string;
  imageUrl: string;
}

interface ThemeSliderProps {
  theme: Theme;
}

export default function ThemeSlider({ theme }: ThemeSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative w-[95vw] md:w-[90vw] px-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{theme.title}</h2>
      </div>

      <div className="relative group">
        {showLeftArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4  top-1/2 -translate-y-1/2 z-10 bg-neutral-300/80 backdrop-blur-sm opacity-50 group-hover:opacity-100 transition-opacity rounded-2xl"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide"
          onScroll={handleScroll}
        >
          {theme.courses.map((course) => (
            <div key={course.id} className="min-w-[300px] max-w-[300px] mb-4">
              <Card>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                </CardHeader>
              </Card>
            </div>
          ))}
        </div>

        {showRightArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-neutral-300/80 backdrop-blur-sm opacity-50 group-hover:opacity-100 transition-opacity rounded-2xl"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
} 