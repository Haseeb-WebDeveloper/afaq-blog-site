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
        console.log('Uploading file to Cloudinary');
        const { file } = await request.json();
        const result = await cloudinary.uploader.upload(file, { folder: 'BlogPosts' });
        console.log('File uploaded to Cloudinary:', result);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error uploading file to Cloudinary:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}
