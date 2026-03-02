"use client";
import { soundKits } from "@/lib/data";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import { money } from "@/lib/utils";

export default function SoundKitsPage() {
  const { add } = useCart();
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Sound Kits</h1>
        <p className="mt-1 text-sm text-white/70">Royalty-free packs and tools.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {soundKits.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="relative h-44 w-full">
              <Image src={p.imageUrl || "/products/placeholder.jpg"} alt={p.title} fill className="object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm text-white/70">{p.description}</p>
                </div>
                <div className="text-sm text-white/90">{money(p.priceRwf)}</div>
              </div>
              <button
                onClick={() =>
                  add({
                    id: p.id,
                    baseId: p.id,
                    title: p.title,
                    priceRwf: p.priceRwf,
                    type: "SOUND_KIT",
                  })
                }
                className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
