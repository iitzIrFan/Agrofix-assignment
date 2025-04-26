'use client';

import { useCart } from '@/lib/cartContext';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  showOrderButton?: boolean;
}

export default function ProductCard({ id, name, price, showOrderButton = true }: ProductCardProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const handleAddToCart = () => {
    addToCart({ id, name, price }, quantity);
    setAddedToCart(true);
    
    // Reset the "Added to cart" message after 2 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-gray-700 mb-4">
        Price: <span className="font-bold text-green-600">{formatCurrency(price)}</span> per unit
      </p>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <label htmlFor={`quantity-${id}`} className="text-sm text-gray-700">Qty:</label>
          <input
            id={`quantity-${id}`}
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 p-1 text-sm border rounded"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </button>
          
          {showOrderButton && (
            <Link
              href={`/order?productId=${id}`}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
            >
              Order Now
            </Link>
          )}
        </div>
        
        {addedToCart && (
          <p className="text-green-600 text-sm font-medium animate-pulse">
            Added to cart!
          </p>
        )}
      </div>
    </div>
  );
} 