'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Sparkles, CheckCircle, ArrowRight } from "lucide-react";
import { authErrorMessage } from "@/lib/auth-errors";
import { normalizeEmail } from "@/lib/normalize-email";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizeEmail(email),
          password,
          name: name.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Signup failed");
        setIsLoading(false);
        return;
      }

      // Try auto sign-in
      const signInResult = await signIn("credentials", {
        email: normalizeEmail(email),
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.error(authErrorMessage(signInResult.error));
        setAccountCreated(true);
        return;
      }

      toast.success("Account created! Redirecting to dashboard...");
      window.location.assign("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  }

  if (accountCreated) {
    return (
      <Card className="border border-border/50 shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Account created!</CardTitle>
          <CardDescription>
            Your account has been successfully created. Please sign in to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/auth/login">
            <Button className="w-full bg-gradient-to-r from-violet-500 to-emerald-500 hover:from-blue-600 hover:to-purple-600" size="lg">
              Sign in to your account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/50 shadow-lg">
      <CardHeader className="space-y-2 text-center">
        <div className="flex justify-center mb-2">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl">Start validating ideas</CardTitle>
        <CardDescription>Create your VentureVibe account to begin</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              placeholder="John Entrepreneur"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
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
            Create account
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
