"use client";
import { membershipPlans } from "@/lib/data";
import { money } from "@/lib/utils";
import { useCart } from "@/components/CartContext";

export default function MembershipsPage() {
  const { add } = useCart();
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Memberships</h1>
        <p className="mt-1 text-sm text-white/70">Choose a plan and unlock benefits.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {membershipPlans.map((p) => (
          <div key={p.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-lg font-semibold">{p.name}</div>
            <div className="mt-2 text-3xl font-semibold">
              {money(p.priceMonthlyRwf)}
              <span className="text-sm font-normal text-white/60">/mo</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {p.perks.map((x) => (
                <li key={x}>• {x}</li>
              ))}
            </ul>

            <button
              onClick={() =>
                add({
                  id: p.id,
                  baseId: p.id,
                  title: `Membership: ${p.name}`,
                  priceRwf: p.priceMonthlyRwf,
                  type: "MEMBERSHIP",
                })
              }
              className="mt-5 w-full rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
