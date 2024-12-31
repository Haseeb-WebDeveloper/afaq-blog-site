import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "./lib/jwt";

const publicRoutes = [
    '/api/auth/login',
    '/api/auth/signup',
    '/auth/signup',
    '/auth/login',
    '/',
    '/blog',
    '/blog/[postId]',
    '/api/blog',
    '/api/blog/[postId]',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
];

export async function middleware(req: NextRequest) {
    if (publicRoutes.includes(req.nextUrl.pathname)) {
        return NextResponse.next();
    }

    const token = req.cookies.get('token');
    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    try {
        const decoded = await verifyToken(token.value);
        if (!decoded) {
            return NextResponse.redirect(new URL('/auth/login', req.url));
        }
        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)', '/'],
};
