"use client";

import { useEffect, useRef, useState } from "react";

export default function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onTime = () => setTime(a.currentTime || 0);
    const onMeta = () => setDur(a.duration || 0);
    const onEnd = () => setPlaying(false);

    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
    };
  }, []);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play();
      setPlaying(true);
    }
  }

  function seek(v: number) {
    const a = audioRef.current;
    if (!a || !dur) return;
    a.currentTime = v;
    setTime(v);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/10"
        >
          {playing ? "Pause" : "Play"}
        </button>

        <input
          type="range"
          min={0}
          max={dur || 0}
          value={time}
          onChange={(e) => seek(Number(e.target.value))}
          className="w-full"
        />
        <div className="w-16 text-right text-xs text-white/60">
          {Math.floor(time)}/{Math.floor(dur)}
        </div>
      </div>
    </div>
  );
}
