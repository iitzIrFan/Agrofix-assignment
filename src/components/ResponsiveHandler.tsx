'use client';

import { useEffect } from 'react';

export default function ResponsiveHandler() {
  // This effect will only run on the client
  useEffect(() => {
    // Handle resize events
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        // Only run on client
        if (window.innerWidth <= 768) {
          document.body.classList.add('mobile');
        } else {
          document.body.classList.remove('mobile');
        }
      }
    };
    
    // Initial call
    handleResize();
    
    // Set up event listener
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  // Component doesn't render anything
  return null;
} 