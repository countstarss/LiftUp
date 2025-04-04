import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import PostActions from '../community/PostActions';
import { Post, User, Comment } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// 定义扩展的Post类型，包含关联数据
type PostWithRelations = Post & {
  owner?: User;
  comments?: CommentWithUser[];
  _count?: {
    comments?: number;
  };
  // 用于媒体展示
  media?: string[];
};

type CommentWithUser = Comment & {
  owner?: User;
};

interface CommunityContentProps {
  posts: PostWithRelations[];
  handleEditPost: (post: PostWithRelations) => void;
  setEditingPost: (post: PostWithRelations | undefined) => void;
  setIsPostEditorOpen: (isOpen: boolean) => void;
}

const CommunityContent = ({
  posts,
  handleEditPost,
  setEditingPost,
  setIsPostEditorOpen,
}: CommunityContentProps) => {

  // MARK: 社区帖子
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Community Posts</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setEditingPost(undefined);
            setIsPostEditorOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post, index) => (
          <div key={post.id || index} className="bg-card p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={post.owner?.avatarUrl || ''} alt={post.owner?.username || 'User'} />
                  <AvatarFallback>{post.owner?.username?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{post.owner?.username || 'Unknown User'}</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditPost(post)}
              >
                Edit
              </Button>
            </div>
            
            <p className="text-sm mt-4">{post.content}</p>
            
            {post.media && post.media.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {post.media.map((mediaUrl, idx) => (
                  <div key={idx} className="relative aspect-square rounded-md overflow-hidden">
                    <Image 
                      src={mediaUrl} 
                      alt={`Media ${idx + 1}`} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4">
              <PostActions post={post} />
            </div>
            
            <div className="mt-2 text-xs text-muted-foreground">
              {post._count?.comments || 0} comments · {post.likes || 0} likes
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CommunityContent;