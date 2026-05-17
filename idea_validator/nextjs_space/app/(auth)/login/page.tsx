'use client';

import { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { VentureVibeLogo } from "@/components/brand/venturevibe-logo";
import { DemoLoginPanel } from "@/components/auth/demo-login-panel";
import { authErrorMessage } from "@/lib/auth-errors";
import { normalizeEmail } from "@/lib/normalize-email";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: normalizeEmail(email),
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (!result?.ok || result.error) {
        toast.error(authErrorMessage(result?.error));
        return;
      }

      const session = await getSession();
      if (!session?.user?.id) {
        toast.error(
          "Signed in but session was not saved. Check NEXTAUTH_URL and NEXTAUTH_SECRET on Vercel."
        );
        return;
      }

      window.location.assign("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border border-border/50 shadow-lg">
      <CardHeader className="space-y-2 text-center">
        <div className="flex justify-center mb-2">
          <VentureVibeLogo size="md" href={null} />
        </div>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your VentureVibe account</CardDescription>
      </CardHeader>
      <CardContent>
        <DemoLoginPanel onFill={(e, p) => { setEmail(e); setPassword(p); }} />
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={isLoading} loading={isLoading}>
            Sign in
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
