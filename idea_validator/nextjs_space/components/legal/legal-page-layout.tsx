import Link from "next/link";
import { VentureVibeLogo } from "@/components/brand/venturevibe-logo";
import { LEGAL_ENTITY_NAME, LEGAL_LAST_UPDATED } from "@/lib/legal";

type LegalPageLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <VentureVibeLogo size="md" href="/" />
          <nav className="flex gap-4 text-sm">
            <Link href="/terms" className="text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="mb-2 text-sm text-muted-foreground">Last updated: {LEGAL_LAST_UPDATED}</p>
        <h1 className="font-display mb-10 text-4xl font-bold tracking-tight">{title}</h1>
        <div className="space-y-10 text-foreground/90">{children}</div>
      </main>

      <footer className="border-t border-border/40 py-10">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <VentureVibeLogo size="sm" href="/" />
          <p className="text-center text-sm text-muted-foreground sm:text-right">
            © {new Date().getFullYear()} {LEGAL_ENTITY_NAME}.{" "}
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            {" · "}
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
