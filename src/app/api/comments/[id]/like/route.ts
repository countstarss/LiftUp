import { NextResponse } from 'next/server';
import { comments, commentLikes } from '@/lib/data/comments';
import { getCurrentUser } from '@/lib/data/auth';

// MARK: 给评论点赞或取消点赞
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const commentIndex = comments.findIndex(comment => comment.id === id);
    
    if (commentIndex === -1) {
      return NextResponse.json({
        message: '未找到指定的评论',
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
    
    // 检查用户是否已点赞
    const existingLikeIndex = commentLikes.findIndex(
      like => like.userId === currentUser.id && like.commentId === id
    );
    const isLiked = existingLikeIndex !== -1;
    
    if (isLiked) {
      // 取消点赞
      commentLikes.splice(existingLikeIndex, 1);
      comments[commentIndex].likes -= 1;
    } else {
      // 点赞
      commentLikes.push({ userId: currentUser.id, commentId: id });
      comments[commentIndex].likes += 1;
    }
    
    return NextResponse.json({
      message: isLiked ? '取消点赞成功' : '点赞成功',
      success: true,
      data: {
        commentId: id,
        likes: comments[commentIndex].likes,
        isLiked: !isLiked
      }
    });
  } catch (error) {
    console.error('处理评论点赞失败:', error);
    return NextResponse.json({
      message: '处理评论点赞时发生错误',
      success: false,
    }, { status: 500 });
  }
}

// MARK: 检查用户是否已点赞评论
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const comment = comments.find(comment => comment.id === id);
    
    if (!comment) {
      return NextResponse.json({
        message: '未找到指定的评论',
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
    
    // 检查用户是否已点赞
    const isLiked = commentLikes.some(
      like => like.userId === currentUser.id && like.commentId === id
    );
    
    return NextResponse.json({
      message: '获取评论点赞状态成功',
      success: true,
      data: {
        commentId: id,
        likes: comment.likes,
        isLiked
      }
    });
  } catch (error) {
    console.error('获取评论点赞状态失败:', error);
    return NextResponse.json({
      message: '获取评论点赞状态时发生错误',
      success: false,
    }, { status: 500 });
  }
} 