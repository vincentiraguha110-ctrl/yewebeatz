"use client";

import { useCart } from "@/components/CartContext";
import { money } from "@/lib/utils";
import { useMemo, useState } from "react";

export default function CheckoutPage() {
  const { items, totalRwf, clear } = useCart();

  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [momoPhone, setMomoPhone] = useState("");
  const [loading, setLoading] = useState<"stripe" | "momo" | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const payloadItems = useMemo(() => {
    return items.map((i) => ({
      id: i.baseId,
      cartId: i.id,
      title: i.title,
      type: i.type,
      priceRwf: i.priceRwf,
      licenseType: i.licenseType,
      deliverables: i.deliverables,
      usageLimits: i.usageLimits,
    }));
  }, [items]);

  async function payStripe() {
    setErr(null);
    if (!items.length) return setErr("Cart is empty.");
    if (!buyerEmail.trim()) return setErr("Enter your email.");
    setLoading("stripe");

    try {
      const res = await fetch("/api/pay/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerName: buyerName.trim(),
          buyerEmail: buyerEmail.trim(),
          currency: "RWF",
          items: payloadItems,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Stripe payment failed");
      window.location.href = data.url;
    } catch (e: any) {
      setErr(e.message || "Stripe error");
    } finally {
      setLoading(null);
    }
  }

  async function payMomo() {
    setErr(null);
    if (!items.length) return setErr("Cart is empty.");
    if (!buyerEmail.trim()) return setErr("Enter your email.");
    if (!momoPhone.trim()) return setErr("Enter your MTN MoMo phone number (e.g. 2507...).");

    setLoading("momo");
    try {
      const res = await fetch("/api/pay/momo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerName: buyerName.trim(),
          buyerEmail: buyerEmail.trim(),
          phoneNumber: momoPhone.trim(),
          currency: "RWF",
          items: payloadItems,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "MoMo request failed");
      window.location.href = `/momo/pending?orderId=${encodeURIComponent(data.orderId)}`;
    } catch (e: any) {
      setErr(e.message || "MoMo error");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="mt-1 text-sm text-white/70">Currency: RWF only</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <input
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            placeholder="Full name (optional)"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-white/25"
          />
          <input
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            placeholder="Email (required)"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-white/25"
          />
          <input
            value={momoPhone}
            onChange={(e) => setMomoPhone(e.target.value)}
            placeholder="MTN MoMo phone (e.g. 2507...)"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-white/25"
          />
        </div>

        <div className="mt-4 text-sm text-white/70">
          Total: <span className="text-white">{money(totalRwf)}</span>
        </div>

        {err && (
          <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {err}
          </div>
        )}

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <button
            onClick={payStripe}
            disabled={loading !== null}
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-60"
          >
            {loading === "stripe" ? "Redirecting..." : "Pay with Card (Stripe)"}
          </button>

          <button
            onClick={payMomo}
            disabled={loading !== null}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm hover:bg-white/10 disabled:opacity-60"
          >
            {loading === "momo" ? "Sending request..." : "Pay with MTN MoMo (Collections)"}
          </button>
        </div>

        <button
          onClick={clear}
          className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm hover:bg-white/10"
        >
          Clear cart
        </button>
      </div>
    </div>
  );
}
