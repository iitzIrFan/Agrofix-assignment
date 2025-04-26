'use client';

import { formatCurrency } from '@/lib/utils';
import { useEffect, useState, useCallback } from 'react';

interface DashboardStatsProps {
  authToken: string;
}

interface StatsData {
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  topProducts: {
    id: string;
    name: string;
    count: number;
  }[];
  activeCartCount: number;
  conversionRate: number;
  averageOrderValue: number;
}

export default function DashboardStats({ authToken }: DashboardStatsProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch statistics');
      }
      
      const statsData = await response.json();
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  }, [authToken]);
  
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
  
  if (loading) {
    return <div className="text-center py-4">Loading dashboard statistics...</div>;
  }
  
  if (error) {
    return (
      <div className="bg-red-50 text-red-800 p-4 rounded-md">
        {error}
        <button
          onClick={fetchStats}
          className="ml-4 underline text-blue-600 hover:text-blue-800"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (!stats) {
    return null;
  }
  
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Dashboard Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Orders Stats */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total Products Shipped</p>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
          <p className="text-sm text-gray-600 mt-2">
            {stats.completedOrders} completed ({Math.round(stats.completedOrders / stats.totalOrders * 100) || 0}%)
          </p>
        </div>
        
        {/* Revenue Stats */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
          <p className="text-sm text-gray-600 mt-2">
            Avg. {formatCurrency(stats.averageOrderValue)}/order
          </p>
        </div>
        
        {/* Cart Stats */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Active Carts</p>
          <p className="text-2xl font-bold">{stats.activeCartCount}</p>
          <p className="text-sm text-gray-600 mt-2">
            {stats.conversionRate.toFixed(1)}% conversion rate
          </p>
        </div>
        
        {/* Top Product */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Top Product</p>
          <p className="text-xl font-bold truncate">
            {stats.topProducts[0]?.name || 'N/A'}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {stats.topProducts[0]?.count || 0} orders
          </p>
        </div>
      </div>
      
      {/* Top Products List */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow border border-gray-100">
        <h4 className="font-medium mb-3">Top Products</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="pb-2 text-left text-xs font-medium text-gray-500">Product</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500">Orders</th>
              </tr>
            </thead>
            <tbody>
              {stats.topProducts.map(product => (
                <tr key={product.id} className="border-t border-gray-100">
                  <td className="py-2 text-sm">{product.name}</td>
                  <td className="py-2 text-sm">{product.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 