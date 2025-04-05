import { useState } from 'react';
import { Heart, MessageCircle, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { toast } from 'sonner';
import DeletePostDialog from './DeletePostDialog';
import { PostCard } from './_post/PostCard';
import { useTogglePostLike, usePostLikeStatus, useDeletePost } from '@/hooks/usePosts';
import { useAddComment } from '@/hooks/useComments';
import { Post, Comment, User } from '@prisma/client';

// 定义扩展的Post类型，包含关联数据
type PostWithRelations = Post & {
  owner?: User;
  comments?: CommentWithUser[];
  _count?: {
    comments?: number;
  };
};

type CommentWithUser = Comment & {
  owner?: User;
};

interface PostActionsProps {
  post: PostWithRelations;
}

export default function PostActions({ post }: PostActionsProps) {
  const [comment, setComment] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const userId = "1"; // 默认用户ID

  // 使用React Query钩子
  const { data: likeStatus } = usePostLikeStatus(post.id);
  const { mutate: toggleLike } = useTogglePostLike();
  const { mutate: addComment } = useAddComment();
  const { mutate: deletePost } = useDeletePost();

  // MARK: handleLike
  const handleLike = () => {
    toggleLike(post.id);
  };

  // MARK: handleComment
  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      setIsAddingComment(true);
      addComment({
        postId: post.id,
        content: comment
      }, {
        onSuccess: () => {
          setComment('');
          toast.success('评论添加成功');
          setIsAddingComment(false);
        },
        onError: () => {
          toast.error('评论添加失败');
          setIsAddingComment(false);
        }
      });
    }
  };

  // MARK: handleDelete
  const handleDelete = () => {
    setIsDeleting(true);
    deletePost(post.id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        toast.success('帖子删除成功');
        setIsDeleting(false);
      },
      onError: () => {
        toast.error('帖子删除失败');
        setIsDeleting(false);
      }
    });
  };

  // 安全地获取数据
  const comments = post.comments || [];
  const commentCount = post._count?.comments || comments.length || 0;
  const isLiked = likeStatus?.data?.isLiked || false;
  const likesCount = likeStatus?.data?.likes || post.likes || 0;
  const isAuthor = post.ownerId === userId;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className={isLiked ? 'text-red-500' : ''}
          onClick={handleLike}
        >
          <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
          {likesCount}
        </Button>
        <Button variant="ghost" size="sm">
          <MessageCircle className="h-4 w-4 mr-1" />
          {commentCount}
        </Button>
        {isAuthor && (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {comments.slice(0, 1).map((commentItem) => (
          <div key={commentItem.id} className="flex items-start gap-2">
            <Avatar className="w-6 h-6">
              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-xs">
                {commentItem.owner?.username?.[0] || '?'}
              </div>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{commentItem.owner?.username || '匿名用户'}</p>
              <p className="text-sm text-muted-foreground">{commentItem.content}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(commentItem.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
        <PostCard 
          postId={post.id} 
        />
      </div>

      <form onSubmit={handleComment} className="flex items-center gap-2">
        <Input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="添加评论..."
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={!comment.trim() || isAddingComment}>
          <Send className="h-4 w-4" />
        </Button>
      </form>

      <DeletePostDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
} 