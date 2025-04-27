import { Leaf, Truck, Users, CheckCircle } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Leaf className="w-12 h-12 text-green-600" />,
      title: "Fresh Produce",
      description: "All products are sourced directly from farms, ensuring maximum freshness and quality."
    },
    {
      icon: <Truck className="w-12 h-12 text-green-600" />,
      title: "Fast Delivery",
      description: "Quick delivery service to ensure your products arrive fresh and on time."
    },
    {
      icon: <Users className="w-12 h-12 text-green-600" />,
      title: "Support Local Farmers",
      description: "By ordering through Agrofix, you're directly supporting local farmers and sustainable agriculture."
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-green-600" />,
      title: "Quality Guarantee",
      description: "We guarantee the quality of all products or your money back."
    }
  ];

  return (
    <section className="w-full max-w-7xl mx-auto py-16">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Agrofix</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100">
            <div className="mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
} 