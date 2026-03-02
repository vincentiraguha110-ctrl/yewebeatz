"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { money } from "@/lib/utils";

export default function CartPage() {
  const { items, remove, clear, totalRwf } = useCart();

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Cart</h1>
        <p className="mt-1 text-sm text-white/70">Review your items before checkout.</p>
      </div>

      <div className="grid gap-3">
        {items.map((i) => (
          <div
            key={i.id}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div>
              <div className="font-semibold">{i.title}</div>
              <div className="text-sm text-white/70">{i.type}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm">{money(i.priceRwf)}</div>
              <button
                onClick={() => remove(i.id)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
            Your cart is empty.{" "}
            <Link className="underline" href="/tracks">
              Browse tracks
            </Link>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="text-lg font-semibold">Total: {money(totalRwf)}</div>
        <div className="flex gap-2">
          <button
            onClick={clear}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            Clear
          </button>
          <Link
            href="/checkout"
            className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-black hover:opacity-90"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
