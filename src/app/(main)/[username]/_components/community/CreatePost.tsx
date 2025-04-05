'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus } from "lucide-react";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File[]>([]);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMedia(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    media.forEach(file => {
      formData.append('media', file);
    });

    // TODO: 实现上传逻辑
  };

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
        <label className="text-sm font-medium">Content</label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post..."
          rows={5}
        />
      </div>

      <div>
        <label className="text-sm font-medium block mb-2">Media</label>
        <div className="flex items-center gap-2">
          <label className="cursor-pointer">
            <Input
              type="file"
              className="hidden"
              multiple
              accept="image/*,video/*"
              onChange={handleMediaUpload}
            />
            <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent">
              <ImagePlus className="w-4 h-4" />
              <span>Add Media</span>
            </div>
          </label>
          {media.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {media.length} file(s) selected
            </span>
          )}
        </div>
      </div>

      <Button onClick={handleSubmit} className="w-full">
        Create Post
      </Button>
    </div>
  );
} 