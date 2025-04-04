import { useState } from 'react';
import { toast } from 'sonner';

interface UploadResult {
  url: string;
  type: string;
}

interface UploadResponse {
  data?: {
    url: string;
  };
  error?: string;
}

// 这是一个通用的媒体上传钩子，稍后可以替换为实际的实现
export function useMediaUpload() {
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // 模拟上传功能，实际项目中应该连接到真实的上传服务
  const uploadMedia = async (file: File): Promise<UploadResult | null> => {
    if (!file) return null;

    try {
      // 验证文件 - 这里简单检查文件类型
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        throw new Error('只支持图片和视频文件');
      }
      
      // 检查文件大小 - 这里限制为10MB
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('文件大小不能超过10MB');
      }
      
      setIsUploading(true);
      
      // 在实际应用中，这里应该调用实际的上传API
      // 这里我们模拟一个上传过程
      return new Promise((resolve) => {
        setTimeout(() => {
          // 创建一个本地URL以便预览
          const url = URL.createObjectURL(file);
          resolve({
            url,
            type: file.type.startsWith('image/') ? 'image' : 'video'
          });
        }, 1000); // 模拟1秒的上传时间
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '上传媒体失败');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // 这个方法匹配CreatePost组件的调用
  const uploadFile = async (
    file: File,
  ): Promise<UploadResponse> => {
    try {
      // 验证文件 - 这里简单检查文件类型
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        return { error: '只支持图片和视频文件' };
      }
      
      // 检查文件大小 - 这里限制为10MB
      if (file.size > 10 * 1024 * 1024) {
        return { error: '文件大小不能超过10MB' };
      }
      
      setIsUploading(true);
      
      // 模拟上传过程
      return new Promise((resolve) => {
        setTimeout(() => {
          // 创建一个本地URL以便预览
          const url = URL.createObjectURL(file);
          resolve({
            data: { url }
          });
        }, 1000); // 模拟1秒的上传时间
      });
    } catch (error) {
      return { error: error instanceof Error ? error.message : '上传媒体失败' };
    } finally {
      setIsUploading(false);
    }
  };

  const handleMediaUpload = async (file: File) => {
    const result = await uploadMedia(file);
    if (result) {
      setMediaUrls(prev => [...prev, result.url]);
      return result.url;
    }
    return null;
  };

  const handleRemoveMedia = (index: number) => {
    setMediaUrls(prev => prev.filter((_, i) => i !== index));
  };

  return {
    mediaUrls,
    setMediaUrls,
    isUploading,
    handleMediaUpload,
    handleRemoveMedia,
    uploadFile
  };
} 