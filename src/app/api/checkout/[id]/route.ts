import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, props: any) {
  try {
    const sessionId = props.params.id;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Find orders by checkout session ID
    const orders = await prisma.order.findMany({
      where: {
        checkoutSessionId: sessionId,
      },
      include: {
        product: true,
      },
    });

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { error: 'No orders found for this session' },
        { status: 404 }
      );
    }

    // Construct checkout session object
    const checkoutSession = {
      id: sessionId,
      orders: orders,
      buyerName: orders[0].buyerName,
      createdAt: orders[0].createdAt,
    };

    return NextResponse.json(checkoutSession);
  } catch (error) {
    console.error('Error fetching checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch checkout session' },
      { status: 500 }
    );
  }
} 