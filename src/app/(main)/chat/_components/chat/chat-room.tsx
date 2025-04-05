"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import MessageInput from "./message-input";
import { cn } from "@/lib/utils";
import { ChatHeader } from "./chat-header";
import { Channel } from "@/lib/types/convex/channel";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import { useAuth } from "@/providers/supabase-auth-provider";

// 添加消息类型定义
interface Message {
  _id: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar: string | undefined;
  createdAt: number; // 时间戳
  channelId: string;
  type: "public" | "private" | "group";
  _creationTime?: number; // 添加服务器消息中的字段
}

// 缓存相关函数
const CACHE_KEY_PREFIX = "chat_messages_";
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24小时过期

// 获取缓存的消息
const getCachedMessages = (channelId: string): Message[] => {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${channelId}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return [];
    
    const { messages, timestamp } = JSON.parse(cached);
    
    // 检查缓存是否过期
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(cacheKey);
      return [];
    }
    
    return messages;
  } catch (error) {
    console.error('获取缓存消息失败:', error);
    return [];
  }
};

// 更新缓存消息
const updateCachedMessages = (channelId: string, messages: Message[]) => {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${channelId}`;
    localStorage.setItem(cacheKey, JSON.stringify({
      messages,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('更新缓存消息失败:', error);
  }
};

interface ChatRoomProps {
  channelId: string;
  type: string;
  channel?: Channel;
}

export function ChatRoom({
  channelId,
  type,
  channel
}: ChatRoomProps) {
  const { session } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // 添加本地缓存状态
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [isLoadingFromCache, setIsLoadingFromCache] = useState(true);

  // 从Convex获取消息
  const serverMessages = useQuery(api.messages.list, { channelId: channelId, limit: 100 });
  const sendMessage = useMutation(api.messages.send);

  // 加载缓存消息
  useEffect(() => {
    const cachedMessages = getCachedMessages(channelId);
    if (cachedMessages.length > 0) {
      setLocalMessages(cachedMessages);
    }
    setIsLoadingFromCache(false);
  }, [channelId]);

  // 当服务器消息更新时，更新缓存和本地状态
  useEffect(() => {
    if (serverMessages?.messages) {
      // 类型转换确保兼容性
      const typedMessages = serverMessages.messages.map((msg: any) => ({
        ...msg,
        userAvatar: msg.userAvatar || "https://avatar.vercel.sh/default"
      })) as Message[];
      
      setLocalMessages(typedMessages);
      updateCachedMessages(channelId, typedMessages);
    }
  }, [serverMessages?.messages, channelId]);

  // 显示的消息 - 优先显示服务器消息，没有时显示缓存消息
  const displayMessages = serverMessages?.messages || localMessages;

  // MARK: scrollToBottom
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        // 添加延迟确保DOM已更新
        setTimeout(() => {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: behavior
          });
        }, 0);
      }
    }
  };

  // 初始加载时立即滚动到底部，不需要动画
  useEffect(() => {
    if (displayMessages?.length) {
      // 使用setTimeout确保DOM已完全渲染
      setTimeout(() => scrollToBottom('instant'), 100);
    }
  }, [displayMessages]); // 当displayMessages变化时重新执行

  // MARK: 平滑滚动
  useEffect(() => {
    if (displayMessages?.length > 0) {
      scrollToBottom('smooth');
    }
  }, [displayMessages?.length]);

  //MARK: handleSend
  const handleSend = async (content: string) => {
    if (!session || !content.trim()) return;

    // 创建乐观更新的消息对象
    const optimisticMessage: Message = {
      _id: `temp-${Date.now()}`,
      content,
      userId: session.user?.id || "",
      userName: session.user?.user_metadata.name || "Anonymous",
      userAvatar: session.user?.user_metadata.avatar_url || "https://avatar.vercel.sh/luke",
      type: type as "public" | "private" | "group",
      channelId: channelId,
      createdAt: Date.now()
    };

    // 乐观更新本地消息列表
    setLocalMessages(prev => [...prev, optimisticMessage]);
    
    // 发送实际消息
    await sendMessage({
      content,
      userId: session.user?.id || "",
      userName: session.user?.user_metadata.name || "Anonymous",
      userAvatar: session.user?.user_metadata.avatar_url || "https://avatar.vercel.sh/luke",
      type: type as "public" | "private" | "group",
      channelId: channelId
    });

    setNewMessage("");
    // 发送后平滑滚动到底部
    setTimeout(() => scrollToBottom('smooth'), 100);
  };

  // MARK: 监听滚动位置
  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
      if (!scrollContainer) return;
      
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      // 当距离底部超过200px时显示按钮
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
      setShowScrollButton(!isNearBottom);
    };

    // 获取滚动容器并添加事件监听
    const scrollContainer = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      // 初始检查一次滚动位置
      handleScroll();
      
      scrollContainer.addEventListener('scroll', handleScroll);
      
      // 窗口大小变化时也重新检查
      window.addEventListener('resize', handleScroll);
      
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [displayMessages]); // 添加displayMessages作为依赖项

  const messageList = () => {
    const {session} = useAuth();
    
    // 显示缓存加载状态或服务器加载状态
    if (isLoadingFromCache && displayMessages.length === 0) {
      return (
        <div className="flex items-center justify-center h-full py-1/2">
          <Loader2 className="h-10 w-10 animate-spin" />
          <span className="ml-2">加载消息...</span>
        </div>
      );
    }
    
    // 如果没有消息显示空状态
    if (displayMessages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full py-1/2 text-muted-foreground">
          <p>暂无消息</p>
          <p className="text-sm">来发送第一条消息吧！</p>
        </div>
      );
    }
    
    return(
      <div className="space-y-4 w-full h-full md:h-[calc(100vh-70px)] mx-auto p-4 select-none">
          {displayMessages.map((message: any) => (
            <div
              key={message._id}
              className={cn(
                "flex items-start gap-2 w-full",
                message.userId === session?.user?.id ? "justify-end" : "justify-start"
              )}
            >
              {message.userId !== session?.user?.id && (
                <Avatar>
                  <AvatarImage src={message.userAvatar || "https://avatar.vercel.sh/default"} />
                  <AvatarFallback>
                    {message.userName[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}

              <div className={cn(
                "flex flex-col max-w-[70%]",
                message.userId === session?.user?.id ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "flex items-center gap-2",
                  message.userId === session?.user?.id ? "flex-row-reverse" : "flex-row"
                )}>
                  <span className="text-sm font-medium">{message.userName}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(message.createdAt, {
                      addSuffix: true,
                      locale: zhCN,
                    })}
                  </span>
                </div>
                <ContextMenu>
                  <ContextMenuTrigger>
                    <div className={cn(
                      "mt-1 rounded-lg p-2 break-words",
                      "max-w-full w-fit",
                      message.userId === session?.user?.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}>
                      {message.content}
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem>个人资料</ContextMenuItem>
                    <ContextMenuItem>复制消息</ContextMenuItem>
                    <ContextMenuItem>举报</ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </div>

              {message.userId === session?.user?.id && (
                <Avatar>
                  <AvatarImage src={message.userAvatar || "https://avatar.vercel.sh/default"} />
                  <AvatarFallback>
                    {message.userName[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div className="h-18" />
        </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>请先登录后参与聊天</p>
      </div>
    );
  }

  return (
    // 这里pb控制input的位置，目前不需要
    <div className="w-full flex flex-col h-full justify-center overflow-y-auto relative ">
      <ScrollArea 
        ref={scrollRef} 
        className="flex rounded-none h-full mb-24"
        style={{ scrollBehavior: 'smooth' }}
      >
        {
          channel && (
            <ChatHeader
              title={"#" + channel.name}
              channel={channel}
            />
          )
        }
        
        {messageList()}
        
        {/* 回到底部按钮 */}
        {showScrollButton && (
          <Button
            onClick={() => scrollToBottom('smooth')}
            className="fixed bottom-24 md:bottom-36 right-8 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 z-50 bg-primary text-primary-foreground dark:bg-gray-200 dark:text-gray-800 hover:scale-105"
            size="icon"
            aria-label="滚动到底部"
            type="button"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        )}

        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onHandleSend={() => handleSend(newMessage)}
          className=''
        />
      </ScrollArea>
    </div>
  );
} 