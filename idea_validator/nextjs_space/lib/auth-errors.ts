/** Map NextAuth / API errors to user-facing copy. */
export function authErrorMessage(error?: string | null): string {
  if (!error || error === "CredentialsSignin") {
    return "Invalid email or password.";
  }
  if (error === "Configuration") {
    return "Server misconfiguration: set DATABASE_URL (Supabase pooler URI), NEXTAUTH_SECRET, and NEXTAUTH_URL on Vercel, then redeploy.";
  }
  return error;
}
