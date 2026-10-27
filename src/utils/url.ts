/**
 * Formats user-provided destination URL to ensure it has a valid protocol
 * so that the browser does not treat it as a relative URL inside the extension.
 *
 * For example:
 * - "www.google.com" -> "https://www.google.com"
 * - "google.com" -> "https://google.com"
 * - "localhost:3000" -> "http://localhost:3000"
 * - "https://google.com" -> "https://google.com"
 */
export function formatDestinationUrl(raw: string): string {
  const trimmed = raw?.trim() || "";
  if (!trimmed) return "";

  // Protocol-relative URLs: //example.com -> https://example.com
  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  // Already has a standard scheme with :// (e.g. https://, http://, ftp://, chrome://)
  // or a common schemeless URI (mailto:, tel:, about:)
  if (
    /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//i.test(trimmed) ||
    /^(mailto|tel|about):/i.test(trimmed)
  ) {
    return trimmed;
  }

  // Localhost or loopback IP without scheme: default to http://
  if (/^(localhost|127\.0\.0\.1)(:\d+)?(\/.*)?$/i.test(trimmed)) {
    return `http://${trimmed}`;
  }

  // Default to https://
  return `https://${trimmed}`;
}
