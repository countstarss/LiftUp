import { NextResponse } from 'next/server';
import { posts } from '@/lib/data/posts';
import { actions } from '@/lib/data/actions';
import { getCurrentUser, hasPermission } from '@/lib/data/auth';

// MARK: 获取Posts列表，支持筛选
export async function GET(request: Request) {
  try {
    const currentUser = getCurrentUser();
    const url = new URL(request.url);
    const isPublicOnly = url.searchParams.get('public') === 'true';
    const actionId = url.searchParams.get('actionId');
    const ownerId = url.searchParams.get('ownerId');
    const limit = url.searchParams.get('limit') ? 
      parseInt(url.searchParams.get('limit') as string) : undefined;
    const page = url.searchParams.get('page') ? 
      parseInt(url.searchParams.get('page') as string) : 1;
    
    // 筛选Posts
    let filteredPosts = [...posts];
    
    // 只显示公开的Posts，除非用户请求查看自己的Posts
    if (isPublicOnly || !currentUser) {
      filteredPosts = filteredPosts.filter(post => post.isPublic);
    } else if (currentUser && !currentUser.role.includes('ADMIN')) {
      // 非管理员只能看到公开的和自己的Posts
      filteredPosts = filteredPosts.filter(post => 
        post.isPublic || post.ownerId === currentUser.id
      );
    }
    
    // 按Action筛选
    if (actionId) {
      filteredPosts = filteredPosts.filter(post => post.actionId === actionId);
    }
    
    // 按用户筛选
    if (ownerId) {
      // 检查权限：只有本人或管理员可以查看非公开Posts
      if (currentUser && (currentUser.id === ownerId || currentUser.role.includes('ADMIN'))) {
        filteredPosts = filteredPosts.filter(post => post.ownerId === ownerId);
      } else {
        // 其他人只能看该用户的公开Posts
        filteredPosts = filteredPosts.filter(post => 
          post.ownerId === ownerId && post.isPublic
        );
      }
    }
    
    // 按创建日期降序排序（最新的在前面）
    filteredPosts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // 分页处理
    const pageSize = limit || 10;
    const startIndex = (page - 1) * pageSize;
    const paginatedPosts = filteredPosts.slice(startIndex, startIndex + pageSize);
    
    // 关联行动数据
    const postsWithActions = paginatedPosts.map(post => {
      const action = actions.find(a => a.id === post.actionId);
      return {
        ...post,
        action: action || undefined
      };
    });
    
    // 返回结果
    return NextResponse.json({
      message: '获取Posts列表成功',
      success: true,
      data: {
        posts: postsWithActions,
        pagination: {
          total: filteredPosts.length,
          page,
          pageSize,
          pageCount: Math.ceil(filteredPosts.length / pageSize)
        }
      }
    });
  } catch (error) {
    console.error('获取Posts列表失败:', error);
    return NextResponse.json({
      message: '获取Posts列表时发生错误',
      success: false,
    }, { status: 500 });
  }
}

// MARK: 创建新Post
export async function POST(request: Request) {
  try {
    const currentUser = getCurrentUser();
    
    // 检查用户是否已登录
    if (!currentUser) {
      return NextResponse.json({
        message: '请先登录',
        success: false,
      }, { status: 401 });
    }
    
    // 解析请求体
    const body = await request.json();
    const { content, isPublic, actionId } = body;
    
    // 检查必填字段
    if (!content || content.trim() === '') {
      return NextResponse.json({
        message: '内容不能为空',
        success: false,
      }, { status: 400 });
    }
    
    if (!actionId) {
      return NextResponse.json({
        message: '请选择关联的行动',
        success: false,
      }, { status: 400 });
    }
    
    // 检查actionId是否有效
    const action = actions.find(a => a.id === actionId);
    if (!action) {
      return NextResponse.json({
        message: '选择的行动不存在',
        success: false,
      }, { status: 400 });
    }
    
    // 创建新Post
    const now = new Date().toISOString();
    const newPost = {
      id: `post-${Date.now()}`,
      content,
      isPublic: isPublic !== false, // 默认为公开
      likes: 0,
      createdAt: now,
      updatedAt: now,
      ownerId: currentUser.id,
      actionId,
      owner: {
        id: currentUser.id,
        username: currentUser.username,
        avatarUrl: currentUser.avatarUrl
      },
      action,
      commentCount: 0
    };
    
    // 模拟将新Post添加到数据库
    posts.unshift(newPost);
    
    return NextResponse.json({
      message: '创建Post成功',
      success: true,
      data: newPost
    }, { status: 201 });
  } catch (error) {
    console.error('创建Post失败:', error);
    return NextResponse.json({
      message: '创建Post时发生错误',
      success: false,
    }, { status: 500 });
  }
} 