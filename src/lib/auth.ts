import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function isAuthenticated(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.split(' ')[1];
  return token === process.env.ADMIN_SECRET;
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  );
} 