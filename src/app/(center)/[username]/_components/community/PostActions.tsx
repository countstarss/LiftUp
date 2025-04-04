import { useState } from 'react';
import { Heart, MessageCircle, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Post } from '@/types/mongo/post';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '@/app/server-actions/post.service';
import { toast } from 'sonner';
import DeletePostDialog from './DeletePostDialog';
import { PostCard } from './_post/PostCard';

interface PostActionsProps {
  post: Post;
}

export default function PostActions({ post }: PostActionsProps) {
  const [comment, setComment] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();
  const userId = "1"; // 默认用户ID



  // MARK: 点赞
  const likeMutation = useMutation({
    mutationFn: () => postService.likePost(post._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: any) => {
      toast.error('Failed to like post');
    },
  });

  // MARK: 添加评论
  const commentMutation = useMutation({
    mutationFn: (content: string) => postService.addComment(post._id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setComment('');
      toast.success('Comment added successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to add comment');
    },
  });

  // MARK: 删除帖子
  const deleteMutation = useMutation({
    mutationFn: () => postService.deletePost(post._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post deleted successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to delete post');
    },
  });

  // MARK: handleLike
  const handleLike = () => {
    likeMutation.mutate();
  };



  // MARK: handleComment
  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      commentMutation.mutate(comment);
    }
  };

  // MARK: handleDelete
  const handleDelete = () => {
    deleteMutation.mutate();
    setShowDeleteDialog(false);
  };

  const isLiked = post.likes.includes(userId);
  const isAuthor = post.authorId === userId;

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
          {post.likes.length}
        </Button>
        <Button variant="ghost" size="sm">
          <MessageCircle className="h-4 w-4 mr-1" />
          {post.comments.length}
        </Button>
        {isAuthor && (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {post.comments.slice(0, 1).map((comment, index) => (
          <div key={index} className="flex items-start gap-2">
            <Avatar className="w-6 h-6">
              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-xs">
                {comment.userName[0]}
              </div>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{comment.userName}</p>
              <p className="text-sm text-muted-foreground">{comment.content}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
        <PostCard 
          // NOTE: - 弹出Dialog
          post={post} 
        />
      </div>

      <form onSubmit={handleComment} className="flex items-center gap-2">
        <Input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={!comment.trim()}>
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