import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import PostActions from '../community/PostActions';

interface CommunityContentProps {
  // You can define any props needed here
  posts: any[];
  handleEditPost: (post: any) => void;
  setEditingPost: (post: any) => void;
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
          <div key={index} className="bg-card p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{post.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditPost(post)}
              >
                Edit
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{post.content}</p>
            {post.media && post.media.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                {post.media.map((url: string, index: number) => (
                  <div key={index} className="aspect-video relative rounded-lg overflow-hidden">
                    {url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                      <Image
                        src={url}
                        alt="Post media"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <video
                        src={url}
                        className="w-full h-full object-cover"
                        controls
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <span>{post.authorName}</span>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <PostActions post={post} />
          </div>
        ))}
      </div>
    </>
  );
};

export default CommunityContent;