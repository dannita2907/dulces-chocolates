import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/features/carrito/cart-context";
import { Navbar } from "@/components/layout/Navbar";
import { FloatingCartButton } from "@/components/layout/FloatingCartButton";
import { Footer } from "@/components/layout/Footer";
import { BRAND_NAME } from "@/lib/constants";

const serif = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: `${BRAND_NAME} | Hechos a mano`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: "Chocolates artesanales de alta calidad",

};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <CartProvider>
          <Navbar />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
          <FloatingCartButton />
        </CartProvider>
      </body>
    </html>
  );
}
