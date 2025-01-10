'use client';

import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from './button';
import { uploadToCloudinary } from '@/lib/cloudinary';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('image')) {
      setError('Please upload an image file');
      return;
    }

    try {
      setIsUploading(true);
      setError('');

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result as string;
        const response = await uploadToCloudinary(base64);
        onChange(response.secure_url);
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          disabled={isUploading}
          onClick={() => document.getElementById('imageInput')?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            className="text-destructive"
            onClick={() => onChange('')}
          >
            <X className="w-4 h-4 mr-2" />
            Remove
          </Button>
        )}
      </div>

      <input
        id="imageInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {value && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <img
            src={value}
            alt="Uploaded image"
            className="object-cover w-full h-full"
          />
        </div>
      )}
    </div>
  );
} 