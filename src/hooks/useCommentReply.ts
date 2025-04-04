import { useState } from 'react';
import { useAddComment } from './useComments';
import { toast } from 'sonner';

/**
 * 评论回复钩子，用于管理评论回复的状态和操作
 * @param postId 帖子ID
 */
export function useCommentReply(postId: string) {
  const [replyTo, setReplyTo] = useState<{
    id: string;
    authorName: string;
  } | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { mutate: addComment } = useAddComment();
  
  /**
   * 开始回复某条评论
   * @param commentId 评论ID
   * @param authorName 评论作者名称
   */
  const handleReply = (commentId: string, authorName: string) => {
    setReplyTo({ id: commentId, authorName });
    setReplyContent('');
  };
  
  /**
   * 取消回复
   */
  const cancelReply = () => {
    setReplyTo(null);
    setReplyContent('');
  };
  
  /**
   * 提交回复
   */
  const submitReply = () => {
    if (!replyContent.trim() || !replyTo) return;
    
    setIsSubmitting(true);
    
    addComment({
      postId,
      content: replyContent,
      parentId: replyTo.id
    }, {
      onSuccess: () => {
        toast.success('回复成功');
        cancelReply();
        setIsSubmitting(false);
      },
      onError: () => {
        toast.error('回复失败');
        setIsSubmitting(false);
      }
    });
  };
  
  return {
    replyTo,
    replyContent,
    setReplyContent,
    isSubmitting,
    handleReply,
    cancelReply,
    submitReply
  };
} 