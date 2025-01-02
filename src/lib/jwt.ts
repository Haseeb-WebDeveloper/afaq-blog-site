// jwt.ts

import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'guhgguofxw.fxenuffieypf7qrtgypewhbehfbcf-fdsd';
const secret = new TextEncoder().encode(JWT_SECRET);

export async function signToken(payload: any) {
  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);
  
  return token;
}


export async function verifyToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}