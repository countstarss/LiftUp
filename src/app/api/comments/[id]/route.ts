import { NextRequest, NextResponse } from 'next/server';
import { comments } from '@/lib/data/comments';
import { posts } from '@/lib/data/posts';
import { getCurrentUser, hasPermission } from '@/lib/data/auth';

// MARK: 获取单个评论详情
export async function GET(
  request: NextRequest,
) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    const comment = comments.find(comment => comment.id === id);
    
    if (!comment) {
      return NextResponse.json({
        message: '未找到指定的评论',
        success: false,
      }, { status: 404 });
    }
    
    // 检查相关Post是否存在
    const post = posts.find(post => post.id === comment.postId);
    if (!post) {
      return NextResponse.json({
        message: '评论关联的Post不存在',
        success: false,
      }, { status: 404 });
    }
    
    // 检查查看权限
    const currentUser = getCurrentUser();
    
    // 非公开Post的评论只有作者和管理员可见
    if (!post.isPublic && (
      !currentUser || 
      (currentUser.id !== post.ownerId && currentUser.role !== 'ADMIN')
    )) {
      return NextResponse.json({
        message: '没有权限查看此评论',
        success: false,
      }, { status: 403 });
    }
    
    return NextResponse.json({
      message: '获取评论详情成功',
      success: true,
      data: comment
    });
  } catch (error) {
    console.error('获取评论详情失败:', error);
    return NextResponse.json({
      message: '获取评论详情时发生错误',
      success: false,
    }, { status: 500 });
  }
}

// MARK: 更新评论
export async function PUT(
  request: NextRequest,
) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    const commentIndex = comments.findIndex(comment => comment.id === id);
    
    if (commentIndex === -1) {
      return NextResponse.json({
        message: '未找到指定的评论',
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
    
    if (!hasPermission(comments[commentIndex].authorId, 'edit')) {
      return NextResponse.json({
        message: '没有权限编辑此评论',
        success: false,
      }, { status: 403 });
    }
    
    // 解析请求体
    const body = await request.json();
    const { content } = body;
    
    // 检查必填字段
    if (!content || content.trim() === '') {
      return NextResponse.json({
        message: '评论内容不能为空',
        success: false,
      }, { status: 400 });
    }
    
    // 更新评论
    const now = new Date().toISOString();
    const updatedComment = {
      ...comments[commentIndex],
      content,
      updatedAt: now
    };
    
    // 模拟更新数据库
    comments[commentIndex] = updatedComment as any;
    
    return NextResponse.json({
      message: '更新评论成功',
      success: true,
      data: updatedComment
    });
  } catch (error) {
    console.error('更新评论失败:', error);
    return NextResponse.json({
      message: '更新评论时发生错误',
      success: false,
    }, { status: 500 });
  }
}

// MARK: 删除评论
export async function DELETE(
  request: NextRequest,
) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    const commentIndex = comments.findIndex(comment => comment.id === id);
    
    if (commentIndex === -1) {
      return NextResponse.json({
        message: '未找到指定的评论',
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
    
    if (!hasPermission(comments[commentIndex].authorId, 'delete')) {
      return NextResponse.json({
        message: '没有权限删除此评论',
        success: false,
      }, { status: 403 });
    }
    
    // 获取要删除的评论
    const commentToDelete = comments[commentIndex];
    
    // 如果是根评论，需要同时删除所有回复
    if (commentToDelete.parentId === null) {
      // 找到所有以该评论为根的回复
      const replyIndices = [];
      
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].rootId === commentToDelete.id && comments[i].id !== commentToDelete.id) {
          replyIndices.push(i);
        }
      }
      
      // 从后往前删除回复，避免索引变化
      for (let i = replyIndices.length - 1; i >= 0; i--) {
        comments.splice(replyIndices[i], 1);
      }
    }
    
    // 删除评论本身
    const deletedComment = comments.splice(commentIndex, 1)[0];
    
    return NextResponse.json({
      message: '删除评论成功',
      success: true,
      data: deletedComment
    });
  } catch (error) {
    console.error('删除评论失败:', error);
    return NextResponse.json({
      message: '删除评论时发生错误',
      success: false,
    }, { status: 500 });
  }
} 