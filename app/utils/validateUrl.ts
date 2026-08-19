export interface UrlValidationResult {
  validity: boolean;
  message: string;
  normalizedUrl: string;
}

/**
 * Normalizes and validates any website URL:
 * - 'google.com' -> 'https://google.com'
 * - 'www.google.com' -> 'https://www.google.com'
 * - 'http://example.com' -> 'http://example.com'
 * - 'https://example.com/about' -> 'https://example.com/about'
 * - 'localhost:3000' -> 'http://localhost:3000'
 */
export function normalizeAndValidateUrl(value: string): UrlValidationResult {
  let trimmed = value.trim();

  if (!trimmed) {
    return {
      validity: false,
      message: "Please enter a website URL",
      normalizedUrl: "",
    };
  }

  // Remove trailing slashes from origin if bare
  trimmed = trimmed.replace(/\/+$/, "");

  // Auto-attach protocol if missing
  if (!/^https?:\/\//i.test(trimmed)) {
    // If it has some unsupported scheme like ftp:// or mailto:
    if (/^[a-zA-Z]+:\/\//i.test(trimmed)) {
      return {
        validity: false,
        message: "Only HTTP and HTTPS protocols are supported",
        normalizedUrl: trimmed,
      };
    }

    if (trimmed.startsWith("localhost")) {
      trimmed = `http://${trimmed}`;
    } else {
      trimmed = `https://${trimmed}`;
    }
  }

  try {
    const url = new URL(trimmed);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return {
        validity: false,
        message: "Only HTTP and HTTPS protocols are supported",
        normalizedUrl: trimmed,
      };
    }

    // Ensure valid hostname with TLD or localhost
    const hostname = url.hostname;
    if (!hostname || (!hostname.includes(".") && hostname !== "localhost")) {
      return {
        validity: false,
        message: "Please enter a valid domain (e.g. example.com or www.example.com)",
        normalizedUrl: trimmed,
      };
    }

    return {
      validity: true,
      message: "",
      normalizedUrl: url.toString().replace(/\/+$/, "") || trimmed,
    };
  } catch {
    return {
      validity: false,
      message: "Please enter a valid URL (e.g. example.com or https://example.com)",
      normalizedUrl: trimmed,
    };
  }
}

/** Legacy default export for backwards compatibility */
export default function isValidUrl(value: string) {
  const result = normalizeAndValidateUrl(value);
  return {
    validity: result.validity,
    message: result.message,
    normalizedUrl: result.normalizedUrl,
  };
}
