"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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

type ImgStatus = "loading" | "loaded" | "error";

function statusFromImage(img: HTMLImageElement): ImgStatus {
  if (!img.complete) return "loading";
  return img.naturalHeight > 0 ? "loaded" : "error";
}

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
  const [imgStatus, setImgStatus] = useState<ImgStatus>("loading");
  const [open, setOpen] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const syncImgStatus = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const next = statusFromImage(img);
    setImgStatus((prev) => (prev === next ? prev : next));
  }, []);

  // Cached images can finish before onLoad is attached; check .complete after mount.
  useEffect(() => {
    syncImgStatus();
  }, [src, syncImgStatus]);

  const canOpen = imgStatus === "loaded" || imgStatus === "error";

  return (
    <>
      <button
        type="button"
        onClick={() => canOpen && setOpen(true)}
        disabled={!canOpen}
        className={cn(
          "group relative mb-4 w-full overflow-hidden rounded-xl border border-dashed border-muted-foreground/30 bg-gradient-to-br from-muted/60 to-muted/30 text-left ring-2 ring-inset transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
          accent.ring,
          canOpen ? "cursor-zoom-in hover:shadow-md" : "cursor-wait opacity-95"
        )}
        aria-label={
          imgStatus === "loading"
            ? `Screenshot loading: ${title}`
            : imgStatus === "error"
              ? `Screenshot missing: ${title}`
              : `View full screenshot: ${title}`
        }
      >
        <div className="relative aspect-[5/3] max-h-40 w-full sm:max-h-44">
          {/* eslint-disable-next-line @next/next/no-img-element -- public path; 404 until file exists */}
          <img
            ref={imgRef}
            src={src}
            alt=""
            decoding="async"
            className={cn(
              "absolute inset-0 z-[1] h-full w-full object-cover object-top transition-opacity duration-300",
              imgStatus === "loaded" ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImgStatus("loaded")}
            onError={() => setImgStatus("error")}
          />
          <div
            className={cn(
              "absolute inset-0 z-[2] flex flex-col items-center justify-center gap-1 p-3 text-center transition-opacity duration-300",
              imgStatus === "loading" ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            <span className={cn("text-xs font-semibold uppercase tracking-wide", accent.label)}>
              Screenshot
            </span>
            <span className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">{title}</span>
            <span className="mt-1 hidden font-mono text-[10px] text-muted-foreground/70 sm:block">
              public/landing/screenshots/{slug}.png
            </span>
          </div>
          {imgStatus === "error" && (
            <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-1 p-3 text-center">
              <span className={cn("text-xs font-semibold uppercase tracking-wide", accent.label)}>
                No image yet
              </span>
              <span className="text-[11px] leading-snug text-muted-foreground">Click for details</span>
            </div>
          )}
          {imgStatus === "loaded" && (
            <div className="pointer-events-none absolute bottom-2 right-2 z-[3] flex items-center gap-1 rounded-md bg-black/55 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm sm:text-xs">
              <Maximize2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden />
              <span>Click to view</span>
            </div>
          )}
        </div>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[95vh] w-[min(96rem,calc(100vw-1.5rem))] max-w-none overflow-y-auto border-border/60 p-4 sm:p-6">
          <DialogHeader className="pr-8">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {imgStatus === "loaded" ? (
            <div className="flex justify-center rounded-lg bg-muted/30 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${title} full screenshot`}
                className="max-h-[min(85vh,1200px)] w-auto max-w-full object-contain"
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Add a PNG at{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                public/landing/screenshots/{slug}.png
              </code>{" "}
              to show this preview.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
