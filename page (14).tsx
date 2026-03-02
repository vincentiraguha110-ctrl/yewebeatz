"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MomoPendingPage() {
  const sp = useSearchParams();
  const orderId = sp.get("orderId") || "";

  const [status, setStatus] = useState<string>("PENDING");
  const [msg, setMsg] = useState<string>("Waiting for confirmation...");
  const [loading, setLoading] = useState<boolean>(true);

  async function check() {
    if (!orderId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/pay/momo/status?orderId=${encodeURIComponent(orderId)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Status check failed");

      setStatus(data.orderStatus);
      setMsg(data.message || "");

      if (data.orderStatus === "PAID") {
        window.location.href = `/success?orderId=${encodeURIComponent(orderId)}`;
      }
    } catch (e: any) {
      setMsg(e.message || "Error checking status");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    check();
    const t = setInterval(check, 5000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">MTN MoMo Payment</h1>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
        <div>
          Order: <span className="text-white">{orderId || "Missing orderId"}</span>
        </div>
        <div className="mt-2">
          Status: <span className="text-white">{status}</span>
        </div>
        <div className="mt-2">{msg}</div>

        <button
          onClick={check}
          disabled={loading}
          className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-60"
        >
          {loading ? "Checking..." : "Check now"}
        </button>
      </div>
    </div>
  );
}
