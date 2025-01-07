import { NextResponse, NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

   // Configuration
   cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


export async function POST(request: NextRequest) {
    try {
        const { file } = await request.json();

        // Check if file is base64
        if (!file.startsWith('data:')) {
            throw new Error('Invalid file format');
        }

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(file, {
            folder: 'blog-posts',
            resource_type: 'auto',
        });

        return NextResponse.json({
            secure_url: uploadResponse.secure_url,
            public_id: uploadResponse.public_id
        });

    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' }, 
            { status: 500 }
        );
    }
}
