import { Avatar } from '@/components/ui/avatar';
import React from 'react';
import { useToggleCommentLike, useCommentLikeStatus } from '@/hooks/useComments';
import { Button } from '@/components/ui/button';
import { Heart, Reply } from 'lucide-react';
import { Comment, User } from '@prisma/client';

// 定义扩展的Comment类型，包含关联数据
type CommentWithRelations = Comment & {
  owner?: User;
  replies?: CommentWithRelations[];
};

interface CommentItemProps {
    comment: CommentWithRelations;
    onReply?: (commentId: string, username: string) => void;
}

const CommentItem = ({ comment, onReply }: CommentItemProps) => {
    const { data: likeStatus } = useCommentLikeStatus(comment.id);
    const { mutate: toggleLike } = useToggleCommentLike();
    
    const isLiked = likeStatus?.data?.isLiked || false;
    const likesCount = likeStatus?.data?.likes || comment.likes || 0;

    // 获取用户名
    const username = comment.owner?.username || '匿名用户';
                  
    // 获取用户头像的第一个字母
    const initial = username[0] || '?';
    
    // 获取评论回复
    const replies = comment.replies || [];

    return (
        <div className="flex items-start gap-2">
            <Avatar className="w-6 h-6">
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-xs">
                    {initial}
                </div>
            </Avatar>
            <div className="flex-1">
                <p className="text-sm font-medium">{username}</p>
                <p className="text-sm text-muted-foreground">{comment.content}</p>
                <div className="flex items-center gap-4 mt-1">
                    <p className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`p-0 h-auto ${isLiked ? 'text-red-500' : ''}`}
                        onClick={() => toggleLike(comment.id)}
                    >
                        <Heart className={`h-3 w-3 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                        <span className="text-xs">{likesCount}</span>
                    </Button>
                    {onReply && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto"
                            onClick={() => onReply(comment.id, username)}
                        >
                            <Reply className="h-3 w-3 mr-1" />
                            <span className="text-xs">回复</span>
                        </Button>
                    )}
                </div>
                
                {/* 显示回复 */}
                {replies.length > 0 && (
                    <div className="ml-4 mt-2 space-y-2 pl-2 border-l-2 border-muted">
                        {replies.map((reply) => (
                            <CommentItem key={reply.id} comment={reply} onReply={onReply} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentItem;