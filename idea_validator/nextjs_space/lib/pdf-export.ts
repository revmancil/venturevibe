/**
 * Report / pitch-deck PDFs currently use Abacus HTML→PDF APIs when enabled.
 * Set PDF_EXPORT=off to disable (e.g. self-hosted without Abacus).
 */
export function isPdfExportEnabled(): boolean {
  return process.env.PDF_EXPORT !== "off";
}
