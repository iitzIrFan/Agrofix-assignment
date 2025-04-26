'use client';

import { formatCurrency, formatEnumValue } from '@/lib/utils';
import { useEffect, useState, useCallback } from 'react';

interface OrderTrackingProps {
  initialOrderId?: string;
  initialCheckoutSessionId?: string;
}

interface OrderDetails {
  id: string;
  status: string;
  buyerName: string;
  contact: string;
  checkoutSessionId?: string;
  product: {
    name: string;
    price: number;
  };
  quantity: number;
  createdAt: string;
}

interface CheckoutSession {
  id: string;
  orders: OrderDetails[];
  buyerName: string;
  createdAt: string;
}

export default function OrderTracker({ initialOrderId, initialCheckoutSessionId }: OrderTrackingProps) {
  const [orderId, setOrderId] = useState(initialOrderId || '');
  const [checkoutSessionId, setCheckoutSessionId] = useState(initialCheckoutSessionId || '');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [sessionDetails, setSessionDetails] = useState<CheckoutSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackBy, setTrackBy] = useState<'order' | 'session'>(initialCheckoutSessionId ? 'session' : 'order');

  const trackOrder = useCallback(async () => {
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/order/${orderId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to find order');
      }
      
      setOrderDetails(data);
      setSessionDetails(null);
    } catch (error) {
      console.error('Error tracking order:', error);
      setError('Order not found. Please check your order ID and try again.');
      setOrderDetails(null);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const trackSession = useCallback(async () => {
    if (!checkoutSessionId.trim()) {
      setError('Please enter a checkout session ID');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/checkout/${checkoutSessionId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to find checkout session');
      }
      
      setSessionDetails(data);
      setOrderDetails(null);
    } catch (error) {
      console.error('Error tracking checkout session:', error);
      setError('Checkout session not found. Please check the ID and try again.');
      setSessionDetails(null);
    } finally {
      setLoading(false);
    }
  }, [checkoutSessionId]);

  // Fetch order when component mounts if initialOrderId is provided
  useEffect(() => {
    if (initialOrderId) {
      trackOrder();
    } else if (initialCheckoutSessionId) {
      trackSession();
    }
  }, [initialOrderId, initialCheckoutSessionId, trackOrder, trackSession]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (trackBy === 'order') {
      setOrderId(e.target.value);
      // Clear previous results
      setOrderDetails(null);
    } else {
      setCheckoutSessionId(e.target.value);
      // Clear previous results
      setSessionDetails(null);
    }
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackBy === 'order') {
      trackOrder();
    } else {
      trackSession();
    }
  };

  const getStatusColor = (status: string) => {
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

  const getGroupStatus = (orders: OrderDetails[]) => {
    // If all orders have the same status, return that status
    // Otherwise return "MIXED"
    const firstStatus = orders[0]?.status;
    
    if (orders.every(order => order.status === firstStatus)) {
      return firstStatus;
    }
    
    return 'MIXED';
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 33;
      case 'IN_PROGRESS':
        return 66;
      case 'DELIVERED':
        return 100;
      case 'MIXED':
        // Average the progress for mixed status orders
        return 50;
      default:
        return 0;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex mb-4">
          <button
            type="button"
            onClick={() => setTrackBy('order')}
            className={`flex-1 py-2 ${
              trackBy === 'order'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors rounded-l-md`}
          >
            Track by Order ID
          </button>
          <button
            type="button"
            onClick={() => setTrackBy('session')}
            className={`flex-1 py-2 ${
              trackBy === 'session'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors rounded-r-md`}
          >
            Track by Checkout Session
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={trackBy === 'order' ? orderId : checkoutSessionId}
              onChange={handleInputChange}
              placeholder={trackBy === 'order' ? "Enter your order ID" : "Enter your checkout session ID"}
              className="flex-grow p-2 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-green-300"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </div>
          {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
        </form>
      </div>

      {/* Single Order Details */}
      {orderDetails && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Order Details</h2>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{orderDetails.id}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium px-2 py-1 rounded-full text-sm ${getStatusColor(orderDetails.status)}`}>
                {formatEnumValue(orderDetails.status)}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Customer:</span>
              <span className="font-medium">{orderDetails.buyerName}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Product:</span>
              <span className="font-medium">{orderDetails.product.name}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Quantity:</span>
              <span className="font-medium">{orderDetails.quantity} units</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Unit Price:</span>
              <span className="font-medium">{formatCurrency(orderDetails.product.price)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Total Price:</span>
              <span className="font-bold text-green-600">
                {formatCurrency(orderDetails.product.price * orderDetails.quantity)}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Order Date:</span>
              <span className="font-medium">{new Date(orderDetails.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Order Progress</h3>
              <span className="text-sm text-gray-500">
                {orderDetails.status === 'DELIVERED'
                  ? 'Completed'
                  : 'In Progress'}
              </span>
            </div>
            
            <div className="mt-4 relative">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                <div 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                  style={{ width: `${getProgressPercentage(orderDetails.status)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs mt-2">
                <div className={orderDetails.status ? 'text-green-600 font-medium' : 'text-gray-500'}>
                  Pending
                </div>
                <div className={
                  orderDetails.status === 'IN_PROGRESS' || orderDetails.status === 'DELIVERED' 
                    ? 'text-green-600 font-medium' 
                    : 'text-gray-500'
                }>
                  In Progress
                </div>
                <div className={
                  orderDetails.status === 'DELIVERED' 
                    ? 'text-green-600 font-medium' 
                    : 'text-gray-500'
                }>
                  Delivered
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Session Details */}
      {sessionDetails && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Checkout Session</h2>
              <p className="text-sm text-gray-600">
                {new Date(sessionDetails.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center">
              <span className="text-sm mr-2">Status:</span>
              <span 
                className={`px-2 py-1 rounded-full text-sm font-medium ${
                  getStatusColor(getGroupStatus(sessionDetails.orders))
                }`}
              >
                {getGroupStatus(sessionDetails.orders) === 'MIXED' 
                  ? 'Mixed Statuses' 
                  : formatEnumValue(getGroupStatus(sessionDetails.orders))
                }
              </span>
            </div>
          </div>
          
          <div className="p-4">
            <div className="mb-4 flex justify-between">
              <div>
                <span className="text-gray-600">Customer:</span>
                <span className="ml-2 font-medium">{sessionDetails.buyerName}</span>
              </div>
              <div>
                <span className="text-gray-600">Total Order Value:</span>
                <span className="ml-2 font-bold text-green-600">
                  {formatCurrency(
                    sessionDetails.orders.reduce(
                      (sum, order) => sum + order.product.price * order.quantity,
                      0
                    )
                  )}
                </span>
              </div>
            </div>
            
            <h3 className="font-medium mb-3 border-b pb-2">Order Items</h3>
            
            <div className="space-y-4">
              {sessionDetails.orders.map(order => (
                <div key={order.id} className="border border-gray-200 rounded-md p-3">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{order.product.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {formatEnumValue(order.status)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Quantity: {order.quantity}</span>
                    <span>{formatCurrency(order.product.price * order.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Overall Progress</h3>
              <span className="text-sm text-gray-500">
                {getGroupStatus(sessionDetails.orders) === 'DELIVERED'
                  ? 'All Items Delivered'
                  : 'Some Items In Progress'}
              </span>
            </div>
            
            <div className="relative">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                <div 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                  style={{ 
                    width: `${getProgressPercentage(getGroupStatus(sessionDetails.orders))}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 