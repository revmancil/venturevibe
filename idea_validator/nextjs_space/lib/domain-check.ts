import dns from "dns/promises";

const TLDS = ["com", "io", "co", "app", "ai"] as const;

export type DomainStatus = "available" | "taken" | "unknown";

/** Heuristic DNS check — not a registrar lookup; good for quick founder screening. */
export async function checkDomain(domain: string): Promise<DomainStatus> {
  const host = domain.toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
  if (!host || !host.includes(".")) return "unknown";

  try {
    await dns.resolve4(host);
    return "taken";
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code === "ENOTFOUND" || code === "ENODATA") return "available";
    return "unknown";
  }
}

export async function checkDomainsForRoot(root: string): Promise<
  Record<string, DomainStatus>
> {
  const slug = root
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 63);
  if (!slug) return {};

  const results: Record<string, DomainStatus> = {};
  await Promise.all(
    TLDS.map(async (tld) => {
      const domain = `${slug}.${tld}`;
      results[tld] = await checkDomain(domain);
    })
  );
  return results;
}
