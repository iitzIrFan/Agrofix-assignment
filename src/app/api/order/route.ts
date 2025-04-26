import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity, buyerName, contact, address, checkoutSessionId } = body;
    
    // Validate inputs
    if (!productId || !quantity || !buyerName || !contact || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create order
    const order = await prisma.order.create({
      data: {
        productId,
        quantity,
        buyerName,
        contact,
        address,
        status: 'PENDING',
        checkoutSessionId: checkoutSessionId || null, // Include checkout session ID if provided
      },
      include: {
        product: true,
      },
    });
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 