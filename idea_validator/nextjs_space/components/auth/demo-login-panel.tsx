"use client";

import { Button } from "@/components/ui/button";
import { DEMO_TEST_EMAIL, DEMO_TEST_PASSWORD } from "@/lib/demo-auth";

const showDemo =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_SHOW_DEMO_LOGIN === "true";

type DemoLoginPanelProps = {
  onFill: (email: string, password: string) => void;
};

export function DemoLoginPanel({ onFill }: DemoLoginPanelProps) {
  if (!showDemo) return null;

  return (
    <div className="mb-4 rounded-lg border border-dashed border-violet-300/70 bg-violet-50/60 p-3 text-sm dark:border-violet-700/60 dark:bg-violet-950/40">
      <p className="mb-2 font-medium text-foreground">Demo account (testing)</p>
      <p className="mb-2 text-muted-foreground">
        In dev, the demo account is created automatically on first sign-in. On production, set{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">ALLOW_DEMO_LOGIN=true</code> in env or
        run <code className="rounded bg-muted px-1 py-0.5 text-xs">npx prisma db seed</code>.
      </p>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="w-full sm:w-auto"
        onClick={() => onFill(DEMO_TEST_EMAIL, DEMO_TEST_PASSWORD)}
      >
        Fill demo email &amp; password
      </Button>
    </div>
  );
}
