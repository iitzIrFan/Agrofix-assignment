import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;
    
    // Validate password against environment variable
    if (!password || password !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
    
    // For simplicity, just return the token (same as the password in this basic implementation)
    // In a real app, you'd generate a proper JWT or other token
    return NextResponse.json({
      token: process.env.ADMIN_SECRET,
    });
    
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 