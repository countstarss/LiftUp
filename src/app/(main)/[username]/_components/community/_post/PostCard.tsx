"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share, ChevronDown } from 'lucide-react';
import { usePost } from '@/hooks/usePosts';
import { Skeleton } from '@/components/ui/skeleton';
import { CommentSection } from '../CommentSection';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import CommentItem from '../CommentItem';
import { Comment, User } from '@prisma/client';

// 定义扩展的Post类型，包含关联数据
type PostWithRelations = {
  id: string;
  content: string;
  isPublic: boolean;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  actionId: string;
  owner?: User;
  comments?: CommentWithUser[];
  _count?: {
    comments?: number;
  };
  // 可选字段，用于显示媒体
  media?: string[];
};

type CommentWithUser = Comment & {
  owner?: User;
};

// 用户信息获取函数，用于在owner字段不存在时获取用户信息
const getUserById = async (userId: string) => {
  // 记录函数调用
  console.log(`获取用户信息: ${userId}`);
  // 模拟一个异步请求
  return {
    id: userId,
    name: '用户' + userId.substring(0, 4),
    email: 'user' + userId.substring(0, 4) + '@example.com',
    avatarUrl: 'https://avatar.vercel.sh/' + userId.substring(0, 4)
  };
};

interface PostCardProps {
  postId?: string;
  post?: PostWithRelations;
}

export function PostCard({ postId, post: initialPost }: PostCardProps) {
  const { data, isLoading, error } = usePost(postId || '');
  const [showComments, setShowComments] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  // 如果直接传入post对象，则使用它，否则使用通过postId获取的数据
  const post = initialPost || (data?.data as PostWithRelations | undefined);

  // 如果没有提供postId，而是直接提供了post对象，则不需要加载
  const isLoadingData = postId ? isLoading : false;
  const hasError = postId ? error : false;

  // 使用getUserById函数获取用户信息
  useEffect(() => {
    if (post && post.ownerId && !post.owner) {
      getUserById(post.ownerId).then(userData => {
        setUserInfo(userData);
      });
    }
  }, [post]);

  if (isLoadingData) {
    return <PostCardSkeleton />;
  }

  if (hasError || !post) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">加载帖子失败</p>
        </CardContent>
      </Card>
    );
  }

  // 安全地从post对象获取数据
  const username = post.owner?.username || (userInfo?.name || '匿名用户');
  const userInitial = username[0] || 'U';
  const likesCount = post.likes || 0;
  const commentCount = post._count?.comments || (post.comments?.length || 0);
  const content = post.content || '';
  const createdAt = post.createdAt;
  const media = post.media || [];
  const comments = post.comments || [];

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-xs">
                {userInitial}
              </div>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{username}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm">{content}</p>
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="px-2">
              <Heart className="h-4 w-4 mr-1" />
              <span className="text-xs">{likesCount}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="px-2"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">{commentCount}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="px-2"
              onClick={() => setIsDialogOpen(true)}
            >
              <Share className="h-4 w-4 mr-1" />
            </Button>
          </div>
        </CardFooter>

        {showComments && (
          <div className="px-4 pb-4">
            <CommentSection postId={post.id} />
            
            {comments.length > 2 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground hover:text-primary flex items-center gap-2"
                onClick={() => setIsDialogOpen(true)}
              >
                <ChevronDown className="h-4 w-4" />
                <span>查看全部 {comments.length} 条评论</span>
              </Button>
            )}
          </div>
        )}
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>帖子详情</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {/* Post Media */}
              {media.length > 0 && (
                <div className="relative w-full h-[400px]">
                  <Image
                    src={media[0] || '/images/placeholder.jpg'}
                    alt="帖子图片"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Post Content */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-xs">
                      {userInitial}
                    </div>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{username}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <p className="text-sm">{content}</p>
              </div>
              {/* Comments Section */}
              <div className="pt-4 border border-gray-200 rounded-lg px-2">
                <h3 className="font-medium mb-4">所有评论</h3>
                <div className="space-y-4 p-2">
                  {comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function PostCardSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-8 w-12" />
        </div>
      </CardFooter>
    </Card>
  );
} 