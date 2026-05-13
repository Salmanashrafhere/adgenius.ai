/**
 * Fetch and extract basic product metadata from HTML (server-side).
 */

const FETCH_TIMEOUT_MS = 25_000;
/** Limit HTML size for parsing / memory (bytes). */
const MAX_HTML_CHARS = 1_200_000;

/**
 * @param {string} hostname
 */
function isBlockedHostname(hostname) {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h === "0.0.0.0") return true;
  if (h.endsWith(".localhost") || h.endsWith(".local")) return true;
  if (h === "127.0.0.1" || h.startsWith("127.")) return true;
  if (h === "::1") return true;
  if (h.endsWith(".onion")) return true;
  if (/^(10|127)\.\d+\.\d+\.\d+$/.test(h)) return true;
  if (/^192\.168\.\d+\.\d+$/.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(h)) return true;
  if (/^169\.254\.\d+\.\d+$/.test(h)) return true;
  return false;
}

/**
 * @param {string} input
 * @returns {string} normalized absolute URL
 */
export function normalizeProductUrl(input) {
  const trimmed = String(input || "").trim();
  if (!trimmed) throw new Error("Product URL is required");
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let u;
  try {
    u = new URL(withProto);
  } catch {
    throw new Error("Invalid product URL");
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error("Invalid product URL");
  }
  if (isBlockedHostname(u.hostname)) {
    throw new Error("URL not allowed");
  }
  return u.toString();
}

/**
 * @param {string} html
 * @param {string} prop
 */
function metaOg(html, prop) {
  const p = prop.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re1 = new RegExp(`<meta[^>]+property=["']og:${p}["'][^>]+content=(["'])([\\s\\S]*?)\\1`, "i");
  const re2 = new RegExp(`<meta[^>]+content=(["'])([\\s\\S]*?)\\1[^>]+property=["']og:${p}["']`, "i");
  let m = html.match(re1) || html.match(re2);
  return m ? decodeBasicEntities(m[2].trim()) : "";
}

/**
 * @param {string} html
 */
function metaNameDescription(html) {
  const re1 = /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i;
  const re2 = /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i;
  let m = html.match(re1);
  if (!m) m = html.match(re2);
  return m ? decodeBasicEntities(m[1].trim()) : "";
}

/**
 * @param {string} html
 */
function titleTag(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? decodeBasicEntities(m[1].replace(/<[^>]+>/g, "").trim()) : "";
}

/**
 * @param {string} html
 */
function firstH1(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!m) return "";
  return decodeBasicEntities(m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

/**
 * @param {string} s
 */
function decodeBasicEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

/**
 * @param {AbortSignal} a
 * @param {AbortSignal} b
 */
export function mergeAbortSignals(a, b) {
  const c = new AbortController();
  function forward() {
    if (!c.signal.aborted) c.abort();
  }
  if (a.aborted || b.aborted) {
    c.abort();
    return c.signal;
  }
  a.addEventListener("abort", forward);
  b.addEventListener("abort", forward);
  return c.signal;
}

/**
 * @param {string} url
 * @param {{ signal?: AbortSignal }} [opts]
 * @returns {Promise<string>} HTML text
 */
export async function fetchProductHtml(url, opts = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  const signal = opts.signal ? mergeAbortSignals(opts.signal, controller.signal) : controller.signal;

  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AdGeniusBot/1.0; +https://adgenius.ai) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal,
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch product page (${res.status})`);
    }

    let text = await res.text();
    if (!text || text.length < 50) {
      throw new Error("Product page response was empty or too short");
    }
    if (text.length > MAX_HTML_CHARS) {
      text = text.slice(0, MAX_HTML_CHARS);
    }

    const ct = (res.headers.get("content-type") || "").toLowerCase();
    const looksHtml = /<!DOCTYPE\s+html|<html[\s>]/i.test(text.slice(0, 2000));
    if (!looksHtml && !ct.includes("text/html") && !ct.includes("application/xhtml")) {
      throw new Error("URL did not return HTML content");
    }
    return text;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * @param {string} html
 */
export function extractProductMetadata(html) {
  const ogTitle = metaOg(html, "title");
  const ogDescription = metaOg(html, "description");
  const ogImage = metaOg(html, "image");
  const titleFromTag = titleTag(html);
  const metaDesc = metaNameDescription(html);
  const h1 = firstH1(html);

  const title = ogTitle || h1 || titleFromTag || "Product";
  const description = ogDescription || metaDesc || "";
  const imageUrl = ogImage || null;

  return { title, description, imageUrl };
}
