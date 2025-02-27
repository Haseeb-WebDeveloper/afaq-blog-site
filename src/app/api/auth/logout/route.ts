import { verifyToken } from '@/lib/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    const token = req.cookies.get('token');
    const decoded = await verifyToken(token?.value || '');
    // console.log(decoded, token)
    if (!decoded) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Clean cookie from browser
    const cookieStore = await cookies();
    cookieStore.delete('token'); // Remove the token cookie
    console.log(cookieStore)

    return NextResponse.json({ message: "Logged out successfully" });
}