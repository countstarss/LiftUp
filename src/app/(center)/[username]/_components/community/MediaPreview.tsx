import Image from 'next/image';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaPreviewProps {
  files: string[];
  onRemove: (index: number) => void;
}

export default function MediaPreview({ files, onRemove }: MediaPreviewProps) {
  console.log(`files:`, files);
  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      {files.map((file, index) => (
        <div key={index} className="relative group">
          <div className="aspect-video relative rounded-lg overflow-hidden">
            {file.startsWith('image/') ? (
              <Image
                src={file}
                alt="Preview"
                fill
                className="object-cover"
              />
            ) : (
              <video
                src={file}
                className="w-full h-full object-cover"
                controls
              />
            )}
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onRemove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
} 