import { isAuthenticated, unauthorizedResponse } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  // Check authentication
  if (!isAuthenticated(request)) {
    return unauthorizedResponse();
  }
  
  try {
    const { id } = context.params;
    const body = await request.json();
    const { name, price } = body;
    
    // Validate inputs
    if ((!name && typeof price !== 'number') || (typeof price === 'number' && price <= 0)) {
      return NextResponse.json(
        { error: 'Invalid product data' },
        { status: 400 }
      );
    }
    
    // Prepare update data
    const updateData: { name?: string; price?: number } = {};
    if (name) updateData.name = name;
    if (typeof price === 'number') updateData.price = price;
    
    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  // Check authentication
  if (!isAuthenticated(request)) {
    return unauthorizedResponse();
  }
  
  try {
    const { id } = context.params;
    
    // Check if there are orders using this product
    const orderCount = await prisma.order.count({
      where: { productId: id },
    });
    
    if (orderCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete product with existing orders' },
        { status: 400 }
      );
    }
    
    // Delete product
    await prisma.product.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 