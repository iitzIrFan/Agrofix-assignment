'use client';

import { useCart } from '@/lib/cartContext';
import Link from 'next/link';

export default function CartIndicator() {
  const { totalItems } = useCart();
  
  return (
    <Link href="/cart" className="relative flex items-center hover:text-gray-100">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        fill="currentColor" 
        viewBox="0 0 16 16"
        className="mr-1"
      >
        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
      </svg>
      
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-yellow-400 text-xs text-gray-800 font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
      
      <span className="hidden md:inline">Cart</span>
    </Link>
  );
} 