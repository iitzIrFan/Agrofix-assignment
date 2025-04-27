import { Analytics } from "@vercel/analytics/react"
import CartIndicator from "@/components/CartIndicator";
import { CartProvider } from "@/lib/cartContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import ResponsiveHandler from "../components/ResponsiveHandler";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agrofix - Bulk Vegetable/Fruit Ordering Platform",
  description: "A platform for placing bulk orders for fruits and vegetables",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <ResponsiveHandler />
          <header className="bg-green-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold">
                🥦 
              </Link>
              <nav>
                <ul className="flex space-x-6 items-center">
                  <li>
                    <Link href="/" className="hover:underline">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/order" className="hover:underline">
                      Place Order
                    </Link>
                  </li>
                  <li>
                    <Link href="/track" className="hover:underline">
                      Track Order
                    </Link>
                  </li>
                  <li>
                    <CartIndicator />
                  </li>
                  <li>
                    <Link href="/admin" className="hover:underline">
                      Admin
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">{children}</main>
          <footer className="bg-gray-100 p-4 text-center text-gray-600 mt-8">
            <div className="container mx-auto">
              <p>© {new Date().getFullYear()} Agrofix - Bulk Vegetable/Fruit Ordering Platform</p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
