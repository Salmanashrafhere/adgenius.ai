import { NextResponse } from "next/server";

export const maxDuration = 60; // Max duration for Vercel/Next.js
export const runtime = "nodejs";

const TIMEOUT_MS = 60000;
const POLL_INTERVAL_MS = 3000;
const MAX_RETRIES = 2;

/**
 * Fallback gradient images in case Leonardo fails
 */
const FALLBACK_IMAGES = [
  { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1024&auto=format&fit=crop", prompt: "Abstract indigo gradient" },
  { url: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1024&auto=format&fit=crop", prompt: "Modern purple mesh gradient" },
  { url: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1024&auto=format&fit=crop", prompt: "Soft blue and pink gradient" },
  { url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1024&auto=format&fit=crop", prompt: "Vibrant energy wave gradient" },
];

async function callGeminiForPrompts(productTitle, platform, tone, apiKey) {
  const prompt = `Create 4 image generation prompts for Leonardo AI. 
Product: ${productTitle} 
Platform: ${platform} 
Tone: ${tone} 

Each prompt should describe:
- Scene and background
- Lighting and mood
- Style: professional ad creative
- Space for text overlay
- No human faces

Return ONLY JSON array of strings:
["prompt1", "prompt2", "prompt3", "prompt4"]`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  async function makeRequest() {
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });
  }

  let response = await makeRequest();

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = errorData.error?.message || response.statusText;
    const isQuotaError = response.status === 429 || errorMsg.toLowerCase().includes("quota");

    if (isQuotaError) {
      console.warn("Gemini rate limit hit in image prompts, retrying in 60 seconds...");
      await new Promise(resolve => setTimeout(resolve, 60000));
      response = await makeRequest();
    }
  }

  if (!response.ok) {
    throw new Error(`Gemini API failed: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  try {
    const prompts = JSON.parse(text);
    return Array.isArray(prompts) ? prompts.slice(0, 4) : [];
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON:", text);
    // Fallback if JSON parsing fails but we have text
    const matches = text.match(/"([^"]+)"/g);
    if (matches) return matches.map(m => m.replace(/"/g, '')).slice(0, 4);
    throw new Error("Invalid response format from Gemini");
  }
}

async function generateWithLeonardo(prompt, apiKey) {
  const res = await fetch("https://cloud.leonardo.ai/api/rest/v1/generations", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: prompt,
      modelId: "b24e16ff-06e3-43eb-8d33-4416c2d75876", // Leonardo Vision XL or similar
      width: 1024,
      height: 1024,
      num_images: 1,
      guidance_scale: 7
    })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Leonardo generation start failed: ${err.message || res.statusText}`);
  }

  const data = await res.json();
  return data.sdGenerationJob.generationId;
}

async function pollLeonardo(generationId, apiKey) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < TIMEOUT_MS) {
    const res = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
      headers: {
        "Authorization": "Bearer " + apiKey
      }
    });

    if (!res.ok) {
      throw new Error(`Leonardo polling failed: ${res.statusText}`);
    }

    const data = await res.json();
    const generation = data.generations_by_pk;

    if (generation.status === "COMPLETE") {
      return generation.generated_images[0].url;
    } else if (generation.status === "FAILED") {
      throw new Error("Leonardo generation job failed");
    }

    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  throw new Error("Leonardo polling timed out");
}

export async function POST(request) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const leonardoKey = process.env.LEONARDO_API_KEY;

  if (!geminiKey) {
    return NextResponse.json({ 
      success: false, 
      message: "Missing API key (GEMINI_API_KEY)" 
    }, { status: 500 });
  }

  try {
    const { productTitle, platform, tone } = await request.json();

    if (!productTitle) {
      return NextResponse.json({ success: false, message: "productTitle is required" }, { status: 400 });
    }

    // 1. Get prompts from Gemini
    let imagePrompts;
    try {
      imagePrompts = await callGeminiForPrompts(productTitle, platform || "All", tone || "Professional", geminiKey);
    } catch (e) {
      console.error("Gemini prompt generation failed:", e);
      return NextResponse.json({ success: true, images: FALLBACK_IMAGES, message: "Using fallback images (Gemini failed)" });
    }

    // 2. Generate images with Leonardo (skip if no key)
    if (!leonardoKey) {
      console.warn("LEONARDO_API_KEY missing, using fallback images gracefully.");
      return NextResponse.json({
        success: true,
        images: FALLBACK_IMAGES,
        message: "Leonardo API key missing, using fallback images."
      });
    }

    const imageResults = await Promise.all(imagePrompts.map(async (prompt) => {
      let lastError;
      for (let i = 0; i <= MAX_RETRIES; i++) {
        try {
          const genId = await generateWithLeonardo(prompt, leonardoKey);
          const url = await pollLeonardo(genId, leonardoKey);
          return { url, prompt };
        } catch (e) {
          lastError = e;
          console.warn(`Leonardo attempt ${i + 1} failed for prompt: "${prompt}". Error: ${e.message}`);
          if (i < MAX_RETRIES) await new Promise(r => setTimeout(r, 2000));
        }
      }
      return null; // Return null if all retries fail
    }));

    // Filter out failed ones and fill with fallbacks if needed
    const finalImages = imageResults
      .filter(img => img !== null)
      .concat(FALLBACK_IMAGES)
      .slice(0, 4);

    return NextResponse.json({
      success: true,
      images: finalImages
    });

  } catch (e) {
    console.error("Image generation route error:", e);
    return NextResponse.json({ 
      success: false, 
      message: e.message || "Internal server error during image generation",
      images: FALLBACK_IMAGES 
    }, { status: 500 });
  }
}
