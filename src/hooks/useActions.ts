import { useQuery } from '@tanstack/react-query';
import { Action } from '@/lib/data/actions';

// MARK: 用于获取所有行动列表的hook
export function useActions(filters?: {
  type?: string;
  location?: string;
  equipment?: string;
  energy?: string;
  maxDuration?: number;
}) {
  // 构建查询字符串
  const queryParams = new URLSearchParams();
  if (filters?.type) queryParams.append('type', filters.type);
  if (filters?.location) queryParams.append('location', filters.location);
  if (filters?.equipment) queryParams.append('equipment', filters.equipment);
  if (filters?.energy) queryParams.append('energy', filters.energy);
  if (filters?.maxDuration) queryParams.append('maxDuration', filters.maxDuration.toString());
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  return useQuery<{
    success: boolean;
    message: string;
    data: Action[];
  }>({
    queryKey: ['actions', filters],
    queryFn: async () => {
      const response = await fetch(`/api/actions${queryString}`);
      if (!response.ok) {
        throw new Error('获取行动列表失败');
      }
      return response.json();
    },
  });
}

// MARK: 用于获取单个行动详情的hook
export function useAction(id: string) {
  return useQuery<{
    success: boolean;
    message: string;
    data: Action;
  }>({
    queryKey: ['action', id],
    queryFn: async () => {
      const response = await fetch(`/api/actions/${id}`);
      if (!response.ok) {
        throw new Error('获取行动详情失败');
      }
      return response.json();
    },
    enabled: !!id,
  });
}

// MARK: 用于获取随机Action的hook
export function useRandomAction(filters?: {
  type?: string;
  location?: string;
  equipment?: string;
  energy?: string;
  maxDuration?: number;
}) {
  // 构建查询字符串
  const queryParams = new URLSearchParams();
  if (filters?.type) queryParams.append('type', filters.type);
  if (filters?.location) queryParams.append('location', filters.location);
  if (filters?.equipment) queryParams.append('equipment', filters.equipment);
  if (filters?.energy) queryParams.append('energy', filters.energy);
  if (filters?.maxDuration) queryParams.append('maxDuration', filters.maxDuration.toString());
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  return useQuery<{
    success: boolean;
    message: string;
    data: Action;
  }>({
    queryKey: ['randomAction', filters],
    queryFn: async () => {
      const response = await fetch(`/api/actions/random${queryString}`);
      if (!response.ok) {
        throw new Error('获取随机行动建议失败');
      }
      return response.json();
    },
    refetchOnWindowFocus: false,
    enabled: false, // 默认不自动获取，需要手动触发
  });
} 