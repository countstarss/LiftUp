import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Post } from '@/lib/data/posts';

// MARK: 用于获取Posts列表的hook
export function usePosts(options?: {
  isPublicOnly?: boolean;
  actionId?: string;
  ownerId?: string;
  limit?: number;
  page?: number;
}) {
  const queryParams = new URLSearchParams();
  if (options?.isPublicOnly) queryParams.append('public', 'true');
  if (options?.actionId) queryParams.append('actionId', options.actionId);
  if (options?.ownerId) queryParams.append('ownerId', options.ownerId);
  if (options?.limit) queryParams.append('limit', options.limit.toString());
  if (options?.page) queryParams.append('page', options.page.toString());
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  return useQuery<{
    success: boolean;
    message: string;
    data: {
      posts: Post[];
      pagination: {
        total: number;
        page: number;
        pageSize: number;
        pageCount: number;
      }
    }
  }>({
    queryKey: ['posts', options],
    queryFn: async () => {
      const response = await fetch(`/api/posts${queryString}`);
      if (!response.ok) {
        throw new Error('获取Posts列表失败');
      }
      return response.json();
    }
  });
}

// MARK: 用于获取单个Post的hook
export function usePost(id: string) {
  return useQuery<{
    success: boolean;
    message: string;
    data: Post;
  }>({
    queryKey: ['post', id],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${id}`);
      if (!response.ok) {
        throw new Error('获取Post详情失败');
      }
      return response.json();
    },
    enabled: !!id,
  });
}

// MARK: 用于创建Post的hook
export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { content: string; isPublic?: boolean; actionId: string }) => {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '创建Post失败');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // 创建成功后，使缓存中的posts列表失效，强制重新获取
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// MARK: 用于更新Post的hook
export function useUpdatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { 
      id: string; 
      data: { content?: string; isPublic?: boolean; actionId?: string } 
    }) => {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '更新Post失败');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      // 更新成功后，使特定post的缓存失效，强制重新获取
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
      // 同时使列表缓存失效
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// MARK: 用于删除Post的hook
export function useDeletePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '删除Post失败');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      // 删除成功后，使列表缓存失效，强制重新获取
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      // 从缓存中移除该post
      queryClient.removeQueries({ queryKey: ['post', variables] });
    },
  });
}

// MARK: 用于点赞或取消点赞Post的hook
export function useTogglePostLike() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/posts/${id}/like`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '处理点赞失败');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      // 点赞成功后，更新缓存中的post数据
      queryClient.invalidateQueries({ queryKey: ['post', variables] });
      
      // 如果在列表中，也更新列表数据
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// MARK: 用于检查用户是否已点赞Post的hook
export function usePostLikeStatus(id: string) {
  return useQuery<{
    success: boolean;
    message: string;
    data: {
      postId: string;
      likes: number;
      isLiked: boolean;
    }
  }>({
    queryKey: ['postLike', id],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${id}/like`);
      if (!response.ok) {
        throw new Error('获取点赞状态失败');
      }
      return response.json();
    },
    enabled: !!id,
  });
} 