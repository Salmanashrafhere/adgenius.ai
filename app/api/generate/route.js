import { NextResponse } from "next/server";
import { analyzeProduct } from "@/lib/gemini";
import { extractProductMetadata, fetchProductHtml, normalizeProductUrl } from "@/lib/scrapeProduct";
import { supabaseAdmin } from "@/lib/supabase";

export const maxDuration = 60 // Vercel timeout fix 
export const runtime = "nodejs";

const ROUTE_TIMEOUT_MS = 30_000;

const FALLBACK_CAMPAIGN = {
  headlines: [
    "Limited Time Offer - Shop Now",
    "Best Deal You'll Find Today",
    "Transform Your Life Today",
    "Don't Miss This Amazing Deal",
    "Get Yours Before It's Gone",
    "The Solution You've Been Looking For",
    "Join 10,000+ Happy Customers",
    "Save Big on Premium Quality",
    "Your Search Ends Here",
    "Exclusive Offer Just For You"
  ],
  bodyCopies: [
    "Are you tired of settling for less? Our product delivers exactly what you need. Join thousands of satisfied customers who made the smart choice.",
    "Introducing the product that changes everything. Premium quality at an unbeatable price. Order today and see the difference yourself."
  ],
  ctas: ["Shop Now", "Get Started", "Buy Today", "Order Now", "Claim Deal"],
  angles: ["Value", "Quality", "Urgency", "Social Proof", "Problem Solution"],
  targetAudience: "Adults 25-45 interested in quality products",
  strategy: "Focus on value proposition and social proof. Test urgency-based headlines against benefit-focused ones."
};

const ALLOWED_GOALS = new Set(["sales", "leads", "brand"]);
const ALLOWED_PLATFORMS = new Set(["facebook", "instagram", "tiktok", "google", "all"]);

/**
 * @param {unknown} v
 * @returns {string[]}
 */
function normalizePlatforms(v) {
  let raw = [];
  if (Array.isArray(v)) {
    raw = v.map((x) => String(x).trim().toLowerCase()).filter(Boolean);
  } else if (typeof v === "string") {
    raw = v
      .split(/[,\s|]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
  }
  const out = [...new Set(raw)].filter((p) => ALLOWED_PLATFORMS.has(p));
  return out;
}

/**
 * @param {unknown} tags
 * @returns {string[]}
 */
function normalizeAudienceTags(tags) {
  if (!Array.isArray(tags)) return [];
  return tags
    .map((t) => String(t).trim())
    .filter(Boolean)
    .slice(0, 40);
}

/**
 * @param {unknown} b
 */
function normalizeBudget(b) {
  if (b == null || b === "") return undefined;
  const n = typeof b === "string" ? Number(b) : Number(b);
  if (!Number.isFinite(n) || n < 0) return undefined;
  return Math.min(Math.round(n), 10_000_000);
}

/**
 * @param {Request} request
 */
export async function POST(request) {
  const controller = new AbortController();
  const kill = setTimeout(() => controller.abort(), ROUTE_TIMEOUT_MS);

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        message: "Server configuration error: GEMINI_API_KEY is missing. Please add it to your environment variables." 
      }, { status: 500 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
    }

    const { productUrl, platform, goal, tone, audienceTags, budget, userId } = body || {};

    if (!productUrl || typeof productUrl !== "string") {
      return NextResponse.json({ success: false, message: "productUrl is required" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ success: false, message: "userId is required" }, { status: 401 });
    }

    const platforms = normalizePlatforms(platform);
    if (platforms.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "platform must include at least one of: facebook, instagram, tiktok, google, all",
        },
        { status: 400 }
      );
    }

    if (!goal || typeof goal !== "string") {
      return NextResponse.json({ success: false, message: "goal is required" }, { status: 400 });
    }
    const goalNorm = String(goal).toLowerCase().trim();
    if (!ALLOWED_GOALS.has(goalNorm)) {
      return NextResponse.json({ success: false, message: "goal must be one of: sales, leads, brand" }, { status: 400 });
    }

    if (!tone || typeof tone !== "string") {
      return NextResponse.json({ success: false, message: "tone is required" }, { status: 400 });
    }
    const toneNorm = String(tone).toLowerCase().trim();
    if (toneNorm.length < 2 || toneNorm.length > 40) {
      return NextResponse.json({ success: false, message: "tone is invalid" }, { status: 400 });
    }

    const tags = normalizeAudienceTags(audienceTags);
    const budgetVal = normalizeBudget(budget);

    let normalizedUrl;
    try {
      normalizedUrl = normalizeProductUrl(productUrl);
    } catch (e) {
      return NextResponse.json(
        { success: false, message: e instanceof Error ? e.message : "Invalid URL" },
        { status: 400 }
      );
    }

    let html;
    try {
      html = await fetchProductHtml(normalizedUrl, { signal: controller.signal });
    } catch (e) {
      const aborted = e instanceof Error && (e.name === "AbortError" || e.message.includes("aborted"));
      if (aborted) {
        return NextResponse.json({ success: false, message: "Request timed out after 30 seconds" }, { status: 504 });
      }
      const msg = e instanceof Error ? e.message : "Failed to fetch product URL";
      const status = msg.includes("not allowed") || msg.includes("Invalid") ? 400 : 502;
      return NextResponse.json({ success: false, message: msg }, { status });
    }

    const scraped = extractProductMetadata(html);
    const platformStr = platforms.join(", ");

    let creative;
    try {
      console.log(`[Generate API] Calling Gemini for: ${scraped.title}`);
      creative = await analyzeProduct(
        {
          title: scraped.title,
          description: scraped.description || scraped.title,
          platform: platformStr,
          goal: goalNorm,
          tone: toneNorm,
          audienceTags: tags,
          budget: budgetVal,
        },
        apiKey,
        { signal: controller.signal }
      );
    } catch (e) {
      console.error("[Generate API] Gemini error:", e);
      const aborted = e instanceof Error && (e.name === "AbortError" || e.message.includes("aborted"));
      if (aborted) {
        return NextResponse.json({ success: false, message: "Request timed out after 30 seconds" }, { status: 504 });
      }
      
      // Return default data if parsing fails or Gemini fails as requested in FIX 1
      console.log("[Generate API] Returning fallback campaign data due to error");
      return NextResponse.json({ 
        success: true, 
        campaign: FALLBACK_CAMPAIGN 
      });
    }

    // Save to Supabase
    try {
      // 1. Save campaign
      const { data: campaign, error: campaignError } = await supabaseAdmin
        .from('campaigns')
        .insert({
          user_id: userId,
          name: scraped.title,
          product_url: normalizedUrl,
          product_title: scraped.title,
          product_description: scraped.description,
          platform: platforms,
          goal: goalNorm,
          tone: toneNorm,
          status: 'processing'
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // 2. Save ad creatives
      const adCreatives = creative.headlines.map((headline, i) => ({
        campaign_id: campaign.id,
        headline: headline,
        body_copy: creative.bodycopies[i % creative.bodycopies.length],
        cta_text: creative.ctas[i % creative.ctas.length],
        angle: creative.angles[i % creative.angles.length],
        platform: platforms[0], // Using the first platform for individual creatives
        status: 'generated'
      }));

      const { error: creativesError } = await supabaseAdmin
        .from('ad_creatives')
        .insert(adCreatives);

      if (creativesError) throw creativesError;

      // 3. Save copy variations
      const copyVariations = [
        ...creative.headlines.map(h => ({ campaign_id: campaign.id, category: 'headline', content: h })),
        ...creative.bodycopies.map(b => ({ campaign_id: campaign.id, category: 'body_copy', content: b })),
        ...creative.ctas.map(c => ({ campaign_id: campaign.id, category: 'cta', content: c }))
      ];

      await supabaseAdmin.from('copy_variations').insert(copyVariations);

      // 4. Update campaign status
      await supabaseAdmin
        .from('campaigns')
        .update({ status: 'ready', completed_at: new Date() })
        .eq('id', campaign.id);

      return NextResponse.json({
        success: true,
        campaignId: campaign.id,
        campaign: {
          title: scraped.title,
          description: scraped.description,
          imageUrl: scraped.imageUrl,
          productUrl: normalizedUrl,
          platforms,
          goal: goalNorm,
          tone: toneNorm,
          audienceTags: tags,
          budget: budgetVal ?? null,
          headlines: creative.headlines,
          bodycopies: creative.bodycopies,
          ctas: creative.ctas,
          angles: creative.angles,
          targetAudience: creative.targetAudience,
          strategy: creative.strategy,
        },
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Still return the generated content even if saving fails, but maybe add a warning
      return NextResponse.json({
        success: true,
        warning: "Generated successfully but failed to save to database",
        campaign: {
          title: scraped.title,
          description: scraped.description,
          imageUrl: scraped.imageUrl,
          productUrl: normalizedUrl,
          platforms,
          goal: goalNorm,
          tone: toneNorm,
          audienceTags: tags,
          budget: budgetVal ?? null,
          headlines: creative.headlines,
          bodycopies: creative.bodycopies,
          ctas: creative.ctas,
          angles: creative.angles,
          targetAudience: creative.targetAudience,
          strategy: creative.strategy,
        },
      });
    }

  } catch (e) {
    const aborted = e instanceof Error && (e.name === "AbortError" || e.message.includes("aborted"));
    if (aborted) {
      return NextResponse.json({ success: false, message: "Request timed out after 30 seconds" }, { status: 504 });
    }
    return NextResponse.json(
      { success: false, message: e instanceof Error ? e.message : "Unexpected server error" },
      { status: 500 }
    );
  } finally {
    clearTimeout(kill);
  }
}

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "AdGenius generate",
      method: "POST",
      body: {
        productUrl: "string (http/https)",
        platform: ["facebook", "instagram", "tiktok", "google", "all"],
        goal: "sales | leads | brand",
        tone: "string",
        audienceTags: "optional string[]",
        budget: "optional number (USD)",
      },
    },
    { status: 200 }
  );
}
