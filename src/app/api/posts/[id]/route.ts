import { NextResponse } from 'next/server';
import { posts } from '@/lib/data/posts';
import { actions } from '@/lib/data/actions';
import { comments } from '@/lib/data/comments';
import { getCurrentUser, hasPermission } from '@/lib/data/auth';

// MARK: 获取单个Post详情
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const post = posts.find(post => post.id === id);
    
    if (!post) {
      return NextResponse.json({
        message: '未找到指定的Post',
        success: false,
      }, { status: 404 });
    }
    
    // 检查查看权限
    const currentUser = getCurrentUser();
    
    // 非公开Post只有作者和管理员可见
    if (!post.isPublic && (
      !currentUser || 
      (currentUser.id !== post.ownerId && currentUser.role !== 'ADMIN')
    )) {
      return NextResponse.json({
        message: '没有权限查看此Post',
        success: false,
      }, { status: 403 });
    }
    
    // 获取关联的Action
    const action = actions.find(a => a.id === post.actionId);
    
    // 获取评论数量
    const commentCount = comments.filter(c => c.postId === post.id).length;
    
    // 组合结果
    const result = {
      ...post,
      action,
      commentCount
    };
    
    return NextResponse.json({
      message: '获取Post详情成功',
      success: true,
      data: result
    });
  } catch (error) {
    console.error('获取Post详情失败:', error);
    return NextResponse.json({
      message: '获取Post详情时发生错误',
      success: false,
    }, { status: 500 });
  }
}

// MARK: 更新Post
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const postIndex = posts.findIndex(post => post.id === id);
    
    if (postIndex === -1) {
      return NextResponse.json({
        message: '未找到指定的Post',
        success: false,
      }, { status: 404 });
    }
    
    // 检查编辑权限
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({
        message: '请先登录',
        success: false,
      }, { status: 401 });
    }
    
    if (!hasPermission(posts[postIndex].ownerId, 'edit')) {
      return NextResponse.json({
        message: '没有权限编辑此Post',
        success: false,
      }, { status: 403 });
    }
    
    // 解析请求体
    const body = await request.json();
    const { content, isPublic, actionId } = body;
    
    // 检查必填字段
    if (content !== undefined && content.trim() === '') {
      return NextResponse.json({
        message: '内容不能为空',
        success: false,
      }, { status: 400 });
    }
    
    // 检查actionId是否有效
    if (actionId) {
      const action = actions.find(a => a.id === actionId);
      if (!action) {
        return NextResponse.json({
          message: '选择的行动不存在',
          success: false,
        }, { status: 400 });
      }
    }
    
    // 更新Post
    const now = new Date().toISOString();
    const updatedPost = {
      ...posts[postIndex],
      content: content || posts[postIndex].content,
      isPublic: isPublic !== undefined ? isPublic : posts[postIndex].isPublic,
      actionId: actionId || posts[postIndex].actionId,
      updatedAt: now
    };
    
    // 如果actionId改变了，更新关联的action
    if (actionId && actionId !== posts[postIndex].actionId) {
      const action = actions.find(a => a.id === actionId);
      if (action) {
        updatedPost.action = action;
      }
    }
    
    // 模拟更新数据库
    posts[postIndex] = updatedPost;
    
    return NextResponse.json({
      message: '更新Post成功',
      success: true,
      data: updatedPost
    });
  } catch (error) {
    console.error('更新Post失败:', error);
    return NextResponse.json({
      message: '更新Post时发生错误',
      success: false,
    }, { status: 500 });
  }
}

// MARK: 删除Post
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const postIndex = posts.findIndex(post => post.id === id);
    
    if (postIndex === -1) {
      return NextResponse.json({
        message: '未找到指定的Post',
        success: false,
      }, { status: 404 });
    }
    
    // 检查删除权限
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({
        message: '请先登录',
        success: false,
      }, { status: 401 });
    }
    
    if (!hasPermission(posts[postIndex].ownerId, 'delete')) {
      return NextResponse.json({
        message: '没有权限删除此Post',
        success: false,
      }, { status: 403 });
    }
    
    // 模拟从数据库删除
    const deletedPost = posts.splice(postIndex, 1)[0];
    
    // 删除关联的评论
    // 在真实数据库中，这可能需要一个单独的操作或事务
    // 这里我们只是模拟
    
    return NextResponse.json({
      message: '删除Post成功',
      success: true,
      data: deletedPost
    });
  } catch (error) {
    console.error('删除Post失败:', error);
    return NextResponse.json({
      message: '删除Post时发生错误',
      success: false,
    }, { status: 500 });
  }
} 