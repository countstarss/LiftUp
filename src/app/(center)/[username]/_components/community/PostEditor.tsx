import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, X } from "lucide-react";
import { Post } from '@/types/profile';
import { EmojiPicker } from '@/components/ui/emoji-picker';
import { useUploadFile } from '@/hooks/tools/useUploadFile';
import MediaPreview from './MediaPreview';
import { toast } from 'sonner';
import { UploadProgress } from './UploadProgress';
import Image from 'next/image';

interface PostEditorProps {
  post?: Post;
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: Partial<Post>) => void;
}

interface UploadStatus {
  file: File;
  progress: number;
}

export default function PostEditor({ post, isOpen, onClose, onSave }: PostEditorProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [description, setDescription] = useState(post?.description || '');
  const [newMediaUrls, setNewMediaUrls] = useState<string[]>([]);
  const [existingMedia, setExistingMedia] = useState<string[]>(post?.media || []);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus[]>([]);
  
  const { uploadFile } = useUploadFile();

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setDescription(post.description);
      setExistingMedia(post.media || []);
      setNewMediaUrls([]);
    } else {
      setTitle('');
      setContent('');
      setDescription('');
      setExistingMedia([]);
      setNewMediaUrls([]);
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
        setNewMediaUrls(prev => [...prev, data.url]);
      }
    } catch (error) {
      toast.error("Failed to upload media");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveNewMedia = (index: number) => {
    setNewMediaUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingMedia = (index: number) => {
    setExistingMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      // 合并现有的媒体URL和新上传的URL
      const allMediaUrls = [...existingMedia, ...newMediaUrls];

      await onSave({
        title,
        content,
        description,
        media: allMediaUrls,
        _id: post?._id,
        updatedAt: new Date(),
      });
      
      setNewMediaUrls([]);
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
              placeholder="Enter a brief description"
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

          <div className="w-full">
            <label className="text-sm font-medium block mb-2"
              // MARK: existingMedia
            >Media</label>

            {existingMedia.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {existingMedia.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video relative rounded-lg overflow-hidden">
                      {url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <Image
                          src={url}
                          alt="Existing media"
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
                      onClick={() => handleRemoveExistingMedia(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {newMediaUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {newMediaUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video relative rounded-lg overflow-hidden">
                      {url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <Image
                          src={url}
                          alt="New media"
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
                      onClick={() => handleRemoveNewMedia(index)}
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
              {newMediaUrls.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {newMediaUrls.length} new file(s) selected
                </span>
              )}
            </div>

            {newMediaUrls.length > 0 && (
              <MediaPreview files={newMediaUrls} onRemove={handleRemoveNewMedia} />
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
              disabled={isUploading || !title.trim() || !content.trim()}
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