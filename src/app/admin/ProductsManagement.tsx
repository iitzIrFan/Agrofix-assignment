'use client';

import { formatCurrency } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  createdAt: string;
}

interface ProductsManagementProps {
  authToken: string;
}

export default function ProductsManagement({ authToken }: ProductsManagementProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  
  const fetchProducts = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/admin/products', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data);
      
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, [authToken]);
  
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
    });
    setFormError('');
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormError('Product name is required');
      return false;
    }
    
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      setFormError('Price must be a positive number');
      return false;
    }
    
    return true;
  };
  
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add product');
      }
      
      const newProduct = await response.json();
      
      // Update local state
      setProducts(prev => [newProduct, ...prev]);
      
      // Reset form and hide it
      resetForm();
      setShowAddForm(false);
      
    } catch (err) {
      console.error('Error adding product:', err);
      setFormError('Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !editingProduct) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      
      const updatedProduct = await response.json();
      
      // Update local state
      setProducts(prev =>
        prev.map(product =>
          product.id === editingProduct.id ? updatedProduct : product
        )
      );
      
      // Reset form and hide it
      resetForm();
      setEditingProduct(null);
      
    } catch (err) {
      console.error('Error updating product:', err);
      setFormError('Failed to update product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const startAddProduct = () => {
    resetForm();
    setShowAddForm(true);
    setEditingProduct(null);
  };
  
  const startEditProduct = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
    });
    setEditingProduct(product);
    setShowAddForm(false);
  };
  
  const cancelEdit = () => {
    setEditingProduct(null);
    resetForm();
  };
  
  const cancelAdd = () => {
    setShowAddForm(false);
    resetForm();
  };
  
  const handleDeleteProduct = async (productId: string) => {
    setDeletingProductId(productId);
    
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete product');
      }
      
      // Update local state
      setProducts(prev => prev.filter(product => product.id !== productId));
      
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product. It may have existing orders.');
    } finally {
      setDeletingProductId(null);
    }
  };
  
  if (loading && products.length === 0) {
    return <div className="text-center py-8">Loading products...</div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Product Catalog</h3>
        <div className="space-x-2">
          <button
            onClick={fetchProducts}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={startAddProduct}
            className="text-sm bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded transition-colors"
          >
            Add Product
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6">
          {error}
          <button
            onClick={() => setError('')}
            className="ml-2 text-sm font-medium hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}
      
      {/* Add Product Form */}
      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <h4 className="font-medium mb-3">Add New Product</h4>
          <form onSubmit={handleAddProduct} className="space-y-4">
            {formError && (
              <div className="text-red-600 text-sm">{formError}</div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price (USD)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-green-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={cancelAdd}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Edit Product Form */}
      {editingProduct && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <h4 className="font-medium mb-3">Edit Product</h4>
          <form onSubmit={handleEditProduct} className="space-y-4">
            {formError && (
              <div className="text-red-600 text-sm">{formError}</div>
            )}
            
            <div>
              <label htmlFor="editName" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                id="editName"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="editPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Price (USD)
              </label>
              <input
                type="number"
                id="editPrice"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Products List */}
      {products.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No products found. Add your first product to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Added
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium">{product.name}</td>
                  <td className="py-3 px-4 text-sm">{formatCurrency(product.price)}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditProduct(product)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={deletingProductId === product.id}
                        className="text-red-600 hover:text-red-800 disabled:text-red-300"
                      >
                        {deletingProductId === product.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 