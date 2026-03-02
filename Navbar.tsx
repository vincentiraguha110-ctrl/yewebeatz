"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/CartContext";
import { useMemo, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { count } = useCart();
  const [q, setQ] = useState("");
  const router = useRouter();

  const nav = useMemo(() => site.nav, []);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/tracks?q=${encodeURIComponent(query)}` : "/tracks");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {site.name}
        </Link>

        <nav className="hidden flex-1 items-center gap-4 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm text-white/80 hover:text-white",
                pathname === item.href && "text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={onSearch} className="hidden md:block">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="SEARCH"
            className="w-52 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/25"
          />
        </form>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/account"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
          >
            Account
          </Link>
          <Link
            href="/cart"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
          >
            Cart ({count})
          </Link>
        </div>
      </div>
    </header>
  );
}
