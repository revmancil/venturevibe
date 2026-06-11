import { SOCIAL_PROOF_ITEMS } from "@/lib/social-proof";
import { cn } from "@/lib/utils";

type SocialProofBarProps = {
  className?: string;
};

export function SocialProofBar({ className }: SocialProofBarProps) {
  return (
    <ul
      aria-label="Platform highlights"
      className={cn(
        "flex flex-col items-center justify-center divide-y divide-border text-sm text-muted-foreground sm:flex-row sm:divide-x sm:divide-y-0",
        className
      )}
    >
      {SOCIAL_PROOF_ITEMS.map((item) => (
        <li
          key={item.id}
          className="px-4 py-2 first:pt-0 last:pb-0 sm:py-0 sm:first:pl-0 sm:last:pr-0"
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
}
