import { NextRequest, NextResponse } from 'next/server';
import { posts } from '@/lib/data/posts';
import { comments } from '@/lib/data/comments';
import { getCurrentUser } from '@/lib/data/auth';

// MARK: 获取Post的评论列表
export async function GET(
  request: NextRequest,
) {
  try {
    const postId = request.nextUrl.searchParams.get('id');
    const post = posts.find(post => post.id === postId);
    
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
    
    // 获取该Post下的所有评论
    const postComments = comments.filter(comment => comment.postId === postId);
    
    // 将评论按创建时间排序
    postComments.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    // 构建评论树结构，以便于前端展示楼中楼
    const commentTree = [];
    const commentMap = new Map();
    
    // 首先找出所有的顶级评论(parentId为null的)
    const rootComments = postComments.filter(comment => comment.parentId === null);
    
    // 对于每个顶级评论，将其添加到结果数组中
    for (const rootComment of rootComments) {
      const commentWithReplies = { ...rootComment, replies: [] };
      commentMap.set(rootComment.id, commentWithReplies);
      commentTree.push(commentWithReplies);
    }
    
    // 然后处理所有的回复(parentId不为null的)
    const replies = postComments.filter(comment => comment.parentId !== null);
    
    for (const reply of replies) {
      // 找到根评论
      const rootComment = postComments.find(c => c.id === reply.rootId);
      
      if (rootComment) {
        // 找到根评论对应的带有replies数组的对象
        const rootWithReplies = commentMap.get(rootComment.id);
        
        if (rootWithReplies) {
          // 添加回复到根评论的replies数组中
          rootWithReplies.replies.push(reply);
        }
      }
    }
    
    return NextResponse.json({
      message: '获取评论列表成功',
      success: true,
      data: commentTree
    });
  } catch (error) {
    console.error('获取评论列表失败:', error);
    return NextResponse.json({
      message: '获取评论列表时发生错误',
      success: false,
    }, { status: 500 });
  }
}

// MARK: 添加评论
export async function POST(
  request: NextRequest,
) {
  try {
    const postId = request.nextUrl.searchParams.get('id');
    const post = posts.find(post => post.id === postId);
    
    if (!post) {
      return NextResponse.json({
        message: '未找到指定的Post',
        success: false,
      }, { status: 404 });
    }
    
    // 检查用户是否登录
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({
        message: '请先登录',
        success: false,
      }, { status: 401 });
    }
    
    // 解析请求体
    const body = await request.json();
    const { content, parentId } = body;
    
    // 检查必填字段
    if (!content || content.trim() === '') {
      return NextResponse.json({
        message: '评论内容不能为空',
        success: false,
      }, { status: 400 });
    }
    
    // 检查父评论(如果有)
    let rootId: string | null = null;
    
    if (parentId) {
      const parentComment = comments.find(comment => comment.id === parentId);
      
      if (!parentComment) {
        return NextResponse.json({
          message: '父评论不存在',
          success: false,
        }, { status: 400 });
      }
      
      // 设置根评论ID
      // 如果父评论本身就是根评论，则使用父评论ID作为根评论ID
      // 否则使用父评论的根评论ID
      rootId = parentComment.parentId === null ? parentComment.id : parentComment.rootId;
    }
    
    // 创建新评论
    const now = new Date().toISOString();
    const newComment: any = {
      id: `comment-${Date.now()}`,
      content,
      likes: 0,
      createdAt: now,
      updatedAt: now,
      ownerId: currentUser.id,
      postId,
      rootId: rootId || null, // 如果没有父评论，则rootId为null
      parentId,
      owner: {
        id: currentUser.id,
        username: currentUser.username,
        avatarUrl: currentUser.avatarUrl
      }
    };
    
    // 如果是顶级评论，rootId等于自己的id
    if (newComment.parentId === null) {
      newComment.rootId = newComment.id;
    }
    
    // 添加新评论
    comments.push(newComment);
    
    return NextResponse.json({
      message: '添加评论成功',
      success: true,
      data: newComment
    }, { status: 201 });
  } catch (error) {
    console.error('添加评论失败:', error);
    return NextResponse.json({
      message: '添加评论时发生错误',
      success: false,
    }, { status: 500 });
  }
} 