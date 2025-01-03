import { cookies } from 'next/headers';
import { verifyToken } from './jwt';

export interface User {
  id: string;
  email: string;
  role: string;
}

export async function getUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = await cookieStore.get('token');

    if (!token) {
      return null;
    }

    const payload = await verifyToken(token.value);
    
    if (!payload) {
      return null;
    }

    return {
      id: payload.id as string,
      email: payload.email as string,
      role: payload.role as string
    };
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser();
  return !!user;
}

export async function isAdmin(): Promise<boolean> {
  const user = await getUser();
  return user?.role === 'admin';
}

export async function getAuthorizationHeader(): Promise<{ user: User | null, token: string | null }> {
  const cookieStore = await cookies();
  const token = await cookieStore.get('token');
  
  if (!token) {
    return { user: null, token: null };
  }
  

  return { user: null, token: token.value };
}

// Helper function to format error messages
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

// Helper function to validate admin access
export async function validateAdminAccess() {
  const user = await getUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }

  if (user.role !== 'admin') {
    throw new Error('Forbidden: Admin access required');
  }

  return user;
}

// Helper function to get user session data
export async function getUserSession() {
  const user = await getUser();
  
  if (!user) {
    return null;
  }

  const cookieStore = await cookies();
  const token = await cookieStore.get('token');

  return {
    user,
    isAdmin: user.role === 'admin',
    token: token?.value
  };
}

// Helper function to check specific permissions
export async function hasPermission(permission: string): Promise<boolean> {
  const user = await getUser();
  
  if (!user) {
    return false;
  }

  // Add your permission logic here
  // For now, we'll just check if user is admin
  return user.role === 'admin';
}

// Types for authentication
export type AuthStatus = {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
};

export type AuthError = {
  message: string;
  code: string;
};

// Helper function to get complete auth status
export async function getAuthStatus(): Promise<AuthStatus> {
  const user = await getUser();
  
  return {
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' ?? false,
    user
  };
} 