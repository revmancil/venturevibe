/**
 * Replaces literal Unicode escape sequences (e.g. the 6-character string \u2022)
 * that LLMs sometimes emit, with the actual Unicode characters.
 */
export function sanitizeUnicode(text: string): string {
  if (!text) return text;
  return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
}

/**
 * Recursively sanitizes all string values in an object/array.
 */
export function deepSanitizeUnicode<T>(data: T): T {
  if (typeof data === 'string') return sanitizeUnicode(data) as T;
  if (Array.isArray(data)) return data.map(deepSanitizeUnicode) as T;
  if (data && typeof data === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = deepSanitizeUnicode(value);
    }
    return result as T;
  }
  return data;
}
