/**
 * Google Gemini helpers for AdGenius AI (server-side).
 * Set GEMINI_API_KEY. Optional: GEMINI_MODEL (default gemini-2.0-flash).
 */

const DEFAULT_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";
const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_ATTEMPTS = 3;

function geminiUrl(modelId) {
  const m = encodeURIComponent(modelId);
  return `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`;
}

/**
 * @param {AbortSignal} a
 * @param {AbortSignal} b
 */
function mergeAbortSignals(a, b) {
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
 * @param {string} text
 * @returns {string}
 */
export function cleanGeminiJsonResponse(text) {
  if (typeof text !== "string") return "";
  let s = text.trim();
  s = s.replace(/^```(?:json)?\s*/i, "");
  s = s.replace(/\s*```\s*$/i, "");
  const first = s.indexOf("{");
  const last = s.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    s = s.slice(first, last + 1);
  }
  return s.trim();
}

/**
 * @param {unknown} v
 * @returns {string[]}
 */
function toStringList(v) {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => {
      if (typeof x === "string") return x.trim();
      if (typeof x === "number" && Number.isFinite(x)) return String(x);
      if (x && typeof x === "object") return JSON.stringify(x);
      return "";
    })
    .filter(Boolean);
}

/**
 * Coerce Gemini JSON into a safe campaign shape (aliases + sensible defaults).
 * @param {unknown} parsed
 * @param {{ title?: string; description?: string }} [ctx]
 */
export function finalizeCreativeFromParsed(parsed, ctx = {}) {
  const title = (ctx.title || "Your product").trim() || "Your product";
  const description = (ctx.description || title).trim() || title;
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Gemini returned invalid JSON root");
  }
  const p = /** @type {Record<string, unknown>} */ (parsed);

  let headlines = toStringList(p.headlines);
  let bodycopies = toStringList(p.bodycopies ?? p.bodyCopies ?? p.body_copy);
  let ctas = toStringList(p.ctas ?? p.cta);
  let angles = toStringList(p.angles ?? p.angle);

  const taRaw = p.targetAudience ?? p.target_audience ?? p.audience;
  const stRaw = p.strategy ?? p.strategyGuide;

  let targetAudience = typeof taRaw === "string" ? taRaw.trim() : "";
  let strategy = typeof stRaw === "string" ? stRaw.trim() : "";

  if (headlines.length < 1) {
    headlines = [`${title}: the upgrade shoppers notice`];
  }
  if (bodycopies.length < 1) {
    bodycopies = [
      `Problem: it’s hard to pick the right offer online. Agitate: generic ads waste budget. Solution: ${title}—${description.slice(0, 200)}${description.length > 200 ? "…" : ""}`,
    ];
  }
  if (ctas.length < 1) {
    ctas = ["Shop now", "Learn more", "Get offer", "See details", "Try it today"];
  }
  if (angles.length < 1) {
    angles = ["Benefit-led", "Social proof", "Offer & urgency", "Authority & trust", "Curiosity hook"];
  }
  if (!targetAudience) {
    targetAudience = `People actively comparing options for ${title}, skewing toward convenience, value, and trust signals.`;
  }
  if (!strategy) {
    strategy = `Lead with one clear benefit from ${title}, keep copy scannable, match CTA to funnel stage, and A/B test 2–3 headline hooks per placement.`;
  }

  return {
    headlines,
    bodycopies,
    ctas,
    angles,
    targetAudience,
    strategy,
  };
}

/**
 * @param {string} rawText
 * @param {{ title?: string; description?: string }} [context]
 */
export function parseGeminiCampaignFromText(rawText, context = {}) {
  const cleaned = cleanGeminiJsonResponse(rawText);
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Could not parse JSON from Gemini response");
  }
  return finalizeCreativeFromParsed(parsed, context);
}

/**
 * @param {string} prompt
 * @param {string} apiKey
 * @param {{ signal?: AbortSignal; model?: string }} [opts]
 */
/**
 * @param {string} prompt
 * @param {string} apiKey
 * @param {{ signal?: AbortSignal; model?: string; jsonMime?: boolean }} [opts]
 */
async function geminiGenerateOnce(prompt, apiKey, opts = {}) {
  const model = opts.model || DEFAULT_MODEL;
  const url = `${geminiUrl(model)}?key=${encodeURIComponent(apiKey)}`;
  const jsonMime = opts.jsonMime !== false;

  async function call(useJsonMime) {
    /** @type {Record<string, unknown>} */
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
    };
    if (useJsonMime) {
      payload.generationConfig = { responseMimeType: "application/json" };
    }
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: opts.signal,
    });
  }

  let res = await call(jsonMime);
  let raw = await res.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`Gemini API returned non-JSON (${res.status})`);
  }

  if (!res.ok && jsonMime && res.status === 400) {
    const hint = (data?.error?.message || raw || "").toLowerCase();
    if (hint.includes("mime") || hint.includes("json") || hint.includes("invalid") || hint.includes("unknown")) {
      res = await call(false);
      raw = await res.text();
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error(`Gemini API returned non-JSON (${res.status})`);
      }
    }
  }

  if (!res.ok) {
    const msg = data?.error?.message || data?.message || raw.slice(0, 240) || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  const candidate = data?.candidates?.[0];
  const finish = candidate?.finishReason;

  const text = candidate?.content?.parts?.map((part) => part?.text || "").join("") || "";

  if (!text.trim()) {
    const promptBlock = data?.promptFeedback?.blockReason;
    if (promptBlock) {
      throw new Error(`Prompt blocked (${promptBlock})`);
    }
    if (finish && finish !== "STOP" && finish !== "MAX_TOKENS") {
      throw new Error(`Gemini returned empty content (${finish})`);
    }
    throw new Error("Gemini returned empty content");
  }

  return text;
}

/**
 * @param {string} prompt
 * @param {string} apiKey
 * @param {{ timeoutMs?: number; signal?: AbortSignal }} [opts]
 */
export async function generateWithGemini(prompt, apiKey, opts = {}) {
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const outer = opts.signal;
  let lastErr;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    if (outer?.aborted) {
      const err = new Error("The operation was aborted");
      err.name = "AbortError";
      throw err;
    }

    const inner = new AbortController();
    const timer = setTimeout(() => inner.abort(), timeoutMs);
    const signal = outer ? mergeAbortSignals(outer, inner.signal) : inner.signal;

    try {
      const text = await geminiGenerateOnce(prompt, apiKey, { signal });
      clearTimeout(timer);
      return text;
    } catch (e) {
      clearTimeout(timer);
      lastErr = e;
      const msg = (e?.message || "").toLowerCase();
      const isQuotaError = msg.includes("quota") || msg.includes("429") || msg.includes("rate limit");

      if (isQuotaError) {
        // Special case for quota exceeded: Wait 60s and retry once
        console.warn("Gemini rate limit hit, retrying in 60 seconds...");
        // If we have an AbortSignal, we should still respect it during the wait
        if (outer?.aborted) throw e;
        
        await new Promise((resolve, reject) => {
          const waitTimer = setTimeout(resolve, 60000);
          outer?.addEventListener("abort", () => {
            clearTimeout(waitTimer);
            reject(new Error("Aborted during quota wait"));
          });
        });

        // Retry once after wait
        try {
          return await geminiGenerateOnce(prompt, apiKey, { signal });
        } catch (retryErr) {
          throw retryErr;
        }
      }

      const aborted = e?.name === "AbortError" || e?.message?.includes("aborted");
      if (outer?.aborted) {
        const err = new Error("The operation was aborted");
        err.name = "AbortError";
        throw err;
      }
      if (aborted) {
        if (attempt === MAX_ATTEMPTS) {
          throw new Error(`Gemini request timed out after ${timeoutMs}ms`);
        }
        await new Promise((r) => setTimeout(r, 400 * attempt));
        continue;
      }
      if (attempt === MAX_ATTEMPTS) {
        throw new Error(e?.message || "Gemini request failed");
      }
      await new Promise((r) => setTimeout(r, 400 * attempt));
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error("Gemini request failed");
}

/**
 * @param {{ title: string; description: string; platform: string; goal: string; tone: string }} productData
 * @param {string} apiKey
 * @param {{ signal?: AbortSignal }} [opts]
 */
export async function analyzeProduct(productData, apiKey, opts = {}) {
  const { title, description, platform, goal, tone, audienceTags, budget } = productData;
  const tagsLine =
    Array.isArray(audienceTags) && audienceTags.length > 0
      ? audienceTags.map(String).join("; ")
      : "None provided by marketer.";
  const budgetLine =
    typeof budget === "number" && Number.isFinite(budget) && budget > 0
      ? `$${Math.round(budget)} (marketer's planned monthly range signal — use only as context)`
      : "Not specified.";

  const prompt = `You are an expert ad copywriter. Analyze this product and generate ad creatives.

Product Title: ${title}
Product Description: ${description}
Platform: ${platform}
Goal: ${goal}
Tone: ${tone}
Budget context: ${budgetLine}
Marketer audience tags / notes: ${tagsLine}

Return ONLY a valid JSON object with NO markdown, no backticks, no explanation. Use these exact keys:
{
  "headlines": [20 different headlines, max 40 chars each],
  "bodycopies": [5 body copies using PAS formula, 3-5 sentences each],
  "ctas": [10 CTA button texts, max 4 words each],
  "angles": [5 different ad angles],
  "targetAudience": "description of ideal audience",
  "strategy": "brief strategy guide"
}`;

  const raw = await generateWithGemini(prompt, apiKey, { timeoutMs: DEFAULT_TIMEOUT_MS, signal: opts.signal });
  return parseGeminiCampaignFromText(raw, { title, description });
}

/**
 * @param {{ title: string; description?: string }} productInfo
 * @param {string} apiKey
 * @param {{ signal?: AbortSignal }} [opts]
 */
export async function generateHeadlines(productInfo, apiKey, opts = {}) {
  const title = productInfo.title || "Product";
  const description = productInfo.description || "";
  const prompt = `You are an expert direct-response copywriter. For this product, return ONLY valid JSON with NO markdown or backticks. Use key "headlines" only:
{
  "headlines": [20 short ad headlines, max 40 characters each, unique angles]
}

Product: ${title}
Details: ${description}`;

  const raw = await generateWithGemini(prompt, apiKey, { timeoutMs: DEFAULT_TIMEOUT_MS, signal: opts.signal });
  const cleaned = cleanGeminiJsonResponse(raw);
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Could not parse headlines JSON from Gemini");
  }
  const headlines = toStringList(parsed?.headlines);
  if (headlines.length < 1) throw new Error("headlines missing in Gemini response");
  return headlines;
}

/** @deprecated use finalizeCreativeFromParsed */
export function parseAndValidateCampaignJson(parsed) {
  return finalizeCreativeFromParsed(parsed, {});
}
