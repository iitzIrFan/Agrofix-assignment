'use client';

import { useEffect, useState } from 'react';

export default function ResponsiveHandler() {
  // Use state to track if component has mounted (client-side only)
  const [hasMounted, setHasMounted] = useState(false);
  
  // This effect will only run on the client
  useEffect(() => {
    // Update mount state
    setHasMounted(true);
    
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