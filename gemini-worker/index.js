import { GoogleGenerativeAI } from "@google/generative-ai";

// Cloudflare Worker မှာ env.GEMINI_API_KEY ကနေ API Key ရယူ
const GEMINI_API_KEY = (typeof globalThis !== 'undefined' && globalThis.GEMINI_API_KEY) || ""; 
// Cloudflare Worker မှာ env.GEMINI_API_KEY ဖြစ်မှ သုံးမယ်ဆိုမှတ်ပါ

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable not set.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // production မှာ restrict လုပ်ပါ
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    if (url.pathname === '/favicon.ico') {
      return new Response(null, { status: 204, statusText: 'No Content' });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
    }

    try {
      const body = await request.json();
      const userMessage = body.message;

      if (!userMessage) {
        return new Response(JSON.stringify({ error: "Message is required." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      let GeminiRequest;

      // Text only
      if (typeof userMessage === "string") {
        GeminiRequest = { contents: [{ parts: [{ text: userMessage }] }] };
      }
      // Text + Image (Base64)
      else if (
        userMessage.type === "text_and_image" &&
        userMessage.text &&
        userMessage.base64Image
      ) {
        GeminiRequest = {
          contents: [
            {
              parts: [
                { text: userMessage.text },
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: userMessage.base64Image,
                  },
                },
              ],
            },
          ],
        };
      }
      // Text + Video (Base64 Data URL)
      else if (
        userMessage.type === "text_and_video" &&
        userMessage.text &&
        userMessage.videoDataUrl
      ) {
        // Extract mime type & base64 data from data URL
        const match = userMessage.videoDataUrl.match(/^data:(.+);base64,(.*)$/);
        if (!match) {
          return new Response(
            JSON.stringify({ error: "Invalid videoDataUrl format." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const mimeType = match[1];
        const base64Data = match[2];

        // WARNING: Large base64 video may cause request size issues in Workers.
        // Production recommendation: Upload video to R2 or GCS, send URL to Gemini if supported.

        GeminiRequest = {
          contents: [
            {
              parts: [
                { text: userMessage.text },
                {
                  inlineData: {
                    mimeType,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
        };
      } else {
        return new Response(
          JSON.stringify({ error: "Unsupported message format." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const result = await model.generateContent(GeminiRequest);
      const response = await result.response;
      const text = response.text();

      return new Response(
        JSON.stringify({ response: text }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error in Gemini Worker:", error);
      const errorMessage = error instanceof Error ? error.message : "Internal error";
      return new Response(
        JSON.stringify({ error: `Failed to get Gemini response: ${errorMessage}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  },
};
