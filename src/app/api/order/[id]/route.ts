import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;  // Directly destructure the 'id' from params

    // You could log the params to check if it's being passed correctly
    console.log("Received ID:", id);

    // Update the order with the provided id
    const order = await prisma.order.update({
      where: { id },
      data: {
        // Add the fields you want to update here
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
