import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Comment } from '@/lib/data/comments';

// MARK: 用于获取Post评论列表的hook
export function usePostComments(postId: string) {
  return useQuery<{
    success: boolean;
    message: string;
    data: Comment[];
  }>({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (!response.ok) {
        throw new Error('获取评论列表失败');
      }
      return response.json();
    },
    enabled: !!postId,
  });
}

// MARK: 用于获取单个评论详情的hook
export function useComment(id: string) {
  return useQuery<{
    success: boolean;
    message: string;
    data: Comment;
  }>({
    queryKey: ['comment', id],
    queryFn: async () => {
      const response = await fetch(`/api/comments/${id}`);
      if (!response.ok) {
        throw new Error('获取评论详情失败');
      }
      return response.json();
    },
    enabled: !!id,
  });
}

// MARK: 用于添加评论的hook
export function useAddComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      postId, 
      content, 
      parentId 
    }: { 
      postId: string; 
      content: string; 
      parentId?: string;
    }) => {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, parentId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '添加评论失败');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      // 添加评论成功后，使该Post的评论列表缓存失效，强制重新获取
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      // 同时使Post详情缓存失效，因为评论数量可能已更新
      queryClient.invalidateQueries({ queryKey: ['post', variables.postId] });
    },
  });
}

// MARK: 用于更新评论的hook
export function useUpdateComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      content 
    }: { 
      id: string; 
      content: string;
    }) => {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '更新评论失败');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // 获取更新后的评论数据
      const comment = data.data as Comment;
      
      // 更新评论成功后，使该评论的缓存失效，强制重新获取
      queryClient.invalidateQueries({ queryKey: ['comment', comment.id] });
      // 同时使该Post的评论列表缓存失效
      queryClient.invalidateQueries({ queryKey: ['comments', comment.postId] });
    },
  });
}

// MARK: 用于删除评论的hook
export function useDeleteComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '删除评论失败');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // 获取删除的评论数据
      const comment = data.data as Comment;
      
      // 删除评论成功后，从缓存中移除该评论
      queryClient.removeQueries({ queryKey: ['comment', comment.id] });
      // 同时使该Post的评论列表缓存失效
      queryClient.invalidateQueries({ queryKey: ['comments', comment.postId] });
      // 同时使Post详情缓存失效，因为评论数量可能已更新
      queryClient.invalidateQueries({ queryKey: ['post', comment.postId] });
    },
  });
}

// MARK: 用于点赞或取消点赞评论的hook
export function useToggleCommentLike() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/comments/${id}/like`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '处理评论点赞失败');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      // 点赞成功后，更新缓存中的评论数据
      queryClient.invalidateQueries({ queryKey: ['comment', variables] });
      
      // 获取评论数据，更新相关列表
      const commentLikeData = data.data as { commentId: string; likes: number; isLiked: boolean };
      
      // 查找缓存中的评论，获取postId
      queryClient.getQueryCache().findAll({ queryKey: ['comment'] }).forEach(query => {
        const commentData = query.state.data as any;
        if (commentData?.data?.id === commentLikeData.commentId) {
          // 更新该Post的评论列表缓存
          queryClient.invalidateQueries({ queryKey: ['comments', commentData.data.postId] });
        }
      });
    },
  });
}

// MARK: 用于检查用户是否已点赞评论的hook
export function useCommentLikeStatus(id: string) {
  return useQuery<{
    success: boolean;
    message: string;
    data: {
      commentId: string;
      likes: number;
      isLiked: boolean;
    }
  }>({
    queryKey: ['commentLike', id],
    queryFn: async () => {
      const response = await fetch(`/api/comments/${id}/like`);
      if (!response.ok) {
        throw new Error('获取评论点赞状态失败');
      }
      return response.json();
    },
    enabled: !!id,
  });
} 