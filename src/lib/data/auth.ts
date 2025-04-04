// MARK: 模拟用户数据
export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  role: 'USER' | 'ADMIN';
}

// 模拟用户数据
export const users: User[] = [
  {
    id: 'user-1',
    username: '张三',
    email: 'zhangsan@example.com',
    avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    role: 'USER'
  },
  {
    id: 'user-2',
    username: '李四',
    email: 'lisi@example.com',
    avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
    role: 'USER'
  },
  {
    id: 'user-3',
    username: '王五',
    email: 'wangwu@example.com',
    avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
    role: 'ADMIN'
  }
];

// 当前会话用户ID (模拟用户登录)
let currentUserId: string | null = 'user-1';

// MARK: 获取当前登录用户信息
export function getCurrentUser(): User | null {
  if (!currentUserId) return null;
  return users.find(user => user.id === currentUserId) || null;
}

// MARK: 检查用户是否有权限访问内容
export function hasPermission(
  resourceOwnerId: string, 
  permission: 'read' | 'edit' | 'delete'
): boolean {
  const currentUser = getCurrentUser();
  
  // 未登录用户没有任何权限
  if (!currentUser) return false;
  
  // 管理员拥有所有权限
  if (currentUser.role === 'ADMIN') return true;
  
  // 普通用户只能操作自己的内容
  if (permission === 'read') {
    // 可以查看任何公开内容
    return true;
  } else {
    // 只能编辑/删除自己的内容
    return currentUser.id === resourceOwnerId;
  }
}

// MARK: 模拟用户登录
export function login(userId: string): User | null {
  const user = users.find(u => u.id === userId);
  if (user) {
    currentUserId = userId;
    return user;
  }
  return null;
}

// MARK: 模拟用户登出
export function logout(): void {
  currentUserId = null;
} 