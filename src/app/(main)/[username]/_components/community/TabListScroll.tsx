import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface TabListScrollProps {
    // You can define any props needed here
    children: React.ReactNode;
}

const TabListScroll = ({ children }: TabListScrollProps) => {

    const tabsContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);


    // MARK: Tablist 滚动
    const checkArrows = () => {
        if (tabsContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    // 监听容器大小变化
    useEffect(() => {
        const container = tabsContainerRef.current;
        if (container) {
            checkArrows();
            const resizeObserver = new ResizeObserver(checkArrows);
            resizeObserver.observe(container);
            return () => resizeObserver.disconnect();
        }
    }, []);

    // 滚动函数
    const scroll = (direction: 'left' | 'right') => {
        if (tabsContainerRef.current) {
            const scrollAmount = 200;
            tabsContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };


    return (
        <div className="relative flex items-center px-1">
            {/* 左箭头 */}
            {showLeftArrow && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 absolute left-0 z-10 bg-background/80 backdrop-blur-sm rounded-xl"
                    onClick={() => scroll('left')}
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
            )}

            {/* 可滚动的标签容器 */}
            <div
                ref={tabsContainerRef}
                className="overflow-x-auto scrollbar-hide mx-8 rounded-sm"
                onScroll={checkArrows}
            // MARK: TabList
            >
                {children}
            </div>

            {/* 右箭头 */}
            {showRightArrow && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 absolute right-0 z-10 bg-background/80 backdrop-blur-sm rounded-xl"
                    onClick={() => scroll('right')}
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            )}
        </div>
    );
};

export default TabListScroll;