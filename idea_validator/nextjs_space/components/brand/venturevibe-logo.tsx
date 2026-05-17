import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { width: 140, height: 40, className: "h-9 w-auto" },
  md: { width: 180, height: 52, className: "h-12 w-auto" },
  lg: { width: 220, height: 64, className: "h-16 w-auto" },
} as const;

type Size = keyof typeof SIZES;

interface VentureVibeLogoProps {
  size?: Size;
  href?: string | null;
  className?: string;
  priority?: boolean;
}

export function VentureVibeLogo({
  size = "sm",
  href = "/",
  className,
  priority = false,
}: VentureVibeLogoProps) {
  const dim = SIZES[size];
  const image = (
    <Image
      src="/logo.png"
      alt="VentureVibe"
      width={dim.width}
      height={dim.height}
      className={cn(dim.className, "object-contain object-left", className)}
      priority={priority}
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center">
        {image}
      </Link>
    );
  }

  return <span className="inline-flex shrink-0 items-center">{image}</span>;
}
