import ProductCard from '@/components/ProductCard';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
}

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl overflow-hidden p-8 md:p-12 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-green-900">Welcome to <span className="text-green-600">Agrofix</span> 🥦</h1>
            <p className="text-xl text-gray-700 max-w-lg">
              Your one-stop platform for ordering fresh fruits and vegetables in bulk
              directly from local farmers and producers.
            </p>
            <div className="pt-4 flex flex-wrap gap-3">
              <Link 
                href="/order" 
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                Place an Order
              </Link>
              <Link 
                href="/track" 
                className="bg-white hover:bg-gray-50 text-green-700 font-medium py-3 px-6 rounded-lg border border-green-200 transition-all shadow-sm hover:shadow-md"
              >
                Track Your Order
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-64 h-64 bg-green-200 rounded-full flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/vegetables.jpg')] bg-cover bg-center opacity-80"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Available Products</h2>
          <Link href="/order" className="text-green-600 hover:text-green-800 font-medium">
            View All →
          </Link>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center p-12 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-gray-500 text-lg">No products available at the moment. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: Product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
              />
            ))}
          </div>
        )}
      </section>
      
      {/* Features Section */}
      <section className="bg-gradient-to-b from-white to-green-50 p-8 md:p-12 rounded-2xl shadow-sm">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Why Choose Agrofix?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🌱</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Farm Fresh</h3>
            <p className="text-gray-600">
              All our products come directly from local farmers, ensuring maximum freshness and nutritional value.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Bulk Ordering</h3>
            <p className="text-gray-600">
              Perfect for restaurants, grocery stores, and large families looking to save money and reduce packaging waste.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🚚</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Fast Delivery</h3>
            <p className="text-gray-600">
              We deliver your order quickly to ensure the freshness of your products with real-time tracking available.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
