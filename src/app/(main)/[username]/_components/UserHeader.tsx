import React from "react";
// import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePageTransition } from "@/components/transitions/page-transition";

interface UserHeaderProps {
    coverImage: string;
    onCoverImageChange: (url: string) => void;
    animationDuration?: number;
}

export default function UserHeader({ 
    coverImage, 
    onCoverImageChange, 
    animationDuration = 500 
}: UserHeaderProps) {
    const router = useRouter();
    const { goBack, isMobile } = usePageTransition();
    
    // 将来可以使用 Image 组件替换 img 标签，以获得更好的图像优化
    // 例如: <Image src={coverImage} alt="Cover" fill className="object-cover" />
    
    return (
        <>
            {/* 头部区域 */}
            <div className="relative">
                {/* 返回按钮 */}
                <div className="fixed top-4 left-4 z-20">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="md:hidden rounded-xl backdrop-blur-sm shadow-md"
                        onClick={() => goBack(animationDuration)}
                        aria-label="返回"
                    >
                    <ChevronLeft className="h-5 w-5" />
                    </Button>
                </div>
                
                {/* 封面图片容器 */}
                <div className="relative h-40 sm:h-48 md:h-64 w-full mt-4">
                    <img
                        src={coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute bottom-4 right-4">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="hidden sm:flex"
                            onClick={() => onCoverImageChange("/images/SoranoItaly.jpg")}
                        >
                            Replace Image
                        </Button>
                    </div>
                </div>

                {/* 用户信息区域 */}
                <div className="px-4 sm:px-6 md:px-8 md:my-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                        {/* 头像区域 */}
                        <div className="flex items-center gap-4">
                            <Avatar className="w-20 h-20 md:w-28 md:h-28 border-4 border-background">
                                <AvatarImage src="/images/avatar.png" alt="Mayuko" />
                                <AvatarFallback>May</AvatarFallback>
                            </Avatar>
                            <div className="text-center md:text-left">
                                <h1 className="text-xl sm:text-2xl font-semibold">Mayuko</h1>
                                <p className="text-sm text-muted-foreground">@hellomayuko</p>
                            </div>
                        </div>

                        {/* 按钮区域 */}
                        <div className="flex flex-row md:justify-end gap-2 w-full md:w-auto mt-4 md:mt-0">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full md:w-auto sm:size-default order-2 md:order-1"
                            >
                                Follow
                            </Button>
                            <Button
                                size="sm"
                                className="w-full md:w-auto sm:size-default order-1 md:order-2"
                            >
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 