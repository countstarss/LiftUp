import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, X } from "lucide-react";
import MediaPreview from './MediaPreview';
import { toast } from 'sonner';
import { UploadProgress } from './UploadProgress';
import Image from 'next/image';
import { Post, User, Comment } from '@prisma/client';
import { useMediaUpload } from '@/hooks/useMediaUpload';

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

interface PostEditorProps {
  post?: PostWithRelations;
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: Partial<PostWithRelations>) => void;
}

interface UploadStatus {
  file: File;
  progress: number;
}

export default function PostEditor({ post, isOpen, onClose, onSave }: PostEditorProps) {
  const [content, setContent] = useState(post?.content || '');
  const [mediaUrls, setMediaUrls] = useState<string[]>(post?.media || []);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus[]>([]); // 仅用于跟踪上传进度
  
  const { uploadFile } = useMediaUpload();

  useEffect(() => {
    if (post) {
      setContent(post.content);
      setMediaUrls(post.media || []);
    } else {
      setContent('');
      setMediaUrls([]);
    }
  }, [post]);

  const handleEmojiSelect = (emoji: string) => {
    setContent(prev => prev + emoji);
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // 添加一个上传状态记录
      const newUploadStatus: UploadStatus = { file, progress: 0 };
      setUploadStatus(prev => [...prev, newUploadStatus]);
      
      const { data, error: uploadError } = await uploadFile(
        file,
      );

      if (uploadError) {
        toast.error(uploadError);
        return;
      }

      if (data?.url) {
        setMediaUrls(prev => [...prev, data.url]);
        // 更新上传状态为完成
        setUploadStatus(prev => 
          prev.map(status => 
            status.file === file ? { ...status, progress: 100 } : status
          )
        );
      }
    } catch (error) {
      toast.error("Failed to upload media");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMediaUrls(prev => prev.filter((_, i) => i !== index));
  };


  const handleSave = async () => {
    try {
      await onSave({
        content,
        updatedAt: new Date(),
        media: mediaUrls
      });
      
      setMediaUrls([]);
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save post');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{post ? 'Edit Post' : 'Create New Post'}</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium">Content</label>
            <div className="relative">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post..."
                rows={5}
              />
            </div>
          </div>

          <div className="w-full">
            <label className="text-sm font-medium block mb-2">Media</label>

            {mediaUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {mediaUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video relative rounded-lg overflow-hidden">
                      {url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <Image
                          src={url}
                          alt="Media"
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
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveMedia(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 w-full">
              <label className="cursor-pointer">
                <Input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  disabled={isUploading}
                />
                <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent ">
                  <ImagePlus className="w-4 h-4" />
                  <span>Add Media</span>
                </div>
              </label>
              {mediaUrls.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {mediaUrls.length} file(s) selected
                </span>
              )}
            </div>

            {mediaUrls.length > 0 && (
              <MediaPreview files={mediaUrls} onRemove={handleRemoveMedia} />
            )}
          </div>

          <div className="flex justify-end gap-2 mt-24">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isUploading || !content.trim()}
            >
              {isUploading ? 'Uploading...' : (post ? 'Save Changes' : 'Create Post')}
            </Button>
          </div>
        </div>

        {uploadStatus.length > 0 && (
          <div className="space-y-2 mt-4">
            {uploadStatus.map((status, index) => (
              <UploadProgress
                key={index}
                fileName={status.file.name}
                progress={status.progress}
              />
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
} 