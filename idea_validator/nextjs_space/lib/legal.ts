/** Update contact email and governing law for your entity before launch if needed. */
export const LEGAL_ENTITY_NAME = "VentureVibe";
export const LEGAL_CONTACT_EMAIL = "legal@venturevibe.app";
export const LEGAL_LAST_UPDATED = "May 19, 2026";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  list?: string[];
};
