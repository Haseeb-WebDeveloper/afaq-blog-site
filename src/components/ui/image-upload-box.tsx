'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Progress } from "@/components/ui/progress";

interface ImageUploadBoxProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
}

export function ImageUploadBox({ value, onChange, className }: ImageUploadBoxProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError('');
      setUploadProgress(0);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result as string;
        const response = await uploadToCloudinary(base64, (progress) => {
          setUploadProgress(progress);
        });
        onChange(response.secure_url);
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative aspect-[16/9] max-h-96 cursor-pointer rounded-lg border-2 border-dashed transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          className
        )}
      >
        <input {...getInputProps()} />
        
        {value ? (
          <div className="relative aspect-[16/9] max-h-96  overflow-hidden rounded-lg">
            <img
              src={value}
              alt="Uploaded image"
              className="object-cover w-full h-full transition-opacity group-hover:opacity-75"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="absolute top-2 right-2 p-2 rounded-full bg-destructive/90 text-destructive-foreground hover:bg-destructive/100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-12 text-center">
            {isUploading ? (
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-primary animate-bounce" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Uploading image... {Math.round(uploadProgress)}%
                  </p>
                  <div className="w-full max-w-xs mx-auto">
                    <Progress value={uploadProgress} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {isDragActive ? (
                    <Upload className="w-6 h-6 text-primary" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {isDragActive ? 'Drop image here' : 'Drag & drop image here'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    or click to select file
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
} 