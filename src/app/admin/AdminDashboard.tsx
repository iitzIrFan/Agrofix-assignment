'use client';

import { useState } from 'react';
import DashboardStats from './DashboardStats';
import OrdersManagement from './OrdersManagement';
import ProductsManagement from './ProductsManagement';

interface AdminDashboardProps {
  authToken: string;
  onLogout: () => void;
}

type Tab = 'dashboard' | 'orders' | 'products';

export default function AdminDashboard({ authToken, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 className="text-gray-800 font-semibold">Admin Console</h2>
            <p className="text-xs text-gray-500">Authorized session</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
      
      <div className="border-b border-gray-200 bg-white">
        <div className="px-6">
          <nav className="flex space-x-2 -mb-px">
            <button
              onClick={() => handleTabChange('dashboard')}
              className={`py-4 px-4 flex items-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${activeTab === 'dashboard' ? 'text-green-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              Dashboard
            </button>

            <button
              onClick={() => handleTabChange('orders')}
              className={`py-4 px-4 flex items-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'orders'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${activeTab === 'orders' ? 'text-green-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Orders
            </button>
            
            <button
              onClick={() => handleTabChange('products')}
              className={`py-4 px-4 flex items-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'products'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${activeTab === 'products' ? 'text-green-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Products
            </button>
          </nav>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {activeTab === 'dashboard' && 'Dashboard Overview'}
            {activeTab === 'orders' && 'Orders Management'}
            {activeTab === 'products' && 'Products Management'}
          </h3>
          <p className="text-sm text-gray-500">
            {activeTab === 'dashboard' && 'View business performance and key metrics.'}
            {activeTab === 'orders' && 'Manage customer orders and shipments.'}
            {activeTab === 'products' && 'Add, edit, or remove products from your inventory.'}
          </p>
        </div>
        
        {activeTab === 'dashboard' && <DashboardStats authToken={authToken} />}
        {activeTab === 'orders' && <OrdersManagement authToken={authToken} />}
        {activeTab === 'products' && <ProductsManagement authToken={authToken} />}
      </div>
    </div>
  );
} 