import { NextResponse } from "next/server";

export const maxDuration = 120; // 2 minute timeout
export const runtime = "nodejs";

const FALLBACK_IMAGES = [
  { url: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", prompt: "Indigo to Purple Gradient" },
  { url: "linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)", prompt: "Blue to Teal Gradient" },
  { url: "linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)", prompt: "Rose to Orange Gradient" },
  { url: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)", prompt: "Emerald to Blue Gradient" },
];

async function callGeminiForPrompts(productTitle, platform, tone, apiKey) {
  const prompt = `Create 4 image generation prompts for an AI model. 
Product: ${productTitle} 
Platform: ${platform} 
Tone: ${tone} 

Each prompt should describe:
- Scene and background
- Lighting and mood
- Style: professional ad creative
- No human faces

Return ONLY JSON array of strings:
["prompt1", "prompt2", "prompt3", "prompt4"]`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    }),
  });

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
    throw new Error("Invalid response format from Gemini");
  }
}

async function queryHuggingFace(imagePrompt, apiKey) {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stable-diffusion-v1-5/stable-diffusion-v1-5",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: imagePrompt + ", professional ad creative, high quality, 4k, marketing photo",
          parameters: {
            width: 512,
            height: 512,
            num_inference_steps: 20,
            guidance_scale: 7.5
          }
        })
      }
    );

    if (response.status === 503) {
      // Model loading, wait 20 seconds and retry
      console.warn(`Hugging Face model loading (503). Retrying in 20s... Attempt ${attempt + 1}/${maxRetries}`);
      await new Promise(resolve => setTimeout(resolve, 20000));
      attempt++;
      continue;
    }

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Hugging Face API failed (${response.status}): ${errText}`);
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  }

  throw new Error("Hugging Face failed after maximum retries");
}

import { createClient } from "@/lib/supabaseServer";

export async function POST(request) {
  // Authentication check
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const hfKey = process.env.HUGGINGFACE_API_KEY;

  if (!geminiKey || !hfKey) {
    return NextResponse.json({ 
      success: false, 
      message: "Missing API keys (GEMINI_API_KEY or HUGGINGFACE_API_KEY)" 
    }, { status: 500 });
  }

  try {
    const { productTitle, headlines, tone, platform } = await request.json();

    if (!productTitle) {
      return NextResponse.json({ success: false, message: "productTitle is required" }, { status: 400 });
    }

    // 1. Get prompts from Gemini
    let imagePrompts;
    try {
      imagePrompts = await callGeminiForPrompts(productTitle, platform || "All", tone || "Professional", geminiKey);
    } catch (e) {
      console.error("Gemini prompt generation failed:", e);
      return NextResponse.json({ success: true, images: FALLBACK_IMAGES, message: "Using fallback gradients (Gemini failed)" });
    }

    // 2. Generate images with Hugging Face
    const imageResults = await Promise.all(imagePrompts.map(async (prompt) => {
      try {
        const url = await queryHuggingFace(prompt, hfKey);
        return { url, prompt, type: "image" };
      } catch (e) {
        console.error(`Hugging Face generation failed for prompt: "${prompt}". Error: ${e.message}`);
        return null;
      }
    }));

    // Filter out failed ones and fill with fallbacks if needed
    const successfulImages = imageResults.filter(img => img !== null);
    
    if (successfulImages.length === 0) {
      return NextResponse.json({
        success: true,
        images: FALLBACK_IMAGES.map(f => ({ ...f, type: "gradient" })),
        message: "Hugging Face failed, returning gradients."
      });
    }

    return NextResponse.json({
      success: true,
      images: successfulImages
    });

  } catch (e) {
    console.error("Image generation route error:", e);
    return NextResponse.json({ 
      success: false, 
      message: e.message || "Internal server error",
      images: FALLBACK_IMAGES.map(f => ({ ...f, type: "gradient" }))
    }, { status: 500 });
  }
}
