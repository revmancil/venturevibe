"use client";

import { useState } from "react";

const accentByColor: Record<string, { ring: string; label: string }> = {
  blue: { ring: "ring-blue-200/80", label: "text-blue-600/90" },
  purple: { ring: "ring-purple-200/80", label: "text-purple-600/90" },
  emerald: { ring: "ring-emerald-200/80", label: "text-emerald-600/90" },
  amber: { ring: "ring-amber-200/80", label: "text-amber-600/90" },
  rose: { ring: "ring-rose-200/80", label: "text-rose-600/90" },
  indigo: { ring: "ring-indigo-200/80", label: "text-indigo-600/90" },
  orange: { ring: "ring-orange-200/80", label: "text-orange-600/90" },
  cyan: { ring: "ring-cyan-200/80", label: "text-cyan-600/90" },
  pink: { ring: "ring-pink-200/80", label: "text-pink-600/90" },
  violet: { ring: "ring-violet-200/80", label: "text-violet-600/90" },
};

export function LandingScreenshot({
  slug,
  title,
  color,
}: {
  slug: string;
  title: string;
  color: string;
}) {
  const accent = accentByColor[color] || accentByColor.blue;
  const src = `/landing/screenshots/${slug}.png`;
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative mb-4 aspect-[16/10] w-full overflow-hidden rounded-xl border border-dashed border-muted-foreground/30 bg-gradient-to-br from-muted/60 to-muted/30 ring-2 ring-inset ${accent.ring}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- optional local assets; 404 is expected until files exist */}
      <img
        src={src}
        alt=""
        className={`absolute inset-0 z-[1] h-full w-full object-cover object-top transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
      />
      <div
        className={`absolute inset-0 z-[2] flex flex-col items-center justify-center gap-1 p-4 text-center transition-opacity duration-300 ${loaded ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <span className={`text-xs font-semibold uppercase tracking-wide ${accent.label}`}>Screenshot</span>
        <span className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">{title}</span>
        <span className="mt-1 font-mono text-[10px] text-muted-foreground/70">
          public/landing/screenshots/{slug}.png
        </span>
      </div>
    </div>
  );
}
