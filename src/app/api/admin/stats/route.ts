import { isAuthenticated, unauthorizedResponse } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Check authentication
  if (!isAuthenticated(request)) {
    return unauthorizedResponse();
  }
  
  try {
    // Get all orders
    const orders = await prisma.order.findMany({
      include: {
        product: true,
      },
    });
    
    // Calculate total orders
    const totalOrders = orders.length;
    
    // Calculate completed orders
    const completedOrders = orders.filter(order => order.status === 'DELIVERED').length;
    
    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + (order.product.price * order.quantity), 0);
    
    // Calculate average order value
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Get top products
    const productCounts = new Map<string, { id: string; name: string; count: number }>();
    
    orders.forEach(order => {
      const { id, name } = order.product;
      
      if (productCounts.has(id)) {
        const current = productCounts.get(id)!;
        productCounts.set(id, { ...current, count: current.count + 1 });
      } else {
        productCounts.set(id, { id, name, count: 1 });
      }
    });
    
    const topProducts = Array.from(productCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Get top 5 products
    
    // Additional metrics (simplified for this example)
    const activeCartCount = 5; // In a real app, this would be fetched from a carts table
    const conversionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
    
    return NextResponse.json({
      totalOrders,
      completedOrders,
      totalRevenue,
      topProducts,
      activeCartCount,
      conversionRate,
      averageOrderValue,
    });
    
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
