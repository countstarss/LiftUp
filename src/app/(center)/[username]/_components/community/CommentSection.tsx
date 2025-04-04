import { usePostComments } from '@/hooks/useComments';
import CommentItem from './CommentItem';
import { Loader2 } from 'lucide-react';
import { Comment, User } from '@prisma/client';

// 定义扩展的Comment类型，包含关联数据
type CommentWithRelations = Comment & {
  owner?: User;
  replies?: CommentWithRelations[];
};

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { data, isLoading, error } = usePostComments(postId);
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-2">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-2 text-sm text-muted-foreground">
        加载评论失败，请稍后再试
      </div>
    );
  }
  
  if (!data?.data || data.data.length === 0) {
    return (
      <div className="text-center py-2 text-sm text-muted-foreground">
        暂无评论，来添加第一条吧
      </div>
    );
  }

  // 假设API已经返回了包含关联数据的评论
  const comments = data.data as unknown as CommentWithRelations[];

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem 
          key={comment.id} 
          comment={comment} 
        />
      ))}
    </div>
  );
} 