import { isAuthenticated, unauthorizedResponse } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Check authentication
  if (!isAuthenticated(request)) {
    return unauthorizedResponse();
  }
  
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Check authentication
  if (!isAuthenticated(request)) {
    return unauthorizedResponse();
  }
  
  try {
    const body = await request.json();
    const { name, price } = body;
    
    // Validate inputs
    if (!name || typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { error: 'Invalid product data' },
        { status: 400 }
      );
    }
    
    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        price,
      },
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 