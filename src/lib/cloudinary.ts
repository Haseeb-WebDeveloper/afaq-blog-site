interface UploadProgressCallback {
    (progress: number): void;
  }
  
  interface CloudinaryResponse {
    secure_url: string;
    public_id: string;
  }
  
  export async function uploadToCloudinary(
    file: string, 
    onProgress?: UploadProgressCallback
  ): Promise<CloudinaryResponse> {
    try {
      // Simulate upload progress for better UX
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress > 95) {
          progress = 95;
          clearInterval(progressInterval);
        }
        onProgress?.(progress);
      }, 500);
  
      const response = await fetch('/api/cloudinary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file }),
      });
  
      clearInterval(progressInterval);
      onProgress?.(100);
  
      if (!response.ok) {
        throw new Error('Upload failed');
      }
  
      const data = await response.json();
      return {
        secure_url: data.secure_url,
        public_id: data.public_id,
      };
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  }
  