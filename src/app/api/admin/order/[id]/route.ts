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
    const { status } = body;
    
    // Validate input
    if (!status || !['PENDING', 'IN_PROGRESS', 'DELIVERED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: { product: true },
    });
    
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
} 