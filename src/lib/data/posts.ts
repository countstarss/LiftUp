import { Action } from './actions';

// MARK: Post类型定义
export interface Post {
  id: string;
  content: string;
  isPublic: boolean;
  likes: number;
  createdAt: string; // ISO格式日期字符串
  updatedAt: string; // ISO格式日期字符串
  ownerId: string;
  actionId: string;
  
  // 添加一些可选的关联数据（前端展示用）
  owner?: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  action?: Action;
  commentCount?: number;
}

// MARK: 模拟数据 - 这里添加一些初始的posts
export const posts: Post[] = [
  {
    id: '1',
    content: '今天完成了一次20分钟的散步，感觉精神焕发！',
    isPublic: true,
    likes: 5,
    createdAt: '2025-04-01T10:00:00Z',
    updatedAt: '2025-04-01T10:00:00Z',
    ownerId: 'user-1',
    actionId: '1',
    owner: {
      id: 'user-1',
      username: '张三',
      avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    commentCount: 2
  },
  {
    id: '2',
    content: '今天尝试了瑜伽，很放松！附上照片。',
    isPublic: true,
    likes: 12,
    createdAt: '2025-04-02T14:30:00Z',
    updatedAt: '2025-04-02T14:30:00Z',
    ownerId: 'user-2',
    actionId: '2',
    owner: {
      id: 'user-2',
      username: '李四',
      avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    commentCount: 3
  },
  {
    id: '3',
    content: '画了一幅小狗的速写，虽然不是很像，但是很开心！',
    isPublic: true,
    likes: 8,
    createdAt: '2025-04-03T09:15:00Z',
    updatedAt: '2025-04-03T09:15:00Z',
    ownerId: 'user-3',
    actionId: '3',
    owner: {
      id: 'user-3',
      username: '王五',
      avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    commentCount: 1
  },
  {
    id: '4',
    content: '整理了我的书桌抽屉，找到了好多失踪已久的东西！',
    isPublic: true,
    likes: 3,
    createdAt: '2025-04-04T16:45:00Z',
    updatedAt: '2025-04-04T16:45:00Z',
    ownerId: 'user-1',
    actionId: '4',
    owner: {
      id: 'user-1',
      username: '张三',
      avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    commentCount: 0
  },
  {
    id: '5',
    content: '给大学室友发了消息，约好下周见面！',
    isPublic: false, // 这是一条私密post
    likes: 0,
    createdAt: '2025-04-05T11:20:00Z',
    updatedAt: '2025-04-05T11:20:00Z',
    ownerId: 'user-2',
    actionId: '5',
    owner: {
      id: 'user-2',
      username: '李四',
      avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    commentCount: 0
  }
];

// MARK: 用户点赞记录
export interface UserLike {
  userId: string;
  postId: string;
}

// 用户点赞记录
export const userLikes: UserLike[] = [
  { userId: 'user-1', postId: '2' },
  { userId: 'user-1', postId: '3' },
  { userId: 'user-2', postId: '1' },
  { userId: 'user-2', postId: '3' },
  { userId: 'user-3', postId: '1' },
  { userId: 'user-3', postId: '2' },
  { userId: 'user-3', postId: '4' },
]; 