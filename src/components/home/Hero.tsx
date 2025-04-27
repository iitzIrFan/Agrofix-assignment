import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl overflow-hidden p-8 md:p-12 shadow-sm w-full max-w-7xl mx-auto mt-8">
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
  );
} 