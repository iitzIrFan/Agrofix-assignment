import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import OrderForm from './OrderForm';

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Get products for dropdown
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' },
  });

  // Handle pre-selected product from URL params
  const resolvedSearchParams = await searchParams;
  const selectedProductId = resolvedSearchParams.productId as string | undefined;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Place Your Order</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Fill out the form below to place a bulk order directly from our farmers.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Cart recommendation banner */}
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="text-center sm:text-left">
              <h2 className="text-lg font-semibold text-blue-800">Want to order multiple items?</h2>
              <p className="text-blue-700">Use our cart feature to add multiple products and checkout once.</p>
            </div>
            <Link 
              href="/" 
              className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-5 rounded-lg transition-colors shadow-sm inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Browse Products
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
              <h2 className="font-semibold text-lg text-gray-800">Order Details</h2>
            </div>
            <div className="p-6">
              <OrderForm 
                products={products} 
                selectedProductId={selectedProductId} 
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="font-semibold text-lg text-gray-800">Order Summary</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Complete the form to see your order summary, including any applicable taxes and shipping costs.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-600">Product</span>
                  <span className="font-medium">Select a product</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="border-t border-gray-200 my-3 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-lg">$0.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-100">
            <h2 className="text-xl font-semibold mb-4 text-amber-800">Why Buy in Bulk?</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-amber-800">Save money with wholesale pricing</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-amber-800">Reduce packaging waste</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-amber-800">Fresh products delivered directly to you</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-amber-800">Support local farmers and growers</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <h3 className="font-medium mb-3">Need a Custom Quote?</h3>
            <p className="text-sm text-gray-600 mb-4">
              For very large orders or special requirements, please contact our wholesale team.
            </p>
            <Link 
              href="mailto:xyz@gmail.com" 
              className="block w-full bg-gray-100 text-gray-700 text-center py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Contact Wholesale Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 