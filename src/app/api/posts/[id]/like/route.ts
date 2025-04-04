import { NextResponse } from 'next/server';
import { posts, userLikes } from '@/lib/data/posts';
import { getCurrentUser } from '@/lib/data/auth';

// MARK: 给Post点赞或取消点赞
export async function POST(
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
    
    // 检查用户是否登录
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({
        message: '请先登录',
        success: false,
      }, { status: 401 });
    }
    
    // 检查用户是否已点赞
    const existingLikeIndex = userLikes.findIndex(
      like => like.userId === currentUser.id && like.postId === id
    );
    const isLiked = existingLikeIndex !== -1;
    
    if (isLiked) {
      // 取消点赞
      userLikes.splice(existingLikeIndex, 1);
      posts[postIndex].likes -= 1;
    } else {
      // 点赞
      userLikes.push({ userId: currentUser.id, postId: id });
      posts[postIndex].likes += 1;
    }
    
    return NextResponse.json({
      message: isLiked ? '取消点赞成功' : '点赞成功',
      success: true,
      data: {
        postId: id,
        likes: posts[postIndex].likes,
        isLiked: !isLiked
      }
    });
  } catch (error) {
    console.error('处理点赞失败:', error);
    return NextResponse.json({
      message: '处理点赞时发生错误',
      success: false,
    }, { status: 500 });
  }
}

// MARK: 检查用户是否已点赞
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
    
    // 检查用户是否登录
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({
        message: '请先登录',
        success: false,
      }, { status: 401 });
    }
    
    // 检查用户是否已点赞
    const isLiked = userLikes.some(
      like => like.userId === currentUser.id && like.postId === id
    );
    
    return NextResponse.json({
      message: '获取点赞状态成功',
      success: true,
      data: {
        postId: id,
        likes: post.likes,
        isLiked
      }
    });
  } catch (error) {
    console.error('获取点赞状态失败:', error);
    return NextResponse.json({
      message: '获取点赞状态时发生错误',
      success: false,
    }, { status: 500 });
  }
} 