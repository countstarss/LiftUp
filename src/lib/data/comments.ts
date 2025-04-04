// MARK: Comment类型定义
export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  parentId: string | null;  // 父评论ID，如果是顶级评论则为null
  rootId: string;           // 根评论ID，如果是顶级评论则等于自己的ID
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    image?: string;
  };
  likes: number;            // 评论的点赞数量
  replies?: Comment[];      // 子评论列表
}

// 创建评论的请求参数
export interface CreateCommentParams {
  postId: string;
  content: string;
  parentId?: string;  // 可选，如果是回复其他评论，则需要提供父评论ID
}

// 更新评论的请求参数
export interface UpdateCommentParams {
  id: string;
  content: string;
}

// MARK: 模拟数据 - 这里添加一些初始的comments
export const comments: Comment[] = [
  // Post 1的评论
  {
    id: 'comment-1',
    content: '散步真的是提升心情的好方法！👍',
    likes: 2,
    createdAt: new Date('2025-04-01T10:15:00Z'),
    updatedAt: new Date('2025-04-01T10:15:00Z'),
    authorId: 'user-2',
    postId: '1',
    rootId: 'comment-1', // 自己是根评论
    parentId: null,
    author: {
      id: 'user-2',
      name: '李四',
      image: 'https://randomuser.me/api/portraits/women/2.jpg'
    }
  },
  {
    id: 'comment-2',
    content: '我也喜欢散步，特别是在公园里！',
    likes: 1,
    createdAt: new Date('2025-04-01T11:20:00Z'),
    updatedAt: new Date('2025-04-01T11:20:00Z'),
    authorId: 'user-3',
    postId: '1',
    rootId: 'comment-1', // 回复comment-1
    parentId: 'comment-1',
    author: {
      id: 'user-3',
      name: '王五',
      image: 'https://randomuser.me/api/portraits/men/3.jpg'
    }
  },
  
  // Post 2的评论
  {
    id: 'comment-3',
    content: '瑜伽真的很棒，我坚持做了半年了！',
    likes: 3,
    createdAt: new Date('2025-04-02T15:05:00Z'),
    updatedAt: new Date('2025-04-02T15:05:00Z'),
    authorId: 'user-3',
    postId: '2',
    rootId: 'comment-3', // 自己是根评论
    parentId: null,
    author: {
      id: 'user-3',
      name: '王五',
      image: 'https://randomuser.me/api/portraits/men/3.jpg'
    }
  },
  {
    id: 'comment-4',
    content: '你有什么推荐的瑜伽视频吗？',
    likes: 1,
    createdAt: new Date('2025-04-02T16:10:00Z'),
    updatedAt: new Date('2025-04-02T16:10:00Z'),
    authorId: 'user-1',
    postId: '2',
    rootId: 'comment-3', // 回复comment-3
    parentId: 'comment-3',
    author: {
      id: 'user-1',
      name: '张三',
      image: 'https://randomuser.me/api/portraits/men/1.jpg'
    }
  },
  {
    id: 'comment-5',
    content: '我最近在看B站的"瑜伽生活"，很适合初学者！',
    likes: 2,
    createdAt: new Date('2025-04-02T17:30:00Z'),
    updatedAt: new Date('2025-04-02T17:30:00Z'),
    authorId: 'user-3',
    postId: '2',
    rootId: 'comment-3', // 同一个根评论下
    parentId: 'comment-4', // 回复comment-4
    author: {
      id: 'user-3',
      name: '王五',
      image: 'https://randomuser.me/api/portraits/men/3.jpg'
    }
  },
  
  // Post 3的评论
  {
    id: 'comment-6',
    content: '画得很可爱！继续加油！',
    likes: 2,
    createdAt: new Date('2025-04-03T10:00:00Z'),
    updatedAt: new Date('2025-04-03T10:00:00Z'),
    authorId: 'user-2',
    postId: '3',
    rootId: 'comment-6', // 自己是根评论
    parentId: null,
    author: {
      id: 'user-2',
      name: '李四',
      image: 'https://randomuser.me/api/portraits/women/2.jpg'
    }
  }
];

// MARK: 用户点赞评论记录
export interface CommentLike {
  userId: string;
  commentId: string;
}

// 用户点赞评论记录
export const commentLikes: CommentLike[] = [
  { userId: 'user-1', commentId: 'comment-1' },
  { userId: 'user-1', commentId: 'comment-3' },
  { userId: 'user-1', commentId: 'comment-6' },
  { userId: 'user-2', commentId: 'comment-2' },
  { userId: 'user-2', commentId: 'comment-5' },
  { userId: 'user-3', commentId: 'comment-1' },
  { userId: 'user-3', commentId: 'comment-4' },
  { userId: 'user-3', commentId: 'comment-6' },
]; 