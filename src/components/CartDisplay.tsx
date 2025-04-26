'use client';

import { useCart } from '@/lib/cartContext';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function CartDisplay({ showCheckoutLink = true }: { showCheckoutLink?: boolean }) {
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-gray-600 text-center">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Your Cart ({totalItems} items)</h2>
      
      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <div key={item.productId} className="py-3 flex justify-between items-center">
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-600">
                {formatCurrency(item.price)} × {item.quantity} = {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={item.quantity}
                onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                className="border rounded p-1 text-sm"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              
              <button
                onClick={() => removeFromCart(item.productId)}
                className="text-red-500 hover:text-red-700 p-1"
                aria-label="Remove item"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
        
        {showCheckoutLink && (
          <Link 
            href="/checkout" 
            className="mt-4 block w-full bg-green-600 text-white py-2 px-4 rounded-md text-center hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Proceed to Checkout
          </Link>
        )}
      </div>
    </div>
  );
} 