'use client';

import { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './AdminLogin';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState('');

  const handleLogin = (token: string) => {
    setAuthToken(token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setAuthToken('');
    setIsAuthenticated(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-green-800 to-green-600 text-white px-6 py-12 mb-8 rounded-2xl shadow-md">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-green-100 text-lg">
            Manage your products, track orders, and view analytics all in one place.
          </p>
        </div>
      </div>
      
      <div className="mb-6 p-6 bg-white rounded-xl shadow-sm">
        {!isAuthenticated ? (
          <AdminLogin onLogin={handleLogin} />
        ) : (
          <AdminDashboard authToken={authToken} onLogout={handleLogout} />
        )}
      </div>
      
      {!isAuthenticated && (
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-xl text-amber-800 mb-6">
          <h2 className="text-lg font-medium mb-2">Admin Access Only</h2>
          <p>
            This area is restricted to authorized administrators. If you're a customer looking to place an order, 
            please return to the main website.
          </p>
          <div className="mt-4">
            <a 
              href="/" 
              className="inline-flex items-center text-amber-700 hover:text-amber-900 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Homepage
            </a>
          </div>
        </div>
      )}
    </div>
  );
} 