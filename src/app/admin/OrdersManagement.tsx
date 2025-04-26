'use client';

import { formatCurrency, formatEnumValue } from '@/lib/utils';
import { useEffect, useState, useCallback } from 'react';

interface Order {
  id: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'DELIVERED';
  buyerName: string;
  contact: string;
  address: string;
  quantity: number;
  createdAt: string;
  checkoutSessionId?: string; // New field for cart checkout sessions
  product: {
    id: string;
    name: string;
    price: number;
  };
}

// Group orders by checkout session if available
interface GroupedOrders {
  sessionId: string | null;
  orders: Order[];
  buyerName: string;
  contact: string;
  createdAt: string;
  totalAmount: number;
}

interface OrdersManagementProps {
  authToken: string;
}

export default function OrdersManagement({ authToken }: OrdersManagementProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [groupedOrders, setGroupedOrders] = useState<GroupedOrders[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'individual' | 'grouped'>('grouped');
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());
  
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/admin/orders', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data);
      
      // Group orders by checkout session
      const grouped = groupOrdersByCheckoutSession(data);
      setGroupedOrders(grouped);
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [authToken]);
  
  // Group orders that came from the same cart checkout
  const groupOrdersByCheckoutSession = (orders: Order[]): GroupedOrders[] => {
    const orderGroups: { [key: string]: Order[] } = {};
    
    // Group orders by checkout session ID or individual orders
    orders.forEach(order => {
      const key = order.checkoutSessionId || `single_${order.id}`;
      if (!orderGroups[key]) {
        orderGroups[key] = [];
      }
      orderGroups[key].push(order);
    });
    
    // Transform into our GroupedOrders format
    return Object.entries(orderGroups).map(([sessionId, orders]) => {
      // Use the first order for buyer info
      const firstOrder = orders[0];
      
      // Calculate total amount for this group
      const totalAmount = orders.reduce(
        (sum, order) => sum + (order.product.price * order.quantity), 
        0
      );
      
      return {
        sessionId: sessionId.startsWith('single_') ? null : sessionId,
        orders,
        buyerName: firstOrder.buyerName,
        contact: firstOrder.contact,
        createdAt: firstOrder.createdAt,
        totalAmount
      };
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };
  
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  const updateOrderStatus = async (orderId: string, newStatus: 'PENDING' | 'IN_PROGRESS' | 'DELIVERED') => {
    setUpdatingOrderId(orderId);
    
    try {
      const response = await fetch(`/api/admin/order/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      
      // Update local state
      const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      
      setOrders(updatedOrders);
      
      // Update grouped orders too
      const updatedGrouped = groupOrdersByCheckoutSession(updatedOrders);
      setGroupedOrders(updatedGrouped);
      
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status. Please try again.');
    } finally {
      setUpdatingOrderId(null);
    }
  };
  
  const updateAllOrdersInGroup = async (groupOrders: Order[], newStatus: 'PENDING' | 'IN_PROGRESS' | 'DELIVERED') => {
    // Set all orders in the group as updating
    groupOrders.forEach(order => setUpdatingOrderId(order.id));
    
    try {
      // Update all orders in parallel
      const updatePromises = groupOrders.map(order => 
        fetch(`/api/admin/order/${order.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ status: newStatus }),
        })
      );
      
      const results = await Promise.all(updatePromises);
      
      // Check if any failed
      if (results.some(res => !res.ok)) {
        throw new Error('Failed to update one or more orders');
      }
      
      // Update local state
      const updatedOrders = orders.map(order =>
        groupOrders.some(groupOrder => groupOrder.id === order.id)
          ? { ...order, status: newStatus }
          : order
      );
      
      setOrders(updatedOrders);
      
      // Update grouped orders too
      const updatedGrouped = groupOrdersByCheckoutSession(updatedOrders);
      setGroupedOrders(updatedGrouped);
      
    } catch (err) {
      console.error('Error updating group orders:', err);
      setError('Failed to update order statuses. Please try again.');
    } finally {
      // Clear all updating states
      setUpdatingOrderId(null);
    }
  };
  
  const getNextStatus = (currentStatus: 'PENDING' | 'IN_PROGRESS' | 'DELIVERED') => {
    switch (currentStatus) {
      case 'PENDING':
        return 'IN_PROGRESS';
      case 'IN_PROGRESS':
        return 'DELIVERED';
      default:
        return null;
    }
  };
  
  const getGroupNextStatus = (orders: Order[]) => {
    // If all orders have the same status, return the next status
    // Otherwise return null (mixed statuses)
    const firstStatus = orders[0]?.status;
    
    if (orders.every(order => order.status === firstStatus)) {
      return getNextStatus(firstStatus);
    }
    
    return null;
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'MIXED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getGroupStatus = (orders: Order[]) => {
    // If all orders have the same status, return that status
    // Otherwise return "MIXED"
    const firstStatus = orders[0]?.status;
    
    if (orders.every(order => order.status === firstStatus)) {
      return firstStatus;
    }
    
    return 'MIXED';
  };
  
  const toggleExpandSession = (sessionId: string) => {
    setExpandedSessions(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(sessionId)) {
        newExpanded.delete(sessionId);
      } else {
        newExpanded.add(sessionId);
      }
      return newExpanded;
    });
  };
  
  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }
  
  if (error) {
    return (
      <div className="bg-red-50 text-red-800 p-4 rounded-md">
        {error}
        <button
          onClick={fetchOrders}
          className="ml-4 underline text-blue-600 hover:text-blue-800"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Orders</h3>
        <div className="flex items-center space-x-4">
          <div className="flex rounded-md overflow-hidden border border-gray-300">
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-3 py-1 text-sm ${
                viewMode === 'grouped' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Grouped
            </button>
            <button
              onClick={() => setViewMode('individual')}
              className={`px-3 py-1 text-sm ${
                viewMode === 'individual' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Individual
            </button>
          </div>
          <button
            onClick={fetchOrders}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No orders found.</p>
        </div>
      ) : viewMode === 'individual' ? (
        // Individual Orders View
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => {
                  const nextStatus = getNextStatus(order.status);
                  
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-mono">{order.id}</td>
                      <td className="py-3 px-4">
                        <div className="text-sm font-medium">{order.buyerName}</div>
                        <div className="text-xs text-gray-500">{order.contact}</div>
                      </td>
                      <td className="py-3 px-4 text-sm">{order.product.name}</td>
                      <td className="py-3 px-4 text-sm">{order.quantity}</td>
                      <td className="py-3 px-4 text-sm font-medium">
                        {formatCurrency(order.product.price * order.quantity)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(order.status)}`}>
                          {formatEnumValue(order.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {nextStatus ? (
                          <button
                            onClick={() => updateOrderStatus(order.id, nextStatus)}
                            disabled={updatingOrderId === order.id}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded disabled:bg-green-300"
                          >
                            {updatingOrderId === order.id
                              ? 'Updating...'
                              : `Mark as ${formatEnumValue(nextStatus)}`}
                          </button>
                        ) : (
                          <span className="text-gray-500 text-xs">
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Grouped Orders View
        <div className="space-y-4">
          {groupedOrders.map((group) => {
            const isCheckoutSession = group.sessionId !== null;
            const isExpanded = isCheckoutSession && expandedSessions.has(group.sessionId!);
            const groupStatus = getGroupStatus(group.orders);
            const nextGroupStatus = getGroupNextStatus(group.orders);
            
            return (
              <div key={group.sessionId || group.orders[0].id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 flex justify-between items-center">
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-medium">{group.buyerName}</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(groupStatus)}`}>
                        {groupStatus === 'MIXED' ? 'Mixed Statuses' : formatEnumValue(groupStatus)}
                      </span>
                      {isCheckoutSession && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          Cart Checkout
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(group.createdAt).toLocaleString()} • {group.contact}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium">
                      {formatCurrency(group.totalAmount)}
                    </div>
                    {isCheckoutSession ? (
                      <button
                        onClick={() => toggleExpandSession(group.sessionId as string)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        {isExpanded ? 'Hide Items' : `View ${group.orders.length} Items`}
                      </button>
                    ) : null}
                    
                    {nextGroupStatus && (
                      <button
                        onClick={() => updateAllOrdersInGroup(group.orders, nextGroupStatus)}
                        disabled={updatingOrderId !== null}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded disabled:bg-green-300"
                      >
                        {updatingOrderId !== null
                          ? 'Updating...'
                          : `All to ${formatEnumValue(nextGroupStatus)}`}
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Expanded view for checkout session items */}
                {isCheckoutSession && isExpanded && (
                  <div className="border-t border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {group.orders.map(order => {
                          const nextStatus = getNextStatus(order.status);
                          
                          return (
                            <tr key={order.id} className="hover:bg-gray-50">
                              <td className="py-2 px-4 text-sm">{order.product.name}</td>
                              <td className="py-2 px-4 text-sm">{order.quantity}</td>
                              <td className="py-2 px-4 text-sm">
                                {formatCurrency(order.product.price * order.quantity)}
                              </td>
                              <td className="py-2 px-4">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(order.status)}`}>
                                  {formatEnumValue(order.status)}
                                </span>
                              </td>
                              <td className="py-2 px-4 text-sm">
                                {nextStatus ? (
                                  <button
                                    onClick={() => updateOrderStatus(order.id, nextStatus)}
                                    disabled={updatingOrderId === order.id}
                                    className="bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded disabled:bg-green-300"
                                  >
                                    {updatingOrderId === order.id
                                      ? 'Updating...'
                                      : formatEnumValue(nextStatus)}
                                  </button>
                                ) : (
                                  <span className="text-gray-500 text-xs">
                                    Completed
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 