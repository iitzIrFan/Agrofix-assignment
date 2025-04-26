'use client';

import CartDisplay from '@/components/CartDisplay';
import { useCart } from '@/lib/cartContext';
import Link from 'next/link';

export default function CartPage() {
  const { items, clearCart } = useCart();
  
  // Calculate subtotal for summary display
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Your Shopping Cart</h1>
      <p className="text-gray-600 mb-8">{items.length === 0 ? 'Your cart is empty' : `${items.length} item${items.length !== 1 ? 's' : ''} in your cart`}</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <CartDisplay showCheckoutLink={false} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden h-fit">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {items.length === 0 ? (
              <div className="py-8 text-center">
                <div className="text-8xl mb-4">🛒</div>
                <p className="text-gray-600 mb-6">Your cart is empty</p>
                <Link 
                  href="/" 
                  className="block w-full bg-green-600 text-white py-3 px-4 rounded-lg text-center hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors shadow-sm"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <Link 
                  href="/checkout" 
                  className="block w-full bg-green-600 text-white py-3 px-4 rounded-lg text-center hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors shadow-sm"
                >
                  Proceed to Checkout
                </Link>
                
                <Link 
                  href="/" 
                  className="block w-full bg-white text-gray-800 py-3 px-4 rounded-lg text-center border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors"
                >
                  Continue Shopping
                </Link>
                
                <button 
                  onClick={clearCart}
                  className="block w-full text-red-600 text-sm py-2 hover:text-red-800 transition-colors"
                >
                  Clear cart
                </button>
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 p-6">
            <div className="flex items-start gap-3">
              <div className="text-green-500 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.674 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm text-gray-600">
                Secure payments and data protection guaranteed. We value your privacy.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 