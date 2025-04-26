'use client';

import CartDisplay from '@/components/CartDisplay';
import { useCart } from '@/lib/cartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    buyerName: '',
    contact: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if cart is empty
  if (items.length === 0 && typeof window !== 'undefined') {
    router.push('/cart');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.buyerName.trim()) newErrors.buyerName = 'Name is required';
    if (!formData.contact.trim()) newErrors.contact = 'Contact information is required';
    if (!formData.address.trim()) newErrors.address = 'Delivery address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Generate a unique checkout session ID
      const checkoutSessionId = `cart_checkout_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      
      // Process each cart item as a separate order
      const orderPromises = items.map(item => 
        fetch('/api/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: item.productId,
            quantity: item.quantity,
            buyerName: formData.buyerName,
            contact: formData.contact,
            address: formData.address,
            checkoutSessionId: checkoutSessionId, // Add checkout session ID
          }),
        })
      );
      
      const responses = await Promise.all(orderPromises);
      const resultsData = await Promise.all(responses.map(res => res.json()));
      
      // Check if any order failed
      const failedOrder = responses.find(res => !res.ok);
      if (failedOrder) {
        throw new Error('Failed to place one or more orders');
      }
      
      // Success
      setSuccessMessage('Orders placed successfully!');
      
      // Clear cart
      clearCart();
      
      // Reset form
      setFormData({
        buyerName: '',
        contact: '',
        address: '',
      });
      
      // Redirect to track page
      setTimeout(() => {
        // Get the first order ID for tracking
        if (resultsData.length > 0 && resultsData[0].id) {
          router.push(`/track?orderId=${resultsData[0].id}&checkoutSessionId=${checkoutSessionId}`);
        } else {
          router.push('/');
        }
      }, 2000);
      
    } catch (error) {
      console.error('Order submission error:', error);
      setErrors({ form: 'Failed to submit orders. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            
            {/* Success message */}
            {successMessage && (
              <div className="bg-green-50 text-green-800 p-4 rounded-md border border-green-200 mb-6">
                {successMessage}
              </div>
            )}
            
            {/* Form error */}
            {errors.form && (
              <div className="bg-red-50 text-red-800 p-4 rounded-md border border-red-200 mb-6">
                {errors.form}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Buyer Name */}
              <div>
                <label htmlFor="buyerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="buyerName"
                  name="buyerName"
                  value={formData.buyerName}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.buyerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.buyerName && <p className="mt-1 text-sm text-red-600">{errors.buyerName}</p>}
              </div>
              
              {/* Contact */}
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Information (Phone/Email)
                </label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.contact ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact}</p>}
              </div>
              
              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:bg-green-300"
                disabled={isSubmitting || items.length === 0}
              >
                {isSubmitting ? 'Processing...' : 'Complete Order'}
              </button>
            </form>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <CartDisplay showCheckoutLink={false} />
        </div>
      </div>
    </div>
  );
} 