import Link from "next/link";
import { site } from "@/lib/site";

export default function HomePage() {
  return (
    <div className="grid gap-10">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10">
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_50%,white,transparent_35%)]" />
        <div className="relative">
          <p className="text-sm text-white/70">{site.tagline}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            YeweBeatz
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Browse beats, download sound kits, shop merch, or join a membership.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/tracks"
              className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black hover:opacity-90"
            >
              Browse Tracks
            </Link>
            <Link
              href="/sound-kits"
              className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm hover:bg-white/10"
            >
              Sound Kits
            </Link>
            <Link
              href="/memberships"
              className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm hover:bg-white/10"
            >
              Memberships
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
