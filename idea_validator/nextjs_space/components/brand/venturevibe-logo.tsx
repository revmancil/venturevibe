import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { width: 220, height: 64, className: "h-14 w-auto sm:h-16" },
  md: { width: 280, height: 80, className: "h-[4.5rem] w-auto sm:h-20" },
  lg: { width: 340, height: 96, className: "h-24 w-auto sm:h-28" },
  hero: {
    width: 520,
    height: 200,
    className: "h-44 w-auto sm:h-52 md:h-60 max-w-[min(100%,32rem)]",
  },
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
      className={cn(dim.className, "object-contain object-center", className)}
      priority={priority}
      quality={95}
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center">
        {image}
      </Link>
    );
  }

  return <span className="inline-flex shrink-0 items-center justify-center">{image}</span>;
}
