import ProductCard from '@/components/ProductCard';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import SearchBar from "@/components/SearchBar";

interface Product {
  id: string;
  name: string;
  price: number;
}

export default async function Home({ 
  searchParams 
}: { 
  searchParams: Promise<{ query?: string }> 
}) {
  const params = await searchParams;
  const query = params.query || "";
  
  const products = await prisma.product.findMany({
    where: query ? {
      name: {
        contains: query,
        mode: 'insensitive'
      }
    } : {},
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      
      <section className="w-full max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Available Products</h2>
        
        <div className="mb-8">
          <SearchBar />
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No products found matching your search.</p>
            {query && (
              <button 
                onClick={() => window.location.href = '/'} 
                className="mt-4 text-green-600 hover:text-green-800 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
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

      <Features />
    </main>
  );
}
