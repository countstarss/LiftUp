'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus } from "lucide-react";
import { useUploadFile } from '@/hooks/tools/useUploadFile';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { postService } from '@/app/server-actions/post.service';
import { useLocalSession } from "@/providers/SessionProvider";
import { validateFile } from '@/utils/fileValidation';
import { UploadProgress } from '../UploadProgress';
import MediaPreview from '../MediaPreview';
import { EmojiPicker } from '@/components/ui/emoji-picker';

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { session } = useLocalSession();
  const queryClient = useQueryClient();
  const { uploadFile } = useUploadFile();

  const handleEmojiSelect = (emoji: string) => {
    setContent(prev => prev + emoji);
  };

  // MARK: 上传媒体文件
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 验证文件
      validateFile(file);
      
      setIsUploading(true);
      const { data, error } = await uploadFile(
        "community-post", // bucket name
        file,
        file.type.startsWith('image/') ? 'image' : 'video',
        "post"
      );

      if (error) {
        toast.error(error);
        return;
      }

      if (data?.url) {
        setMediaUrls(prev => [...prev, data.url]);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload media');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMediaUrls(prev => prev.filter((_, i) => i !== index));
  };

  // MARK: handleSubmit
  const handleSubmit = async () => {
    try {
      if (!session?.user) {
        toast.error('Please login first');
        return;
      }

      // 创建帖子
      await postService.createPost({
        title,
        content,
        description,
        authorId: session.user.id,
        media: mediaUrls,
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: [],
        comments: []
      });

      // 重置表单
      setTitle('');
      setContent('');
      setDescription('');
      setMediaUrls([]);
      
      // 刷新帖子列表
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post created successfully');
    } catch (error) {
      toast.error('Failed to create post');
      console.error(error);
    }
  };

  // MARK: PostForm
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Description</label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter post description"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Content</label>
        <div className="relative">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post..."
            rows={5}
          />
          <div className="absolute bottom-2 right-2">
            <EmojiPicker onChange={handleEmojiSelect} />
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-2">Media</label>
        <div className="flex items-center gap-2">
          <label className="cursor-pointer">
            <Input
              type="file"
              className="hidden"
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              disabled={isUploading}
            />
            <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent">
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

      <Button 
        onClick={handleSubmit} 
        className="w-full"
        disabled={isUploading || !title.trim() || !content.trim()}
      >
        {isUploading ? 'Uploading...' : 'Create Post'}
      </Button>
    </div>
  );
} 