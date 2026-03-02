import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/components/CartContext";

export const metadata: Metadata = {
  title: "YeweBeatz",
  description: "Beats • Sound Kits • Merch • Memberships",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-black text-white">
        <CartProvider>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
          <footer className="border-t border-white/10 py-10">
            <div className="mx-auto max-w-6xl px-4 text-sm text-white/60">
              © {new Date().getFullYear()} YeweBeatz — All rights reserved.
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
