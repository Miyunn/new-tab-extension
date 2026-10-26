export interface ResolvedFavicon {
  name: string;
  faviconUrl: string;
  siteUrl: string;
}

/**
 * Well-known domain overrides for clean, recognizable display names.
 */
const KNOWN_NAMES: Record<string, string> = {
  "google.com": "Google",
  "mail.google.com": "Gmail",
  "drive.google.com": "Google Drive",
  "docs.google.com": "Google Docs",
  "sheets.google.com": "Google Sheets",
  "slides.google.com": "Google Slides",
  "calendar.google.com": "Google Calendar",
  "keep.google.com": "Google Keep",
  "meet.google.com": "Google Meet",
  "maps.google.com": "Google Maps",
  "photos.google.com": "Google Photos",
  "translate.google.com": "Google Translate",
  "youtube.com": "YouTube",
  "www.youtube.com": "YouTube",
  "music.youtube.com": "YouTube Music",
  "web.whatsapp.com": "WhatsApp",
  "whatsapp.com": "WhatsApp",
  "web.telegram.org": "Telegram",
  "telegram.org": "Telegram",
  "github.com": "GitHub",
  "www.github.com": "GitHub",
  "twitter.com": "Twitter",
  "www.twitter.com": "Twitter",
  "x.com": "X",
  "www.x.com": "X",
  "reddit.com": "Reddit",
  "www.reddit.com": "Reddit",
  "linkedin.com": "LinkedIn",
  "www.linkedin.com": "LinkedIn",
  "facebook.com": "Facebook",
  "www.facebook.com": "Facebook",
  "instagram.com": "Instagram",
  "www.instagram.com": "Instagram",
  "open.spotify.com": "Spotify",
  "spotify.com": "Spotify",
  "discord.com": "Discord",
  "stackoverflow.com": "Stack Overflow",
  "www.stackoverflow.com": "Stack Overflow",
  "netflix.com": "Netflix",
  "www.netflix.com": "Netflix",
  "twitch.tv": "Twitch",
  "www.twitch.tv": "Twitch",
  "amazon.com": "Amazon",
  "www.amazon.com": "Amazon",
  "notion.so": "Notion",
  "www.notion.so": "Notion",
  "figma.com": "Figma",
  "www.figma.com": "Figma",
  "slack.com": "Slack",
  "app.slack.com": "Slack",
  "chatgpt.com": "ChatGPT",
  "www.chatgpt.com": "ChatGPT",
  "wikipedia.org": "Wikipedia",
  "en.wikipedia.org": "Wikipedia",
};

/**
 * Normalizes user input into a valid HTTP/HTTPS URL string.
 */
export function normaliseUrl(raw: string): string {
  let url = raw.trim();
  if (!url) {
    throw new Error("Please enter a URL.");
  }

  // Prepend https:// if protocol is missing
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  const parsed = new URL(url);
  if (!parsed.hostname || !parsed.hostname.includes(".")) {
    throw new Error("Invalid domain name.");
  }

  return parsed.href;
}

/**
 * Extracts root domain from hostname (e.g. drive.google.com -> google.com, news.bbc.co.uk -> bbc.co.uk).
 */
export function getRootDomain(hostname: string): string {
  const parts = hostname.toLowerCase().split(".");
  if (parts.length <= 2) return hostname;
  const secondLast = parts[parts.length - 2];
  if (["co", "com", "org", "net", "gov", "edu"].includes(secondLast) && parts.length > 2) {
    return parts.slice(-3).join(".");
  }
  return parts.slice(-2).join(".");
}

/**
 * Derives a human-friendly name from hostname.
 */
export function deriveNameFromHostname(hostname: string): string {
  const lower = hostname.toLowerCase();

  if (KNOWN_NAMES[lower]) return KNOWN_NAMES[lower];
  const withoutWww = lower.replace(/^www\./, "");
  if (KNOWN_NAMES[withoutWww]) return KNOWN_NAMES[withoutWww];

  const parts = withoutWww.split(".");
  const domainPart = parts.length > 2 ? parts[parts.length - 2] : parts[0];

  return domainPart
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Probes an image via Image element with a timeout.
 */
export function probeImage(url: string, timeoutMs = 3000): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    let settled = false;

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        img.src = "";
        resolve(false);
      }
    }, timeoutMs);

    img.onload = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolve(img.naturalWidth > 0);
      }
    };

    img.onerror = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolve(false);
      }
    };

    img.src = url;
  });
}

/**
 * Fast and accurate candidate image check using fetch if possible, falling back to Image element.
 */
export async function testCandidateUrl(url: string, timeoutMs = 3000): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      return true;
    }
    return false;
  } catch {
    // If fetch failed (e.g. CORS or network policy), probe with Image element
    return probeImage(url, timeoutMs);
  }
}

/**
 * Generates an SVG data URL avatar as fallback when no favicon is found.
 */
export function generateLetterAvatar(letter: string): string {
  const char = (letter.charAt(0) || "?").toUpperCase();
  const hue = (char.charCodeAt(0) * 47) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="28" fill="hsl(${hue}, 60%, 42%)"/>
    <text x="64" y="74" text-anchor="middle"
          font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          font-weight="700" font-size="64" fill="#ffffff">${char}</text>
  </svg>`;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Resolves site name, destination URL, and highest quality favicon.
 *
 * Multi-tier resolution strategy:
 *   1. Google FaviconV2 API with exact full URL (handles subdomains and specific services like drive.google.com, web.whatsapp.com, mail.google.com)
 *   2. Google FaviconV2 API with origin URL
 *   3. Icon.horse API for the hostname (CORS-friendly, subdomain-aware)
 *   4. Google FaviconV2 API with root domain fallback
 *   5. Legacy Google s2 service on root domain
 *   6. Direct origin /favicon.ico
 *   7. SVG letter avatar as guaranteed fallback
 */
export async function resolveFavicon(inputUrl: string): Promise<ResolvedFavicon> {
  const siteUrl = normaliseUrl(inputUrl);
  const parsed = new URL(siteUrl);
  const hostname = parsed.hostname;
  const name = deriveNameFromHostname(hostname);
  const rootDomain = getRootDomain(hostname);

  const candidates: string[] = [
    // 1. Exact full URL on FaviconV2 (gets exact product icons for drive.google.com, web.whatsapp.com, etc.)
    `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(siteUrl)}&size=128`,

    // 2. Origin on FaviconV2
    `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(parsed.origin)}&size=128`,

    // 3. Icon.horse API (specialized favicon service)
    `https://icon.horse/icon/${hostname}`,

    // 4. Root domain fallback on FaviconV2
    `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(`https://${rootDomain}`)}&size=128`,

    // 5. Legacy Google s2 favicon on root domain
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(rootDomain)}&sz=128`,

    // 6. Direct /favicon.ico on origin
    `${parsed.origin}/favicon.ico`,
  ];

  for (const candidate of candidates) {
    if (await testCandidateUrl(candidate)) {
      return {
        name,
        faviconUrl: candidate,
        siteUrl,
      };
    }
  }

  // 7. Letter avatar fallback
  return {
    name,
    faviconUrl: generateLetterAvatar(name),
    siteUrl,
  };
}
