'use client';

import { useCart } from '@/lib/cartContext';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface OrderFormProps {
  products: Product[];
  selectedProductId?: string;
}

export default function OrderForm({ products, selectedProductId }: OrderFormProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    productId: selectedProductId || '',
    quantity: 1,
    buyerName: '',
    contact: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  // Find the selected product to display price
  const selectedProduct = products.find(p => p.id === formData.productId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  const validateFormForCart = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.productId) newErrors.productId = 'Please select a product';
    if (formData.quantity < 1) newErrors.quantity = 'Quantity must be at least 1';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.productId) newErrors.productId = 'Please select a product';
    if (formData.quantity < 1) newErrors.quantity = 'Quantity must be at least 1';
    if (!formData.buyerName.trim()) newErrors.buyerName = 'Name is required';
    if (!formData.contact.trim()) newErrors.contact = 'Contact information is required';
    if (!formData.address.trim()) newErrors.address = 'Delivery address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddToCart = () => {
    if (!validateFormForCart()) return;
    
    if (selectedProduct) {
      addToCart(selectedProduct, Number(formData.quantity));
      setAddedToCart(true);
      
      // Reset the "Added to cart" message after 3 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          quantity: Number(formData.quantity),
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order');
      }
      
      // Success
      setSuccessMessage(`Order placed successfully! Your order ID is: ${data.id}`);
      
      // Reset form
      setFormData({
        productId: '',
        quantity: 1,
        buyerName: '',
        contact: '',
        address: '',
      });
      
      // Redirect to tracking page after a short delay
      setTimeout(() => {
        router.push(`/track?orderId=${data.id}`);
      }, 3000);
      
    } catch (error) {
      console.error('Order submission error:', error);
      setErrors({ form: 'Failed to submit order. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success message */}
      {successMessage && (
        <div className="bg-green-50 text-green-800 p-4 rounded-md border border-green-200 mb-6">
          {successMessage}
        </div>
      )}
      
      {/* Cart success message */}
      {addedToCart && (
        <div className="bg-blue-50 text-blue-800 p-4 rounded-md border border-blue-200 mb-6 flex justify-between items-center">
          <span>Product added to cart!</span>
          <Link 
            href="/cart" 
            className="bg-blue-600 text-white text-sm py-1 px-3 rounded hover:bg-blue-700 transition-colors"
          >
            View Cart
          </Link>
        </div>
      )}
      
      {/* Form error */}
      {errors.form && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md border border-red-200 mb-6">
          {errors.form}
        </div>
      )}
      
      {/* Product Selection */}
      <div>
        <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">
          Select Product
        </label>
        <select
          id="productId"
          name="productId"
          value={formData.productId}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md ${
            errors.productId ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        >
          <option value="">-- Select a product --</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} ({formatCurrency(product.price)} per unit)
            </option>
          ))}
        </select>
        {errors.productId && <p className="mt-1 text-sm text-red-600">{errors.productId}</p>}
      </div>
      
      {/* Quantity */}
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
          Quantity
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          min="1"
          value={formData.quantity}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md ${
            errors.quantity ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        />
        {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
        
        {selectedProduct && (
          <p className="mt-2 text-sm text-gray-600">
            Total price: <span className="font-bold text-green-600">
              {formatCurrency(selectedProduct.price * Number(formData.quantity))}
            </span>
          </p>
        )}
      </div>
      
      {/* Add to Cart Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleAddToCart}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          disabled={isSubmitting || !selectedProduct}
        >
          Add to Cart
        </button>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium mb-4">Or Complete Order Now</h3>
      
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
        <div className="mt-4">
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
        <div className="mt-4">
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
          className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:bg-green-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </form>
  );
} 