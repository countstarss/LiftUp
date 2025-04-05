import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share } from 'lucide-react';
import { usePost } from '@/hooks/usePosts';
import { Skeleton } from '@/components/ui/skeleton';
import { CommentSection } from './CommentSection';

interface PostCardProps {
  postId?: string;
  post?: any; // 允许接收任何形式的post对象
}

export function PostCard({ postId, post: initialPost }: PostCardProps) {
  const { data, isLoading, error } = usePost(postId || '');
  const [showComments, setShowComments] = useState(false);

  // 如果直接传入post对象，则使用它，否则使用通过postId获取的数据
  const post = initialPost || (data?.data);

  // 如果没有提供postId，而是直接提供了post对象，则不需要加载
  const isLoadingData = postId ? isLoading : false;
  const hasError = postId ? error : false;

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

  // 处理MongoDB格式的post对象（_id）和普通格式的post对象（id）
  const postId2 = post._id || post.id;
  
  // 处理不同格式的用户信息
  const userInitial = post.owner?.username?.[0] || post.authorId?.[0] || 'U';
  const username = post.owner?.username || post.authorName || '匿名用户';
  
  // 处理不同格式的点赞数
  const likesCount = typeof post.likes === 'number' ? post.likes : (Array.isArray(post.likes) ? post.likes.length : 0);
  
  // 处理不同格式的评论数
  const commentCount = post.commentCount || (Array.isArray(post.comments) ? post.comments.length : 0);

  return (
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
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm">{post.content}</p>
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
          <Button variant="ghost" size="sm" className="px-2">
            <Share className="h-4 w-4 mr-1" />
          </Button>
        </div>
      </CardFooter>

      {showComments && (
        <div className="px-4 pb-4">
          <CommentSection postId={postId2} />
        </div>
      )}
    </Card>
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