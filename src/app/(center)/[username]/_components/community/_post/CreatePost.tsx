'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus } from "lucide-react";
import { toast } from 'sonner';
import MediaPreview from '../MediaPreview';
import { EmojiPicker } from '@/components/ui/emoji-picker';
import { useCreatePost } from '@/hooks/usePosts';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { useSession } from 'next-auth/react';

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  // const [actionId, setActionId] = useState<string>(""); // 默认选择的Action ID
  const actionId = "1"; // 默认选择的Action ID

  const { data: session } = useSession();
  const { uploadFile } = useMediaUpload();
  const { mutate: createPost } = useCreatePost();

  const handleEmojiSelect = (emoji: string) => {
    setContent(prev => prev + emoji);
  };

  // MARK: 上传媒体文件
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const { data, error } = await uploadFile(
        file,
      );

      if (error) {
        toast.error(error);
        return;
      }

      if (data?.url) {
        setMediaUrls(prev => [...prev, data.url]);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '上传媒体失败');
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
        toast.error('请先登录');
        return;
      }

      if (!actionId) {
        toast.error('请选择关联的行动');
        return;
      }

      // 开始创建帖子
      setIsCreatingPost(true);
      
      // 使用React Query钩子创建帖子
      createPost({
        content,
        isPublic: true,
        actionId
      }, {
        onSuccess: () => {
          // 重置表单
          setTitle('');
          setContent('');
          setDescription('');
          setMediaUrls([]);
          toast.success('帖子创建成功');
          setIsCreatingPost(false);
        },
        onError: (error) => {
          toast.error('创建帖子失败');
          console.error(error);
          setIsCreatingPost(false);
        }
      });
    } catch (error) {
      toast.error('创建帖子失败');
      console.error(error);
      setIsCreatingPost(false);
    }
  };

  // MARK: PostForm
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">标题</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入帖子标题"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">描述</label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="输入帖子描述"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">内容</label>
        <div className="relative">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写下你的帖子内容..."
            rows={5}
          />
          <div className="absolute bottom-2 right-2">
            <EmojiPicker onChange={handleEmojiSelect} />
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-2">媒体</label>
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
              <span>添加媒体</span>
            </div>
          </label>
          {mediaUrls.length > 0 && (
            <span className="text-sm text-muted-foreground">
              已选择 {mediaUrls.length} 个文件
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
        disabled={isUploading || !title.trim() || !content.trim() || isCreatingPost}
      >
        {isUploading ? '上传中...' : isCreatingPost ? '创建中...' : '创建帖子'}
      </Button>
    </div>
  );
} 