/** Map NextAuth / API errors to user-facing copy. */
export function authErrorMessage(error?: string | null): string {
  if (!error || error === "CredentialsSignin") {
    return "Invalid email or password.";
  }
  if (error === "Configuration") {
    return "Sign-in is misconfigured on the server. Contact support if this persists.";
  }
  return error;
}
