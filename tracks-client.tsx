"use client";

import { tracks } from "@/lib/data";
import AudioPlayer from "@/components/AudioPlayer";
import { useCart } from "@/components/CartContext";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { licensePresets, type LicenseType } from "@/lib/licenses";
import { trackPricesRwf } from "@/lib/pricing";
import { money } from "@/lib/utils";

export default function TracksClient() {
  const sp = useSearchParams();
  const query = (sp.get("q") || "").trim().toLowerCase();

  const { add } = useCart();

  const [genre, setGenre] = useState<string>("All");
  const [mood, setMood] = useState<string>("All");

  const genres = useMemo(() => ["All", ...Array.from(new Set(tracks.map((t) => t.genre)))], []);
  const moods = useMemo(() => ["All", ...Array.from(new Set(tracks.map((t) => t.mood)))], []);

  const filtered = useMemo(() => {
    return tracks.filter((t) => {
      const okQ = query ? t.title.toLowerCase().includes(query) : true;
      const okG = genre === "All" ? true : t.genre === genre;
      const okM = mood === "All" ? true : t.mood === mood;
      return okQ && okG && okM;
    });
  }, [genre, mood, query]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Tracks</h1>
          <p className="mt-1 text-sm text-white/70">Pick a license, preview, add to cart.</p>
        </div>

        <div className="flex gap-2">
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
          >
            {genres.map((g) => (
              <option key={g} value={g} className="bg-black">
                {g}
              </option>
            ))}
          </select>

          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
          >
            {moods.map((m) => (
              <option key={m} value={m} className="bg-black">
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((t) => (
          <TrackRow key={t.id} track={t} onAdd={add} />
        ))}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
            No tracks found.
          </div>
        )}
      </div>
    </div>
  );
}

function TrackRow({ track, onAdd }: { track: (typeof tracks)[number]; onAdd: any }) {
  const [license, setLicense] = useState<LicenseType>("BASIC");
  const preset = licensePresets[license];
  const priceRwf = trackPricesRwf[license];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">{track.title}</div>
          <div className="mt-1 text-sm text-white/70">
            {track.genre} • {track.mood} • {track.bpm} BPM • {track.key} • ID: {track.id}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={license}
            onChange={(e) => setLicense(e.target.value as LicenseType)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
          >
            <option className="bg-black" value="BASIC">Basic (MP3)</option>
            <option className="bg-black" value="PREMIUM">Premium (MP3+WAV)</option>
            <option className="bg-black" value="UNLIMITED">Unlimited (MP3+WAV+STEMS)</option>
          </select>

          <div className="text-sm">{money(priceRwf)}</div>
          <button
            onClick={() =>
              onAdd({
                id: `${track.id}-${license}`,
                baseId: track.id,
                title: `${track.title} (${preset.name})`,
                priceRwf,
                type: "TRACK",
                licenseType: license,
                deliverables: preset.deliverables,
                usageLimits: preset.usageLimits,
              })
            }
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="mt-4">
        <AudioPlayer src={track.audioUrl} />
      </div>
    </div>
  );
}
