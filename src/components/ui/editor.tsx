'use client';

import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';
import { uploadToCloudinary } from '@/lib/cloudinary';

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
}

export function Editor({ value, onChange }: EditorProps) {
  const handleImageUpload = async (blobInfo: any): Promise<string> => {
    try {
      // Convert blob to base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blobInfo.blob());
        reader.onload = async () => {
          try {
            const base64 = reader.result as string;
            const response = await uploadToCloudinary(base64);
            resolve(response.secure_url);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = (error) => reject(error);
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY || '0yjhs49kdhknwm2or3apawddwfxc3ptzu9y964f7cdvspjdh';

  return (
    <TinyMCEEditor
      apiKey={apiKey}
      value={value}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | image | help',
        content_style: 'body { font-family:Inter, Arial,sans-serif; font-size:14px }',
        images_upload_handler: handleImageUpload,
        automatic_uploads: true,
        file_picker_types: 'image',
        images_reuse_filename: true,
      }}
      onEditorChange={onChange}
    />
  );
} 